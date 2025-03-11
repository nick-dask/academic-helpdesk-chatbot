const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user_input');
const chatBox = document.getElementById('chat-box');
const chatWrapper = document.getElementById('chat-wrapper');
const chatToggleButton = document.getElementById('chat-toggle-button');
let isChatOpened = false;
const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const uploadStatus = document.getElementById('upload-status');

// Toggle chatbot visibility
chatToggleButton.addEventListener('click', () => {
    chatWrapper.classList.toggle('hidden');

    // Intro message
    if (!isChatOpened) {
        appendMessage('bot', 'welcome message');
        isChatOpened = true;
    }
});

// Append message to chat box
function appendMessage(role, message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', role === 'user' ? 'user-message-container' : 'bot-message-container');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', role === 'user' ? 'user-message' : 'bot-message');
    
    messageDiv.innerHTML = message;

    messageContainer.appendChild(messageDiv);
    chatBox.appendChild(messageContainer);
    chatBox.scroll({ top: chatBox.scrollHeight, behavior: 'smooth' });
}


function showThinkingBubble() {
    const thinkingBubble = document.createElement('div');
    thinkingBubble.classList.add('thinking-bubble');
    thinkingBubble.id = 'thinking-bubble';

    const dot1 = document.createElement('div');
    dot1.classList.add('dot');
    const dot2 = document.createElement('div');
    dot2.classList.add('dot');
    const dot3 = document.createElement('div');
    dot3.classList.add('dot');

    thinkingBubble.appendChild(dot1);
    thinkingBubble.appendChild(dot2);
    thinkingBubble.appendChild(dot3);

    chatBox.appendChild(thinkingBubble);
    chatBox.scroll({ top: chatBox.scrollHeight, behavior: 'smooth' });
}


function hideThinkingBubble() {
    const thinkingBubble = document.getElementById('thinking-bubble');
    if (thinkingBubble) {
        chatBox.removeChild(thinkingBubble);
    }
}


function disableInput() {
    userInput.disabled = true;
    sendButton.disabled = true;
}


function enableInput() {
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
}


sendButton.addEventListener('click', function () {
    const userMessage = userInput.value;

    if (userMessage.trim()) {
        appendMessage('user', userMessage);

        disableInput();

        showThinkingBubble();

        // Send the message to the Flask backend via AJAX
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: userMessage }),
        })
            .then(response => response.json())
            .then(data => {
                
                hideThinkingBubble();

                
                const botMessage = data[data.length - 1].message; // The last message is the bot's
                appendMessage('bot', botMessage);

                
                userInput.value = '';

                
                enableInput();
            })
            .catch(error => {
                console.error('Error:', error);
                
                hideThinkingBubble();

                // In case of error, re-enable input and button
                enableInput();
            });
    }
});

// Handle "Enter" key press to send the message
userInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendButton.click();
    }
});


uploadForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
        uploadStatus.textContent = 'Please select a file first!';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    uploadButton.disabled = true;
    uploadStatus.textContent = 'Uploading...';

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                uploadStatus.textContent = data.success;
            } else if (data.error) {
                uploadStatus.textContent = `Error: ${data.error}`;
            }
            uploadButton.disabled = false;
        })
        .catch(error => {
            uploadStatus.textContent = `Error: ${error.message}`;
            uploadButton.disabled = false;
        });
});