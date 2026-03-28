import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { ShieldCheck, Loader2 } from "lucide-react";

import { adApi, type Ad } from "../api/adApi";

const Redirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(20);
  const [ad, setAd] = useState<Ad | null>(null);
  const [loadingAd, setLoadingAd] = useState(true);

  const targetUrl = searchParams.get("to") || "/test";

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await adApi.getRandomAd();
        setAd(res.data?.data || null);
      } catch (error) {
        console.error("Error fetching ad:", error);
      } finally {
        setLoadingAd(false);
      }
    };
    fetchAd();
  }, []);

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
        <AnimatePresence mode="wait">
          {loadingAd ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center p-20"
            >
              <Loader2 className="animate-spin text-sky-500" size={48} />
            </motion.div>
          ) : ad ? (
            <motion.div
              key="ad"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group transition-all duration-500"
            >
              {/* Outer Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-end">
                {/* Ad Image Background */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                </div>


                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black bg-sky-500 text-slate-950 px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                        Sponsored
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
                        Official Partner
                      </span>
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight group-hover:text-sky-400 transition-colors uppercase italic">
                    {ad.title}
                  </h2>

                  <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4 font-medium max-w-lg">
                    {ad.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fallback"
              className="text-center p-20 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-md"
            >
              <h2 className="text-2xl font-black italic uppercase text-slate-500">
                JLPTX Mock System
              </h2>
              <p className="text-xs text-slate-600 mt-2 uppercase tracking-widest">
                Preparing your resources...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

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

