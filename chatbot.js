import React, { useState } from 'react';
import './chatbot.css'; // Import the CSS file

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const newMessage = { text: inputValue, sender: 'user' };
            setMessages([...messages, newMessage]);
            setInputValue('');

            setTimeout(() => {
                const botMessage = { text: `You said: "${newMessage.text}"`, sender: 'bot' };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            }, 1000);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Hello , How Can i help You..</h2>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chatbot-input-container">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="chatbot-input"
                />
                <button onClick={handleSendMessage} className="chatbot-send-btn">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
