import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, type LanguageCode } from "../constant/translations";

interface LanguageContextType {
  lang: LanguageCode;
  t: (key: keyof (typeof translations)["en"]) => string;
  setLanguage: (code: LanguageCode) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lang, setLang] = useState<LanguageCode>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as LanguageCode;

    if (savedLang) {
      setLang(savedLang);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split("-")[0] as LanguageCode;
      const supported = Object.keys(translations).includes(browserLang);
      setLang(supported ? browserLang : "en");
    }
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setLang(code);
    localStorage.setItem("app_lang", code);
  };

  const t = (key: keyof (typeof translations)["en"]) => {
    return translations[lang][key] || translations["en"][key];
  };

  return (
    <LanguageContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
