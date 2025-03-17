import React, { useState, useEffect } from "react";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false); // למקרה שרוצים להציג שהבוט "כותב..."

    // הודעה ראשונה מהבוט כשהצ'אט נפתח
    useEffect(() => {
        setMessages([{ text: "How can i help you today? ", sender: "bot" }]);
    }, []);
    
    const handleSendMessage = async () => {
        if (input.trim()) {
            const userMessage = { text: input, sender: "user" };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setInput("");

            try {
                const response = await fetch("http://localhost:5000/api/chatbot/message", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: input }),
                });

                const data = await response.json();
                const botMessage = { text: data.response, sender: "bot" };

                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } catch (error) {
                console.error("Error fetching bot response:", error);
            }
        }
    };


    return (
        <div className="chatbot-popup">
            <div className="chat-header">
                <div className="header-info">
                    <svg className="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 1024 1024">
                        <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
                    </svg>
                    <span className="logo-text">ChatBot</span>
                </div>
                <button id="close-chatbot">×</button>
            </div>

            <div className="chat-body">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}-message`}>
                        {msg.sender === "bot" && (
                            <svg className="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 1024 1024">
                                <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
                            </svg>
                        )}
                        <div className="message-text">{msg.text}</div>
                    </div>
                ))}
                {loading && <div className="bot-message">Let me think....</div>}
            </div>

            <div className="chat-footer">
                <div className="chat-form">
                    <textarea
                        className="message-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <div className="chat-controls">
                        <button id="send-message" onClick={handleSendMessage} disabled={loading}>➤</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
