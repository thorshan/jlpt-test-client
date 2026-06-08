import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  User as UserIcon,
  CheckCircle2,
  Info,
  AlertTriangle,
} from "lucide-react";
import { userApi } from "../api/userApi";
import { LoadingScreen } from "../components/LoadingScreen";
import axios from "axios";
import { useUser } from "../hooks/useUser";
import { collabsApi, type Collabs } from "../api/collabsApi";

// --- INTERFACES ---
interface UserData {
  _id: string;
  name: string;
  token?: string;
  dob?: Date;
  password?: string;
  email?: string;
  level?: string;
  role?: string;
  expireAt?: Date;
  createdAt?: string;
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

const Students = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUsers = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const { user } = useUser();
  const [collabs, setCollabs] = useState<Collabs[]>([]);
  const isS_Admin = user?.role === "s-admin";

  const fetchCollabs = async () => {
    const collabs = await collabsApi.getAllCollabs();
    setCollabs(collabs.data.data);
  };

  useEffect(() => {
    fetchCollabs();
  }, []);

  const collabsByIncharge = collabs.filter(
    (c) => c.incharge?._id === user?._id,
  );

  const collabsData = collabsByIncharge.flatMap((c) => c.students);
  const filterStudents = collabsData.filter((c) => c?.role === "user");
  const filterAccess = isS_Admin
    ? users.filter((u) => u.role === "user")
    : filterStudents;

  const filteredUsers = filterAccess.filter((u) => {
    return (
      u?._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u?._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStudentAssociation = (studentId: string) => {
    const parentCollab = collabs.find((c) =>
      c?.students?.some((s) => s._id === studentId),
    );

    return parentCollab?.name;
  };

  // Modal Ops
  const openInfoModal = (data: UserData) => {
    setIsOpenInfo(true);
    setUserData(data);
  };

  const openDeleteModal = (id: string) => {
    setIsOpenDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      setIsProcessing(true);
      try {
        await userApi.clearUser(deleteId);
        setUsers((prev) => prev.filter((u) => u._id !== deleteId));
      } catch (error) {
        console.error("Delete Error:", error);
      } finally {
        setIsOpenDelete(false);
        setIsProcessing(false);
      }
    }
  };

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
              <UserIcon className="text-sky-500" size={32} />
              Students
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 italic">
              Student Management
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
                    Info
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    ID
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Email
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    D.O.B
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Level
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
                      key={user?._id}
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
                              {user?.name}
                            </p>
                            <p className="text-[9px] text-slate-600 font-mono italic uppercase tracking-tighter">
                              ID: {user?._id.slice(-10)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <code className="text-xs font-mono text-sky-500">
                          {user?._id.slice(-10)}
                        </code>
                      </td>
                      <td className="px-8 py-5">
                        <code className="text-xs font-mono">{user?.email}</code>
                      </td>
                      <td className="px-8 py-5">
                        <code className="text-xs font-mono">
                          {user?.dob
                            ? new Date(user.dob).toLocaleDateString()
                            : "N/A"}
                        </code>
                      </td>
                      <td className="px-8 py-5">
                        <code className="text-[10px] font-mono text-white bg-sky-500/5 px-2 py-1 rounded-lg border border-sky-500/10">
                          {user?.level}
                        </code>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            disabled={isProcessing}
                            onClick={() => openInfoModal(user!)}
                            className="p-2 rounded-xl text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Info size={18} />
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() => openDeleteModal(user?._id as string)}
                            className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
        {isOpenInfo && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0f172a] border border-white/10 p-10 rounded-[3rem] max-w-lg w-full shadow-3xl text-center"
            >
              <div className="w-full flex flex-col items-center gap-3 mb-5">
                <h1 className="text-3xl font-black mb-5">
                  Student Informations
                </h1>
                <div className="w-full flex justify-between items-center border border-sky-900 rounded-2xl p-3">
                  <span className="text-md font-black text-sky-500">Name</span>
                  <span className="text-md text-white">{userData?.name}</span>
                </div>
                <div className="w-full flex justify-between items-center border border-sky-900 rounded-2xl p-3">
                  <span className="text-md font-black text-sky-500">Email</span>
                  <span className="text-md text-white">{userData?.email}</span>
                </div>
                <div className="w-full flex justify-between items-center border border-sky-900 rounded-2xl p-3">
                  <span className="text-md font-black text-sky-500">
                    Valid Until
                  </span>
                  <div className="flex flex-col">
                    <span className="text-md text-white">
                      {userData?.dob
                        ? new Date(userData?.dob).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span className="text-[9px] text-sky-500 text-end italic">
                      {userData?.dob
                        ? (() => {
                            const birthDate = new Date(userData.dob);
                            const today = new Date();
                            let age =
                              today.getFullYear() - birthDate.getFullYear();
                            const m = today.getMonth() - birthDate.getMonth();
                            if (
                              m < 0 ||
                              (m === 0 && today.getDate() < birthDate.getDate())
                            ) {
                              age--;
                            }
                            return `${age} years old`;
                          })()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center border border-sky-900 rounded-2xl p-3">
                  <span className="text-md font-black text-sky-500">Level</span>
                  <span className="text-md text-white">{userData?.level}</span>
                </div>
                <div className="w-full flex justify-between items-center border border-sky-900 rounded-2xl p-3">
                  <span className="text-md font-black text-sky-500">
                    Valid Until
                  </span>
                  <div className="flex flex-col">
                    <span className="text-md text-white">
                      {typeof userData?.expireAt === "string"
                        ? new Date(userData?.expireAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span className="text-[9px] text-sky-500 text-end italic">
                      1 Year
                    </span>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center border border-sky-900 rounded-2xl p-3">
                  <span className="text-md font-black text-sky-500 whitespace-nowrap">
                    Associated with
                  </span>
                  {/* Added 'text-right' to align nicely if it wraps, and fixed the class name */}
                  <div className="text-md text-white break-words whitespace-normal max-w-[50%] text-right">
                    {getStudentAssociation(userData?._id as string)}
                  </div>
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={() => {
                  setIsOpenInfo(false);
                  setUserData(null);
                }}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpenDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenDelete(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#0f172a] border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl overflow-hidden"
            >
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black italic uppercase mb-2">
                  Confirm Delete
                </h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 px-4">
                  Are you sure you want to delete this user? This action can not
                  be undo.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    disabled={isProcessing}
                    onClick={confirmDelete}
                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing" : "Confirm Deletion"}
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => setIsOpenDelete(false)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
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

export default Students;
