import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface Message {
  role: "bot" | "user";
  text: string;
  isSuggestion?: boolean;
}

const FAQS = [
  {
    q: "What is JLPTX?",
    a: "JLPTX is an advanced proficiency simulation platform designed to help students master the Japanese Language Proficiency Test (JLPT) through realistic mock exams and detailed performance analytics.",
  },
  {
    q: "How do I get a certificate?",
    a: "Certificates are automatically generated when you achieve a 'PASSED' status in any full-length mock exam. You can view and print them from your 'Results' dashboard.",
  },
  {
    q: "Can I retake exams?",
    a: "Yes! You can retake any available examination as many times as you like. We recommend spaced repetition to improve your score over time.",
  },
  {
    q: "Is there a mobile app?",
    a: "JLPTX is currently a Progressive Web App (PWA). You can 'Add to Home Screen' on your mobile device for an app-like experience.",
  },
  {
    q: "How is the grading calculated?",
    a: "Our grading system mirrors the official JLPT weightings, mapping your raw points to JLPT-standard grades (A, B, C) and CEFR levels (N1-N5).",
  },
];

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Konnichiwa! I'm the JLPTX Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    // Simple FAQ matching
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      const match = FAQS.find(
        (f) =>
          lowerText.includes(f.q.toLowerCase()) ||
          f.q.toLowerCase().split(" ").some(word => word.length > 3 && lowerText.includes(word.toLowerCase()))
      );

      if (match) {
        setMessages((prev) => [...prev, { role: "bot", text: match.a }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "I'm sorry, I couldn't find a direct answer to that. Would you like to check our top FAQs?",
            isSuggestion: true,
          },
        ]);
      }
    }, 600);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-sky-500 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3 text-slate-950">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tighter">
                    JLPTX Support
                  </h3>
                  <p className="text-[10px] font-bold opacity-70">Always Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-950/50 hover:text-slate-950 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
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
                    className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.role === "user"
                        ? "bg-sky-500 text-slate-950 rounded-br-none"
                        : "bg-white/5 text-slate-300 border border-white/5 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                    {msg.isSuggestion && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {FAQS.slice(0, 3).map((f, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(f.q)}
                            className="bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1.5 rounded-lg text-[10px] hover:bg-sky-500 hover:text-slate-950 transition-all font-bold"
                          >
                            {f.q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-black/20 border-t border-white/5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-5 pr-14 text-xs font-medium focus:border-sky-500/50 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-sky-500 text-slate-950 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/20"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? "bg-red-500 text-white rotate-90" : "bg-sky-500 text-slate-950"
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
