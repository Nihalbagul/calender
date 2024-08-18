import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // Ensure you create a corresponding CSS file for styling

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
