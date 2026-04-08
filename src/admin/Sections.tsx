import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Edit3,
  Save,
  XCircle,
  Trash2,
  Clock,
  Target,
  CheckCircle2,
  Layers,
  Database,
  AlertTriangle,
  Info,
  Maximize2,
  Minimize2,
  Search,
  X,
} from "lucide-react";
import { sectionApi, type Section } from "../api/sectionApi";
import { questionApi, type Question } from "../api/questionApi";
import { LoadingScreen } from "../components/LoadingScreen";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// --- SORTABLE ITEM COMPONENT ---
const SortableQuestionItem = ({
  question,
  onRemove,
}: {
  question: Question;
  onRemove: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-sky-500/30 transition-all mb-2"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-sky-500 shrink-0"
      >
        <GripVertical size={16} />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-200 truncate">
          {question.text}
        </p>
        <div className="flex gap-2 text-[8px] font-black mt-1">
          <span className="text-slate-500 uppercase">{question.category}</span>
          <span className="text-sky-500/50">/</span>
          <span className="text-slate-500 uppercase">{question.module}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(question._id)}
        className="p-1.5 text-slate-500 hover:text-red-500 transition-colors"
      >
        <XCircle size={14} />
      </button>
    </div>
  );
};

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

const Sections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);

  // --- DELETE MODAL STATE ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // --- FILTER STATE ---
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterModule, setFilterModule] = useState<string>("All");

  // --- SECTIONS SEARCH & FILTER ---
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionsFilterTag, setSectionsFilterTag] = useState("All");

  const [form, setForm] = useState({
    title: "",
    desc: "",
    duration: 30,
    minPassedMark: 38,
    questions: [] as string[],
    tag: "",
  });

  // --- DND SENSORS ---
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setForm((prev) => {
        const oldIndex = prev.questions.indexOf(active.id as string);
        const newIndex = prev.questions.indexOf(over.id as string);
        return {
          ...prev,
          questions: arrayMove(prev.questions, oldIndex, newIndex),
        };
      });
    }
  };

  // --- DERIVED FILTER DATA ---
  const categories = useMemo(
    () => [
      "All",
      ...new Set(allQuestions.map((q) => q.category).filter(Boolean)),
    ],
    [allQuestions],
  );

  const modules = useMemo(
    () => [
      "All",
      ...new Set(allQuestions.map((q) => q.module).filter(Boolean)),
    ],
    [allQuestions],
  );

  const availableTags = useMemo(
    () => [
      "All",
      ...new Set(sections.map((s) => s.tag).filter(Boolean) as string[]),
    ],
    [sections],
  );

  const filteredQuestions = allQuestions.filter((q) => {
    const categoryMatch =
      filterCategory === "All" || q.category === filterCategory;
    const moduleMatch = filterModule === "All" || q.module === filterModule;
    return categoryMatch && moduleMatch;
  });

  const filteredSectionsEntries = sections.filter((s) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      s.title.toLowerCase().includes(searchLower) ||
      (s.tag && s.tag.toLowerCase().includes(searchLower));
    
    const matchesTag =
      sectionsFilterTag === "All" || s.tag === sectionsFilterTag;

    return matchesSearch && matchesTag;
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [secRes, qRes] = await Promise.all([
        sectionApi.getSections(true),
        questionApi.getQuestions(true),
      ]);
      setSections(secRes.data.data || []);
      setAllQuestions(qRes.data.data || []);
    } catch (error) {
      if (axios.isAxiosError<ValidationError>(error)) {
        console.error("API Error:", error.response);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (editingId) {
        const res = await sectionApi.updateSection(editingId, form);
        setSections((prev) =>
          prev.map((s) => (s._id === editingId ? res.data.data : s)),
        );
      } else {
        const res = await sectionApi.createSection(form);
        setSections((prev) => [...prev, res.data.data]);
      }
      resetForm();
    } catch (error) {
      if (axios.isAxiosError<ValidationError>(error)) {
        console.error("Submission Error:", error.response);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleQuestionSelection = (qId: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.includes(qId)
        ? prev.questions.filter((id) => id !== qId)
        : [...prev.questions, qId],
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      desc: "",
      duration: 30,
      minPassedMark: 38,
      questions: [],
      tag: "",
    });
    setEditingId(null);
  };

  const handleEdit = (section: Section) => {
    setEditingId(section._id);
    const questionIds = section.questions.map((q: string | Question) => {
      if (typeof q === "string") return q;
      return q._id;
    });
    setForm({
      title: section.title,
      desc: section.desc || "",
      duration: section.duration,
      minPassedMark: section.minPassedMark,
      questions: questionIds,
      tag: section.tag || "",
    });
  };

  const openDeleteModal = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setIsProcessing(true);
      try {
        await sectionApi.deleteSection(itemToDelete);
        setSections((prev) => prev.filter((s) => s._id !== itemToDelete));
      } catch (error) {
        console.error("Delete Error:", error);
      } finally {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        setIsProcessing(false);
      }
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-transparent text-white flex flex-col font-sans overflow-hidden">
      {/* Background Orbs */}
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
        {/* HEADER */}
        <header className="mb-4 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter italic flex items-center gap-4 text-white">
              <Layers className="text-sky-500" size={32} />
              SECTIONS
            </h1>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2">
              Section Management
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
              className="bg-white/5 border border-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              <h2 className="text-sm font-black uppercase tracking-widest text-sky-500 mb-6 flex items-center gap-2 shrink-0">
                {editingId ? <Edit3 size={16} /> : <PlusCircle size={16} />}
                {editingId ? "Update Section" : "Create Section"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 overflow-y-auto pr-2 scrollbar-hide"
              >
                <div className="space-y-2 shrink-0">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                    Section Title
                  </label>
                  <input
                    className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm font-bold text-white"
                    placeholder="e.g., N5 Grammar Assessment"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2 shrink-0">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                    Tag (for filtering)
                  </label>
                  <input
                    className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm font-bold text-sky-400"
                    placeholder="e.g., N5, Vocabulary, Kanji..."
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  />
                </div>

                <div className="space-y-2 shrink-0">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2 flex items-center gap-2">
                    <Info size={12} className="text-sky-500" /> Description
                  </label>
                  <textarea
                    className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm font-medium text-slate-300 min-h-[80px]"
                    placeholder="Provide details about this section..."
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 shrink-0">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2 text-sky-500/80 flex items-center gap-1">
                      <Clock size={10} /> Duration (M)
                    </label>
                    <input
                      className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm font-bold text-sky-400"
                      type="number"
                      value={form.duration}
                      onChange={(e) =>
                        setForm({ ...form, duration: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2 text-sky-500/80 flex items-center gap-1">
                      <Target size={10} /> Min Pass Mark
                    </label>
                    <input
                      className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-sm font-bold text-sky-400"
                      type="number"
                      value={form.minPassedMark}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          minPassedMark: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                {/* --- ORDERED QUESTIONS (DRAGGABLE) --- */}
                {form.questions.length > 0 && (
                  <div className="flex flex-col gap-3 shrink-0">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase text-sky-400">
                        Question Order (Drag to Reorder)
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsEnlarged(true)}
                        className="p-1.5 bg-sky-500/10 text-sky-500 rounded-lg hover:bg-sky-500/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase"
                      >
                        <Maximize2 size={12} /> Enlarge View
                      </button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar bg-slate-950/30 p-3 rounded-2xl border border-white/5">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={form.questions}
                          strategy={verticalListSortingStrategy}
                        >
                          {form.questions.map((qId) => {
                            const q = allQuestions.find((qu) => qu._id === qId);
                            if (!q) return null;
                            return (
                              <SortableQuestionItem
                                key={q._id}
                                question={q}
                                onRemove={toggleQuestionSelection}
                              />
                            );
                          })}
                        </SortableContext>
                      </DndContext>
                    </div>
                  </div>
                )}

                {/* --- QUESTION SELECTOR --- */}
                <div className="flex flex-col gap-3 h-[600px] custom-scrollbar">
                  <div className="flex justify-between items-end shrink-0">
                    <label className="text-[10px] font-black uppercase text-slate-400">
                      Add Questions ({form.questions.length} Selected)
                    </label>
                    {(filterCategory !== "All" || filterModule !== "All") && (
                      <button
                        type="button"
                        onClick={() => {
                          setFilterCategory("All");
                          setFilterModule("All");
                        }}
                        className="text-[10px] text-sky-500 font-black uppercase tracking-tighter hover:underline"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 p-3 bg-slate-950/50 rounded-2xl border border-white/5 shrink-0">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[9px] text-slate-600 font-black w-8">
                        CAT
                      </span>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFilterCategory(cat)}
                          className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border transition ${filterCategory === cat ? "bg-sky-500 border-sky-400 text-slate-950 shadow-sm" : "bg-white/5 border-white/5 text-slate-400"}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[9px] text-slate-600 font-black w-8">
                        MOD
                      </span>
                      {modules.map((mod) => (
                        <button
                          key={mod}
                          type="button"
                          onClick={() => setFilterModule(mod)}
                          className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border transition ${filterModule === mod ? "bg-white border-white text-slate-950 shadow-sm" : "bg-white/5 border-white/5 text-slate-400"}`}
                        >
                          {mod}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-[400px] overflow-y-auto border border-white/5 rounded-2xl bg-slate-950/30 p-2 flex flex-col gap-2 custom-scrollbar">
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((q) => (
                        <div
                          key={q._id}
                          onClick={() => toggleQuestionSelection(q._id)}
                          className={`p-3 rounded-xl cursor-pointer text-xs flex justify-between items-start transition-all ${form.questions.includes(q._id)
                            ? "bg-sky-500/10 border border-sky-500/50"
                            : "bg-white/5 border border-transparent hover:bg-white/10"
                            }`}
                        >
                          <div className="flex flex-col gap-1 truncate pr-4">
                            <span
                              className={`truncate font-bold ${form.questions.includes(q._id) ? "text-sky-400" : "text-slate-300"}`}
                            >
                              {q.text}
                            </span>
                            <div className="flex gap-2 text-[8px] font-black">
                              <span className="text-slate-500 uppercase">
                                {q.category}
                              </span>
                              <span className="text-sky-500/50">/</span>
                              <span className="text-slate-500 uppercase">
                                {q.module}
                              </span>
                            </div>
                          </div>
                          {form.questions.includes(q._id) && (
                            <CheckCircle2
                              size={14}
                              className="text-sky-400 shrink-0 mt-0.5"
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest italic">
                        No questions available
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0 pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 ${editingId
                      ? "bg-white text-slate-950"
                      : "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20"
                      }`}
                  >
                    <Save size={18} />
                    {isProcessing ? "Processing" : editingId ? "Update Section" : "Save Section"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-[10px] font-black uppercase text-red-500 flex items-center justify-center gap-2 hover:text-white"
                    >
                      <XCircle size={14} /> Abort Edit
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </section>

          {/* --- BOTTOM: LIST SECTION --- */}
          <section className="w-full">
            <div className="shrink-0 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end px-2 gap-4">
              <div>
                <h2 className="text-xl font-black italic uppercase">
                  Sections Entries
                </h2>
                <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">
                  Active Sections: {sections.length}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search by title or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/50 p-3 pl-10 rounded-xl border border-white/5 outline-none focus:border-sky-500/50 transition-all text-[11px] font-bold text-sky-400 placeholder-slate-600"
                  />
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-sky-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2 px-2 mb-6">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSectionsFilterTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                    sectionsFilterTag === tag
                      ? "bg-sky-500 border-sky-400 text-slate-950 shadow-md"
                      : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredSectionsEntries.map((s) => (
                  <motion.div
                    layout
                    key={s._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/5 border border-white/5 backdrop-blur-md p-6 rounded-[2rem] flex justify-between items-center group hover:bg-sky-500/[0.03] hover:border-sky-500/20 transition-all"
                  >
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="font-black text-lg tracking-tight truncate group-hover:text-sky-400 transition-colors uppercase italic">
                        {s.title}
                      </h3>
                      {s.desc && (
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 italic">
                        </p>
                      )}
                      {s.tag && (
                        <div className="mt-2">
                          <span className="text-[8px] font-black uppercase bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded border border-sky-500/20 shadow-inner tracking-widest">
                            {s.tag}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Database size={12} className="text-sky-500/50" />
                          <span className="text-[10px] font-black uppercase">
                            {s.questions.length} Q's
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock size={12} className="text-sky-500/50" />
                          <span className="text-[10px] font-black uppercase">
                            {s.duration} Mins
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Target size={12} className="text-sky-500/50" />
                          <span className="text-[10px] font-black uppercase">
                            {s.minPassedMark} Min Mark
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sky-500">
                          <div className="w-1 h-1 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                          <span className="text-[10px] font-black uppercase">
                            {(() => {
                              const total = s.questions.reduce((acc, q) => {
                                const questionObj = typeof q === 'string' 
                                  ? allQuestions.find(aq => aq._id === q)
                                  : q;
                                return acc + (questionObj?.point || 0);
                              }, 0);
                              return `${total} Total Points`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        disabled={isProcessing}
                        onClick={() => handleEdit(s)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-sky-400 transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        disabled={isProcessing}
                        onClick={() => openDeleteModal(s._id)}
                        className="p-3 bg-white/5 hover:bg-red-500/10 rounded-2xl text-red-500 transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredSectionsEntries.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                  <p className="text-slate-600 text-xs font-black uppercase tracking-widest">
                    No matching sections found 
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* --- DELETE CONFIRM MODAL --- */}
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
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black italic uppercase mb-2">
                  Confirm Purge
                </h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 px-4">
                  Are you sure you want to delete this section? This action will
                  remove the module from the exam bank.
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
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Cancel Action
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style>{`
              .custom-scrollbar::-webkit-scrollbar { width: 4px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14, 165, 233, 0.2); border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(14, 165, 233, 0.4); }
            `}</style>

      {/* --- ENLARGED DND MODAL --- */}
      <AnimatePresence>
        {isEnlarged && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEnlarged(false)}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#020617] border border-sky-500/20 w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-3xl flex flex-col p-8 md:p-12 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                  <h2 className="text-3xl font-black italic uppercase text-white flex items-center gap-4">
                    <Maximize2 className="text-sky-500" size={24} />
                    REORDER QUESTIONS
                  </h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                    Manage entry sequence for: {form.title || "Untitled Section"}
                  </p>
                </div>
                <button
                  onClick={() => setIsEnlarged(false)}
                  className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all active:scale-95 flex items-center gap-2 font-black uppercase text-xs"
                >
                  <Minimize2 size={18} /> Close View
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar bg-slate-950/50 p-6 rounded-[2rem] border border-white/5">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={form.questions}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {form.questions.map((qId) => {
                        const q = allQuestions.find((qu) => qu._id === qId);
                        if (!q) return null;
                        return (
                          <SortableQuestionItem
                            key={q._id}
                            question={q}
                            onRemove={toggleQuestionSelection}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              <div className="mt-8 shrink-0 flex justify-end">
                <p className="text-[10px] font-black uppercase text-sky-500 italic">
                  Total Questions: {form.questions.length}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sections;
