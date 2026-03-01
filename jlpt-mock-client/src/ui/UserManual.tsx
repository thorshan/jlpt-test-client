import React from "react";
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
import { useUser } from "../context/UserContext";
import { useTranslation } from "../context/LanguageContext";

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
      icon: <Key className="text-sky-500" />,
      title: t("step_1_title"),
      desc: t("step_1_desc"),
    },
    {
      icon: <Clock className="text-orange-500" />,
      title: t("step_2_title"),
      desc: t("step_2_desc"),
    },
    {
      icon: <BookOpen className="text-green-500" />,
      title: t("step_3_title"),
      desc: t("step_3_desc"),
    },
    {
      icon: <ShieldCheck className="text-purple-500" />,
      title: t("step_4_title"),
      desc: t("step_4_desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 selection:bg-sky-500/30">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-500 hover:text-sky-400 transition-colors mb-10 group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-bold uppercase tracking-widest text-xs">
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
            <div className="flex items-center gap-2 text-sky-500 font-black text-xs uppercase tracking-[0.3em] mb-3">
              <Zap size={14} fill="currentColor" /> {t("manual")}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-none">
              {t("manual_title")}
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl font-medium">
              {t("manual_subtitle")}
            </p>
          </motion.header>

          {/* NOTICE SECTION */}
          <motion.section
            variants={itemVariants}
            className="mb-12 p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 text-red-500 mb-6">
              <AlertTriangle size={22} />
              <h3 className="font-black uppercase tracking-[0.2em] text-sm">
                {t("notice_title")}
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-red-500/20 p-2 h-fit rounded-lg">
                  <Trash2 size={18} className="text-red-500 shrink-0" />
                </div>
                <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
                  <span className="text-white font-black uppercase tracking-tighter mr-1">
                    {t("logout")} :
                  </span>
                  {t("notice_logout_warning")}
                </p>
              </div>

              <div className="flex gap-4">
                <div className="bg-red-500/20 p-2 h-fit rounded-lg">
                  <Clock size={18} className="text-red-500 shrink-0" />
                </div>
                <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
                  <span className="text-white font-black uppercase tracking-tighter mr-1">
                    {t("notice_ttl_title")} :
                  </span>
                  {t("notice_ttl_warning")}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Steps Grid */}
          <div className="space-y-10 mb-20">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                  {step.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-neutral-200 uppercase tracking-wider text-sm">
                    {step.title}
                  </h4>
                  <p className="text-neutral-500 leading-relaxed text-sm md:text-base">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.footer
            variants={itemVariants}
            className="text-center space-y-8 pt-10 border-t border-neutral-900"
          >
            <p className="text-neutral-600 text-xs uppercase tracking-[0.2em] font-bold">
              {t("footer_tag")}
            </p>
            <button
              onClick={() => navigate(user ? "/test" : "/get-started")}
              className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-sky-400 transition-all active:scale-[0.98] text-lg shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              {t("ready_btn")}
            </button>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
};

export default UserManual;
