import React, { useState, useEffect } from 'react';
import './ChatPage.css';
import ChatHistory from '../ChatHistory/ChatHistory';
import ChatView from '../ChatView/ChatView';

export default function ChatPage() {
    const [chats, setChats] = useState([]);

    const refreshChats = async () => {
        try {
            const response = await fetch("http://localhost:5000/chats");
            const data = await response.json();
            setChats(data);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    useEffect(() => {
        refreshChats(); // טוען את ההיסטוריה בהתחלה
    }, []);

    return (
        <div className="ChatPage">
            <ChatHistory chats={chats} onChatUpdate={refreshChats} /> {/* העבר את פונקציית העדכון */}
            <ChatView onChatUpdate={refreshChats} /> {/* וודא שזה קיים */}
        </div>
    );
}
