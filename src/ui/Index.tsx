import {
  motion,
  type Variants,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect } from "react";
import {
  ExternalLink,
  Zap,
  Globe,
  Lock,
  BookOpen,
  UserStar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LangToggler } from "../components/LangToggler";
import { useTranslation } from "../hooks/useTranslation";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const Index = () => {
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

      <div className="fixed top-0 left-0 w-full z-[100] px-4 py-4 md:px-8 md:py-8 flex items-center justify-between pointer-events-none">
        {/* Logo Section */}
        <motion.div variants={itemVariants} className="pointer-events-auto">
          <motion.img
            src="/JLPTX.png"
            className="w-12 h-12 md:w-16 md:h-16 object-contain brightness-125"
          />
        </motion.div>

        {/* Buttons Section */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <motion.div variants={itemVariants}>
            <div className="bg-white/5 backdrop-blur-xl border border-sky-500/10 p-1 rounded-2xl shadow-2xl">
              <LangToggler />
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-sky-500/10 text-white px-4 py-2.5 md:px-6 md:py-2 rounded-2xl font-bold text-sm md:text-base shadow-2xl hover:border-sky-400/40 transition-all"
              onClick={() => navigate("/manual")}
            >
              <span className="bg-sky-500/20 text-sky-400 p-1 rounded-lg">
                <BookOpen size={18} />
              </span>
              <span className={isBurmese ? "leading-relaxed" : ""}>
                {t("manual")}
              </span>
            </motion.button>
          </motion.div>

          <motion.button
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-sky-500/10 text-white px-4 py-2.5 md:px-6 md:py-2 rounded-2xl font-bold text-sm md:text-base shadow-2xl hover:border-sky-400/40 transition-all"
            onClick={() => navigate("/auth")}
          >
            <span className="bg-sky-500/20 text-sky-400 p-1 rounded-lg">
              <UserStar size={18} />
            </span>
          </motion.button>
        </div>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.2, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[5%] -left-[5%] w-[70%] h-[50%] bg-sky-600/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/2 -right-[10%] w-[60%] h-[60%] bg-blue-900/20 blur-[150px] rounded-full"
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center px-4 md:px-6 z-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center space-y-6 md:space-y-8"
        >
          {/* VERSION TAG */}
          <motion.div
            variants={itemVariants}
            className="inline-block px-4 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-400 text-[10px] md:text-xs font-black tracking-[0.25em] uppercase"
          >
            v1.0
          </motion.div>

          <motion.h3
            variants={itemVariants}
            className={`
              text-4xl sm:text-5xl md:text-7xl font-black
              leading-[1.6]
              overflow-visible
              tracking-normal
            `}
          >
            {t("hero_title")} <br />
            <span className="inline-block pb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-500 to-blue-600">
              {t("hero_subtitle")}
            </span>
          </motion.h3>

          <motion.p
            variants={itemVariants}
            className={`
                  text-slate-400 text-sm md:text-balance max-w-xl md:max-w-2xl mx-auto font-medium px-4
                  ${isBurmese ? "leading-loose" : "leading-relaxed"}
                `}
          >
            {t("hero_desc")}
          </motion.p>

          {/* BUTTON */}
          <motion.div
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
              onClick={() => navigate("/get-started")}
            >
              {t("start_test")}
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto relative z-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: <Zap />, title: t("feat_1_title"), desc: t("feat_1_desc") },
            {
              icon: <Lock />,
              title: t("feat_2_title"),
              desc: t("feat_2_desc"),
            },
            {
              icon: <Globe />,
              title: t("feat_3_title"),
              desc: t("feat_3_desc"),
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
      </section>

      {/* INTEGRITY SECTION */}
      <section className="py-16 md:py-24 px-4 md:px-6 relative z-40">
        <div className="max-w-4xl mx-auto bg-sky-950/10 p-8 md:p-16 rounded-[40px] border border-sky-500/10 text-center space-y-8 backdrop-blur-sm">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-sky-500/10 rounded-3xl mx-auto flex items-center justify-center border border-sky-500/20">
            <img
              src="/JLPTX.png"
              alt="Logo"
              className="w-12 h-12 md:w-16 md:h-16 object-contain brightness-125 contrast-125"
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
            {t("integrity_title")}
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {t("integrity_desc")}{" "}
            <a
              href="https://jlpt.jp"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 font-bold hover:text-sky-300 transition-colors inline-flex items-center gap-1 border-b border-sky-500/30 pb-0.5"
            >
              {t("official_link")} <ExternalLink size={14} />
            </a>
          </p>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center relative z-40">
        <span className="text-[10px] tracking-[0.4em] font-bold text-slate-600 uppercase">
          &copy; {new Date().getFullYear()} JLPTX
        </span>
      </footer>
    </div>
  );
};

export default Index;
