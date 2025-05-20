import React from 'react';
import './chatbot.scss';
import { ChatMessageProps } from '../../types/chat';
import botAvatar from '../../assets/bot-avatar.png';
import userDefaultAvatar from '../../assets/user-avatar.png';

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`message-container ${isBot ? 'is-bot' : 'is-user'}`}>
      <div className={`avatar${isBot ? ' is-bot' : ''}`}>
        <img
          src={isBot ? botAvatar : userDefaultAvatar}
          alt={isBot ? 'Bot' : 'User'}
        />
      </div>
      <div className={`message-bubble${isBot ? ' is-bot' : ''}`}>
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage; 