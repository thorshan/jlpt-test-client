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
  X,
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

  // --- STATE ---
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // --- CATEGORY LIST ---
  const categoryList = [
    "All",
    "JLPT Old Questions",
    "Level Test",
    "Custom Test",
  ];

  // --- FETCH DATA ---
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

  // --- FILTER & SEARCH LOGIC ---
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
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-sky-500/30">
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-neutral-800 h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => navigate("/test")}
          >
            <img
              src="/JLPTX.png"
              alt="JLPT.X"
              className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]"
            />
          </motion.div>

          <div className="flex gap-2 items-center">
            <LangToggler />

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1 md:pl-4 md:pr-2 md:py-1.5 rounded-full hover:border-sky-500/50 transition-all active:scale-95"
              >
                <span className="hidden sm:inline text-sm font-bold text-neutral-300 max-w-[100px] truncate">
                  {user?.name || "Student"}
                </span>
                <div className="w-8 h-8 bg-sky-500/10 text-sky-500 rounded-full flex items-center justify-center shrink-0">
                  <UserIcon size={18} />
                </div>
                <ChevronDown
                  size={14}
                  className={`text-neutral-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-52 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-2 z-[110] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-neutral-800/50 mb-1">
                      <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">
                        {t("token")}
                      </p>
                      <p className="text-sm font-bold text-sky-400 truncate">
                        {user?.name}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5 opacity-70">
                        {t("level")} : {user?.level || "N/A"}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-bold"
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
      <main className="relative pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
        <header className="mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-5xl font-black tracking-tighter leading-tight"
          >
            {t("welcome")}, <br className="sm:hidden" />
            <span className="text-sky-500">{user?.name}</span>.
          </motion.h2>

          {/* SEARCH COMPONENT */}
          <div className="mt-8 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-sky-500 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/40 border border-neutral-800 rounded-2xl py-4 pl-12 pr-12 text-sm md:text-base focus:outline-none focus:border-sky-500/50 focus:bg-neutral-900 transition-all placeholder:text-neutral-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </header>

        {/* CATEGORY FILTER PILLS */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 text-neutral-500">
            <LayoutGrid size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {t("select_category")}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${
                  activeCategory === cat
                    ? "bg-sky-500 border-sky-400 text-black shadow-[0_0_20px_rgba(14,165,233,0.25)]"
                    : "bg-neutral-900/50 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300"
                }`}
              >
                {cat === "JLPT Old Questions" ? "Past Papers" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* LIST SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-sky-500" />
              <h3 className="text-[10px] md:text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">
                {activeCategory} {t("results")}
              </h3>
            </div>
            <span className="text-[10px] text-neutral-600 font-bold">
              {filteredExams.length} {t("available")}
            </span>
          </div>

          <div className="grid gap-4">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam, index) => (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/test/${exam._id}`)}
                  className="group w-full flex items-center justify-between bg-neutral-900/30 border border-neutral-800 p-5 rounded-2xl transition-all hover:border-sky-500/40 hover:bg-neutral-900/60 cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center gap-5 min-w-0 flex-1">
                    <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-sky-500/5 rounded-2xl flex flex-col items-center justify-center text-sky-500 border border-sky-500/10 group-hover:bg-sky-500 group-hover:text-black transition-all duration-500 shadow-inner">
                      <Album size={20} className="md:size-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-black text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 uppercase tracking-tighter">
                          {exam.category}
                        </span>
                        <span className="text-[9px] font-black text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700 uppercase tracking-tighter">
                          {exam.level}
                        </span>
                      </div>
                      <h4 className="text-base md:text-xl font-bold text-neutral-100 truncate group-hover:text-sky-400 transition-colors">
                        {exam.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-neutral-500">
                          <BookOpen size={12} />
                          <span className="text-xs font-medium">
                            {exam.sections?.reduce(
                              (acc, s) => acc + (s.questions?.length || 0),
                              0,
                            )}{" "}
                            Qs
                          </span>
                        </div>
                        <div className="w-1 h-1 bg-neutral-800 rounded-full" />
                        <span className="text-xs font-bold text-sky-600/80">
                          {exam.sections?.reduce(
                            (acc, s) => acc + (s.duration || 0),
                            0,
                          )}{" "}
                          Mins
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 shrink-0 w-10 h-10 rounded-full bg-neutral-800/50 flex items-center justify-center text-neutral-500 group-hover:bg-sky-500 group-hover:text-black group-hover:translate-x-1 transition-all">
                    <ArrowRight size={18} />
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-neutral-900/50 rounded-full flex items-center justify-center mb-4 border border-neutral-800 text-neutral-700">
                  <Search size={28} />
                </div>
                <p className="text-neutral-500 text-sm italic">
                  {t("no_record")}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-sky-500 text-xs font-black uppercase tracking-widest hover:text-sky-400 transition-colors underline underline-offset-8 decoration-sky-500/30"
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
            className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm sm:backdrop-blur-none"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
