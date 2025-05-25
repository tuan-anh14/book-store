import React from 'react';
import './ChatBot.scss';
import { ChatHeaderProps } from '../../types/chat';

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onMinimize, onMaximize }) => {
  return (
    <div className="chatbot-header">
      <div className="chatbot-title-container">
        <h3 className="chatbot-title">Trợ lý AI Gemini</h3>
        <span className="chatbot-disclaimer">Thông tin mang tính chất tham khảo</span>
      </div>
      <div className="chatbot-btn-group">
        <button className="chatbot-icon-btn" onClick={onMinimize} title="Thu nhỏ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 13H5v-2h14v2z" fill="currentColor" />
          </svg>
        </button>
        <button className="chatbot-icon-btn" onClick={onMaximize} title="Phóng to">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor" />
          </svg>
        </button>
        <button className="chatbot-icon-btn" onClick={onClose} title="Đóng">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 