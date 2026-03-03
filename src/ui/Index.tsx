import { motion, type Variants } from "framer-motion";
import {
  Instagram,
  Youtube,
  Send,
  ExternalLink,
  Zap,
  Globe,
  Lock,
  BookOpen,
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-sky-500/30 overflow-x-hidden relative">
      {/* FLOAT UTILS */}
      <div className="fixed top-4 right-4 z-[100] md:top-8 md:right-8 flex flex-col items-end gap-3 md:flex-row md:items-center">
        {/* MANUAL BUTTON */}
        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 text-white px-5 py-3 md:px-6 md:py-4 rounded-2xl font-bold text-sm md:text-base shadow-xl hover:border-sky-500/50 transition-all"
            onClick={() => navigate("/manual")}
          >
            <span className="bg-sky-500/20 text-sky-400 p-1 rounded-lg">
              <BookOpen size={18} />
            </span>
            {t("manual")}
          </motion.button>
        </motion.div>

        {/* LANGUAGE TOGGLER */}
        <motion.div variants={itemVariants}>
          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-1 rounded-2xl shadow-xl">
            <LangToggler />
          </div>
        </motion.div>
      </div>

      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[80%] md:w-[40%] h-[40%] bg-sky-600/10 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[70%] md:w-[30%] h-[30%] bg-sky-900/10 blur-[80px] md:blur-[100px] rounded-full" />
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center space-y-6 md:space-y-8"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block px-4 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-400 text-[10px] md:text-xs font-black tracking-widest uppercase"
          >
            VERSION 1.0
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[1.5] md:leading-none"
          >
            {t("hero_title")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">
              {t("hero_subtitle")}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-neutral-500 text-sm md:text-xl max-w-xl md:max-w-2xl mx-auto font-medium leading-relaxed px-4"
          >
            {t("hero_desc")}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="pt-4 flex justify-center w-full"
          >
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="
                sm:w-2/4 w-full
                bg-white text-black
                px-12 py-4 md:py-5
                rounded-2xl font-black text-lg
                shadow-[0_0_40px_rgba(255,255,255,0.1)]
                active:bg-neutral-200
                transition-colors
                flex items-center justify-center
              "
              onClick={() => navigate("/get-started")}
            >
              {t("start_test")}
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
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
              viewport={{ once: true, margin: "-50px" }}
              className="p-8 rounded-[32px] bg-neutral-900/40 border border-neutral-800 hover:border-sky-500/50 transition-all group"
            >
              <div className="text-sky-500 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOGO & INTEGRITY SECTION */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-neutral-900/50 p-8 md:p-16 rounded-[40px] border border-neutral-800 text-center space-y-8">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-sky-500/10 rounded-3xl mx-auto flex items-center justify-center border border-sky-500/20 shadow-[0_0_40px_rgba(14,165,233,0.15)]">
            <img
              src="/JLPTX.png"
              alt="Logo"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-black">
            {t("integrity_title")}
          </h2>
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {t("integrity_desc")}{" "}
            <a
              href="https://jlpt.jp"
              target="_blank"
              rel="noreferrer"
              className="text-sky-500 font-bold hover:underline inline-flex items-center gap-1"
            >
              {t("official_link")} <ExternalLink size={14} />
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-neutral-900 text-center space-y-10">
        <div className="flex justify-center gap-8 text-neutral-500">
          <Instagram className="cursor-pointer hover:text-sky-500 transition-colors" />
          <Send className="cursor-pointer hover:text-sky-500 transition-colors" />
          <Youtube className="cursor-pointer hover:text-sky-500 transition-colors" />
        </div>
        <p className="text-[10px] font-black tracking-[0.3em] text-neutral-700 uppercase px-6">
          {t("footer_tag")}
        </p>
      </footer>
    </div>
  );
};

export default Index;
