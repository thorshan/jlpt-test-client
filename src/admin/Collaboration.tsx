import {
  BookHeart,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  Info,
  RedoDot,
  School,
  Search,
  Settings,
  User,
  XCircle,
} from "lucide-react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LoadingScreen } from "../components/LoadingScreen";
import { collabsApi, type Collabs } from "../api/collabsApi";

const collabCategory = [
  {
    id: 1,
    type: "Language School",
    icon: <School size={18} />,
  },
  {
    id: 2,
    type: "Engineering School",
    icon: <Settings size={18} />,
  },
  {
    id: 3,
    type: "Consultant",
    icon: <User size={18} />,
  },
  {
    id: 4,
    type: "Non-Profit Organization",
    icon: <BookHeart size={18} />,
  },
];

const Collaboration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [collabs, setCollabs] = useState<Collabs[]>([]);

  const [form, setForm] = useState<Collabs | null>({
    _id: "",
    name: "",
    email: "",
    category: "",
    incharge: { _id: "", email: "", name: "" },
    status: "Pending",
    students: [],
  });

  const fetchCollabs = async () => {
    const res = await collabsApi.getAllCollabs();
    setCollabs(res.data.data);
  };

  useEffect(() => {
    fetchCollabs();
  }, []);

  const filteredResults = collabs.filter((r: Collabs) => {
    return (
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const iconMapping = (data: string) => {
    const catResult = Array(collabCategory.filter((c) => c.type === data));
    return catResult.flatMap((c) => c.map((v) => v.icon));
  };

  const showClientDetail = (data: Collabs) => {
    console.log(data);
    setShowDetail(true);
    setForm({
      _id: data._id,
      name: data.name,
      email: data.email,
      category: data.category,
      incharge: data.incharge,
      status: data.status,
      students: data.students,
    });
  };

  const showActionModal = (id: string) => {
    setShowAction(true);
    setActionId(id);
  };

  const confirmAction = async (status: number) => {
    try {
      setLoading(true);
      if (status === 1) {
        await collabsApi.updateCollabStauts(actionId!, "Approved");
      } else {
        await collabsApi.updateCollabStauts(actionId!, "Rejected");
      }
    } catch (error) {
      console.error(error);
    } finally {
      fetchCollabs();
      setShowAction(false);
      setActionId(null);
      setLoading(false);
    }
  };

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
              <BriefcaseBusiness className="text-sky-500" size={32} />
              Collabs
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 italic">
              Client Collaborations
            </p>
          </motion.div>

          <div className="relative flex-1 md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500/50"
              size={18}
            />
            <input
              type="text"
              placeholder="Filter by Name or Category..."
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
                    Client
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Incharge
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">
                    Students
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/2">
                <AnimatePresence mode="popLayout">
                  {filteredResults.map((result) => (
                    <motion.tr
                      key={result._id}
                      layout
                      className="hover:bg-sky-500/3 transition-colors group"
                    >
                      {/* Identity Column */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-11 h-11 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-sky-500/5">
                              {iconMapping(result.category)}
                            </div>
                            <div>
                              <p className="font-black text-xs">
                                {result.name}
                              </p>
                              <p className="text-[9px] text-slate-600 font-mono italic mt-0.5">
                                {result.category}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Exam/Level Column */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-start">
                          <span className="text-xs px-2 py-0.5">
                            {typeof result.incharge === "object"
                              ? result.incharge?.name
                              : ""}
                          </span>
                          <span className="text-[10px] text-sky-500 px-2 py-0.5">
                            {typeof result.incharge === "object"
                              ? result.incharge?.email
                              : ""}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5">
                            {result.students?.length}
                          </span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-8 py-6">
                        <div
                          className={`flex items-center gap-2 text-[10px] font-black ${
                            result.status === "Approved" && "text-emerald-400"
                          } ${
                            result.status === "Pending" && "text-amber-400"
                          } ${result.status === "Rejected" && "text-red-400"}`}
                        >
                          {result.status === "Approved" && (
                            <>
                              <CheckCircle2
                                size={14}
                                className="animate-pulse"
                              />
                              Approved
                            </>
                          )}
                          {result.status === "Pending" && (
                            <>
                              <Info size={14} className="animate-pulse" />
                              Pending
                            </>
                          )}
                          {result.status === "Rejected" && (
                            <>
                              <XCircle size={14} />
                              Rejected
                            </>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6 text-right flex items-center gap-2">
                        <div className="flex justify-end gap-2">
                          <button
                            title="View"
                            className="p-2.5 text-slate-400 hover:text-sky-400 border border-transparent transition-all"
                            onClick={() => showClientDetail(result)}
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            title="Change Status"
                            className="p-2.5 text-slate-400 hover:text-sky-400 border border-transparent transition-all"
                            onClick={() => showActionModal(result._id)}
                          >
                            <RedoDot size={18} />
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
      <AnimatePresence>
        {showDetail && (
          <div className="fixed inset-0 z-1000 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0f172a] border border-white/10 p-8 rounded-[3rem] max-w-sm w-full shadow-3xl text-center"
            >
              <h3 className="text-xl font-black mb-6">Client Informations</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                {Array(form).map((f, index) => {
                  return (
                    <div key={index} className="group flex flex-col gap-5">
                      <div className="w-full p-4 md:p-5 border border-sky-900/40 rounded-2xl font-black flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 disabled:opacity-50 disabled:cursor-not-allowed sm:col-span-1">
                        <span className="text-[14px] text-sky-500 capitalize">
                          Name
                        </span>
                        <span className="text-sm text-white">{f?.name}</span>
                      </div>
                      <div className="w-full p-4 md:p-5 border border-sky-900/40 rounded-2xl font-black flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 disabled:opacity-50 disabled:cursor-not-allowed sm:col-span-1">
                        <span className="text-[14px] text-sky-500 capitalize">
                          Incharge Person
                        </span>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-white">
                            {typeof f?.incharge === "object"
                              ? f?.incharge.name
                              : ""}
                          </span>
                          <span className="text-[9px] text-sky-500 italic text-end">
                            {typeof f?.incharge === "object"
                              ? f?.incharge.email
                              : ""}
                          </span>
                        </div>
                      </div>
                      <div className="w-full p-4 md:p-5 border border-sky-900/40 rounded-2xl font-black flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 disabled:opacity-50 disabled:cursor-not-allowed sm:col-span-1">
                        <span className="text-[14px] text-sky-500 capitalize">
                          Category
                        </span>
                        <span className="text-sm text-white">
                          {f?.category}
                        </span>
                      </div>
                      <div className="w-full p-4 md:p-5 border border-sky-900/40 rounded-2xl font-black flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 disabled:opacity-50 disabled:cursor-not-allowed sm:col-span-1">
                        <span className="text-[14px] text-sky-500 capitalize">
                          Total Students
                        </span>
                        <span className="text-sm text-white">
                          {f?.students?.length}
                        </span>
                      </div>
                      <div className="w-full p-4 md:p-5 border border-sky-900/40 rounded-2xl font-black flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 disabled:opacity-50 disabled:cursor-not-allowed sm:col-span-1">
                        <span className="text-[14px] text-sky-500 capitalize">
                          Stauts
                        </span>
                        <span
                          className={`text-sm animate-pulse ${
                            f?.status === "Approved" && "text-emerald-400"
                          } ${
                            f?.status === "Pending" && "text-amber-400"
                          } ${f?.status === "Rejected" && "text-red-400"}`}
                        >
                          {f?.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                disabled={loading}
                onClick={() => setShowDetail(false)}
                className="mt-6 w-full py-4 bg-red-800 text-white font-black text-sm rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0f172a] border border-white/10 p-8 rounded-[3rem] max-w-sm w-full shadow-3xl text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                <Info size={32} />
              </div>
              <h3 className="text-xl font-black italic mb-2">Change Status</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 my-6">
                  <button
                    disabled={loading}
                    onClick={() => confirmAction(1)}
                    className="w-full py-4 bg-emerald-500 font-black uppercase text-[10px] rounded-2xl disabled:opacity-50"
                  >
                    {loading ? "Processing" : "Approve"}
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => confirmAction(2)}
                    className="w-full py-4 bg-red-500 font-black uppercase text-[10px] rounded-2xl disabled:opacity-50"
                  >
                    {loading ? "Processing" : "Reject"}
                  </button>
                </div>
                <button
                  disabled={loading}
                  onClick={() => setShowAction(false)}
                  className="w-full py-4 bg-white/5 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Abort
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collaboration;
