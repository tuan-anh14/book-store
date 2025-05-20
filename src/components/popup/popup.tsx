import React from 'react';
import './Popup.scss';

interface PopupProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isVisible, onClose, children }) => {
    return (
        <div className={`popup-overlay${isVisible ? '' : ' hide'}`}>
            <div className="popup-content">
                <button className="popup-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Popup; 