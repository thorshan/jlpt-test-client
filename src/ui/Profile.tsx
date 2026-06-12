import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Download,
  Edit,
  Info,
  ShieldUser,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
import { LoadingScreen } from "../components/LoadingScreen";
import { resultApi, type Result } from "../api/resultApi";
import { useUser } from "../hooks/useUser";
import { AnimatePresence, motion } from "framer-motion";
import SEO from "../components/SEO";

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

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const { logout, updateUser } = useUser();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await userApi.getUser(id as string);
      setUser(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await resultApi.getResultByUser(id as string);
      setResults(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchResults();
  }, [id]);

  const handleDownload = (data: string) => {
    navigate(`/download/${data}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const confirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (data.trim() !== "confirm_deletion") {
      setIsProcessing(false);
      setError("Please type 'confirm_deletion' to proceed");
      return;
    }

    try {
      await userApi.clearUser(user?._id as string);
    } catch (error) {
      console.error("Delete Error:", error);
      setError("An error occurred during deletion.");
      setIsProcessing(false);
      return;
    } finally {
      setIsOpenDelete(false);
      setIsProcessing(false);
      setError("");
      navigate("/");
    }
  };

  const selectLevel = async (lvl: string) => {
    setIsProcessing(true);
    try {
      await userApi.updateUser(user!._id!, lvl);
      updateUser({ level: lvl });
      fetchUser();
      setOpenLevel(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="relative min-h-screen bg-[#020617] text-white p-6 md:p-12 selection:bg-sky-500/30 overflow-x-hidden">
      <SEO
        title="Profile"
        description="Join JLPTX and start practicing for your Japanese Language Proficiency Test. Practice N1, N2, N3, N4, and N5 levels."
        canonical="/"
      />
      {/* Navigation */}
      <nav className="bg-sky-950/20 backdrop-blur-md fixed top-0 left-0 w-full z-50 px-5 md:px-15 py-5 border-b border-b-sky-500/10 flex justify-between items-center">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 cursor-pointer hover:text-sky-500 transition-colors"
        >
          <ArrowLeft size={18} className="text-sky-500" /> {t("back")}
        </div>
        <div className="hidden sm:block text-md text-sky-500 font-black">
          {user ? `${user.name}'s ${t("profile")}` : t("profile")}
        </div>
        <img src="/JLPTX.png" className="w-12 h-12 object-cover" alt="Logo" />
      </nav>

      <main className="mt-24 max-w-7xl mx-auto space-y-10">
        {/* SECTION 1: PROFILE HEADER */}
        <section>
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 bg-sky-950/50 backdrop-blur-sm rounded-full flex items-center justify-center text-sky-50 font-black text-4xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-black text-sky-50">{user?.name}</h1>
          </div>

          <div className="flex items-center gap-2.5 mb-3">
            <User size={24} className="text-sky-500" />
            <h2 className="text-xl">{t("account_info")}</h2>
          </div>
          <hr className="text-sky-500/20 mb-5" />

          <div className="space-y-2">
            <p>
              <span className="text-sky-500 font-black mr-4">
                {t("email")}:
              </span>{" "}
              {user?.email}
            </p>
            <div className="flex items-center gap-5">
              <p>
                <span className="text-sky-500 font-black mr-4">
                  {t("level")}:
                </span>{" "}
                {user?.level}
              </p>
              <div
                onClick={() => setOpenLevel(true)}
                className="hover:text-sky-500 transition-colors"
              >
                <Edit size={18} />
              </div>
            </div>
            <p>
              <span className="text-sky-500 font-black mr-4">
                {t("valid_until")}:
              </span>
              {user?.expireAt
                ? new Date(user.expireAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </section>

        {/* SECTION 2: ACTIVITY & CONTROLS (Side-by-Side on Desktop) */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Activity Feed */}
          <section className="flex-3">
            <div className="flex items-center gap-2.5">
              <Activity size={24} className="text-sky-500" />
              <h2 className="text-xl">{t("account_activity")}</h2>
            </div>
            <hr className="text-sky-500/20 mt-3 mb-5" />

            <div className="space-y-4">
              {results.length > 0 ? (
                results.map((res) => (
                  <div
                    key={res._id}
                    className="flex flex-wrap gap-4 p-4 bg-sky-950/20 backdrop-blur-sm rounded border border-sky-500/50 items-center"
                  >
                    <div className="flex-1 min-w-50 bg-sky-950/20 rounded p-5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 bg-sky-950/50 rounded border border-sky-500/20">
                          {res.level}
                        </span>
                        <span className="font-black text-lg">
                          {typeof res.exam === "object"
                            ? res.exam.title
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 items-center gap-4 bg-sky-950/50 rounded py-3 px-5">
                      <div className="flex justify-evenly gap-2">
                        {res.sectionDetails.map((sec, index) => (
                          <>
                            {index !== 0 && (
                              <div className="w-px h-10 bg-sky-500/30 mx-3.5" />
                            )}
                            <div key={index} className="text-center">
                              <div className="text-[10px] text-sky-50/50">
                                {sec.sectionTitle}
                              </div>

                              <div className="flex items-center gap-2.5">
                                <div className="font-black text-sky-500">
                                  {Math.round(sec.earnedPoints)}
                                </div>
                                <div>•</div>
                                <div className="text-xl font-black text-sky-50/20">
                                  {sec.gradeJLPT}
                                </div>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                    <div className="text-center border border-sky-500/50 rounded p-1.5">
                      <div className="text-xl font-black text-sky-500">
                        {Math.round(
                          res.sectionDetails.reduce(
                            (sum, s) => sum + (s.earnedPoints || 0),
                            0,
                          ),
                        )}
                      </div>
                      <div className="w-full h-px bg-sky-500/30" />
                      <div className="text-xs font-black text-sky-50/20">
                        {res.sectionDetails.reduce(
                          (sum, s) => sum + (s.totalPoints || 0),
                          0,
                        )}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                      <div
                        className={`font-black ${res.status ? "text-emerald-500 md:border md:border-emerald-500 p-3.5 rounded" : "text-red-500 md:border md:border-emerald p-3.5 rounded"}`}
                      >
                        {res.status ? "SUCCESS" : "FAILED"}
                      </div>
                      <div onClick={() => handleDownload(res._id as string)}>
                        <Download
                          className="text-sky-500 cursor-pointer"
                          size={24}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>{t("no_record")}</p>
              )}
            </div>
          </section>
        </div>
        {/* Account Control Sidebar */}
        <section className="shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldUser size={24} className="text-sky-500" />
            <h2 className="text-xl">{t("account_control")}</h2>
          </div>
          <hr className="text-sky-500/20 mt-3 mb-5" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>{t("logout")}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 border border-red-500/70 py-1 px-4 rounded hover:bg-red-900"
              >
                {t("logout")}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span>{t("delete")}</span>
              <button
                onClick={() => {
                  setIsOpenDelete(true);
                  setError("");
                  setData("");
                }}
                className="bg-red-500/20 border border-red-500/70 py-1 px-4 rounded hover:bg-red-900"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </section>
      </main>
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
              className="relative bg-[#0f172a] border border-white/10 p-8 rounded-[2.5rem] max-w-lg w-full shadow-2xl overflow-hidden"
            >
              <div className="relative z-10 text-center">
                <form onSubmit={confirmDelete}>
                  <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl text-red-500 font-black italic uppercase mb-2">
                    {t("account_deletion")}
                  </h3>
                  <p className="text-slate-50 text-md font-medium leading-relaxed mb-8 px-4">
                    {t("delete_confirm")}
                  </p>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 px-4">
                    {t("confirm_text")}
                  </p>
                  {error && (
                    <p className="text-red-500 text-xs font-medium leading-relaxed mb-8 px-4 py-px border border-red-500 bg-red-500/20">
                      {error}
                    </p>
                  )}
                  <input
                    type="text"
                    className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data}
                    onChange={(e) => {
                      setData(e.target.value);
                      if (error) setError("");
                    }}
                  />
                  <div className="flex flex-col gap-3">
                    <button
                      disabled={isProcessing || !data}
                      type="submit"
                      className="w-full py-4 bg-red-500 hover:bg-red-600 text-md rounded-2xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-10"
                    >
                      {isProcessing ? t("processing") : t("delete")}
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => {
                        setIsOpenDelete(false);
                      }}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openLevel && (
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
              className="relative bg-[#0f172a] border border-white/10 p-8 rounded-[2.5rem] max-w-lg w-full shadow-2xl overflow-hidden"
            >
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-sky-500">
                  <Info size={32} />
                </div>
                <h3 className="text-xl text-sky-500 font-black italic uppercase mb-2">
                  {t("select_level")}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                  {["N1", "N2", "N3", "N4", "N5"].map((lvl, index) => (
                    <button
                      key={lvl}
                      disabled={isProcessing}
                      onClick={() => selectLevel(lvl)}
                      className={`group w-full p-4 md:p-5 bg-sky-950/40 border border-sky-900/40 rounded-2xl font-black text-lg transition-all active:scale-[0.96] hover:bg-sky-600 hover:border-sky-400 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                        index === 4 ? "col-span-2 sm:col-span-1" : ""
                      }`}
                    >
                      <span className="text-sky-500 group-hover:text-white transition-colors">
                        {lvl}
                      </span>
                      <span className="text-[10px] md:text-xs uppercase tracking-widest text-sky-900 group-hover:text-sky-100 opacity-60">
                        {t("proficiency")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
