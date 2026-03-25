import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Search,
  CheckCircle2,
  XCircle,
  User as UserIcon,
  FileText,
} from "lucide-react";
import { resultApi, type Result } from "../api/resultApi";
import { LoadingScreen } from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await resultApi.getAllResults();
      setResults(res.data?.data || []);
    } catch (err) {
      console.error("Protocol Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredResults = results.filter((r) => {
    const userName =
      typeof r.user === "object" ? r.user?.name : "Unknown Identity";
    return (
      userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans relative overflow-hidden">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-sky-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter italic text-white flex items-center gap-3 uppercase">
              <Award className="text-sky-500" size={32} />
              Results
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 italic">
              Results Management
            </p>
          </motion.div>

          <div className="relative flex-1 md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500/50"
              size={18}
            />
            <input
              type="text"
              placeholder="Filter by Identity or N-Level..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-sky-500/50 focus:bg-white/[0.08] outline-none transition-all text-[11px] font-bold uppercase tracking-widest placeholder:text-slate-700"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- PERFORMANCE TABLE --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/5 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Subject Identity
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Exam Protocol
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">
                    Score Metric
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Final Status
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                <AnimatePresence mode="popLayout">
                  {filteredResults.map((result) => (
                    <motion.tr
                      key={result._id}
                      layout
                      className="hover:bg-sky-500/[0.03] transition-colors group"
                    >
                      {/* Identity Column */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-sky-500/5">
                            <UserIcon size={18} />
                          </div>
                          <div>
                            <p className="font-black text-xs uppercase italic tracking-tight">
                              {typeof result.user === "object"
                                ? result?.user?.name
                                : "Anonymous"}
                            </p>
                            <p className="text-[9px] text-slate-600 font-mono italic uppercase mt-0.5">
                              ID: {result._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Exam/Level Column */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-sky-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-md italic">
                              {result.level}
                            </span>
                            <span className="text-white text-[10px] font-black uppercase italic tracking-tighter">
                              {typeof result.exam === "object"
                                ? result.exam.title
                                : "Exam Link Severed"}
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
                            CEFR Rank: {result.grade}
                          </p>
                        </div>
                      </td>

                      {/* Score Column */}
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex flex-col items-center px-4 py-2 rounded-2xl bg-white/5 border border-white/5 group-hover:border-sky-500/20 transition-all">
                          <span className="text-xs font-black italic">
                            {result.totalEarnedPoints}{" "}
                            <span className="text-slate-600 font-normal">
                              / {result.totalPossiblePoints}
                            </span>
                          </span>
                          <div className="w-12 h-[2px] bg-sky-500/20 my-1 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-500"
                              style={{
                                width: `${(result.totalEarnedPoints / result.totalPossiblePoints) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-[9px] font-black text-sky-500 uppercase">
                            Grade {result.gradeJLPT}
                          </span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-8 py-6">
                        <div
                          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${result.status ? "text-emerald-400" : "text-red-500"}`}
                        >
                          {result.status ? (
                            <>
                              <CheckCircle2
                                size={14}
                                className="animate-pulse"
                              />{" "}
                              Success
                            </>
                          ) : (
                            <>
                              <XCircle size={14} /> Failed
                            </>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            title="Full Analytics"
                            className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 transition-all"
                            onClick={() =>
                              navigate(
                                `/admin/results/${typeof result?.user === "object" && result.user._id}`,
                              )
                            }
                          >
                            <FileText size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      {/* Global Scrollbar styling consistent with Dashboard */}
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(14, 165, 233, 0.2); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(14, 165, 233, 0.4); }
      `}</style>
    </div>
  );
};

export default Results;
