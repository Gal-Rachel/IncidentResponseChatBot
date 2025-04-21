import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // הוספנו useNavigate
import './ChatHistory.css';
import { SiCyberdefenders } from "react-icons/si";
import { IoSearchSharp } from "react-icons/io5";

export default function ChatHistory({ onChatUpdate }) {

    return (
    <div></div>    
    );

    // const [chats, setChats] = useState([]);
    // const navigate = useNavigate(); // שימוש ב-navigate

    // // טוען את השיחות הקיימות
    // useEffect(() => {
    //     const fetchChats = async () => {
    //         try {
    //             const response = await fetch('http://localhost:5000/');
    //             const data = await response.json();
    //             setChats(data);
    //         } catch (err) {
    //             console.error("Error fetching chats:", err);
    //         }
    //     };

    //     fetchChats();
    // }, [onChatUpdate]); // נוסיף את onChatUpdate כהתאם כדי לעדכן את ההיסטוריה

    // // יצירת שיחה חדשה
    // const createNewChat = async () => {

    //     const userMsg = { role: "user", content: "היי אני צריכה עזרה!" };
    //     const botResponse = "אני כאן עבורך!";
    //     const botMsg = { role: "bot", content: botResponse };
    //     const newChatTitle = "New Chat"; // תוכל לשנות את הכותרת פה

    //     try {
    //         const response = await fetch('http://localhost:5000/', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 title: newChatTitle,
    //                 messages: [userMsg, botMsg]
    //             }),
    //         });

    //         const chat = await response.json();
    //         setChats(prevChats => [...prevChats, chat]); // עדכון ההיסטוריה עם השיחה החדשה

    //         // הפנה את המשתמש ל-ChatView של השיחה החדשה
    //         navigate(`/chat/${chat._id}`);
    //         if (onChatUpdate) onChatUpdate(); // עדכון היסטוריית השיחות אחרי יצירת שיחה חדשה
    //     } catch (error) {
    //         console.error("Error creating new chat:", error);
    //     }
    // };

//     return (
//         <div className="ChatHistory">
//             <div className="ChatHistoryHeader">
//                 <div className="ChatHistoryHeaderTitleText">
//                     <SiCyberdefenders className="icon" />
//                     <span>Chat History</span>
//                 </div>
//             </div>

//             <div className="ChatHistoryBody">
//                 <div className="search-container">
//                     <IoSearchSharp />
//                     <input
//                         type="text"
//                         placeholder=" Search previous chats..."
//                         className="search-input"
//                     />
//                 </div>
//                 <button
//                     className="new-chat-button"
//                     onClick={createNewChat}
//                 >
//                     Start New Chat
//                 </button>

//                 <ul className="chat-list">
//                     {chats.map(chat => (
//                         <li key={chat._id} className="chat-item">
//                             <Link to={`/chat/${chat._id}`}>{chat.title}</Link>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//             <div className="PoweredBy">
//                 powered by Gal Shmuel & Rachel Yeholashet
//             </div>
//         </div>
//     );
    //
}
