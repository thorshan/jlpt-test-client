import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ExternalLink, ShieldCheck } from "lucide-react";

const Redirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);

  const targetUrl = searchParams.get("to") || "/test";
  const type = searchParams.get("type") || "general";

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate(targetUrl);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate, targetUrl]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-2xl w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-2xl shadow-3xl text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 animate-pulse">
            <Loader2 size={32} className="animate-spin" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-4">
          Preparing your {type === "cert" ? "Certificate" : "Examination"}
        </h2>
        <p className="text-slate-400 text-sm font-medium mb-8">
          Please wait while we secure your connection and prepare the requested resources.
        </p>

        {/* PROXIMITY ADS (Mock) */}
        <div className="bg-slate-950/50 border border-white/5 rounded-3xl p-6 mb-8 text-left group hover:border-sky-500/30 transition-all cursor-pointer">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-black bg-sky-500 text-slate-950 px-2 py-0.5 rounded uppercase tracking-widest">
              Sponsored
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Ads by JLPTX Partners
            </span>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors mb-2">
            Master N1 Kanji with JLPTX Elite™
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Get unlimited access to premium Kanji drills, simulated listening tests, and expert feedback. 
            Join 50,000+ students today.
          </p>
          <div className="flex items-center gap-2 text-sky-500 text-[10px] font-black uppercase tracking-widest">
            Learn More <ExternalLink size={12} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl font-black text-sky-500 tabular-nums">
            {timeLeft}s
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Security Verified
            </span>
          </div>
        </div>
      </motion.div>

      <footer className="absolute bottom-8 left-0 w-full text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
          Powered by JLPTX Infrastructure
        </p>
      </footer>
    </div>
  );
};

export default Redirect;
