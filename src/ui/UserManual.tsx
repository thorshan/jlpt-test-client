import { motion } from "framer-motion";
import {
  Key,
  ShieldCheck,
  Clock,
  BookOpen,
  ChevronLeft,
  Zap,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { useUser } from "../hooks/useUser";

const UserManual = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const steps = [
    {
      icon: <Key className="text-sky-400" />,
      title: t("step_1_title"),
      desc: t("step_1_desc"),
    },
    {
      icon: <Clock className="text-amber-400" />,
      title: t("step_2_title"),
      desc: t("step_2_desc"),
    },
    {
      icon: <BookOpen className="text-emerald-400" />,
      title: t("step_3_title"),
      desc: t("step_3_desc"),
    },
    {
      icon: <ShieldCheck className="text-indigo-400" />,
      title: t("step_4_title"),
      desc: t("step_4_desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 selection:bg-sky-500/30 relative overflow-x-hidden font-sans">
      {/* 1. ANIMATED GRID BACKGROUND */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ backgroundPosition: "0px 0px" }}
        animate={{ backgroundPosition: ["0px 0px", "48px 48px"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgb(14 165 233 / 0.1) 1px, transparent 0),
            linear-gradient(rgb(30 41 59 / 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgb(30 41 59 / 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* 2. DYNAMIC SKY ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-sky-600/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.15, 0.05] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 -left-[10%] w-[60%] h-[60%] bg-blue-900/20 blur-[150px] rounded-full"
        />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-sky-400 transition-colors mb-10 group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-black uppercase tracking-widest text-[14px]">
            {t("back")}
          </span>
        </button>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.header variants={itemVariants} className="mb-12">
            <div className="flex items-center gap-2 text-sky-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4">
              <Zap size={14} fill="currentColor" /> {t("manual")}
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-[1.1]">
              {t("manual_title")}
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              {t("manual_subtitle")}
            </p>
          </motion.header>

          {/* NOTICE SECTION */}
          <motion.section
            variants={itemVariants}
            className="mb-16 p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/20 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="flex items-center gap-3 text-rose-500 mb-8">
              <AlertTriangle size={22} />
              <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                {t("notice_title")}
              </h3>
            </div>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="bg-rose-500/10 p-3 h-fit rounded-2xl border border-rose-500/10">
                  <Trash2 size={20} className="text-rose-500 shrink-0" />
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  <span className="text-white font-black uppercase tracking-tighter mr-2">
                    {t("logout")} :
                  </span>
                  {t("notice_logout_warning")}
                </p>
              </div>

              <div className="flex gap-5">
                <div className="bg-rose-500/10 p-3 h-fit rounded-2xl border border-rose-500/10">
                  <Clock size={20} className="text-rose-500 shrink-0" />
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  <span className="text-white font-black uppercase tracking-tighter mr-2">
                    {t("notice_ttl_title")} :
                  </span>
                  {t("notice_ttl_warning")}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Steps Grid */}
          <div className="space-y-12 mb-20">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex gap-6 items-start group"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-slate-900/50 rounded-[1.5rem] flex items-center justify-center border border-white/5 shadow-2xl backdrop-blur-md group-hover:border-sky-500/30 transition-colors">
                  {step.icon}
                </div>
                <div className="space-y-2 pt-1">
                  <h4 className="font-black text-slate-100 uppercase tracking-widest text-xs">
                    {step.title}
                  </h4>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base font-medium">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.footer
            variants={itemVariants}
            className="text-center space-y-10 pt-12 border-t border-slate-900/50"
          >
            <p className="text-[10px] tracking-[0.4em] font-bold text-slate-600 uppercase">
              &copy; {new Date().getFullYear()} JLPTX
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(user ? "/test" : "/get-started")}
              className="w-full py-6 bg-white text-slate-950 font-black rounded-3xl hover:bg-sky-400 transition-all text-xl shadow-[0_20px_40px_rgba(14,165,233,0.15)]"
            >
              {t("ready_btn")}
            </motion.button>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
};

export default UserManual;
