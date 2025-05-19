import React from 'react';
import styled from 'styled-components';
import { ChatHeaderProps } from '../../types/chat';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onMinimize, onMaximize }) => {
    return (
        <HeaderContainer>
            <Title>Trợ lý AI</Title>
            <ButtonGroup>
                <IconButton onClick={onMinimize} title="Thu nhỏ">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 13H5v-2h14v2z" fill="currentColor" />
                    </svg>
                </IconButton>
                <IconButton onClick={onMaximize} title="Phóng to">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor" />
                    </svg>
                </IconButton>
                <IconButton onClick={onClose} title="Đóng">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
                    </svg>
                </IconButton>
            </ButtonGroup>
        </HeaderContainer>
    );
};

export default ChatHeader; 