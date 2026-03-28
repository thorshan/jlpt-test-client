import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Edit3,
  Save,
  Trash2,
  AlertTriangle,
  GraduationCap,
  CheckCircle2,
  Clock,
  Database,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { examApi, type Exam, type Section } from "../api/examApi";
import { sectionApi } from "../api/sectionApi";
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
import { GripVertical, XCircle } from "lucide-react";

// --- SORTABLE SECTION ITEM ---
const SortableSectionItem = ({
  section,
  onRemove,
}: {
  section: Section;
  onRemove: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section._id });

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
        <p className="text-xs font-bold text-slate-200 truncate font-black uppercase italic">
          {section.title}
        </p>
        <div className="flex gap-2 text-[8px] font-black mt-1">
          <span className="text-slate-500">
            {section.questions.length} QUESTIONS
          </span>
          <span className="text-sky-500/50">/</span>
          <span className="text-slate-500">{section.duration} MIN</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(section._id)}
        className="p-1.5 text-slate-500 hover:text-red-500 transition-colors"
      >
        <XCircle size={14} />
      </button>
    </div>
  );
};

// Local interfaces removed in favor of shared ones from API layer

interface ExamForm {
  level: "N1" | "N2" | "N3" | "N4" | "N5" | "";
  title: string;
  desc: string;
  category: string;
  passingScore: number;
  sections: string[];
}

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

const Exams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [form, setForm] = useState<ExamForm>({
    level: "",
    title: "",
    desc: "",
    category: "",
    passingScore: 80,
    sections: [],
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
        const oldIndex = prev.sections.indexOf(active.id as string);
        const newIndex = prev.sections.indexOf(over.id as string);
        return {
          ...prev,
          sections: arrayMove(prev.sections, oldIndex, newIndex),
        };
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examRes, sectionRes] = await Promise.all([
        examApi.getExams(true),
        sectionApi.getSections(true),
      ]);
      setExams(examRes.data?.data || []);
      setAvailableSections(sectionRes.data?.data || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApiError = (error: unknown) => {
    if (axios.isAxiosError<ValidationError>(error)) {
      console.error("API Error:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const selectedSectionObjects = form.sections
        .map((id) => availableSections.find((s) => s._id === id))
        .filter((s): s is Section => !!s);

      const dataToSend = {
        ...form,
        level: form.level as "N1" | "N2" | "N3" | "N4" | "N5",
        sections: selectedSectionObjects,
      };

      if (editingId) {
        const res = await examApi.updateExam(editingId, dataToSend);
        setExams((prev) =>
          prev.map((ex) => (ex._id === editingId ? res.data.data : ex)),
        );
      } else {
        const res = await examApi.createExam(dataToSend as any); // cast to any or fix createExam signature
        setExams((prev) => [...prev, res.data.data]);
      }
      resetForm();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleEdit = (exam: Exam) => {
    setEditingId(exam._id);
    // const sectionIds = (exam.sections || []).map((s) => s._id);
    const sectionIds = exam.sections.map((s: string | Section) => {
      if (typeof s === "string") return s;
      return s._id;
    });

    setForm({
      level: exam.level,
      title: exam.title,
      desc: exam.desc || "",
      category: exam.category,
      passingScore: exam.passingScore,
      sections: sectionIds,
    });
  };

  const toggleSectionSelection = (sectionId: string) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter((id) => id !== sectionId)
        : [...prev.sections, sectionId],
    }));
  };

  const resetForm = () => {
    setForm({
      level: "",
      title: "",
      desc: "",
      category: "",
      passingScore: 80,
      sections: [],
    });
    setEditingId(null);
  };

  const openDeleteModal = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await examApi.deleteExam(itemToDelete);
        setExams((prev) => prev.filter((ex) => ex._id !== itemToDelete));
      } finally {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-transparent text-white flex flex-col font-sans overflow-hidden text-[13px]">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 p-6 md:p-12 max-w-5xl mx-auto w-full flex flex-col">
        <header className="mb-4 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter italic flex items-center gap-4 text-white uppercase">
              <GraduationCap className="text-sky-500" size={32} />
              Exams
            </h1>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2">
              Exam Management
            </p>
          </motion.div>
        </header>

        {/* MAIN STACKED CONTENT */}
        <div className="flex flex-col gap-8 flex-1 pr-4 custom-scrollbar pb-10">
          {/* --- TOP: FORM SECTION --- */}
          <section className="w-full shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 mb-6 shrink-0 flex items-center gap-2">
                {editingId ? <Edit3 size={14} /> : <PlusCircle size={14} />}
                {editingId ? "Update Blueprint" : "Create Exam"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 overflow-y-auto pr-2 scrollbar-hide"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                    Title
                  </label>
                  <input
                    className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500 transition-all font-bold"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500 transition-all font-medium text-slate-300 min-h-[60px] resize-none"
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["JLPT Old Questions", "Level Test", "Custom Test"].map(
                      (cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat })}
                          className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${
                            form.category === cat
                              ? "bg-sky-500 border-sky-400 text-slate-950"
                              : "bg-white/5 border-white/5 text-slate-500"
                          }`}
                        >
                          {cat}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                      Pass Mark
                    </label>
                    <input
                      className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 text-sky-400 font-bold"
                      type="number"
                      value={form.passingScore}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          passingScore: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2 text-center block">
                      Level
                    </label>
                    <div className="flex gap-1">
                      {(["N5", "N4", "N3", "N2", "N1"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setForm({ ...form, level: lvl })}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${
                            form.level === lvl
                              ? "bg-white text-slate-950"
                              : "bg-white/5 border-white/5 text-slate-500"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- ORDERED SECTIONS (DRAGGABLE) --- */}
                {form.sections.length > 0 && (
                  <div className="flex flex-col gap-3 shrink-0">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase text-sky-400">
                        Section Order (Drag to Reorder)
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsEnlarged(true)}
                        className="p-1.5 bg-sky-500/10 text-sky-500 rounded-lg hover:bg-sky-500/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase"
                      >
                        <Maximize2 size={12} /> Full Page
                      </button>
                    </div>
                    <div className="max-h-[250px] overflow-y-auto custom-scrollbar bg-slate-950/30 p-3 rounded-[2rem] border border-white/5">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={form.sections}
                          strategy={verticalListSortingStrategy}
                        >
                          {form.sections.map((sId) => {
                            const s = availableSections.find(
                              (sec) => sec._id === sId,
                            );
                            if (!s) return null;
                            return (
                              <SortableSectionItem
                                key={s._id}
                                section={s}
                                onRemove={toggleSectionSelection}
                              />
                            );
                          })}
                        </SortableContext>
                      </DndContext>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 min-h-[150px]">
                  <label className="text-[10px] font-black uppercase text-slate-400 flex justify-between px-2">
                    <span>Add Sections</span>
                    <span className="text-sky-500 italic">
                      {form.sections.length} Selected
                    </span>
                  </label>

                  <div className="flex-1 overflow-y-auto border border-white/5 rounded-[2rem] bg-slate-950/30 p-2 flex flex-col gap-2 custom-scrollbar">
                    {availableSections.map((s) => {
                      const isSelected = form.sections.includes(s._id);
                      return (
                        <div
                          key={s._id}
                          onClick={() => toggleSectionSelection(s._id)}
                          className={`p-4 rounded-[1.5rem] cursor-pointer flex justify-between items-center transition-all ${
                            isSelected
                              ? "bg-sky-500/10 border border-sky-500/40"
                              : "bg-white/5 border border-transparent hover:border-white/10"
                          }`}
                        >
                          <div>
                            <span
                              className={`font-black uppercase italic ${isSelected ? "text-sky-400" : "text-slate-400"}`}
                            >
                              {s.title}
                            </span>
                            <div className="flex gap-3 text-[8px] font-black uppercase text-slate-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Database size={8} /> {s.questions.length} Qs
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={8} /> {s.duration}m
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 size={16} className="text-sky-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      editingId
                        ? "bg-white text-slate-950"
                        : "bg-sky-500 text-slate-950"
                    }`}
                  >
                    <Save size={16} />
                    {editingId ? "Update System" : "Save Exam"}
                  </button>
                </div>
              </form>
            </motion.div>
          </section>

          {/* --- BOTTOM: LIST SECTION --- */}
          <section className="w-full">
            <div className="shrink-0 mb-8 flex justify-between items-end px-2">
              <div>
                <h2 className="text-xl font-black italic uppercase">
                  Exam Entries
                </h2>
                <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">
                  Active Sections: {exams.length}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {exams.map((exam) => (
                  <motion.div
                    layout
                    key={exam._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/5 border border-white/5 backdrop-blur-md p-6 rounded-[2rem] flex justify-between items-center group hover:bg-sky-500/[0.03] transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sky-500 text-[9px] font-black bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                          {exam.level}
                        </span>
                        <h3 className="font-black text-lg truncate uppercase italic group-hover:text-sky-400 transition-colors">
                          {exam.title}
                        </h3>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-wider italic">
                        {exam.sections.length} Modules • {exam.passingScore}% •{" "}
                        {exam.category}
                      </p>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                      <button
                        onClick={() => handleEdit(exam)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-sky-400 transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(exam._id)}
                        className="p-3 bg-white/5 hover:bg-red-500/10 rounded-2xl text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0f172a] border border-white/10 p-8 rounded-[3rem] max-w-sm w-full shadow-3xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black italic uppercase mb-2">
                Confirm Delete
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-500 text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-2xl"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-4 bg-white/5 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl"
                >
                  Abort
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14, 165, 233, 0.2); border-radius: 10px; }
      `}</style>

      {/* --- ENLARGED DND MODAL --- */}
      <AnimatePresence>
        {isEnlarged && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 text-[13px]">
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
                    REORDER SECTIONS
                  </h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                    System Architecture for: {form.title || "Untitled Exam"}
                  </p>
                </div>
                <button
                  onClick={() => setIsEnlarged(false)}
                  className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all active:scale-95 flex items-center gap-2 font-black uppercase text-xs"
                >
                  <Minimize2 size={18} /> Exit View
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar bg-slate-950/50 p-6 rounded-[2rem] border border-white/5">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={form.sections}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {form.sections.map((sId) => {
                        const s = availableSections.find(
                          (sec) => sec._id === sId,
                        );
                        if (!s) return null;
                        return (
                          <SortableSectionItem
                            key={s._id}
                            section={s}
                            onRemove={toggleSectionSelection}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              <div className="mt-8 shrink-0 flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-sky-500 italic">
                  Total Active Modules: {form.sections.length}
                </p>
                <button
                  onClick={() => setIsEnlarged(false)}
                  className="px-8 py-3 bg-white text-slate-950 rounded-xl font-black uppercase text-[10px] shadow-lg active:scale-95 transition-all"
                >
                  Save & Return
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Exams;
