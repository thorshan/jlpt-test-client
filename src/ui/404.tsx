import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

const STAR_DATA = [...Array(30)].map((_, i) => ({
  id: i,
  size: Math.random() * 2 + 1,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 2,
}));

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#060606] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative font-sans">
      {/* BACKGROUND STARS */}
      {STAR_DATA.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-0"
          style={{
            width: star.size,
            height: star.size,
            top: star.top,
            left: star.left,
          }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {/* LOGO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-12 z-10"
      >
        <img
          src="/JLPTX.png"
          alt="Logo"
          className="h-14 w-auto drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]"
        />
      </motion.div>

      {/* CONTENT */}
      <div className="relative z-10">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-9xl font-black text-white/10 absolute -top-20 left-1/2 -translate-x-1/2 select-none"
        >
          404
        </motion.h1>

        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
          {t("notFound_title")}
        </h2>

        <p className="text-gray-400 mb-10 max-w-xs mx-auto">
          {t("notFound_desc")}
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-800 text-gray-400 rounded-xl hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
          >
            ← {t("notFound_back")}
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-cyan-400 transition-colors"
          >
            {t("notFound_home")}
          </button>
        </div>
      </div>

      {/* ATMOSPHERIC GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full" />
    </div>
  );
};

export default NotFound;
