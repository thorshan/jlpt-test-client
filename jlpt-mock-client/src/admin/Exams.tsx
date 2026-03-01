import { useEffect, useState } from "react";
import { examApi } from "../api/examApi";
import { sectionApi, type Section } from "../api/sectionApi";
import { LoadingScreen } from "../components/LoadingScreen";

interface Exam {
  _id: string;
  level: string;
  title: string;
  desc: string;
  passingScore: number;
  sections: string[];
}

interface ExamForm {
  level: string;
  title: string;
  desc: string;
  passingScore: number;
  sections: string[];
}

const Exams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ExamForm>({
    level: "",
    title: "",
    desc: "",
    passingScore: 80,
    sections: [],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examRes, sectionRes] = await Promise.all([
        examApi.getExams(),
        sectionApi.getSections(),
      ]);
      setExams(examRes.data?.data || []);
      setAvailableSections(sectionRes.data?.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CRUD Handlers ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await examApi.updateExam(editingId, form);
        setExams((prev) =>
          prev.map((ex) => (ex._id === editingId ? res.data.data : ex)),
        );
      } else {
        const res = await examApi.createExam(form);
        setExams((prev) => [...prev, res.data.data]);
      }
      resetForm();
    } catch (err: any) {
      alert("Error saving exam: " + err.message);
    }
  };

  const handleEdit = (exam: Exam) => {
    setEditingId(exam._id);
    setForm({
      level: exam.level,
      title: exam.title,
      desc: exam.desc,
      passingScore: exam.passingScore,
      // Safe check: convert populated objects to IDs if necessary
      sections: exam.sections.map((s: any) =>
        typeof s === "string" ? s : s._id,
      ),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await examApi.deleteExam(id);
      setExams((prev) => prev.filter((ex) => ex._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setForm({ level: "", title: "", desc: "", passingScore: 80, sections: [] });
    setEditingId(null);
  };

  // --- Form Helpers ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "passingScore" ? Number(value) : value,
    }));
  };

  const handleSelectSection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sectionId = e.target.value;
    if (sectionId && !form.sections.includes(sectionId)) {
      setForm((prev) => ({ ...prev, sections: [...prev.sections, sectionId] }));
    }
  };

  const removeSection = (sectionId: string) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((id) => id !== sectionId),
    }));
  };

  const getSectionTitle = (id: string) => {
    return (
      availableSections.find((s) => s._id === id)?.title || "Unknown Section"
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen p-10 bg-neutral-900 text-white flex flex-col gap-10">
      <h1 className="text-3xl font-bold border-b border-neutral-700 pb-4 text-sky-500">
        Exam Management
      </h1>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* FORM */}
        <section className="bg-neutral-800 p-8 rounded-2xl border border-neutral-700 sticky top-10">
          <h2 className="text-xl font-semibold mb-5 text-sky-400">
            {editingId ? "Edit Exam Mode" : "Create New Exam"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">Exam Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-sky-500 outline-none"
                placeholder="N1 Mock Exam A"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">Description</label>
              <input
                name="desc"
                value={form.desc}
                onChange={handleChange}
                className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-sky-500 outline-none"
                placeholder="Describe this exam..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">Passing Score</label>
              <input
                name="passingScore"
                type="number"
                value={form.passingScore}
                onChange={handleChange}
                className="bg-neutral-900 p-3 rounded border border-neutral-600 focus:border-sky-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400">Add Sections</label>
              <select
                onChange={handleSelectSection}
                value=""
                className="bg-neutral-900 p-3 rounded border border-neutral-600 outline-none cursor-pointer"
              >
                <option value="" disabled>
                  Select a section...
                </option>
                {availableSections.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2 mt-2">
                {form.sections.map((id) => (
                  <div
                    key={id}
                    className="bg-sky-900/40 text-sky-300 border border-sky-700 px-3 py-1 rounded-full text-xs flex items-center gap-2"
                  >
                    {getSectionTitle(id)}
                    <button
                      type="button"
                      onClick={() => removeSection(id)}
                      className="font-bold hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Target Level
                </label>

                <div className="flex flex-wrap gap-2">
                  {["N5", "N4", "N3", "N2", "N1"].map((lvl) => {
                    const isSelected = form.level === lvl;

                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, level: lvl }))
                        }
                        className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${
                          isSelected
                            ? "bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-900/40 translate-y-[-2px]"
                            : "bg-neutral-800 border-neutral-700 text-neutral-500 hover:border-neutral-500"
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                className={`py-3 rounded-lg font-bold transition active:scale-95 ${editingId ? "bg-orange-600 hover:bg-orange-500" : "bg-sky-600 hover:bg-sky-500"}`}
              >
                {editingId ? "Update Exam" : "Save Exam"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-neutral-500 underline hover:text-neutral-300 transition"
                >
                  Cancel Edit / Clear Form
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LIST */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">All Exams ({exams.length})</h2>
          {loading ? (
            <p className="animate-pulse text-sky-500 italic">
              Fetching exams from server...
            </p>
          ) : (
            exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-neutral-800 p-5 rounded-xl border border-neutral-700 flex justify-between items-center group hover:border-sky-500/50 transition shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-bold">{exam.title}</h3>
                  <p className="text-neutral-400 text-xs">
                    {(exam.sections || []).length} Sections Assigned •{" "}
                    {exam.passingScore} Passing
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(exam)}
                    className="text-sky-400 font-semibold text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exam._id)}
                    className="text-red-500 font-semibold text-sm hover:underline"
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

export default Exams;
