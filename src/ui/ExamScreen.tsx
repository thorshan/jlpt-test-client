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
import { examApi, type Exam, type Section } from "../api/examApi";
import { resultApi, type ResultFormData, type SectionDetail } from "../api/resultApi";
import { LoadingScreen } from "../components/LoadingScreen";
import { type Question } from "../api/questionApi";
import { useUser } from "../hooks/useUser";
import { useTranslation } from "../hooks/useTranslation";

// Local interfaces removed in favor of shared ones from API layer

const title = {
  moji_goi: {
    kanji_reading: "もんだい　１　＿＿＿＿＿　の　ことばは　どう　よみますか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    orthography: "もんだい　２　＿＿＿＿＿　の　ことばは　どう　かきますか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    word_formation: "もんだい　３　＿＿＿＿＿  に　なにを　いれますか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    paraphrases: "もんだい　３ ＿＿＿＿＿  に　なにが　はいりますか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    contextually_defined_expression: "もんだい　４　＿＿＿＿＿　の　ぷんと　だいたい　おなじ　いみの　ぷんが　あります。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    usage: "もんだい　５ つぎの　ことばの　つかいかたで　いちばん　いいものを\n１・２・３・４　から　ひとつ　えらんでください。",
  },
  grammar: {
    selecting_grammar_form: "もんだい　１　（　　）　に　なにを　いれますか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    sentence_composition: "もんだい　２　＿＿★＿＿　に　いれる　ものは　どれ　ですか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    text_grammar: "もんだい　３（　番　）から（　番　）　に　なにを　いれますか。\n１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
  },
  reading: {
    short_passage: "もんだい　４　つぎの　ぶんを　読んで　しつもんに　こたえてください。\nこたえは　１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    mid_passage: "もんだい　５　つぎの　ぶんを　読んで　しつもんに　こたえてください。\nこたえは　１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    long_passage: "もんだい　６　つぎの　ぶんを　読んで　しつもんに　こたえてください。\nこたえは　１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    integrated_reading_comprehension: "もんだい　６　つぎの　ぶんを　読んで　しつもんに　こたえてください。\nこたえは　１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    thematic_comprehension: "もんだい　６　つぎの　ぶんを　読んで　しつもんに　こたえてください。\nこたえは　１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
    information_retrieval: "もんだい　７　つぎの　ぶんを　読んで　しつもんに　こたえてください。\nこたえは　１・２・３・４　から　いちばん　いいものを　ひとつ　えらんでください。",
  },
  listening: {
    text_based_comprehension: "もんだい　１では、はじめに　しつもんを　きいて　ください。\nそれから　はなしを　きいて　もんだいようしの　１　から　４の　なか　から　いちばん　いいものを　ひとつ　えらんでください。",
    keypoints_comprehension: "もんだい　２では、はじめに　しつもんを　きいて　ください。\nそれから　はなしを　きいて　もんだいようしの　１　から　４の　なか　から　いちばん　いいものを　ひとつ　えらんでください。",
    general_outline_comprehension: "もんだい　３では、はじめに　しつもんを　きいて　ください。\nそれから　はなしを　きいて　もんだいようしの　１　から　４の　なか　から　いちばん　いいものを　ひとつ　えらんでください。",
    verbal_expression: "もんだい　３では、はじめに　しつもんを　きいて　ください。\nそれから　はなしを　きいて　もんだいようしの　１　から　４の　なか　から　いちばん　いいものを　ひとつ　えらんでください。",
    quick_response: "もんだい　３では、はじめに　しつもんを　きいて　ください。\nそれから　はなしを　きいて　もんだいようしの　１　から　４の　なか　から　いちばん　いいものを　ひとつ　えらんでください。",
    integrated_listening_comprehension: "もんだい　４では、はじめに　しつもんを　きいて　ください。\nそれから　はなしを　きいて　もんだいようしの　１　から　４の　なか　から　いちばん　いいものを　ひとつ　えらんでください。",
  },
};

const ExamScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const questionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // --- STATE ---
  const [exam, setExam] = useState<Exam<Question> | null>(null);
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
  const [exmaTimeLeft, setExamTimeLeft] = useState(0);

  // --- DERIVED DATA ---
  const currentSection = exam?.sections?.[currentSectionIdx];
  const questions = currentSection?.questions || [];
  const currentQuestion = questions[currentQuestionIdx];

  // --- HELPERS ---
  const moduleOrder = [
    "Kanji Reading",
    "Orthography",
    "Word Formation",
    "Paraphrases",
    "Contextually Defined Expression",
    "Usage",
    "Selecting Grammar Form",
    "Sentence Composition",
    "Text Grammar",
    "Short Passage",
    "Mid Passage",
    "Long Passage",
    "Integrated Reading Comprehension",
    "Thematic Comprehension",
    "Information Retrieval",
    "Text-Based Comprehension",
    "Keypoints Comprehension",
    "General Outline Comprehension",
    "Verbal Expression",
    "Quick Response",
    "Integrated Listening Comprehension",
  ];

  const getModulePriority = (mod: string) => {
    const index = moduleOrder.indexOf(mod);
    return index !== -1 ? index : 99;
  };

  // --- 1. FETCH EXAM ---
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await examApi.getExam(id as string);
        const data = res?.data?.data;
        if (data) {
          // Sort questions within each section by category then module order
          if (data.sections) {
            const getCategoryPriority = (cat: string) => {
              const norm = cat.toLowerCase();
              if (norm.includes("moji_goi") || norm.includes("vocab") || norm.includes("kanji")) return 1;
              if (norm.includes("grammar")) return 2;
              if (norm.includes("reading")) return 3;
              if (norm.includes("listening")) return 4;
              return 99;
            };

            data.sections.forEach((sec: Section<Question>) => {
              if (sec.questions) {
                sec.questions.sort((a, b) => {
                  const pA = getCategoryPriority(a.category);
                  const pB = getCategoryPriority(b.category);
                  if (pA !== pB) return pA - pB;
                  return getModulePriority(a.module) - getModulePriority(b.module);
                });
              }
            });
          }

          setExam(data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, loading, exam, userAnswers, isSubmitting, sectionTimeLeft]);

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
  }, [currentQuestionIdx, currentSectionIdx, status, currentQuestion?.refAudio]);

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

  const startNextSection = () => {
    if (!exam) return;
    const nextIdx = currentSectionIdx + 1;
    setCurrentSectionIdx(nextIdx);
    setCurrentQuestionIdx(0);

    const nextSectionDuration = exam.sections[nextIdx].duration * 60;
    setSectionTimeLeft(nextSectionDuration + exmaTimeLeft);

    setExamTimeLeft(0);

    setStatus("exam");
    setSelectedOption(null);
    setRestTimeLeft(10 * 60);
  };

  const handleSectionEnd = (updatedAnswers: Record<string, number>) => {
    if (exam && currentSectionIdx < exam.sections.length - 1) {
      if (exam.category === "Level Test") {
        startNextSection();
      } else {
        setExamTimeLeft(sectionTimeLeft);
        setStatus("rest");
      }
    } else {
      submitExam(updatedAnswers);
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const getQuestionTitle = (category: string, module: string) => {
    const normalizedCat = category.toLowerCase();
    let catKey = "";

    if (normalizedCat.includes("moji_goi") || normalizedCat.includes("vocab") || normalizedCat.includes("kanji")) catKey = "moji_goi";
    else if (normalizedCat.includes("grammar")) catKey = "grammar";
    else if (normalizedCat.includes("reading")) catKey = "reading";
    else if (normalizedCat.includes("listening")) catKey = "listening";
    else catKey = normalizedCat;

    const modKey = module.toLowerCase().replace(/\s+/g, "_");

    // @ts-expect-error - dynamic access
    return title[catKey]?.[modKey] || "";
  };

  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(（.*?）)/g);

    return parts.map((part, index) => {
      if (part.startsWith("（") && part.endsWith("）")) {
        const content = part.slice(1, -1);
        return (
          <span
            key={index}
            className="inline-block mx-1.5 text-sky-500 underline underline-offset-8"
          >
            {content}
          </span>
        );
      }
      return part;
    });
  };

  if (loading || !exam) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans overflow-hidden relative">
      {/* --- BACKGROUND LAYER --- */}
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
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="h-16 md:h-20 border-b border-white/5 bg-[#020617]/60 backdrop-blur-2xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-[60]">
        <div className="flex items-center gap-4">
          <img
            src="/JLPTX.png"
            alt="Logo"
            className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]"
          />
          <div className="text-sky-400 font-mono text-sm font-black bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-500/20 flex items-center gap-2 shadow-inner">
            <Clock size={16} className="text-sky-500" />
            {status === "exam" ? formatTime(sectionTimeLeft) : "REST"}
          </div>
        </div>
        <button
          onClick={() => setShowExitModal(true)}
          className="text-neutral-500 hover:text-red-400 text-xs font-black uppercase flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/5"
        >
          {t("exit")} <LogOut size={16} />
        </button>
      </nav>

      {/* --- PROGRESS BAR --- */}
      {status === "exam" && (
        <div className="w-full bg-[#020617]/40 border-b border-white/5 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory relative z-10">
          <div className="flex gap-2 min-w-max px-[calc(50vw-20px)]">
            {questions.map((q, idx) => (
              <button
                key={q._id}
                ref={(el) => {
                  questionRefs.current[idx] = el;
                }}
                className={`min-w-[42px] h-[42px] rounded-xl text-[10px] font-black transition-all border snap-center shrink-0 ${currentQuestionIdx === idx
                  ? "bg-sky-500 border-sky-400 text-slate-950 scale-110 shadow-[0_0_20px_rgba(14,165,233,0.4)]"
                  : userAnswers[q._id] !== undefined
                    ? "bg-sky-500/20 border-sky-500/40 text-sky-400"
                    : "bg-white/5 border-white/10 text-slate-500"
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center p-4 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {status === "exam" ? (
            <motion.div
              key={`q-${currentSectionIdx}-${currentQuestionIdx}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-4xl pb-32"
            >
              {currentQuestion && (
                <div className="space-y-8">
                  <header>
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-sky-500 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
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
                            {t("listening_active")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-8">
                      <h2 className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed whitespace-pre-line bg-white/5 p-6 rounded-3xl border border-white/5 shadow-xl backdrop-blur-sm">
                        {getQuestionTitle(
                          currentQuestion.category,
                          currentQuestion.module,
                        )}
                      </h2>
                    </div>

                    {currentQuestion.refImage && (
                      <div className="mb-8 rounded-3xl border border-white/10 overflow-hidden bg-white/5 p-4 backdrop-blur-sm shadow-2xl">
                        <img
                          src={currentQuestion.refImage}
                          alt="Ref"
                          className="max-h-80 w-full object-contain rounded-xl"
                          onError={(e) => (e.currentTarget.src = "/JLPTX.png")}
                        />
                      </div>
                    )}

                    {currentQuestion.refText && (
                      <div className="mb-8 p-8 bg-[#0f172a]/60 rounded-3xl border border-white/5 shadow-inner text-slate-200 text-xl leading-relaxed">
                        {currentQuestion.refText}
                      </div>
                    )}
                    {currentQuestion.category !== "Listening" && (
                      <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                        {renderHighlightedText(currentQuestion.text)}
                      </h2>
                    )}
                  </header>

                  {/* OPTIONS */}
                  <div className="grid gap-4">
                    {currentQuestion.options?.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedOption(i)}
                        className={`w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center justify-between backdrop-blur-md ${selectedOption === i
                          ? "bg-sky-500/10 border-sky-500 text-sky-400 shadow-lg"
                          : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                          }`}
                      >
                        <div className="flex gap-4 items-center">
                          <span
                            className={`flex justify-center items-center w-9 h-9 border-2 rounded-2xl font-black text-sm transition-colors ${selectedOption === i
                              ? "bg-sky-500 border-sky-500 text-slate-950"
                              : "border-white/10 text-slate-500"
                              }`}
                          >
                            {i + 1}
                          </span>
                          <span className="font-bold text-lg md:text-xl">
                            {opt}
                          </span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === i ? "bg-sky-500 border-sky-500" : "border-white/10"}`}
                        >
                          {selectedOption === i && (
                            <CheckCircle2
                              size={14}
                              className="text-slate-950"
                            />
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 space-y-8"
            >
              <div className="w-24 h-24 bg-sky-500/10 text-sky-500 rounded-full flex items-center justify-center mx-auto border border-sky-500/20 shadow-[0_0_30px_rgba(14,165,233,0.2)]">
                <Coffee size={48} className="animate-bounce" />
              </div>
              <h2 className="text-5xl font-black tracking-tighter italic">
                {t("take_breath")}
              </h2>
              <div className="text-8xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl">
                {formatTime(restTimeLeft)}
              </div>
              <button
                onClick={startNextSection}
                className="px-12 py-5 bg-white text-slate-950 rounded-[2rem] font-black uppercase tracking-widest hover:bg-sky-500 transition-all active:scale-95 shadow-xl"
              >
                {t("skip_break")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- EXIT MODAL --- */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitModal(false)}
              className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[#0f172a] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <LogOut size={32} />
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">
                {t("leave_exam")}?
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {t("exit_confirm")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors border border-white/5"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => navigate("/test")}
                  className="py-4 bg-red-500 text-slate-950 font-black rounded-2xl hover:bg-red-600 transition-all"
                >
                  {t("exit")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      {status === "exam" && (
        <footer className="h-24 border-t border-white/5 bg-[#020617]/80 backdrop-blur-2xl px-4 md:px-10 flex items-center justify-center fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-4xl w-full flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 border border-white/5 px-4 py-1.5 rounded-full">
                <Info size={14} className="text-sky-500" /> Session active
              </span>
            </div>
            <button
              disabled={selectedOption === null || isSubmitting}
              onClick={handleNextQuestion}
              className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-3 ${selectedOption !== null && !isSubmitting
                ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95"
                : "bg-white/5 text-slate-600 opacity-50 cursor-not-allowed border border-white/5"
                }`}
            >
              {isSubmitting ? (
                <>
                  {t("processing")}...{" "}
                  <Loader2 size={20} className="animate-spin" />
                </>
              ) : (
                <>
                  {currentQuestionIdx === questions.length - 1
                    ? t("complete_section")
                    : t("next_question")}
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
