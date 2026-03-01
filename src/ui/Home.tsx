import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { useTranslation } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User as UserIcon,
  ChevronDown,
  BookOpen,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { LangToggler } from "../components/LangToggler";

// Mock Data - In production, fetch this from your API
const PAST_EXAMS = [
  {
    id: "1",
    year: "2023",
    period: "July",
    title: "JLPT N1 Full Mock Exam",
    questions: 120,
  },
  {
    id: "2",
    year: "2022",
    period: "December",
    title: "JLPT N1 Grammar Focus",
    questions: 45,
  },
  {
    id: "3",
    year: "2022",
    period: "July",
    title: "JLPT N1 Reading Comprehension",
    questions: 60,
  },
  {
    id: "4",
    year: "2021",
    period: "December",
    title: "JLPT N1 Vocabulary & Kanji",
    questions: 80,
  },
];

const Home = () => {
  const { user, logout } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-sky-500/30">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-neutral-800 h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo Section */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => navigate("/home")}
          >
            <img
              src="/JLPTX.png"
              alt="JLPT.X"
              className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]"
            />
          </motion.div>

          {/* Right Side Actions */}
          <div className="flex gap-2 items-center">
            <LangToggler />

            {/* User Dropdown */}
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
                        Lv: {user?.level || "N/A"}
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

      {/* MAIN CONTENT AREA */}
      <main className="relative pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-5xl font-black tracking-tighter leading-tight"
          >
            {t("welcome")}, <br className="sm:hidden" />
            <span className="text-sky-500">{user?.name}</span>.
          </motion.h2>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/5 border border-sky-500/20">
            <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">
              {t("level")}:
            </span>
            <span className="text-sky-400 font-black text-sm">
              {user?.level || "N/A"}
            </span>
          </div>
        </header>

        {/* LIST SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="text-[10px] md:text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">
              {t("past_exams")}
            </h3>
            <span className="text-[10px] text-neutral-600 font-bold">
              {PAST_EXAMS.length} Papers
            </span>
          </div>

          {/* Exam Cards Container */}
          <div className="grid gap-3 sm:gap-4">
            {PAST_EXAMS.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/exam/${exam.id}`)}
                className="group w-full flex items-center justify-between bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl transition-all hover:border-sky-500/40 hover:bg-neutral-900/60 cursor-pointer overflow-hidden"
              >
                {/* Left: Info Block */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Date Badge */}
                  <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-sky-500/10 rounded-2xl flex flex-col items-center justify-center text-sky-500 border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-black transition-colors duration-300">
                    <Calendar size={14} className="md:size-4" />
                    <span className="text-[10px] md:text-[11px] font-black mt-0.5">
                      {exam.year}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm md:text-lg font-bold text-neutral-100 truncate group-hover:text-sky-400 transition-colors">
                      {exam.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] md:text-xs text-neutral-500 font-medium bg-neutral-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <BookOpen size={10} /> {exam.questions} Qs
                      </span>
                      <span className="w-1 h-1 bg-neutral-700 rounded-full" />
                      <span className="text-[10px] md:text-xs text-neutral-500 italic uppercase">
                        {exam.period}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Icon */}
                <div className="ml-4 shrink-0 w-10 h-10 rounded-full bg-neutral-800/50 flex items-center justify-center text-neutral-500 group-hover:bg-sky-500 group-hover:text-black group-hover:translate-x-1 transition-all">
                  <ArrowRight size={18} />
                </div>
              </motion.div>
            ))}
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
