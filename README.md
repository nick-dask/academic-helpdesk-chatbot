# academic-helpdesk-chatbot
Flask chatbot based on Google's Gemini API, for use as an academic assistant for students.

This is a Flask based application, that uses Google's Gemini API to allow it's users to communicate their questions and get answers based on their respective institution's study guide. It works as an virtual academic assistant and it currently only supports txt file processing.

![image](https://github.com/user-attachments/assets/7150f439-3652-4006-9a4a-66bd5b291cc3)


## Features

- **Text file Upload**: Users can upload multiple txt files, for additional processing alongside the institution's study guide.
- **Text Extraction**: Extracts text from uploaded text files.
- **Conversational AI**: Uses the Gemini conversational AI model to answer user questions.
- **Chat Interface**: Provides a chat interface for the user to interact with the chatbot.

## System Requirements
- Python 3.10 +
- Git installed
- Docker installed (for containerized deployment)
- Virtual environment support

## Installation Steps
Follow these instructions to set up and run this project on your local machine.

   **Note:** This project requires Python 3.10 or higher.
   
1. **Clone the Repository:**
	First, download the chatbot project from the repository:

 	```bash
 	git clone https://github.com/your-username/gemini-pdf-chatbot.git 
    cd gemini-pdf-chatbot 
 	 ```

2. **Install Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Google API Key:**
    Obtain a Google API key from [here](https://aistudio.google.com) and set it in the `.env` file.


   ```python
   GOOGLE_API_KEY=your_api_key_here
   ```
4. **Select the initial study guide txt file to train the chatbot:**

   ```python
   LOCAL_FILE_PATH = os.path.join(app.config['UPLOAD_FOLDER'], "put_your_file_here.txt")
   ```
	

5. **Change the chatbot's welcome message from the .js file to fit your language requirement:**
   ```python
   chatToggleButton.addEventListener('click', () => {
    	chatWrapper.classList.toggle('hidden');

	    // Intro message
	    if (!isChatOpened) {
	        appendMessage('bot', 'welcome message');
	        isChatOpened = true;
	    }
	});
   ```	
   
6. **Run the Application:**

   ```bash
   python main.py
   ```