import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Bot } from "lucide-react";

interface Message {
  role: "bot" | "user";
  text: string;
  isSuggestion?: boolean;
}

const FAQS = [
  {
    q: "How to use JLPTX?",
    a: "Simply choose a level (N5-N1), select an available exam, and start! You'll move through timed sections and can review your results immediately after completion.",
  },
  {
    q: "Are the exams official?",
    a: "Our exams are simulation mock-ups designed by experts to mirror the structure, timing, and difficulty of official JLPT tests to provide the best training environment.",
  },
  {
    q: "How do I see my results?",
    a: "After finishing an exam, results are saved to your dashboard. You'll see detailed breakdowns per section, CEFR grading, and your overall pass/fail status.",
  },
  {
    q: "How are points calculated?",
    a: "Points are assigned per question. Each section has a minimum pass mark. If you meet the overall passing score AND pass all sections, you achieve a 'PASSED' status.",
  },
  {
    q: "Can I use it on mobile?",
    a: "Yes! JLPTX is mobile-friendly. You can access it via any mobile browser, and for the best experience, use it in 'Exam Mode' which expands to full view.",
  },
  {
    q: "About certification",
    a: "Once you pass an exam, a digital achievement record is generated. You can request a verified certificate via the homepage using your Result ID.",
  },
];

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "こんにちは! I'm the JLPTX Assistant. Welcome to the platform! Please select a topic below to help you get started.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text }]);

    // Find answer and add bot message
    setTimeout(() => {
      const match = FAQS.find((f) => f.q === text);
      if (match) {
        setMessages((prev) => [...prev, { role: "bot", text: match.a }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "I specialize in the topics listed below. Please select an option for precise assistance.",
          },
        ]);
      }
    }, 600);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] md:w-[400px] h-[60vh] md:h-[550px] bg-[#0f172a] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 md:p-8 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center gap-4 text-slate-950 relative z-10">
                <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/20">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest">
                    JLPTX Assistant
                  </h3>
                  <p className="text-[10px] font-bold opacity-60 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-pulse" /> Support Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-950/40 hover:text-slate-950 transition-colors relative z-10"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/20"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {msg.role === "bot" && (
                    <div className="shrink-0 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/10">
                      <Bot size={14} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-4 rounded-[1.5rem] text-[13px] font-medium leading-relaxed ${msg.role === "user"
                        ? "bg-sky-500 text-slate-950 rounded-br-none shadow-lg shadow-sky-500/10"
                        : "bg-white/5 text-slate-300 border border-white/5 rounded-bl-none"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Options Selection */}
            <div className="p-6 bg-slate-950/40 border-t border-white/5 space-y-3">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4 text-center">
                Select a Question
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                {FAQS.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(f.q)}
                    className="w-full text-left bg-white/5 hover:bg-sky-500/10 border border-white/5 hover:border-sky-500/30 text-slate-300 hover:text-sky-400 p-3.5 rounded-2xl text-xs font-bold transition-all active:scale-[0.98]"
                  >
                    {f.q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? "bg-red-500 text-white rotate-90" : "bg-sky-500 text-slate-950"
          }`}
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#020617] animate-pulse" />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingChatbot;
