import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatHistory.css';
import { SiCyberdefenders } from "react-icons/si";
import { IoSearchSharp } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { FaBars } from "react-icons/fa";

export default function ChatHistory({ chats, onChatUpdate }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deletingChatId, setDeletingChatId] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNewChat = async () => {
        setLoading(true);
        setError(null);
        try {
            const initialMessage = {
                role: "bot",
                content: "Hello! I'm your Incident Response Assistant. How can I help you today?"
            };

            const response = await fetch('http://localhost:5000/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: initialMessage.content,
                    messages: [initialMessage]
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create new chat');
            }

            const newChat = await response.json();
            if (onChatUpdate) onChatUpdate();
            navigate(`/chat/${newChat._id}`);
        } catch (error) {
            console.error('Error creating new chat:', error);
            setError('Failed to create new chat');
        } finally {
            setLoading(false);
        }
    };

    const handleChatClick = (chatId) => {
        navigate(`/chat/${chatId}`);
    };

    const handleDeleteChat = async (chatId, e) => {
        e.stopPropagation(); // Prevent chat click when clicking delete button
        if (!window.confirm('Are you sure you want to delete this chat?')) {
            return;
        }

        setDeletingChatId(chatId);
        try {
            const response = await fetch(`http://localhost:5000/api/chats/${chatId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete chat');
            }

            if (onChatUpdate) onChatUpdate();
        } catch (error) {
            console.error('Error deleting chat:', error);
            setError('Failed to delete chat');
        } finally {
            setDeletingChatId(null);
        }
    };

    return (
        <>
            <div className={`ChatHistory ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="ChatHistoryHeader">
                    <div className="ChatHistoryHeaderTitleText">
                        <SiCyberdefenders className="icon" />
                        <span>Chat History</span>
                    </div>
                </div>

                <div className="search-container">
                    <IoSearchSharp />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    className="new-chat-button"
                    onClick={handleNewChat}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'New Chat'}
                </button>

                <div className="ChatHistoryBody">
                    {error ? (
                        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                            {error}
                        </div>
                    ) : (
                        <ul className="chat-list">
                            {filteredChats.map((chat) => (
                                <li
                                    key={chat._id}
                                    className="chat-item"
                                    onClick={() => {
                                        handleChatClick(chat._id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <div className="chat-link">
                                        {chat.title}
                                    </div>
                                    <button
                                        className="delete-chat-button"
                                        onClick={(e) => handleDeleteChat(chat._id, e)}
                                        disabled={deletingChatId === chat._id}
                                    >
                                        {deletingChatId === chat._id ? 'Deleting...' : <FaTrash />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="PoweredBy">
                    Powered by
                    <a
                        href="https://github.com/Gal-Rachel/IncidentResponseChatBot"
                        target="_blank" rel="noopener noreferrer">
                        <br />
                        Gal Shmuel & Rachel Yeholashet
                    </a>
                </div>
            </div>

            <button 
                className="mobile-menu-toggle"
                onClick={toggleMobileMenu}
                style={{
                    display: 'none',
                    position: 'fixed',
                    top: '10px',
                    left: '10px',
                    zIndex: 1001,
                    background: '#2e64a1',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    color: 'white',
                    cursor: 'pointer'
                }}
            >
                <FaBars />
            </button>
        </>
    );
}
