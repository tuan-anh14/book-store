import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { ChatBotProps, Message } from '../../types/chat';
import { GeminiService } from '../../services/gemini';
import ChatHeader from './chat.header';
import ChatMessage from './chat.message';
import ChatInput from './chat.input';

const ChatContainer = styled.div<{ isMinimized: boolean; isMaximized: boolean; isVisible: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: ${props => props.isMaximized ? '80%' : '350px'};
  height: ${props => props.isMinimized ? '60px' : props.isMaximized ? '80vh' : '500px'};
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(20px)'};
`;

const AssistantButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 999;

  &:hover {
    background-color: #1557b0;
    transform: translateY(-2px);
  }

  img {
    width: 32px;
    height: 32px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const ChatBot: React.FC<ChatBotProps> = ({ apiKey }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const geminiService = useRef(new GeminiService(apiKey));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        const userMessage: Message = {
            id: uuidv4(),
            content,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await geminiService.current.generateResponse(content);
            const botMessage: Message = {
                id: uuidv4(),
                content: response,
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error getting response:', error);
            const errorMessage: Message = {
                id: uuidv4(),
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setMessages([]);
    };

    return (
        <>
            <AssistantButton onClick={() => setIsVisible(true)}>
                <img src="https://salt.tikicdn.com/ts/ta/f8/a1/bf/95b4110dc1fba3d9b48dfc6c60be4a90.png" alt="Trợ lý" />
                <span>Trợ lý</span>
            </AssistantButton>
            <ChatContainer isMinimized={isMinimized} isMaximized={isMaximized} isVisible={isVisible}>
                <ChatHeader
                    onClose={handleClose}
                    onMinimize={() => setIsMinimized(!isMinimized)}
                    onMaximize={() => setIsMaximized(!isMaximized)}
                />
                {!isMinimized && (
                    <>
                        <MessagesContainer>
                            {messages.map(message => (
                                <ChatMessage key={message.id} message={message} />
                            ))}
                            <div ref={messagesEndRef} />
                        </MessagesContainer>
                        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
                    </>
                )}
            </ChatContainer>
        </>
    );
};

export default ChatBot; 