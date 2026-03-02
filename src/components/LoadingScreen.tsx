import { motion } from "framer-motion";

import { type Variants } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

export const LoadingScreen = () => {
  const { t } = useTranslation();

  const pathVariants: Variants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut", repeat: Infinity },
        opacity: { duration: 0.5 },
      },
    },
  };

  // Animation variants for the JLPT text (breathing effect)
  const textVariants: Variants = {
    animate: {
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-6">
      <div className="relative w-32 h-32 md:w-48 md:h-48">
        <svg
          viewBox="0 0 236 185"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* THE BLUE "X" SHAPE - Animated Drawing */}
          <motion.path
            d="M5 5H75.839L105.771 40.2823M176.61 5H225L150.669 92.1472M196.066 145.776L225 180H152.664L114.751 135.192M76.3379 180H27.449L90.3061 106.26"
            stroke="#0EA5E9"
            strokeWidth="10"
            strokeLinecap="round"
            variants={pathVariants}
            initial="initial"
            animate="animate"
          />

          {/* THE JLPT TEXT - Breathing Fade */}
          <motion.path
            d="M6.728 100.448V95.136C10.184 95.136 12.7013 94.432 14.28 93.024C15.9013 91.616 16.712 89.1627 16.712 85.664V56.48H22.28V85.664C22.28 88.5653 21.8107 91.1467 20.872 93.408C19.976 95.6267 18.3973 97.3547 16.136 98.592C13.9173 99.8293 10.7813 100.448 6.728 100.448ZM58.842 94.816V100H35.034V56.48H40.602V94.816H58.842ZM67.409 100V56.48H80.977C85.1583 56.48 88.337 57.5893 90.513 59.808C92.7317 61.984 93.841 64.9067 93.841 68.576V71.968C93.841 75.6373 92.7317 78.5813 90.513 80.8C88.337 83.0187 85.1583 84.128 80.977 84.128H72.977V100H67.409ZM80.977 61.728H72.977V78.944H80.977C83.281 78.944 85.0303 78.3253 86.225 77.088C87.4623 75.8507 88.081 74.144 88.081 71.968V68.576C88.081 66.4427 87.4623 64.7787 86.225 63.584C85.0303 62.3467 83.281 61.728 80.977 61.728ZM97.582 61.728V56.48H128.494V61.728H115.822V100H110.254V61.728H97.582Z"
            fill="#CBDDE9"
            variants={textVariants}
            animate="animate"
          />
        </svg>

        {/* Outer Glow Effect */}
        <div className="absolute inset-0 bg-sky-500/10 blur-3xl rounded-full -z-10 animate-pulse" />
      </div>

      {/* Localized Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sky-500 font-black tracking-[0.3em] text-xs uppercase"
      >
        {t("loading")}
      </motion.p>
    </div>
  );
};
