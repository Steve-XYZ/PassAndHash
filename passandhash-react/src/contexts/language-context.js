import { createContext } from "react";
import { makeT } from "../i18n/translations";

export const defaultLanguage = "es";

export const LanguageContext = createContext({
  language: defaultLanguage,
  setLanguage: () => {},
  t: makeT(defaultLanguage),
});
