import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Edit3,
  Trash2,
  PlusCircle,
  Database,
  Save,
  XCircle,
  Filter,
  AlertTriangle,
} from "lucide-react";

import {
  questionApi,
  type Question,
  QuestionModule,
  QuestionCategory,
} from "../api/questionApi";
import { LoadingScreen } from "../components/LoadingScreen";

interface QuestionForm {
  refText: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  module: QuestionModule;
  category: QuestionCategory;
  point: number;
  refImage?: string;
  refAudio?: string;
  tags: string[];
}

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [listSearch, setListSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [form, setForm] = useState<QuestionForm>({
    refText: "",
    text: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    module: QuestionModule.kanji_reading,
    category: QuestionCategory.Moji_Goi,
    point: 1,
    refImage: "",
    refAudio: "",
    tags: [],
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await questionApi.getQuestions(true);
      setQuestions(res.data?.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (editingId) {
        const res = await questionApi.updateQuestion(editingId, form);
        const updatedQuestion = res.data?.data || res.data;

        if (updatedQuestion) {
          setQuestions((prev) =>
            prev.map((q) => (q._id === editingId ? { ...updatedQuestion } : q)),
          );
        }
      } else {
        const res = await questionApi.createQuestion(form);
        const newQuestion = res.data?.data || res.data;

        if (newQuestion) {
          setQuestions((prev) => [newQuestion, ...prev]);
        }
      }
      resetForm();
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setForm({
      refText: "",
      text: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      module: QuestionModule.kanji_reading,
      category: QuestionCategory.Moji_Goi,
      point: 1,
      refImage: "",
      refAudio: "",
      tags: [],
    });
    setEditingId(null);
  };

  const handleEdit = (q: Question) => {
    setEditingId(q._id);
    setForm({ ...q, options: [...q.options], tags: [...(q.tags || [])] });
  };

  const openDeleteModal = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setIsProcessing(true);
      try {
        await questionApi.deleteQuestion(itemToDelete);
        setQuestions((prev) => prev.filter((q) => q._id !== itemToDelete));
      } catch (error) {
        console.error("Delete Error:", error);
      } finally {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        setIsProcessing(false);
      }
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.text
      .toLowerCase()
      .includes(listSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || q.category === selectedCategory;
    const matchesModule =
      selectedModule === "ALL" || q.module === selectedModule;
    const matchesTag =
      selectedTag === "ALL" || (q.tags && q.tags.includes(selectedTag));
    return matchesSearch && matchesCategory && matchesModule && matchesTag;
  });

  const allTags = Array.from(
    new Set(questions.flatMap((q) => q.tags || [])),
  ).sort();

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-transparent text-white flex flex-col font-sans relative overflow-hidden">
      {/* --- BACKGROUND DECOR --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <main className="relative z-10 p-6 md:p-12 max-w-5xl mx-auto w-full flex flex-col">
        {/* --- HEADER (Fixed at top) --- */}
        <header className="mb-4 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter italic flex items-center gap-4">
              <Database className="text-sky-500" size={32} />
              QUESTIONS
            </h1>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2">
              Question Management
            </p>
          </motion.div>
        </header>

        {/* MAIN STACKED CONTENT */}
        <div className="flex flex-col gap-8 flex-1 pr-4 custom-scrollbar pb-10">
          {/* --- TOP: FORM SECTION --- */}
          <section className="w-full shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl"
            >
              <h2 className="text-sm font-black uppercase tracking-widest text-sky-500 mb-6 flex items-center gap-2">
                {editingId ? <Edit3 size={16} /> : <PlusCircle size={16} />}
                {editingId ? "Modify Entry" : "New Entry"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                    Question Inquiry
                  </label>
                  <textarea
                    className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm min-h-[80px] font-medium text-white"
                    placeholder="Enter question text..."
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                    Question Reference Text
                  </label>
                  <textarea
                    className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm min-h-[80px] font-medium text-white"
                    placeholder="Enter reference text..."
                    value={form.refText}
                    onChange={(e) =>
                      setForm({ ...form, refText: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {form.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`relative rounded-2xl border transition-all ${form.correctOptionIndex === i
                          ? "border-sky-500 bg-sky-500/5"
                          : "border-white/5 bg-slate-950/50"
                        }`}
                    >
                      <input
                        className="w-full bg-transparent p-3 pr-10 outline-none text-sm font-bold text-white"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...form.options];
                          newOpts[i] = e.target.value;
                          setForm({ ...form, options: newOpts });
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, correctOptionIndex: i })
                        }
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all ${form.correctOptionIndex === i
                            ? "bg-sky-500 border-sky-400 scale-110 shadow-[0_0_8px_#0ea5e9]"
                            : "border-slate-700"
                          }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                      Point
                    </label>
                    <input
                      type="number"
                      className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm font-medium text-white"
                      placeholder="Enter point..."
                      value={form.point}
                      onChange={(e) =>
                        setForm({ ...form, point: Number(e.target.value) })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                      Tags (Comma separated)
                    </label>
                    <input
                      className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm font-medium text-white"
                      placeholder="e.g., N5, Kanji"
                      value={form.tags.join(", ")}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t !== "");
                        setForm({ ...form, tags });
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="w-full bg-slate-950/50 p-3 rounded-xl border border-white/5 outline-none text-xs font-bold text-sky-400 appearance-none"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as QuestionCategory,
                      })
                    }
                  >
                    {Object.values(QuestionCategory).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-full bg-slate-950/50 p-3 rounded-xl border border-white/5 outline-none text-xs font-bold text-sky-400 appearance-none"
                    value={form.module}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        module: e.target.value as QuestionModule,
                      })
                    }
                  >
                    {Object.values(QuestionModule).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                      Ref: Image
                    </label>
                    <input
                      className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm font-medium text-white"
                      placeholder="Image URL..."
                      value={form.refImage}
                      onChange={(e) =>
                        setForm({ ...form, refImage: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                      Ref: Audio
                    </label>
                    <input
                      className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm font-medium text-white"
                      placeholder="Audio URL..."
                      value={form.refAudio}
                      onChange={(e) =>
                        setForm({ ...form, refAudio: e.target.value })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`mt-4 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 ${editingId
                      ? "bg-white text-slate-950"
                      : "bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-lg shadow-sky-500/20"
                    }`}
                >
                  <Save size={18} />
                  {isProcessing ? "Processing" : editingId ? "Update Registry" : "Commit to Bank"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-[10px] font-black uppercase text-red-500 flex items-center justify-center gap-2 hover:text-white transition-colors"
                  >
                    <XCircle size={14} /> Abort Operation
                  </button>
                )}
              </form>
            </motion.div>
          </section>

          {/* --- BOTTOM: LIST & FILTER SECTION --- */}
          <section className="w-full">
            {/* 1. FILTER CARD (Locked at the top of this column) */}
            <div className="shrink-0 mb-8 space-y-4">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h2 className="text-xl font-black italic uppercase text-white">
                    Question Entries
                  </h2>
                  <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">
                    Showing {filteredQuestions.length} of {questions.length}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 backdrop-blur-md p-4 rounded-3xl flex flex-col gap-3">
                <div className="relative group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search within bank..."
                    className="w-full bg-slate-950/50 pl-12 pr-4 py-3 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-xs font-medium text-white"
                    value={listSearch}
                    onChange={(e) => setListSearch(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Filter
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500/50"
                      size={12}
                    />
                    <select
                      className="w-full bg-slate-950/50 pl-8 pr-2 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase text-sky-500 outline-none appearance-none"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="ALL">All Categories</option>
                      {Object.values(QuestionCategory).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <Filter
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500/50"
                      size={12}
                    />
                    <select
                      className="w-full bg-slate-950/50 pl-8 pr-2 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase text-sky-500 outline-none appearance-none"
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                    >
                      <option value="ALL">All Modules</option>
                      {Object.values(QuestionModule).map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <Filter
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500/50"
                    size={12}
                  />
                  <select
                    className="w-full bg-slate-950/50 pl-8 pr-2 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase text-sky-500 outline-none appearance-none"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    <option value="ALL">All Tags</option>
                    {allTags.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. QUESTION LIST */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q) => (
                    <motion.div
                      layout
                      key={q._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white/5 border border-white/5 backdrop-blur-md p-5 rounded-3xl flex justify-between items-center group hover:bg-sky-500/[0.03] hover:border-sky-500/20 transition-all shadow-lg"
                    >
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex gap-2 items-center mb-2">
                          <span className="text-[9px] font-black bg-sky-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            {q.category}
                          </span>
                          <span className="text-[9px] font-black border border-white/10 text-slate-400 px-2 py-0.5 rounded-full uppercase">
                            {q.module}
                          </span>
                        </div>
                        <p className="font-bold text-sm tracking-tight truncate group-hover:text-sky-400 transition-colors text-white">
                          {q.text}
                        </p>
                        <p className="text-[10px] font-black text-slate-500 mt-1">
                          {q.point} Point(s) •{" "}
                          {(q.tags || []).length > 0
                            ? q.tags.join(", ")
                            : "No Tags"}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          disabled={isProcessing}
                          onClick={() => handleEdit(q)}
                          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-sky-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          disabled={isProcessing}
                          onClick={() => openDeleteModal(q._id)}
                          className="p-3 bg-white/5 hover:bg-red-500/10 rounded-2xl text-red-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]"
                  >
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                      Zero Matches in Database
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#0f172a] border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl overflow-hidden"
            >
              {/* Modal Background Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl -mr-16 -mt-16" />

              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black italic uppercase mb-2">
                  Confirm Purge
                </h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
                  This operation will permanently remove this entry from the
                  JLPT registry. This action cannot be undone.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    disabled={isProcessing}
                    onClick={confirmDelete}
                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-500/20 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing" : "Confirm Delete"}
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => setIsDeleteModalOpen(false)}
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
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14, 165, 233, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Questions;
