import React, { useState } from "react";
import "../styles/ChatBot.css"; // נשתמש באותו קובץ CSS

function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="chat-footer">
      <form className="chat-form" onSubmit={handleSubmit}>
        
        <textarea
          className="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          required
        />
        <div className="chat-controls">
          <button id="send-message" type="submit">➤</button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
