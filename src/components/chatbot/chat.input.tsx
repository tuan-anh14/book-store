import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChatInputProps } from '../../types/chat';

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
`;

const InputForm = styled.form`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const TextArea = styled.textarea`
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  resize: none;
  font-size: 14px;
  line-height: 1.4;
  outline: none;
  
  &:focus {
    border-color: #1a73e8;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #1a73e8;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1557b0;
  }
  
  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <InputContainer>
            <InputForm onSubmit={handleSubmit}>
                <TextArea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    disabled={disabled}
                    rows={1}
                />
                <SendButton type="submit" disabled={!message.trim() || disabled}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                            fill="currentColor"
                        />
                    </svg>
                </SendButton>
            </InputForm>
        </InputContainer>
    );
};

export default ChatInput; 