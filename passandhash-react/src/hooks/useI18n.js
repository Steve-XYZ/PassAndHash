import { useContext } from "react";
import { LanguageContext } from "../contexts/language-context";

export const useI18n = () => useContext(LanguageContext);
