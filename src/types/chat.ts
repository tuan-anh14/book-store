export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export interface ChatBotProps {
    apiKey: string;
}

export interface ChatMessageProps {
    message: Message;
}

export interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

export interface ChatHeaderProps {
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
} 