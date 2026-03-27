import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe, Check } from "lucide-react";
import type { LanguageCode } from "../constant/translations";
import { useTranslation } from "../hooks/useTranslation";

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "my", label: "မြန်မာဘာသာ" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
  { code: "ne", label: "नेपाली" },
  { code: "vi", label: "Việt Nam" },
  { code: "ru", label: "Русский" },
  { code: "id", label: "Indonesia" },
  { code: "ph", label: "Tagalog" },
];

export const LangToggler = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLanguage } = useTranslation();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-sky-500"
      >
        <Globe size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-48 bg-slate-900 border border-sky-800 rounded-2xl shadow-2xl py-3 z-20 overflow-hidden"
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-medium hover:bg-sky-500/10 transition-colors"
                >
                  <span
                    className={
                      lang === l.code ? "text-sky-500" : "text-neutral-400"
                    }
                  >
                    {l.label}
                  </span>
                  {lang === l.code && (
                    <Check size={14} className="text-sky-500" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
