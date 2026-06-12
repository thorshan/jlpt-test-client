import type React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import SEO from "../components/SEO";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { Flag, LayoutDashboard, Zap } from "lucide-react";

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, z: 40 },
  visible: {
    y: 0,
    opacity: 1,
    z: 40,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const CollabLanding: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isBurmese = localStorage.getItem("app_lang") === "my";

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30 overflow-x-hidden relative font-sans">
      <SEO
        title="Collaborate with JLPTX"
        description="Collaborate with JLPTX"
        canonical="/collabs/get-started"
      />
      <motion.div
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none z-30 translate-x-[-50%] translate-y-[-50%]"
        style={{
          x: smoothX,
          y: smoothY,
        }}
      />

      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ backgroundPosition: "0px 0px" }}
        animate={{
          backgroundPosition: ["0px 0px", "48px 48px"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0),
          linear-gradient(rgba(30, 41, 59, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30, 41, 59, 0.2) 1px, transparent 1px)
        `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="z-40 flex flex-col justify-center items-center">
        <AnimatePresence>
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, z: 40 }}
            transition={{ duration: 0.9 }}
            src="/JLPTX.png"
            className="md:w-36 w-24 object-fit mt-10"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, z: 40 }}
            transition={{ duration: 2 }}
            className="md:my-6 my-2"
          >
            <h2
              className={`font-black ${isBurmese ? "md:text-7xl text-2xl" : "md:text-8xl text-3xl"}`}
            >
              {t("lets_together")}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="md:my-6 my-2"
          >
            <h6 className="md:text-2xl text-sm text-sky-500">
              {t("yours_stu_amb")}
            </h6>
          </motion.div>
        </AnimatePresence>
      </div>

      {/*Action Btn*/}
      <div className="w-full flex justify-center items-center md:my-10 my-5">
        <motion.div
          initial={{ z: 40 }}
          variants={itemVariants}
          className="pt-4 flex justify-center w-full"
        >
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 50px rgba(14, 165, 233, 0.25)",
            }}
            whileTap={{ scale: 0.98 }}
            className="w-fit sm:w-2/5 bg-sky-500 text-white px-8 md:px-8 py-4 md:py-5 rounded-2xl font-black text-base transition-all duration-300 flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(14,165,233,0.5)]"
            onClick={() => navigate("/collabs/get-started")}
          >
            {t("get_started")}
          </motion.button>
        </motion.div>
      </div>

      {/* Hero Image */}
      <div className="flex flex-col items-center justify-center">
        <AnimatePresence>
          <motion.img
            src="/home-test.png"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="object-contain my-10 w-[90%] rounded-3xl bg-linear-to-b from-slate-800/80 to-slate-700 shadow-2xl border border-slate-700/50 flex flex-row justify-center items-center"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            }}
          ></motion.img>
        </AnimatePresence>
      </div>

      {/* */}
      <div className="flex justify-center items-center">
        <div className="md:w-4/5 w-full md:px-15 px-10 my-6 flex justify-between items-center md:gap-5 gap-2 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -100, z: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-full flex flex-col justify-center items-center md:h-56 h-24 rounded-3xl bg-linear-to-r from-slate-800 to-slate-700/0 shadow-2xl border-slate-700/50"
          >
            <h1 className="md:text-7xl text-3xl font-black">Yours</h1>
            <h1 className="md:text-4xl text-md tracking-widest font-black">
              Students
            </h1>
          </motion.div>

          <motion.div className="animate-pulse font-black fonfont-sans md:text-8xl text-3xl text-sky-400">
            X
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100, z: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="md:h-56 h-24 w-full flex justify-center rounded-3xl bg-linear-to-l from-slate-800 to-slate-700/0 shadow-2xl border-slate-700/50"
          >
            <img src="/JLPTX.png" className="md:w-48 w-24 object-fit" />
          </motion.div>
        </div>
      </div>

      {/*Action Btn*/}
      <div className="w-full flex justify-center items-center md:my-10 my-5 md:px-15 px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: <LayoutDashboard />,
              title: t("collab_features_title_1"),
              desc: t("collab_features_desc_1"),
            },
            {
              icon: <Zap />,
              title: t("collab_features_title_2"),
              desc: t("collab_features_desc_2"),
            },
            {
              icon: <Flag />,
              title: t("collab_features_title_3"),
              desc: t("collab_features_desc_3"),
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-[32px] bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-sky-500/30 hover:bg-sky-500/[0.03] transition-all group"
            >
              <div className="text-sky-400 mb-6 group-hover:scale-110 group-hover:text-sky-300 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollabLanding;
