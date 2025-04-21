import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatView.css';
import { IoPersonOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import ChatInput from '../ChatInput/ChatInput';

export default function ChatView({ onChatUpdate }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChat = useCallback(async () => {
        if (!id) return;
        try {
            const response = await fetch(`http://localhost:5000/api/chats/${id}`);
            if (!response.ok) throw new Error('Failed to fetch chat');
            const chat = await response.json();
            setMessages(chat.messages || []);
        } catch (error) {
            console.error('Error fetching chat:', error);
            navigate('/');
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchChat();
    }, [fetchChat]);

    const renderBoldText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const saveMessage = async (message) => {
        try {
            const response = await fetch(`http://localhost:5000/api/chats/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });

            if (!response.ok) throw new Error('Failed to save message');

            // Update the chat list in the sidebar
            if (onChatUpdate) onChatUpdate();
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    const sendMessage = async (content) => {
        if (!content.trim() || isThinking) return;

        const userMessage = { role: "user", content };
        console.log('Sending message:', userMessage);
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsThinking(true);

        try {
            if (!id) {
                // Create new chat if no ID exists
                console.log('Creating new chat...');
                const response = await fetch('http://localhost:5000/api/chats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: content.substring(0, 30) + '...',
                        messages: [userMessage]
                    })
                });

                if (!response.ok) throw new Error('Failed to create chat');
                const newChat = await response.json();
                console.log('New chat created:', newChat);
                navigate(`/chat/${newChat._id}`);
                if (onChatUpdate) onChatUpdate();
                return;
            }

            // Save user message and get autogen response through the backend
            console.log('Sending message to backend...');
            const response = await fetch(`http://localhost:5000/api/chats/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userMessage)
            });

            if (!response.ok) throw new Error('Failed to send message');

            const updatedChat = await response.json();
            console.log('Received updated chat with autogen response:', updatedChat);
            setMessages(updatedChat.messages);

            if (onChatUpdate) onChatUpdate();

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsThinking(false);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
    };

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
                    <div key={index} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
                        {msg.role === 'user' ? (
                            <div className="user-icon-wrapper icon-wrapper">
                                <IoPersonOutline className="icon" />
                            </div>
                        ) : (
                            <div className="bot-icon-wrapper icon-wrapper">
                                <RiRobot2Line className="icon" />
                            </div>
                        )}
                        <div className="message-text">{renderBoldText(msg.content)}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
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
                    disabled={isThinking || !input.trim()}
                >
                    {isThinking ? <div className="spinner"></div> : 'Send'}
                </button>
            </div>
        </div>
    );
}