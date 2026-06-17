import { useEffect, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { translations, type LanguageCode } from "../constant/translations";

const getInitialLanguage = (): LanguageCode => {
  const savedLang = localStorage.getItem("app_lang") as LanguageCode;

  if (savedLang && Object.keys(translations).includes(savedLang)) {
    return savedLang;
  }

  const browserLang = navigator.language.split("-")[0] as LanguageCode;
  return Object.keys(translations).includes(browserLang) ? browserLang : "en";
};

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lang, setLang] = useState<LanguageCode>(getInitialLanguage);

  useEffect(() => {
    const root = document.documentElement;

    // Remove both to ensure a clean state
    root.classList.remove("lang-en", "lang-mm");

    // Apply the class based on current state
    if (lang === "my") {
      root.classList.add("lang-mm");
    } else {
      root.classList.add("lang-en");
    }

    localStorage.setItem("app_lang", lang);
  }, [lang]);

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
