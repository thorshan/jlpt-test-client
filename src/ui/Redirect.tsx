import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck } from "lucide-react";

const Redirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(20);

  const targetUrl = searchParams.get("to") || "/test";

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl w-full"
      >
        {/* ENHANCED PROXIMITY AD */}
        <div className="relative group cursor-pointer transition-all duration-500">
          {/* Outer Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl overflow-hidden active:scale-[0.98]">
            {/* Background Texture for Ad */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black bg-sky-500 text-slate-950 px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                  Sponsored
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
                  JLPTX Partners
                </span>
              </div>
              <ExternalLink size={18} className="text-slate-500 group-hover:text-sky-400 transition-colors" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight tracking-tight group-hover:text-sky-400 transition-colors">
              Master N1 Kanji with <span className="text-sky-500 italic">JLPTX Elite™</span>
            </h2>
            
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 font-medium">
              Get unlimited access to premium Kanji drills, simulated listening tests, and expert feedback from N1 certified instructors.
            </p>

            <div className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95">
              Unlock Elite Now
            </div>
          </div>
        </div>

        {/* REFINED COUNTDOWN */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md">
            <div className="text-3xl font-black text-white tabular-nums">
              {timeLeft}
              <span className="text-sky-500 ml-1 italic">S</span>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Safe Redirect
              </span>
            </div>
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
