// src/components/Toast.jsx
import { useEffect, useState } from "react";

const Toast = ({ message, type, id, onClose }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Inicia el temporizador para el desvanecimiento
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500); // Empieza a desvanecerse a los 2.5s

    // Inicia el temporizador para la eliminación final del DOM
    const removeTimer = setTimeout(() => {
      onClose(id);
    }, 3000); // Se elimina completamente a los 3s (dando 0.5s para la animación)

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [id, onClose]);

  const toastClass = `toast toast-${type} ${isFadingOut ? "fade-out" : ""}`;

  return (
    <div className={toastClass} role="alert">
      {message}
      <button
        type="button"
        className="toast-close-btn"
        onClick={() => onClose(id)}
        aria-label="Cerrar notificacion"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
