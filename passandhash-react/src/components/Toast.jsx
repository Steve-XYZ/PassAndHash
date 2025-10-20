import React, { useEffect, useState } from 'react';

const Toast = ({ message, type, id, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 3000); // Toast disappears after 3 seconds

    return () => clearTimeout(timer);
  }, [id, onClose]);

  if (!isVisible) return null;

  const toastClass = `toast toast-${type}`;

  return (
    <div className={toastClass}>
      {message}
      <button className="toast-close-btn" onClick={() => onClose(id)}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
