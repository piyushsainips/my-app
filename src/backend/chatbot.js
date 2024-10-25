import React, { useState } from 'react';
import './chatbot.css'; // Ensure you have styling for your chatbot UI

const Chatbot = () => {
    const [inputText, setInputText] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleSend = async () => {
        if (inputText.trim() === '') return;

        // Add the user's question to the chat history
        setChatHistory([...chatHistory, { text: inputText, sender: 'user' }]);

        // Call the backend to get the answer
        const response = await fetch('/get-answer', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: inputText }),
      });

        const data = await response.json();

        // Add the bot's response to the chat history
        setChatHistory([...chatHistory, { text: inputText, sender: 'user' }, { text: data.answer, sender: 'bot' }]);
        setInputText(''); // Clear input field
    };

    return (
        <div className="chatbot-container">
            <div className="chat-history">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={'chat-message ${chat.sender}'}>
                        {chat.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask your question..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;