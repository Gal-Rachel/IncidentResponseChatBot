import React from "react";
import "../styles/ChatBot.css"; // נשתמש באותו קובץ CSS

function ChatMessage({ message }) {
    return (
        <div className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}>
            {message.sender !== "user" && <div className="bot-avatar">🤖</div>}
            <div className="message-text">{message.text}</div>
        </div>
    );
}

export default ChatMessage;
