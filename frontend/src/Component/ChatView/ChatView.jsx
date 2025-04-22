import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatView.css';
import { IoPersonOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import ChatInput from '../ChatInput/ChatInput';

const formatJson = (text) => {
    try {
        // Check if the text is a JSON string
        const jsonObj = JSON.parse(text);
        const formattedJson = JSON.stringify(jsonObj, null, 2);
        
        // Split the JSON into lines and format each part
        return formattedJson.split('\n').map((line, index) => {
            // Match JSON key-value pairs
            const parts = line.split(/(?<=")([^"]+)(?=":)|(?<=: )([^,}\]]+)/g).filter(Boolean);
            
            return (
                <span key={index}>
                    {parts.map((part, i) => {
                        if (part.trim().startsWith('"')) {
                            return <span key={i} className="json-key">{part}</span>;
                        } else if (part.trim().startsWith('"') || part.trim().endsWith('"')) {
                            return <span key={i} className="json-string">{part}</span>;
                        } else if (!isNaN(part.trim())) {
                            return <span key={i} className="json-number">{part}</span>;
                        } else if (part.trim() === 'true' || part.trim() === 'false') {
                            return <span key={i} className="json-boolean">{part}</span>;
                        } else if (part.trim() === 'null') {
                            return <span key={i} className="json-null">{part}</span>;
                        }
                        return part;
                    })}
                    {'\n'}
                </span>
            );
        });
    } catch (e) {
        // If it's not valid JSON, return the original text
        return text;
    }
};

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

    const renderMessageContent = (content) => {
        // Check if the content is a JSON string
        if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
            return (
                <pre>
                    <code>
                        {formatJson(content)}
                    </code>
                </pre>
            );
        }

        // Split content into lines and process each line
        const lines = content.split('\n');
        let currentList = [];
        let result = [];
        let isInCodeBlock = false;
        let currentCodeBlock = [];
        let codeBlockLanguage = '';

        const handleCopy = (code) => {
            navigator.clipboard.writeText(code).then(() => {
                // You can add a visual feedback here if needed
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            // Check for code block markers
            if (trimmedLine.startsWith('```')) {
                if (isInCodeBlock) {
                    // End of code block
                    const codeContent = currentCodeBlock.join('\n');
                    result.push(
                        <pre key={`code-${index}`} data-language={codeBlockLanguage}>
                            <div className="code-block-header">
                                <span className="code-language">{codeBlockLanguage || 'plaintext'}</span>
                                <button 
                                    className="copy-button"
                                    onClick={() => handleCopy(codeContent)}
                                    title="Copy code"
                                >
                                    Copy
                                </button>
                            </div>
                            <code className={codeBlockLanguage ? `language-${codeBlockLanguage}` : ''}>
                                {codeContent}
                            </code>
                        </pre>
                    );
                    currentCodeBlock = [];
                    isInCodeBlock = false;
                    codeBlockLanguage = '';
                } else {
                    // Start of code block
                    isInCodeBlock = true;
                    // Extract language if specified
                    codeBlockLanguage = trimmedLine.slice(3).trim();
                }
                return;
            }

            if (isInCodeBlock) {
                currentCodeBlock.push(line);
                return;
            }

            // Handle regular markdown as before
            if (trimmedLine.startsWith('#')) {
                const level = trimmedLine.match(/^#+/)[0].length;
                const text = trimmedLine.replace(/^#+\s*/, '');
                const HeaderTag = `h${Math.min(level, 6)}`;
                result.push(React.createElement(HeaderTag, { key: index, className: 'markdown-header' }, text));
            }
            else if (trimmedLine.startsWith('-')) {
                const listItemText = trimmedLine.replace(/^-+\s*/, '').trim();
                currentList.push(<li key={index}>{renderBoldText(listItemText)}</li>);
            }
            else if (currentList.length > 0) {
                result.push(<ul key={`list-${index}`}>{currentList}</ul>);
                currentList = [];
                result.push(<div key={index}>{renderBoldText(line)}</div>);
            }
            else {
                result.push(<div key={index}>{renderBoldText(line)}</div>);
            }
        });

        // Add any remaining list items
        if (currentList.length > 0) {
            result.push(<ul key="final-list">{currentList}</ul>);
        }

        // Add any remaining code block content
        if (isInCodeBlock && currentCodeBlock.length > 0) {
            const codeContent = currentCodeBlock.join('\n');
            result.push(
                <pre key="final-code" data-language={codeBlockLanguage}>
                    <div className="code-block-header">
                        <span className="code-language">{codeBlockLanguage || 'plaintext'}</span>
                        <button 
                            className="copy-button"
                            onClick={() => handleCopy(codeContent)}
                            title="Copy code"
                        >
                            Copy
                        </button>
                    </div>
                    <code className={codeBlockLanguage ? `language-${codeBlockLanguage}` : ''}>
                        {codeContent}
                    </code>
                </pre>
            );
        }

        return result;
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
                        <div className="message-text">{renderMessageContent(msg.content)}</div>
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