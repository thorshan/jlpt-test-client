import { useEffect, useState, useMemo } from "react";
import { sectionApi, type Section } from "../api/sectionApi";
import { questionApi, type Question } from "../api/questionApi";
import { LoadingScreen } from "../components/LoadingScreen";
import axios from "axios";

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

const Sections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- FILTER STATE ---
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterModule, setFilterModule] = useState<string>("All");

  const [form, setForm] = useState({
    title: "",
    desc: "",
    duration: 30,
    minPassedMark: 38,
    questions: [] as string[],
  });

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

  const filteredQuestions = allQuestions.filter((q) => {
    const categoryMatch =
      filterCategory === "All" || q.category === filterCategory;
    const moduleMatch = filterModule === "All" || q.module === filterModule;
    return categoryMatch && moduleMatch;
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [secRes, qRes] = await Promise.all([
        sectionApi.getSections(),
        questionApi.getQuestions(),
      ]);
      setSections(secRes.data.data);
      setAllQuestions(qRes.data.data);
    } catch (error) {
      if (axios.isAxiosError<ValidationError>(error)) {
        console.error(error.response);
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
        console.error(error.response);
      }
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
    });
    setEditingId(null);
  };

  const handleEdit = (section: Section) => {
    setEditingId(section._id);
    setForm({
      title: section.title,
      desc: section.desc,
      duration: section.duration,
      minPassedMark: section.minPassedMark,
      questions: section.questions,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete section?")) return;
    await sectionApi.deleteSection(id);
    setSections((prev) => prev.filter((s) => s._id !== id));
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen p-8 bg-neutral-900 text-slate-100 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-emerald-500">
        Section Management
      </h1>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* FORM */}
        <section className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-xl sticky top-8">
          <h2 className="text-xl font-bold mb-6 text-emerald-400">
            {editingId ? "Edit Section" : "Create New Section"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-500 uppercase font-bold">
                  Title
                </label>
                <input
                  className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-emerald-500 outline-none"
                  placeholder="N1 Listening"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-neutral-500 uppercase font-bold">
                  Duration (Mins)
                </label>
                <input
                  className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-emerald-500 outline-none"
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <input
              className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-emerald-500 outline-none"
              placeholder="Description"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 uppercase font-bold">
                Minimum Passing Mark
              </label>
              <input
                className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-emerald-500 outline-none"
                type="number"
                value={form.minPassedMark}
                onChange={(e) =>
                  setForm({ ...form, minPassedMark: Number(e.target.value) })
                }
              />
            </div>

            {/* --- QUESTION SELECTOR WITH FILTERS --- */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-neutral-400">
                  Select Questions ({form.questions.length} selected)
                </label>
                {(filterCategory !== "All" || filterModule !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilterCategory("All");
                      setFilterModule("All");
                    }}
                    className="text-[10px] text-emerald-500 hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col gap-2 p-3 bg-neutral-900/50 rounded-lg border border-neutral-700">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] text-neutral-500 font-bold w-12">
                    CAT:
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFilterCategory(cat)}
                      className={`px-2 py-0.5 rounded text-[10px] border transition ${filterCategory === cat ? "bg-emerald-600 border-emerald-400" : "bg-neutral-800 border-neutral-700 text-neutral-400"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] text-neutral-500 font-bold w-12">
                    MOD:
                  </span>
                  {modules.map((mod) => (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => setFilterModule(mod)}
                      className={`px-2 py-0.5 rounded text-[10px] border transition ${filterModule === mod ? "bg-sky-600 border-sky-400" : "bg-neutral-800 border-neutral-700 text-neutral-400"}`}
                    >
                      {mod}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="max-h-60 overflow-y-auto border border-neutral-700 rounded bg-neutral-900 p-2 flex flex-col gap-2">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q) => (
                    <div
                      key={q._id}
                      onClick={() => toggleQuestionSelection(q._id)}
                      className={`p-2 rounded cursor-pointer text-xs flex justify-between items-start transition ${
                        form.questions.includes(q._id)
                          ? "bg-emerald-900/40 border border-emerald-500"
                          : "bg-neutral-800 border border-transparent hover:bg-neutral-700"
                      }`}
                    >
                      <div className="flex flex-col gap-1 truncate pr-4">
                        <span className="truncate">{q.text}</span>
                        <div className="flex gap-2 text-[9px] font-mono text-neutral-500">
                          <span className="bg-neutral-950 px-1 rounded">
                            CAT: {q.category}
                          </span>
                          <span className="bg-neutral-950 px-1 rounded">
                            MOD: {q.module}
                          </span>
                        </div>
                      </div>
                      {form.questions.includes(q._id) && (
                        <span className="text-emerald-400 font-bold">✓</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-neutral-600 text-xs italic">
                    No questions match these filters.
                  </div>
                )}
              </div>
            </div>

            <button
              className={`py-3 rounded-lg font-bold transition active:scale-95 ${editingId ? "bg-orange-600" : "bg-emerald-600"}`}
            >
              {editingId ? "Update Section" : "Save Section"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-neutral-500 underline"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        {/* LIST */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">
            Existing Sections ({sections.length})
          </h2>
          {sections.map((s) => (
            <div
              key={s._id}
              className="bg-neutral-800 p-5 rounded-xl border border-neutral-700 flex justify-between items-center hover:border-emerald-500/50 transition"
            >
              <div>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-sm text-neutral-400">
                  {s?.questions.length} Questions • {s.duration} Mins •{" "}
                  {s.minPassedMark} Min Mark
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(s)}
                  className="text-sky-400 text-sm font-semibold hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-red-500 text-sm font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Sections;
