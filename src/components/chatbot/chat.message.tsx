import React from 'react';
import styled from 'styled-components';
import { ChatMessageProps } from '../../types/chat';

const MessageContainer = styled.div<{ isBot: boolean }>`
  display: flex;
  flex-direction: ${props => props.isBot ? 'row' : 'row-reverse'};
  margin: 8px 0;
  gap: 8px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MessageBubble = styled.div<{ isBot: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  background-color: ${props => props.isBot ? '#f0f0f0' : '#1a73e8'};
  color: ${props => props.isBot ? '#000' : '#fff'};
  font-size: 14px;
  line-height: 1.4;
`;

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isBot = message.sender === 'bot';

    return (
        <MessageContainer isBot={isBot}>
            <Avatar>
                <img
                    src={isBot ? '/bot-avatar.png' : '/user-avatar.png'}
                    alt={isBot ? 'Bot' : 'User'}
                />
            </Avatar>
            <MessageBubble isBot={isBot}>
                {message.content}
            </MessageBubble>
        </MessageContainer>
    );
};

export default ChatMessage; 