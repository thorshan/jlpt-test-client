import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer,
  XCircle,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Award,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { resultApi, type Result } from "../api/resultApi";
import { useUser } from "../hooks/useUser";
import { useTranslation } from "../hooks/useTranslation";

// --- ANIMATED COUNTER COMPONENT ---
const CountUp: React.FC<{ end: number; duration?: number }> = ({
  end,
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return <>{count}</>;
};

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUser();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const step = parseInt(searchParams.get("step") || "0");

  const [certLang, setCertLang] = useState<"en" | "jp">("en");

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-medium animate-pulse text-sm">
          {t("generating_report")}...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-6 text-center">
        <XCircle className="w-16 h-16 text-neutral-800 mb-4" />
        <h2 className="text-2xl font-bold text-white">{t("no_record")}</h2>
        <Link
          to="/test"
          className="mt-4 text-sky-500 flex items-center gap-2 hover:underline"
        >
          <ArrowLeft size={18} /> {t("return_tests")}
        </Link>
      </div>
    );
  }

  const isPassed = data.status;

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
          {step === 0 ? (
            <motion.div
              key="step0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl w-full text-center space-y-8"
            >
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
                {t("results")}
              </h3>

              <div className="py-4">
                <div
                  className={`inline-flex items-center gap-3 px-10 py-4 rounded-full border-2 text-2xl font-black tracking-widest uppercase backdrop-blur-md transition-all ${
                    isPassed
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                      : "border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 size={32} />
                  ) : (
                    <AlertCircle size={32} />
                  )}
                  {isPassed ? t("passed") : t("failed")}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                  <div className="text-7xl font-black text-white">
                    <CountUp end={data.totalEarnedPoints} />
                    <span className="text-2xl text-slate-500 ml-3">
                      / {data.totalPossiblePoints}
                    </span>
                  </div>
                  <p className="text-sky-500 font-bold uppercase tracking-[0.2em] mt-4 text-xs">
                    Overall Score
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.sectionDetails?.map((sec, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-sm"
                    >
                      <p className="text-[10px] text-slate-500 font-black uppercase truncate mb-2 tracking-widest">
                        {sec.sectionTitle}
                      </p>
                      <div className="text-3xl font-black text-sky-400">
                        <CountUp end={sec.earnedPoints} />
                        <span className="text-sm text-slate-600 font-normal ml-1">
                          / {sec.totalPoints}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-sky-500/20 p-4 md:p-6 rounded-3xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 mb-4">
                <div className="text-center sm:text-left space-y-1">
                  <p className="text-sm font-black text-white">{t("result_id")}</p>
                  <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                    {t("save_code_warning")}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl w-full sm:w-auto overflow-hidden">
                  <code className="flex-1 px-3 sm:px-4 py-2 font-mono text-sky-300 font-bold tracking-widest text-[10px] sm:text-sm truncate text-center sm:text-left">
                    {data._id}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(data._id);
                      alert(t("result_id_copied"));
                    }}
                    className="p-3 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl transition-colors shrink-0"
                    title={t("copy_result_id")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/redirect?to=/results?step=1&type=cert&id=${data._id}`,
                  )
                }
                className="group relative inline-flex items-center gap-3 bg-white text-slate-950 px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-sky-500 transition-all active:scale-95 shadow-xl"
              >
                <Award size={24} />
                {t("print_cert")}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl w-full space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <Link
                  to="/test"
                  className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.2em] group"
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  {t("exit_home")}
                </Link>

                 <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  {/* Language Toggle */}
                  <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0 h-14">
                    <button
                      onClick={() => setCertLang("en")}
                      className={`px-4 rounded-xl text-[10px] font-black uppercase transition-all ${certLang === "en" ? "bg-sky-500 text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setCertLang("jp")}
                      className={`px-4 rounded-xl text-[10px] font-black uppercase transition-all ${certLang === "jp" ? "bg-sky-500 text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"}`}
                    >
                      Japanese
                    </button>
                  </div>

                  <div
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full border backdrop-blur-md w-full sm:w-auto h-14 ${
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
                    className="flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-950 px-8 py-4 rounded-2xl w-full sm:w-auto font-black transition-all shadow-lg active:scale-95 h-14"
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
                            {certLang === "en"
                              ? "Japanese Proficiency"
                              : "日本語能力認定"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">
                          {certLang === "en" ? "Certificate No." : "証書番号"}
                        </p>
                        <p className="text-xs font-mono text-white mb-4">
                          #JLPT-{data.level}-{data._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">
                          {certLang === "en" ? "Issued Date" : "発行日"}
                        </p>
                        <p className="text-sm font-bold text-white">
                          {new Date(data.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-center py-6">
                      <p className="text-sky-500 uppercase text-[11px] font-black tracking-[0.5em] mb-4">
                        {certLang === "en" ? "Official Result" : "公式結果"}
                      </p>
                      <h2 className="text-6xl font-black text-white mb-6 underline decoration-sky-500/20 underline-offset-[12px]">
                        {user?.name || "Examinee"}
                      </h2>
                      <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                        {certLang === "en"
                          ? "Has successfully demonstrated proficiency in the Japanese language assessment at the level specified below."
                          : "貴殿は、当プログラムが実施した日本語能力アセスメントにおいて、下記の通り優秀な成績を収め、所定のレベルに達したことをここに証します。"}
                      </p>
                      <div className="flex items-center justify-center gap-8 mt-10">
                        <div className="h-[1px] w-20 bg-white/10" />
                        <div className="px-10 py-3 bg-white text-slate-950 font-black text-2xl rounded-sm skew-x-[-10deg] shadow-lg">
                          {certLang === "en" ? "LEVEL" : "レベル"} {data.level}
                        </div>
                        <div className="h-[1px] w-20 bg-white/10" />
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-6 my-10">
                      <div className="col-span-2 bg-white/5 border border-white/5 p-6 rounded-xl">
                        <p className="text-[10px] text-sky-500 font-black uppercase mb-4 tracking-widest">
                          {certLang === "en" ? "Score Data" : "得点データ"}
                        </p>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              {certLang === "en" ? "Total" : "合計"}
                            </span>
                            <span className="text-2xl font-black text-white">
                              {data.totalEarnedPoints}/
                              {data.totalPossiblePoints}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              JLPT
                            </span>
                            <span className="text-2xl font-black text-sky-500">
                              {data.gradeJLPT}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              CEFR
                            </span>
                            <span className="text-2xl font-black text-white">
                              {data.grade}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-3 bg-white/5 border border-white/5 p-6 rounded-xl">
                        <p className="text-[10px] text-sky-500 font-black uppercase mb-4 tracking-widest">
                          {certLang === "en" ? "Breakdown" : "得点内訳"}
                        </p>
                        <table className="w-full text-left">
                          <thead className="text-[9px] text-slate-500 uppercase border-b border-white/10">
                            <th className="pb-2">
                              {certLang === "en" ? "Section" : "セクション"}
                            </th>
                            <th className="pb-2 text-center">
                              {certLang === "en" ? "Score" : "得点"}
                            </th>
                            <th className="pb-2 text-right">
                              {certLang === "en" ? "Grade" : "判定"}
                            </th>
                          </thead>
                          <tbody className="text-[11px] font-bold">
                            {data.sectionDetails?.map((sec, idx) => (
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
                          {certLang === "en"
                            ? "Signature Verified"
                            : "署名検証済み"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Trophy size={14} className="text-sky-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          {certLang === "en"
                            ? "Validated via JLPTX"
                            : "JLPTXによる承認"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="h-10 w-40 border-b border-white/10 mb-1 flex items-end justify-end">
                          <span
                            className={`text-2xl font-black ${isPassed ? "text-emerald-500" : "text-red-500"}`}
                          >
                            {isPassed
                              ? certLang === "en"
                                ? "PASSED"
                                : "合格"
                              : certLang === "en"
                                ? "FAILED"
                                : "不合格"}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                          {certLang === "en"
                            ? "Validation Status"
                            : "検証ステータス"}
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
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Results;
