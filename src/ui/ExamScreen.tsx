import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock,
  LogOut,
  ChevronRight,
  Info,
  Coffee,
  CheckCircle2,
  Volume2,
  Loader2,
} from "lucide-react";
import { examApi } from "../api/examApi";
import { resultApi, type ResultFormData } from "../api/resultApi";
import { LoadingScreen } from "../components/LoadingScreen";
import { useUser } from "../hooks/useUser";

// --- INTERFACES ---
export interface Question {
  _id: string;
  refText: string;
  refImage: string;
  refAudio: string;
  text: string;
  category: string;
  module: string;
  options: string[];
  correctOptionIndex: number;
  point: number;
}

export interface SectionDetail {
  sectionTitle: string;
  earnedPoints: number;
  totalPoints: number;
  gradeJLPT: "A" | "B" | "C";
  passed: boolean;
}

export interface Section {
  _id: string;
  title: string;
  desc: string;
  duration: number;
  minPassedMark: number;
  questions: Question[];
}

export interface Exam {
  _id: string;
  title: string;
  level: "N1" | "N2" | "N3" | "N4" | "N5";
  passingScore: number;
  sections: Section[];
}

const title = {
  vocab: {
    m1: "もんだい　１・＿＿＿＿＿　の　ことばは　ひらがなで　どう　かきますか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    m3: "もんだい　３・（　　）　に　なにが　はいりますか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    m4: "もんだい　４・＿＿＿＿＿　の　ぷんと　だいたい　おなじ　いみの　ぷんが　あります。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
  },
  kanji: {
    m2: "もんだい　２・＿＿＿＿＿　の　ことばは　どう　かきますか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
  },
  grammar: {
    m1: "もんだい　１・（　　）　に　なにを　いれますか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    m2: "もんだい　２・＿＿★＿＿　に　いれる　ものは　どれ　ですか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
  },
  reading: {
    m3: "もんだい　３・（　　）に　なにを　いれますか。ぶんしょうの　いみを　かんがえて\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    m4: "もんだい　４・つぎの（　　）から（　　）　ぶんしょうを　よんで　しつもんに　こたえてください。\nこたえは　１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    m5: "もんだい　５・つぎの（　　）から（　　）　ぶんしょうを　よんで　しつもんに　こたえてください。\nこたえは　１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    m6: "もんだい　６・つぎの（　　）から（　　）　ぶんしょうを　よんで　しつもんに　こたえてください。\nこたえは　１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
  },
  listening: {
    m1: "もんだい　１では、はじめに　しつもんを　きいて　ください。\nそれから　はなしを　きいて　もんだいようしの　１　から　４の　なか　から　いちばん　いいものを　ひとつ　えらんでください。",
    m2: "もんだい　２では、はじめに　しつもんを　きいて　ください。\nそれから　はなしを　きいて　もんだいようしの　１　から　４の　なか　から　いちばん　いいものを　ひとつ　えらんでください。",
    m3: "もんだい　３では、はじめに　しつもんを　きいて　ください。\nそれから　はなしを　きいて　もんだいようしの　１　から　４の　なか　から　いちばん　いいものを　ひとつ　えらんでください。",
    m4: "もんだい　４では、はじめに　しつもんを　きいて　ください。\nそれから　はなしを　きいて　もんだいようしの　１　から　４の　なか　から　いちばん　いいものを　ひとつ　えらんでください。",
  },
};

const ExamScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const questionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // --- STATE ---
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [status, setStatus] = useState<"exam" | "rest">("exam");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sectionTimeLeft, setSectionTimeLeft] = useState(0);
  const [restTimeLeft, setRestTimeLeft] = useState(10 * 60);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExitModal, setShowExitModal] = useState(false);

  // --- DERIVED DATA ---
  const currentSection = exam?.sections?.[currentSectionIdx];
  const questions = currentSection?.questions || [];
  const currentQuestion = questions[currentQuestionIdx];

  // --- 1. FETCH EXAM ---
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await examApi.getExam(id as string);
        const data = res?.data?.data;
        if (data) {
          setExam(data as unknown as Exam);
          if (data.sections?.[0]) {
            setSectionTimeLeft(data.sections[0].duration * 60);
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  // --- 2. TIMER LOGIC ---
  useEffect(() => {
    if (loading || !exam || isSubmitting) return;
    const timer = setInterval(() => {
      if (status === "exam") {
        setSectionTimeLeft((p) =>
          p <= 1 ? (handleSectionEnd(userAnswers), 0) : p - 1,
        );
      } else {
        setRestTimeLeft((p) => (p <= 1 ? (startNextSection(), 0) : p - 1));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [status, loading, exam, userAnswers, isSubmitting]);

  useEffect(() => {
    if (status === "exam" && questionRefs.current[currentQuestionIdx]) {
      questionRefs.current[currentQuestionIdx]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentQuestionIdx, status]);

  // --- 3. AUTO-PLAY AUDIO LOGIC ---
  useEffect(() => {
    let playTimeout: number;
    if (status === "exam" && currentQuestion?.refAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      playTimeout = window.setTimeout(() => {
        const audio = new Audio(currentQuestion.refAudio);
        audio.crossOrigin = "anonymous";
        audio.preload = "auto";
        audioRef.current = audio;
        audio
          .play()
          .catch((err) => console.error("Audio playback failed:", err));
      }, 3000);
    }
    return () => {
      window.clearTimeout(playTimeout);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [currentQuestionIdx, currentSectionIdx, status]);

  // --- 4. CALCULATION & SUBMISSION ---
  const submitExam = async (finalAnswers: Record<string, number>) => {
    if (!exam || !user?._id || isSubmitting) return;

    try {
      setIsSubmitting(true);
      let totalEarnedPoints = 0;
      let totalPossiblePoints = 0;
      const sectionResults: SectionDetail[] = [];

      exam.sections.forEach((sec) => {
        let sectionTotalPoints = 0;
        let sectionEarnedPoints = 0;

        sec.questions.forEach((q) => {
          const pointValue = Number(q.point) || 0;
          sectionTotalPoints += pointValue;

          const userAnswer = finalAnswers[q._id];
          if (
            userAnswer !== undefined &&
            String(userAnswer) === String(q.correctOptionIndex)
          ) {
            sectionEarnedPoints += pointValue;
          }
        });

        const sectionPercentage =
          sectionTotalPoints > 0
            ? (sectionEarnedPoints / sectionTotalPoints) * 100
            : 0;
        totalPossiblePoints += sectionTotalPoints;
        totalEarnedPoints += sectionEarnedPoints;

        sectionResults.push({
          sectionTitle: sec.title,
          earnedPoints: sectionEarnedPoints,
          totalPoints: sectionTotalPoints,
          gradeJLPT:
            sectionPercentage >= 67 ? "A" : sectionPercentage >= 34 ? "B" : "C",
          passed: sectionEarnedPoints >= sec.minPassedMark,
        });
      });

      const totalPercentage =
        totalPossiblePoints > 0
          ? (totalEarnedPoints / totalPossiblePoints) * 100
          : 0;
      const gradeJLPT =
        totalPercentage >= 67 ? "A" : totalPercentage >= 34 ? "B" : "C";
      const allSectionsPassed = sectionResults.every((sec) => sec.passed);
      const resultStatus =
        totalEarnedPoints >= exam.passingScore && allSectionsPassed;

      // CEFR Grading Logic
      let gradeCEFR: "A1" | "A2" | "B1" | "B2" | "C1" = "A1";
      const lvl = exam.level;
      if (lvl === "N3")
        gradeCEFR =
          totalEarnedPoints >= 104
            ? "B1"
            : totalEarnedPoints >= 95
              ? "A2"
              : "A1";
      else if (lvl === "N2")
        gradeCEFR =
          totalEarnedPoints >= 112
            ? "B2"
            : totalEarnedPoints >= 90
              ? "B1"
              : "A2";
      else if (lvl === "N1")
        gradeCEFR =
          totalEarnedPoints >= 142
            ? "C1"
            : totalEarnedPoints >= 100
              ? "B2"
              : "B1";
      else if (lvl === "N4") gradeCEFR = "A2";

      const payload: ResultFormData = {
        user: user._id,
        exam: exam._id,
        level: exam.level,
        sectionDetails: sectionResults,
        totalEarnedPoints: totalEarnedPoints,
        totalPossiblePoints: totalPossiblePoints,
        status: resultStatus,
        gradeJLPT: gradeJLPT,
        grade: gradeCEFR,
      };
      await resultApi.createResult(payload);
      navigate("/results");
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLERS ---
  const handleNextQuestion = () => {
    if (currentQuestion && selectedOption !== null) {
      const updatedAnswers = {
        ...userAnswers,
        [currentQuestion._id]: selectedOption,
      };
      setUserAnswers(updatedAnswers);

      if (currentQuestionIdx < questions.length - 1) {
        const nextIdx = currentQuestionIdx + 1;
        setCurrentQuestionIdx(nextIdx);
        setSelectedOption(updatedAnswers[questions[nextIdx]._id] ?? null);
      } else {
        handleSectionEnd(updatedAnswers);
      }
    }
  };

  const handleSectionEnd = (updatedAnswers: Record<string, number>) => {
    if (exam && currentSectionIdx < exam.sections.length - 1) {
      setStatus("rest");
    } else {
      submitExam(updatedAnswers);
    }
  };

  const startNextSection = () => {
    if (!exam) return;
    const nextIdx = currentSectionIdx + 1;
    setCurrentSectionIdx(nextIdx);
    setCurrentQuestionIdx(0);
    setSectionTimeLeft(exam.sections[nextIdx].duration * 60);
    setStatus("exam");
    setSelectedOption(null);
    setRestTimeLeft(10 * 60);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const getQuestionTitle = (category: string, module: string) => {
    const catKey =
      category.toLowerCase() === "vocabulary"
        ? "vocab"
        : category.toLowerCase();
    const modKey = module.toLowerCase().replace("module ", "m");
    // @ts-expect-error - dynamic access
    return title[catKey]?.[modKey] || "";
  };

  if (loading || !exam) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <nav className="h-16 border-b border-neutral-800 bg-black/60 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <img src="/JLPTX.png" alt="Logo" className="w-8 h-8 object-contain" />
          <div className="text-sky-500 font-mono text-sm font-bold bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 flex items-center gap-2">
            <Clock size={14} />
            {status === "exam" ? formatTime(sectionTimeLeft) : "REST"}
          </div>
        </div>
        <button
          onClick={() => setShowExitModal(true)}
          className="text-neutral-500 hover:text-red-400 text-xs font-bold uppercase flex items-center gap-2"
        >
          Exit <LogOut size={16} />
        </button>
      </nav>

      {status === "exam" && (
        <div className="w-full bg-neutral-900/40 border-b border-neutral-800 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          <div className="flex gap-2 min-w-max px-[calc(50vw-20px)]">
            {questions.map((q, idx) => (
              <button
                key={q._id}
                ref={(el) => {
                  questionRefs.current[idx] = el;
                }}
                onClick={() => {
                  setCurrentQuestionIdx(idx);
                  setSelectedOption(userAnswers[q._id] ?? null);
                }}
                className={`min-w-[40px] h-[40px] rounded-md text-[10px] font-black transition-all border snap-center shrink-0 ${
                  currentQuestionIdx === idx
                    ? "bg-sky-500 border-sky-400 text-black scale-110 shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                    : userAnswers[q._id] !== undefined
                      ? "bg-sky-500/20 border-sky-500/40 text-sky-400"
                      : "bg-neutral-800 border-neutral-700 text-neutral-500"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center p-4 md:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {status === "exam" ? (
            <motion.div
              key={`q-${currentSectionIdx}-${currentQuestionIdx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-3xl pb-24"
            >
              {currentQuestion && (
                <div className="space-y-8">
                  <header>
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-sky-500 text-[13px] font-black">
                        {currentSection?.title} {"・"} {currentQuestionIdx + 1}{" "}
                        / {questions.length} Qs
                      </p>
                      {currentQuestion.refAudio && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full">
                          <Volume2
                            size={14}
                            className="text-sky-500 animate-pulse"
                          />
                          <span className="text-sky-500 text-[9px] font-black uppercase italic">
                            Listening Track Active
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <h2 className="text-neutral-300 text-md md:text-2xl font-medium leading-relaxed whitespace-pre-line bg-neutral-900/30 p-4 rounded-xl border border-neutral-800/50">
                        {getQuestionTitle(
                          currentQuestion.category,
                          currentQuestion.module,
                        )}
                      </h2>
                    </div>

                    {currentQuestion.refImage && (
                      <div className="mb-6 rounded-2xl border border-neutral-800 overflow-hidden bg-white/5">
                        <img
                          src={`/refImages/${currentQuestion.refImage}`}
                          alt="Ref"
                          className="max-h-80 w-full object-contain p-4"
                          onError={(e) => (e.currentTarget.src = "/JLPTX.png")}
                        />
                      </div>
                    )}

                    {currentQuestion.refText && (
                      <div className="mb-8 p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800 shadow-inner text-neutral-200">
                        {currentQuestion.refText}
                      </div>
                    )}

                    <h2 className="text-xl md:text-3xl font-bold text-white leading-tight">
                      {currentQuestion.text}
                    </h2>
                  </header>

                  <div className="grid gap-3">
                    {currentQuestion.options?.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedOption(i)}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                          selectedOption === i
                            ? "bg-sky-500/10 border-sky-500 text-sky-400"
                            : "bg-neutral-900/50 border-neutral-700 text-neutral-400 hover:border-neutral-500"
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <span className="flex justify-center items-center w-[35px] h-[35px] border-[2px] border-sky-500/30 rounded-full font-semibold text-lg">
                            {i + 1}
                          </span>
                          <span className="font-semibold text-lg">{opt}</span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === i ? "bg-sky-500 border-sky-500" : "border-neutral-700"}`}
                        >
                          {selectedOption === i && (
                            <CheckCircle2 size={14} className="text-black" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="rest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 space-y-8"
            >
              <div className="w-24 h-24 bg-sky-500/10 text-sky-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Coffee size={48} />
              </div>
              <h2 className="text-4xl font-black">Take a Breath</h2>
              <div className="text-7xl font-mono font-black text-sky-500 tracking-tighter">
                {formatTime(restTimeLeft)}
              </div>
              <button
                onClick={startNextSection}
                className="px-12 py-4 bg-white text-black rounded-2xl font-black"
              >
                Skip Break
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut size={32} />
              </div>
              <h3 className="text-2xl font-black mb-2">Leave Exam?</h3>
              <p className="text-neutral-400 text-sm mb-8">
                Your progress will not be saved. Are you sure you want to exit
                now?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="py-4 bg-neutral-800 text-white font-bold rounded-2xl hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate("/test")}
                  className="py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600"
                >
                  Exit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {status === "exam" && (
        <footer className="h-24 border-t border-neutral-800 bg-black/90 backdrop-blur-xl px-4 flex items-center justify-center fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-3xl w-full flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase">
              <Info size={14} className="text-sky-500" /> Session active
            </div>
            <button
              disabled={selectedOption === null || isSubmitting}
              onClick={handleNextQuestion}
              className={`px-10 py-4 rounded-2xl font-black uppercase transition-all flex items-center gap-3 ${
                selectedOption !== null && !isSubmitting
                  ? "bg-sky-500 text-black shadow-lg"
                  : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  Saving... <Loader2 size={20} className="animate-spin" />
                </>
              ) : (
                <>
                  {currentQuestionIdx === questions.length - 1
                    ? "Complete Section"
                    : "Next Question"}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ExamScreen;
