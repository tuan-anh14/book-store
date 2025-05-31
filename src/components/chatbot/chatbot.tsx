import React, { useState, useRef, useEffect } from 'react';
import './chatbot.scss';
import { v4 as uuidv4 } from 'uuid';
import { ChatBotProps, Message } from '../../types/chat';
import { GeminiService } from '../../services/gemini';
import ChatHeader from './chat.header';
import ChatMessage from './chat.message';
import ChatInput from './chat.input';

const ChatBot: React.FC<ChatBotProps> = ({ apiKey }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const geminiService = useRef(new GeminiService(apiKey));
    const [hasShownWelcome, setHasShownWelcome] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Trigger welcome message when the chatbot is opened
    useEffect(() => {
        if (isVisible && !hasShownWelcome) {
            const welcomeMessage: Message = {
                id: uuidv4(),
                content: 'Chào mừng bạn đến với BookStore! Tôi có thể giúp gì cho bạn?',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
            setHasShownWelcome(true);
        }
    }, [isVisible, hasShownWelcome]);

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

    // Call the external onClose prop when closing
    const handleClose = () => {
        setIsVisible(false);
        setMessages([]);
        setHasShownWelcome(false);
    };

    let containerClass = 'chatbot-container';
    if (isMaximized) containerClass += ' maximized';
    if (isMinimized) containerClass += ' minimized';
    if (!isVisible) containerClass += ' hide';

    return (
        <>
            <button className="assistant-button" onClick={() => setIsVisible(true)}>
                <img src="https://salt.tikicdn.com/ts/ta/f8/a1/bf/95b4110dc1fba3d9b48dfc6c60be4a90.png" alt="Trợ lý" />
                <span>Trợ lý</span>
            </button>
            <div className={containerClass}>
                <ChatHeader
                    onClose={handleClose}
                    onMinimize={() => setIsMinimized(!isMinimized)}
                    onMaximize={() => setIsMaximized(!isMaximized)}
                />
                {!isMinimized && (
                    <>
                        <div className="messages-container">
                            {messages.length === 0 && (
                                <div className="welcome-message">
                                    <img
                                        src="https://salt.tikicdn.com/ts/tikimsp/9c/a5/89/bd9f768fd2b4b6037159e7d8fa5595f0.png"
                                        alt="Welcome"
                                    />
                                </div>
                            )}
                            {messages.map(message => (
                                <ChatMessage key={message.id} message={message} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
                    </>
                )}
            </div>
        </>
    );
};

export default ChatBot; 