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

    // Show intro message
    if (!isChatOpened) {
        appendMessage('bot', 'Γειά σου! Μπορείς να με ρωτήσεις οτιδήποτε θες!!');
        isChatOpened = true;
    }
});

// Append new message to the chat box
function appendMessage(role, message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', role === 'user' ? 'user-message-container' : 'bot-message-container');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', role === 'user' ? 'user-message' : 'bot-message');

    messageContainer.appendChild(messageDiv);
    chatBox.appendChild(messageContainer);
    chatBox.scroll({ top: chatBox.scrollHeight, behavior: 'smooth' });
}

// Thinking bubble when processing
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

// Remove the thinking bubble once the bot responds
function hideThinkingBubble() {
    const thinkingBubble = document.getElementById('thinking-bubble');
    if (thinkingBubble) {
        chatBox.removeChild(thinkingBubble);
    }
}

// Disable input and button
function disableInput() {
    userInput.disabled = true;
    sendButton.disabled = true;
}

// Enable input and button
function enableInput() {
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
}

// Handle the send button click
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

                const botMessage = data[data.length - 1].message;
                appendMessage('bot', botMessage);

                userInput.value = '';

                enableInput();
            })
            .catch(error => {
                console.error('Error:', error);
                hideThinkingBubble();

                enableInput();
            });
    }
});

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