// src/hooks/useToast.js
import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext"; // <-- Importa el contexto

export const useToast = () => {
  return useContext(ToastContext);
};
