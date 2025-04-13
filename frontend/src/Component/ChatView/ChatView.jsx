import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatView.css';
import { IoPersonOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import ChatInput from '../ChatInput/ChatInput';

export default function ChatView({ onChatUpdate }) {



    const { id: routeId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [currentChatId, setCurrentChatId] = useState(null); // אתחל ל-null

    useEffect(() => {
        setCurrentChatId(routeId); // עדכן את ה-ID כש-routeId משתנה
    }, [routeId]);

    // יצירת שיחה חדשה
    const createNewChat = async (content) => {
        const userMsg = { role: "user", content };
        const botResponse = `אני בוט, קיבלתי את: ${content}`;
        const botMsg = { role: "bot", content: botResponse };

        try {
            const response = await fetch('http://localhost:5000/chats/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: content,
                    messages: [userMsg, botMsg]
                }),
            });

            const chat = await response.json();
            const newId = chat._id;

            setMessages([
                { sender: "user", text: content },
                { sender: "bot", text: botResponse }
            ]);

            setCurrentChatId(newId); // עדכן את ה-ID המקומי מיד לאחר יצירה
            navigate(`/chat/${newId}`);
            if (onChatUpdate) onChatUpdate();

        } catch (error) {
            console.error("Error creating new chat:", error);
        }
    };

    // שליחה לעדכון הודעות
    const sendMessage = async (content) => {
        const userMsg = { sender: "user", text: content };
        const botResponse = `אני בוט, קיבלתי את: ${content}`;
        const botMsg = { sender: "bot", text: botResponse };

        setMessages(prev => [...prev, userMsg]);
        setIsThinking(true);

        try {
            if (!currentChatId) return; // השתמש ב-currentChatId

            // שליחת הודעת המשתמש לשרת
            await fetch(`http://localhost:5000/chats/${currentChatId}`, { // השתמש ב-currentChatId
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: "user", content })
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessages(prev => [...prev, botMsg]);
            setIsThinking(false);

            // שליחת הודעת הבוט לשרת
            await fetch(`http://localhost:5000/chats/${currentChatId}`, { // השתמש ב-currentChatId
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: "bot", content: botResponse })
            });

            if (onChatUpdate) onChatUpdate();

        } catch (err) {
            console.error("Failed to update chat:", err);
            setIsThinking(false);
        }
    };

    // שליחה של הודעה
    const handleSend = () => {
        console.log("Current ID in handleSend:", currentChatId);
        if (!input.trim() || isThinking) return;
        if (!currentChatId) {
            console.log("No ID found, creating new chat.");
            createNewChat(input);
        } else {
            console.log("ID found, sending message to existing chat:", currentChatId);
            sendMessage(input);
        }
        setInput("");
    };

    useEffect(() => {
        console.log("🔄 useEffect triggered with routeId:", routeId);
        if (!routeId) return;

        const fetchChat = async () => {
            console.log("📡 Fetching chat with ID:", routeId);
            try {
                const response = await fetch(`http://localhost:5000/chats/${routeId}`);
                const chat = await response.json();
                console.log("📥 Chat data received:", chat);

                const formattedMessages = chat.messages.map(msg => ({
                    sender: msg.role === 'user' ? 'user' : 'bot',
                    text: msg.content,
                }));

                setMessages(formattedMessages);
                setCurrentChatId(routeId);
            } catch (err) {
                console.error("❌ Error fetching chat:", err);
            }
        };

        fetchChat();
    }, [routeId]);



    // גלילת ההודעות
    useEffect(() => {
        const messagesContainer = document.querySelector(".ChatMessages");
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="ChatView">
            <div className="ChatHeader">
                <h2>
                    <RiRobot2Line className="icon" />
                    Chat with IR Bot
                </h2>
            </div>
            <div className="ChatMessages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.sender === 'user' ? (
                            <div className="user-icon-wrapper icon-wrapper">
                                <IoPersonOutline className="icon" />
                            </div>
                        ) : (
                            <div className="bot-icon-wrapper icon-wrapper">
                                <RiRobot2Line className="icon" />
                            </div>
                        )}
                        <div className="message-text">{msg.text}</div>
                    </div>
                ))}
            </div>
            <div className="ChatInputArea">
                <ChatInput
                    input={input}
                    onChange={(e) => setInput(e.target.value)}
                    onSend={handleSend}
                />
                <button
                    onClick={handleSend}
                    className={`send-button ${isThinking ? 'thinking' : ''}`}
                    disabled={isThinking}
                >
                    {isThinking ? <div className="spinner"></div> : 'Send'}
                </button>
            </div>
        </div>
    );
}