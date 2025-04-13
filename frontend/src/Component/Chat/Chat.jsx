// import { useState, useCallback } from 'react';
// import Message from '../Message/Message';
// import MessageList from '../MessageList/MessageList';
// import ChatInput from '../ChatInput/ChatInput';

// import './Chat.css';

// export default function Chat() {
//     const [messages, setMessages] = useState([
//         { text: "שלום! איך אפשר לעזור?", sender: "bot" },
//     ]);
//     const [input, setInput] = useState("");

//     const sendMessage = useCallback((content) => {
//         const userMsg = { text: content, sender: "user" };
//         const botReply = { text: `אני בוט, קיבלתי את: ${content}`, sender: "bot" };

//         setMessages(prev => [...prev, userMsg]);

//         setTimeout(() => {
//             setMessages(prev => [...prev, botReply]);
//         }, 600);
//     }, []);

//     const handleSend = () => {
//         if (!input.trim()) return;
//         sendMessage(input);
//         setInput("");
//     };

//     return (
//         <div className="chat-container">
//             <MessageList messages={messages} />
//             <ChatInput
//                 input={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onSend={handleSend}
//             />
//         </div>
//     );
// }