import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User as UserIcon,
  ChevronDown,
  BookOpen,
  ArrowRight,
  Album,
  Filter,
  Search,
  LayoutGrid,
} from "lucide-react";
import { LangToggler } from "../components/LangToggler";
import { useUser } from "../hooks/useUser";
import { useTranslation } from "../hooks/useTranslation";
import { examApi } from "../api/examApi";
import { LoadingScreen } from "../components/LoadingScreen";

// --- INTERFACES ---
interface Section {
  _id: string;
  title: string;
  duration: number;
  questions: string[];
}

interface Exam {
  _id: string;
  level: string;
  title: string;
  desc: string;
  category: string;
  passingScore: number;
  sections: Section[];
}

const Home = () => {
  const { user, logout } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryList = [
    "All",
    "JLPT Old Questions",
    "Level Test",
    "Custom Test",
  ];

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await examApi.getExams();
        const resExam = res?.data?.data || [];
        const filterByLevel = resExam.filter(
          (ex: Exam) => ex.level === user?.level,
        );
        setExams(filterByLevel);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [user?.level]);

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesCategory =
        activeCategory === "All" || exam.category === activeCategory;
      const matchesSearch = exam.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [exams, activeCategory, searchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden selection:bg-sky-500/30 relative">
      {/* 1. ANIMATED GRID BACKGROUND */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ backgroundPosition: "0px 0px" }}
        animate={{ backgroundPosition: ["0px 0px", "48px 48px"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgb(14 165 233 / 0.1) 1px, transparent 0),
            linear-gradient(rgb(30 41 59 / 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgb(30 41 59 / 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* 2. DYNAMIC SKY ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[70%] h-[60%] bg-sky-600/10 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.15, 0.05] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 -right-[10%] w-[60%] h-[60%] bg-blue-900/20 blur-[160px] rounded-full"
        />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/60 backdrop-blur-2xl border-b border-sky-500/10 h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => navigate("/test")}
          >
            <img
              src="/JLPTX.png"
              alt="JLPT.X"
              className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-[0_0_15px_rgba(14,165,233,0.4)] brightness-110"
            />
          </motion.div>

          <div className="flex gap-3 items-center">
            <LangToggler />
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-sky-950/40 border border-sky-500/20 p-1 md:pl-4 md:pr-2 md:py-1.5 rounded-full hover:border-sky-500/50 transition-all active:scale-95 shadow-xl"
              >
                <span className="hidden sm:inline text-xs font-black text-slate-300 max-w-[100px] truncate uppercase tracking-wider">
                  {user?.name || "Student"}
                </span>
                <div className="w-8 h-8 bg-sky-500 text-slate-950 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                  <UserIcon size={16} strokeWidth={3} />
                </div>
                <ChevronDown
                  size={14}
                  className={`text-sky-500/50 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-60 bg-[#0f172a] border border-sky-500/20 rounded-[2rem] shadow-2xl p-3 z-[110] backdrop-blur-xl"
                  >
                    <div className="px-4 py-4 border-b border-sky-500/10 mb-2 bg-sky-500/5 rounded-t-[1.5rem]">
                      <p className="text-[9px] text-sky-500 font-black uppercase tracking-[0.3em] mb-1">
                        {t("name_label")}
                      </p>
                      <p className="text-sm font-black text-white truncate leading-none mb-2">
                        {user?.name}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-sky-500 text-slate-950 rounded-md text-[9px] font-black uppercase tracking-tighter">
                        JLPT {user?.level || "N/A"}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-colors text-xs font-black uppercase tracking-widest"
                    >
                      <LogOut size={16} /> {t("logout")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="relative z-10 pt-28 md:pt-40 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
        <header className="mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-white"
          >
            {t("welcome")},
            <span className="text-sky-500 drop-shadow-[0_0_20px_rgba(14,165,233,0.3)]">
              {user?.name?.trim().split(" ")[0]}
            </span>
          </motion.h2>

          {/* SEARCH COMPONENT */}
          <div className="mt-10 relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sky-950/20 backdrop-blur-md border border-sky-500/10 rounded-3xl py-5 pl-14 pr-12 text-sm md:text-base focus:outline-none focus:border-sky-500/40 focus:bg-sky-900/30 transition-all placeholder:text-slate-600 font-medium shadow-2xl"
            />
          </div>
        </header>

        {/* CATEGORY FILTER PILLS */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-5 text-slate-500">
            <LayoutGrid size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              {t("select_category")}
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat
                    ? "bg-sky-500 border-sky-400 text-slate-950 shadow-[0_10px_25px_rgba(14,165,233,0.4)]"
                    : "bg-sky-950/30 border-sky-500/10 text-slate-500 hover:border-sky-500/30 hover:text-sky-400"
                }`}
              >
                {cat === "JLPT Old Questions" ? "Past Papers" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* LIST SECTION */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-sky-500/10 pb-6">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-sky-500" />
              <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                {activeCategory} {t("results")}
              </h3>
            </div>
            <span className="text-[10px] text-sky-500/60 font-black uppercase tracking-widest bg-sky-500/5 px-3 py-1 rounded-full border border-sky-500/10">
              {filteredExams.length} {t("available")}
            </span>
          </div>

          <div className="grid gap-5">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam, index) => (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/test/${exam._id}`)}
                  className="group w-full flex items-center justify-between bg-sky-950/10 backdrop-blur-md border border-sky-500/10 p-6 md:p-8 rounded-[2.5rem] transition-all hover:border-sky-500/40 hover:bg-sky-900/20 cursor-pointer overflow-hidden shadow-xl"
                >
                  <div className="flex items-center gap-6 min-w-0 flex-1">
                    <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 bg-sky-500/5 rounded-[1.8rem] flex flex-col items-center justify-center text-sky-500 border border-sky-500/10 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-500 shadow-inner">
                      <Album size={24} className="md:size-8" />
                    </div>

                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[9px] font-black text-sky-400 bg-sky-500/10 px-3 py-1 rounded-lg border border-sky-500/20 uppercase tracking-widest">
                          {exam.category}
                        </span>
                        <span className="text-[9px] font-black text-slate-300 bg-slate-800/50 px-3 py-1 rounded-lg border border-white/5 uppercase tracking-widest">
                          LEVEL {exam.level}
                        </span>
                      </div>
                      <h4 className="text-lg md:text-2xl font-black text-white truncate group-hover:text-sky-400 transition-colors tracking-tight">
                        {exam.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2 text-slate-500 font-bold">
                          <BookOpen size={14} className="text-sky-500/50" />
                          <span className="text-xs uppercase tracking-tighter">
                            {exam.sections?.reduce(
                              (acc, s) => acc + (s.questions?.length || 0),
                              0,
                            )}{" "}
                            Qs
                          </span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-sky-500/20 rounded-full" />
                        <span className="text-xs font-black text-sky-500 uppercase tracking-widest">
                          {exam.sections?.reduce(
                            (acc, s) => acc + (s.duration || 0),
                            0,
                          )}{" "}
                          Mins
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 shrink-0 w-12 h-12 rounded-2xl bg-sky-500/5 border border-sky-500/10 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-slate-950 group-hover:translate-x-2 transition-all shadow-lg">
                    <ArrowRight size={22} strokeWidth={3} />
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-sky-950/40 rounded-full flex items-center justify-center mb-6 border border-sky-500/10 text-sky-900 shadow-inner">
                  <Search size={32} strokeWidth={3} />
                </div>
                <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em]">
                  {t("no_record")}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-6 text-sky-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors bg-sky-500/5 px-6 py-3 rounded-xl border border-sky-500/20"
                >
                  {t("reset_filters")}
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Global Overlay for Dropdowns */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-[#020617]/80 backdrop-blur-md"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
