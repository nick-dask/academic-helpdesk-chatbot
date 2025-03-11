import os
import time
import re
import unicodedata
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, render_template, session, jsonify, flash
from flask_wtf import FlaskForm
from wtforms import MultipleFileField, SubmitField
from werkzeug.utils import secure_filename
from wtforms.validators import InputRequired

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

app = Flask(__name__)
app.secret_key = 'key' 


app.config['SECRET_KEY'] = 'key'
app.config['UPLOAD_FOLDER'] = r"static\data"
LOCAL_FILE_PATH = os.path.join(app.config['UPLOAD_FOLDER'], "put_your_file_here.txt")

class UploadFileForm(FlaskForm):
    files = MultipleFileField("Files", render_kw={'multiple': True}, validators=[InputRequired()])
    submit = SubmitField("Upload Files")

def upload_to_gemini(path, mime_type=None):
    file = genai.upload_file(path, mime_type=mime_type)
    return file

def wait_for_files_active(files):
    for name in (file.name for file in files):
        file = genai.get_file(name)
        while file.state.name == "PROCESSING":
            time.sleep(10)
            file = genai.get_file(name)
        if file.state.name != "ACTIVE":
            raise Exception(f"File {file.name} failed to process")

def get_all_uploaded_files():
    """Retrieve all uploaded file paths."""
    return [os.path.join(app.config['UPLOAD_FOLDER'], f) for f in os.listdir(app.config['UPLOAD_FOLDER']) if os.path.isfile(os.path.join(app.config['UPLOAD_FOLDER'], f))]

# Configure the generation model
generation_config = {
    "temperature": 0.3,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction="You are a virtual academic assistant, that receives questions and answers them based on a structured study guide, with formal tone, giving the necessary insight for each question.",
)

# Upload the local file to Gemini and wait for processing at startup
uploaded_files = [upload_to_gemini(LOCAL_FILE_PATH, mime_type="text/plain")]
wait_for_files_active(uploaded_files)

def retrain_chatbot():
    # Upload additional to Gemini API and retrain the chatbot.
    files = get_all_uploaded_files()
    new_uploads = []
    for file_path in files:
        try:
            uploaded_file = upload_to_gemini(file_path, mime_type="text/plain")
            new_uploads.append(uploaded_file)
        except Exception as e:
            print(f"Error uploading {file_path}: {e}")
    if new_uploads:
        wait_for_files_active(new_uploads)
        uploaded_files.extend(new_uploads)

def safe_unicode_filename(filename):
    # Sanitizes the file name while preserving Unicode characters (e.g., Greek)
    filename = unicodedata.normalize('NFKC', filename)
    filename = re.sub(r'[^\w\s.\u0370-\u03FF\u1F00-\u1FFF-]', '_', filename)
    filename = filename.strip().replace(' ', '_')
    return filename

@app.before_request
def initialize_session():
    if 'history' not in session:
        session['history'] = []

@app.route('/', methods=['GET', 'POST'])
def home():
    form = UploadFileForm()
    if form.validate_on_submit():
        uploaded_filenames = []
        for file in form.files.data:
            if file:
                filename = safe_unicode_filename(file.filename)
                save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(save_path)
                uploaded_filenames.append(filename)
        retrain_chatbot()
        flash(f'Files {", ".join(uploaded_filenames)} uploaded successfully!', 'success')
        return render_template('chat.html', form=form)
    return render_template('chat.html', form=form)

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)
    retrain_chatbot()
    return jsonify({'success': f'File {filename} uploaded and chatbot retrained successfully!'})

@app.route('/submit', methods=['POST'])
def submit():
    user_input = request.json['user_input']

    session['history'].append({'role': 'user', 'message': user_input})

    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": uploaded_files,
            },
        ]
    )

    response = chat_session.send_message(user_input)
    session['history'].append({'role': 'bot', 'message': response.text})

    return jsonify(session['history'])

if __name__ == '__main__':
    app.run(debug=True)
