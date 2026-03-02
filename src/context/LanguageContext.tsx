import { createContext } from "react";
import { translations, type LanguageCode } from "../constant/translations";

interface LanguageContextType {
  lang: LanguageCode;
  t: (key: keyof (typeof translations)["en"]) => string;
  setLanguage: (code: LanguageCode) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);
