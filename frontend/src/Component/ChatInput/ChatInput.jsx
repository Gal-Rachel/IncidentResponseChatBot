import React from 'react';
import './ChatInput.css';

export default function ChatInput({ input, onChange, onSend }) {
    return (
        <div className="ChatInput">
            <input
                type="text"
                value={input}
                onChange={onChange}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && onSend()}
            />
        </div>
    );
}
