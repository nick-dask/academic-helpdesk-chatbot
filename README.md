# academic-helpdesk-chatbot
Flask chatbot based on Google's Gemini API, for use as an academic assistant for students.

This is a Flask based application, that uses Google's Gemini API to allow it's users to communicate their questions and get answers based on their respective institution's study guide. It works as an virtual academic assistant and it currently only supports txt file processing.

Below is a screenshot of what the app looks like:

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
 	git clone https://github.com/nick-dask/academic-helpdesk-chatbot.git 
	cd academic-helpdesk-chatbot 
 	```

2. **Install Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Google API Key:**
    Obtain a Google Gemini API key from [here](https://aistudio.google.com) and set it in the `.env` file.


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

## Running the app with Docker
If you have docker installed, you can run the application using the following command:

- If you haven't already, obtain a Google Gemini API key from [here](https://aistudio.google.com) and set it in the `.env` file.

   ```python
   GOOGLE_API_KEY=your_api_key_here
   ```
- then in you terminal paste the following command:
  
   ```bash
   docker compose up --build
   ```

Your application will be available at <http://localhost:5000>.

## Cloud deployment

Initially, create your image, for example: `docker build -t myapp .`.
If your cloud operates on a CPU architecture that differs from your development
device (for instance, you are using a Mac M1 while your cloud service operates on amd64),
you'll need to create the image for that platform, for example:
```bash
docker push myregistry.com/myapp
```

- Next, upload it to your registry, for example,

	```bash
	docker push myregistry.com/myapp
	```
 
Check out Docker's [getting started](https://docs.docker.com/go/get-started-sharing/) guide.

Refer to the documentation for additional information on constructing and uploading.

### Citations

- [Python guide for Docker](https://docs.docker.com/language/python/)
- [Quickstart guide on Gemini API](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart)
- [Flask Project Layout](https://flask.palletsprojects.com/en/stable/tutorial/layout/)

## Project Structure

- `app.py`: Main application script that handles the use of the Gemini API, assigns functions to certain URLs and uploads/receives files using the Flask framework.
- `chat.html`: The main structure of the page.
- `scripts.js`: Handles the conversation between the user and the API.
- `.env`: File which will contain your environment variable which will be the API key.
- `requirements.txt`: Python packages required for working of the app.
- `README.md`: Project documentation.