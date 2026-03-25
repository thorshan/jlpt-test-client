import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer,
  ShieldCheck,
  ArrowLeft,
  Trophy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { resultApi, type Result } from "../api/resultApi";
import { useUser } from "../hooks/useUser";
import { useTranslation } from "../hooks/useTranslation";
import { LoadingScreen } from "../components/LoadingScreen";

const ResultDetail: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestResult = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await resultApi.getResultsByUser(user._id);
        const resultsArray: Result[] = res?.data?.data;

        if (resultsArray && resultsArray.length > 0) {
          const latest = resultsArray.sort((a: Result, b: Result) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          })[0];
          setData(latest);
        }
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestResult();
  }, [user?._id]);

  const handlePrint = useReactToPrint({
    documentTitle: `JLPT_Certificate_${user?.name || "Student"}`,
  });

  if (loading) return <LoadingScreen />;

  const isPassed = data?.status;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans overflow-x-hidden relative">
      {/* --- SHARED BACKGROUND LAYER --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          initial={{ backgroundPosition: "0px 0px" }}
          animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1e293b 1px, transparent 1px),
              linear-gradient(to bottom, #1e293b 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#020617]/0 via-[#020617]/50 to-[#020617]" />
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl w-full space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <Link
                to="/admin/results"
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black uppercase text-[10px] group"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                {t("back")}
              </Link>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full border backdrop-blur-md w-full sm:w-auto ${
                    isPassed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                      : "border-red-500/30 bg-red-500/10 text-red-500"
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span className="text-xs font-black tracking-widest uppercase">
                    {isPassed ? t("passed") : t("failed")}
                  </span>
                </div>

                <button
                  onClick={() =>
                    certificateRef.current &&
                    handlePrint(() => certificateRef.current)
                  }
                  className="flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-950 px-8 py-4 rounded-2xl w-full sm:w-auto font-black transition-all shadow-lg active:scale-95"
                >
                  <Printer size={20} />
                  <span>{t("print_cert")}</span>
                </button>
              </div>
            </div>

            {/* CERTIFICATE CONTAINER */}
            <div className="overflow-x-auto pb-20 rounded-[2.5rem] shadow-2xl">
              <div
                ref={certificateRef}
                className="w-[850px] mx-auto bg-[#020617] p-12 relative border border-white/10 flex flex-col justify-between"
                style={{
                  minHeight: "650px",
                  boxSizing: "border-box",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                {/* Watermark/Corners */}
                <div
                  className="absolute inset-0 opacity-[0.03] grayscale pointer-events-none"
                  style={{
                    backgroundImage: `url('/JLPTX.png')`,
                    backgroundSize: "120px",
                  }}
                />
                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-sky-500 m-6 opacity-50" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-sky-500 m-6 opacity-50" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start border-b border-white/5 pb-8 mb-8">
                    <div className="flex items-center gap-5">
                      <img
                        src="/JLPTX.png"
                        alt="Logo"
                        className="h-16 w-auto"
                      />
                      <div>
                        <h4 className="text-white font-black text-3xl tracking-tighter leading-none">
                          JLPTX
                        </h4>
                        <p className="text-sky-500 text-[10px] font-black uppercase tracking-widest">
                          Japanese Proficiency
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">
                        Certificate No.
                      </p>
                      <p className="text-xs font-mono text-white mb-4">
                        #JLPT-{data?.level}-{data?._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">
                        Issued Date
                      </p>
                      <p className="text-sm font-bold text-white uppercase italic">
                        {new Date(data?.createdAt || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-center py-6">
                    <p className="text-sky-500 uppercase text-[11px] font-black tracking-[0.5em] mb-4">
                      Official Result
                    </p>
                    <h2 className="text-6xl font-black text-white mb-6 underline decoration-sky-500/20 underline-offset-[12px]">
                      {user?.name || "Examinee"}
                    </h2>
                    <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                      Has successfully demonstrated proficiency in the Japanese
                      language assessment at the level specified below.
                    </p>
                    <div className="flex items-center justify-center gap-8 mt-10">
                      <div className="h-[1px] w-20 bg-white/10" />
                      <div className="px-10 py-3 bg-white text-slate-950 font-black text-2xl rounded-sm skew-x-[-10deg] shadow-lg">
                        LEVEL {data?.level}
                      </div>
                      <div className="h-[1px] w-20 bg-white/10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-6 my-10">
                    <div className="col-span-2 bg-white/5 border border-white/5 p-6 rounded-xl">
                      <p className="text-[10px] text-sky-500 font-black uppercase mb-4 tracking-widest">
                        Score Data
                      </p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">
                            Total
                          </span>
                          <span className="text-2xl font-black text-white">
                            {data?.totalEarnedPoints}/
                            {data?.totalPossiblePoints}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">
                            JLPT
                          </span>
                          <span className="text-2xl font-black text-sky-500">
                            {data?.gradeJLPT}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">
                            CEFR
                          </span>
                          <span className="text-2xl font-black text-white">
                            {data?.grade}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3 bg-white/5 border border-white/5 p-6 rounded-xl">
                      <p className="text-[10px] text-sky-500 font-black uppercase mb-4 tracking-widest">
                        Breakdown
                      </p>
                      <table className="w-full text-left">
                        <thead className="text-[9px] text-slate-500 uppercase border-b border-white/10">
                          <th className="pb-2">Section</th>
                          <th className="pb-2 text-center">Score</th>
                          <th className="pb-2 text-right">Grade</th>
                        </thead>
                        <tbody className="text-[11px] font-bold">
                          {data?.sectionDetails?.map((sec, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-white/5 last:border-0"
                            >
                              <td className="py-2.5 text-slate-200">
                                {sec.sectionTitle}
                              </td>
                              <td className="py-2.5 text-center text-white">
                                {sec.earnedPoints}/{sec.totalPoints}
                              </td>
                              <td className="py-2.5 text-right text-sky-400 font-black">
                                {sec.gradeJLPT}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-8 mt-auto">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Signature Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Trophy size={14} className="text-sky-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Validated via JLPTX
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="h-10 w-40 border-b border-white/10 mb-1 flex items-end justify-end">
                        <span
                          className={`text-2xl font-black ${isPassed ? "text-emerald-500" : "text-red-500"}`}
                        >
                          {isPassed ? "PASSED" : "FAILED"}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                        Validation Status
                      </p>
                    </div>
                    <img
                      src="/JLPTX.png"
                      alt="Logo"
                      className="h-16 w-auto opacity-80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ResultDetail;
