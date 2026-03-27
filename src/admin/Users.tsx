import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  Trash2,
  User as UserIcon,
  AlertTriangle,
  CheckCircle2,
  Info,
  User,
} from "lucide-react";
import { userApi } from "../api/userApi";
import { LoadingScreen } from "../components/LoadingScreen";
import axios from "axios";

// --- INTERFACES ---
interface UserData {
  _id: string;
  name: string;
  token: string;
  level?: string;
  role: string;
}

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "role" | "delete" | null;
    user: UserData | null;
  }>({ isOpen: false, type: null, user: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAllUsers();
      setUsers(res.data?.data);
    } catch (err) {
      handleApiError(err);
      showToast("Failed to fetch database records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApiError = (error: unknown) => {
    if (axios.isAxiosError<ValidationError>(error)) {
      console.error("API Error:", error.response?.data || error.message);
    }
  };

  // --- ACTIONS ---
  const showToast = (message: string, type: Toast["type"]) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleConfirmAction = async () => {
    if (!modal.user || !modal.type) return;
    const { _id, name } = modal.user;

    try {
      if (modal.type === "role") {
        await userApi.updateRole(_id);
        showToast(`${name}'s permissions updated`, "success");
        fetchUsers();
      } else {
        await userApi.clearUser(_id);
        setUsers((prev) => prev.filter((u) => u._id !== _id));
        showToast(`${name} purged from database`, "info");
      }
    } catch (err) {
      handleApiError(err);
      showToast("Protocol execution failed", "error");
    } finally {
      setModal({ isOpen: false, type: null, user: null });
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans relative overflow-hidden">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-sky-500/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter italic text-white flex items-center gap-3 uppercase">
              <User className="text-sky-500" size={32} />
              Users
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 italic">
              User Management
            </p>
          </motion.div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500/50"
                size={18}
              />
              <input
                type="text"
                placeholder="Search identity..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl focus:border-sky-500 outline-none transition-all text-xs font-bold placeholder:text-slate-600"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* --- TABLE --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/5 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Identity
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Token
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Protocol
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">
                    Ops
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      layout
                      className="hover:bg-sky-500/[0.03] transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20 group-hover:scale-110 transition-transform duration-300">
                            <UserIcon size={18} />
                          </div>
                          <div>
                            <p className="font-black text-xs uppercase italic">
                              {user.name}
                            </p>
                            <p className="text-[9px] text-slate-600 font-mono italic uppercase tracking-tighter">
                              ID: {user._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <code className="text-[10px] font-mono text-sky-400 bg-sky-500/5 px-2 py-1 rounded-lg border border-sky-500/10">
                          {user.token}
                        </code>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border transition-all ${
                            user.role === "s-admin"
                              ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                              : user.role === "admin"
                                ? "bg-sky-500 text-slate-950 border-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                                : "bg-white/5 border-white/10 text-slate-500"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() =>
                              setModal({ isOpen: true, type: "role", user })
                            }
                            className="p-2 rounded-xl text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
                          >
                            <ShieldCheck size={18} />
                          </button>
                          <button
                            onClick={() =>
                              setModal({ isOpen: true, type: "delete", user })
                            }
                            className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 size={18} />
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

      {/* --- NOTIFICATION TOASTS --- */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                t.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : t.type === "error"
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : "bg-sky-500/10 border-sky-500/20 text-sky-400"
              }`}
            >
              {t.type === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <Info size={16} />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest italic">
                {t.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- MODAL SYSTEM --- */}
      <AnimatePresence>
        {modal.isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0f172a] border border-white/10 p-10 rounded-[3rem] max-w-sm w-full shadow-3xl text-center"
            >
              <div
                className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-2 ${
                  modal.type === "delete"
                    ? "bg-red-500/10 border-red-500/20 text-red-500"
                    : "bg-sky-500/10 border-sky-500/20 text-sky-500"
                }`}
              >
                {modal.type === "delete" ? (
                  <AlertTriangle size={40} />
                ) : (
                  <ShieldCheck size={40} />
                )}
              </div>

              <h3 className="text-2xl font-black italic uppercase mb-2 tracking-tighter">
                {modal.type === "delete" ? "Purge User?" : "Update Role?"}
              </h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10 leading-relaxed">
                Confirm action for{" "}
                <span className="text-white italic">{modal.user?.name}</span>
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmAction}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 ${
                    modal.type === "delete"
                      ? "bg-red-500 text-slate-950"
                      : "bg-sky-500 text-slate-950"
                  }`}
                >
                  Execute Protocol
                </button>
                <button
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className="w-full py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all"
                >
                  Abort
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(14, 165, 233, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Users;
