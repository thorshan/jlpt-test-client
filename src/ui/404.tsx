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
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative font-sans">
      {/* 1. ANIMATED GRID BACKGROUND */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ backgroundPosition: "0px 0px" }}
        animate={{ backgroundPosition: ["0px 0px", "48px 48px"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgb(14 165 233 / 0.15) 1px, transparent 0),
            linear-gradient(rgb(30 41 59 / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgb(30 41 59 / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* 2. DYNAMIC SKY ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[50%] bg-sky-600/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-900/30 blur-[150px] rounded-full"
        />
      </div>

      {/* 3. BACKGROUND STARS */}
      {STAR_DATA.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-0 z-0"
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 z-10"
      >
        <img
          src="/JLPTX.png"
          alt="Logo"
          className="h-14 w-auto drop-shadow-[0_0_15px_rgba(14,165,233,0.5)] brightness-110"
        />
      </motion.div>

      {/* CONTENT */}
      <div className="relative z-10">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-[12rem] md:text-[15rem] font-black text-sky-500/10 absolute -top-32 md:-top-40 left-1/2 -translate-x-1/2 select-none z-[-1]"
        >
          404
        </motion.h1>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-relaxed">
          {t("notFound_title")}
        </h2>

        <p className="text-sky-500/60 mb-10 max-w-xs mx-auto font-medium leading-relaxed">
          {t("notFound_desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 border border-sky-900/50 text-sky-400 rounded-xl hover:bg-sky-500/10 transition-all font-bold"
          >
            ← {t("notFound_back")}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-10 py-3 bg-sky-500 text-white rounded-xl font-black shadow-[0_10px_20px_-5px_rgba(14,165,233,0.4)] hover:bg-sky-400 transition-all"
          >
            {t("notFound_home")}
          </motion.button>
        </div>
      </div>

      {/* ATMOSPHERIC CENTRAL GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default NotFound;
