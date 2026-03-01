import { useEffect, useState } from "react";
import { sectionApi, type Section } from "../api/sectionApi";
import { questionApi, type Question } from "../api/questionApi";
import { LoadingScreen } from "../components/LoadingScreen";

const Sections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    desc: "",
    duration: 30,
    minPassedMark: 38,
    questions: [] as string[],
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
    } catch (err: any) {
      console.error(err.message);
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
    } catch (err: any) {
      alert(err.message);
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
            <input
              className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-emerald-500 outline-none"
              placeholder="Section Title (e.g. N1 Listening)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-emerald-500 outline-none"
              placeholder="Description"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />

            <label>Section Durations</label>
            <input
              className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-emerald-500 outline-none"
              placeholder="Duration (minutes)"
              type="number"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: Number(e.target.value) })
              }
            />
            <label>Minimum Passed Mark</label>
            <input
              className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-emerald-500 outline-none"
              placeholder="Minimum Passed Mark"
              type="number"
              value={form.minPassedMark}
              onChange={(e) =>
                setForm({ ...form, minPassedMark: Number(e.target.value) })
              }
            />

            {/* QUESTION SELECTOR */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-neutral-400">
                Select Questions ({form.questions.length} selected)
              </label>
              <div className="max-h-60 overflow-y-auto border border-neutral-700 rounded bg-neutral-900 p-2 flex flex-col gap-2">
                {allQuestions.map((q) => (
                  <div
                    key={q._id}
                    onClick={() => toggleQuestionSelection(q._id)}
                    className={`p-2 rounded cursor-pointer text-xs flex justify-between items-center transition ${form.questions.includes(q._id) ? "bg-emerald-900/40 border border-emerald-500" : "bg-neutral-800 border border-transparent hover:bg-neutral-700"}`}
                  >
                    <span className="truncate pr-4">{q.text}</span>
                    {form.questions.includes(q._id) && (
                      <span className="text-emerald-400 font-bold">✓</span>
                    )}
                  </div>
                ))}
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
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* LIST */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Existing Sections</h2>
          {loading ? (
            <p className="animate-pulse text-emerald-500">Loading...</p>
          ) : (
            sections.map((s) => (
              <div
                key={s._id}
                className="bg-neutral-800 p-5 rounded-xl border border-neutral-700 flex justify-between items-center hover:bg-neutral-750 transition"
              >
                <div>
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-neutral-400">
                    {s?.questions.length} Questions • {s.duration} Mins •{" "}
                    {s.minPassedMark} Minimum Passed Mark
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-sky-400 text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-500 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default Sections;
