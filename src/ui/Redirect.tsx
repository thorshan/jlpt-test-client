import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import { adApi, type Ad } from "../api/adApi";

const Redirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10); // Reduced to 10s for better UX
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
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAdClick = async () => {
    if (ad) {
      try {
        await adApi.trackClick(ad._id);
      } catch (error) {
        console.error("Error tracking click:", error);
      }
    }
  };

  const handleContinue = () => {
    navigate(targetUrl);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md w-full"
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
              className="flex flex-col gap-6"
            >
              {/* Ad Card */}
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col">
                {/* Square Image Block */}
                <div className="w-full aspect-square bg-slate-900 relative overflow-hidden">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[9px] font-black bg-sky-500 text-slate-950 px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg">
                      Sponsored
                    </span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-8 flex flex-col gap-3">
                  <h2 className="text-2xl font-black text-white leading-tight uppercase italic tracking-tight">
                    {ad.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {ad.content}
                  </p>
                  <a
                    href="https://jlpt.jp" // Placeholder or actual link if provided in model
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleAdClick}
                    className="mt-2 text-sky-400 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors group w-fit"
                  >
                    See More Details
                    <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex flex-col items-center gap-6 mt-4">
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 py-2 px-4 rounded-full">
                   <div className="text-xl font-black text-white tabular-nums">
                    {timeLeft > 0 ? timeLeft : 0}
                    <span className="text-sky-500 ml-1 italic text-xs">S</span>
                  </div>
                  <div className="w-[1px] h-4 bg-white/10" />
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Ready to Proceed
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[12px] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                    timeLeft <= 0
                      ? "bg-white text-slate-950 scale-100 opacity-100 hover:bg-sky-400 hover:scale-[1.02]"
                      : "bg-white/5 text-slate-500 cursor-not-allowed opacity-50"
                  }`}
                  disabled={timeLeft > 0}
                >
                  Continue to Exam
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-8">
              <motion.div
                key="fallback"
                className="text-center p-16 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-md"
              >
                <h2 className="text-2xl font-black italic uppercase text-slate-300">
                  JLPTX Mock System
                </h2>
                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.3em] font-bold">
                  Preparing your safe environment...
                </p>
              </motion.div>
              <button
                onClick={handleContinue}
                className="w-full py-5 bg-white text-slate-950 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[12px] flex items-center justify-center gap-3"
              >
                Skip to Destination
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <footer className="absolute bottom-8 left-0 w-full text-center opacity-20">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-600">
          JLPTX Cloud Infrastructure • Security Verified
        </p>
      </footer>
    </div>
  );
};

export default Redirect;
