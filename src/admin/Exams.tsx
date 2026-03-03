import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { examApi } from "../api/examApi";
import { sectionApi } from "../api/sectionApi";
import { LoadingScreen } from "../components/LoadingScreen";
import axios from "axios";

// --- INTERFACES ---
interface Section {
  _id: string;
  title: string;
  desc: string;
  duration: number;
  questions: string[];
  minPassedMark: number;
}

interface Exam {
  _id: string;
  level: string;
  title: string;
  desc: string;
  passingScore: number;
  sections: Section[];
}

interface ExamForm {
  level: string;
  title: string;
  desc: string;
  passingScore: number;
  sections: Section[];
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

  const [form, setForm] = useState<ExamForm>({
    level: "",
    title: "",
    desc: "",
    passingScore: 80,
    sections: [],
  });

  // --- Data Fetching ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [examRes, sectionRes] = await Promise.all([
        examApi.getExams(),
        sectionApi.getSections(),
      ]);
      setExams(examRes.data?.data);
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

  // --- Error Helper ---
  const handleApiError = (error: unknown) => {
    if (axios.isAxiosError<ValidationError>(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
  };

  // --- CRUD Handlers ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await examApi.updateExam(editingId, form);
        const updatedExam: Exam = res.data.data;
        setExams((prev) =>
          prev.map((ex) => (ex._id === editingId ? updatedExam : ex)),
        );
      } else {
        const res = await examApi.createExam(form);
        const newExam: Exam = res.data.data;
        setExams((prev) => [...prev, newExam]);
      }
      resetForm();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleEdit = (exam: Exam) => {
    setEditingId(exam._id);

    // Use a type assertion (s: any) or (s: string) to tell TS
    // that these are IDs from the database
    const fullSectionObjects = (exam.sections || [])
      .map((sectionData: Section) => {
        // If the database gave us a string ID, find the object
        const id =
          typeof sectionData === "string" ? sectionData : sectionData._id;
        return availableSections.find((s) => s._id === id);
      })
      .filter((s): s is Section => !!s);

    setForm({
      level: exam.level,
      title: exam.title,
      desc: exam.desc,
      passingScore: exam.passingScore,
      sections: fullSectionObjects,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await examApi.deleteExam(id);
      setExams((prev) => prev.filter((ex) => ex._id !== id));
    } catch (error) {
      handleApiError(error);
    }
  };

  const resetForm = () => {
    setForm({ level: "", title: "", desc: "", passingScore: 80, sections: [] });
    setEditingId(null);
  };

  // --- Form Helpers ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "passingScore" ? Number(value) : value,
    }));
  };

  const handleSelectSection = (e: ChangeEvent<HTMLSelectElement>) => {
    const sectionId = e.target.value;

    const sectionObject = availableSections.find((s) => s._id === sectionId);

    if (sectionObject && !form.sections.some((s) => s._id === sectionId)) {
      setForm((prev) => ({
        ...prev,
        sections: [...prev.sections, sectionObject],
      }));
    }
  };

  const removeSection = (sectionId: string) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section._id !== sectionId),
    }));
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen p-10 bg-neutral-900 text-white flex flex-col gap-10">
      <h1 className="text-3xl font-bold border-b border-neutral-700 pb-4 text-sky-500">
        Exam Management
      </h1>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* FORM SECTION */}
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
                {form.sections.map((section) => (
                  <div
                    key={section._id}
                    className="bg-sky-900/40 text-sky-300 border border-sky-700 px-3 py-1 rounded-full text-xs flex items-center gap-2"
                  >
                    {section.title}

                    <button
                      type="button"
                      onClick={() => removeSection(section._id)}
                      className="font-bold hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Target Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {["N5", "N4", "N3", "N2", "N1"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, level: lvl }))
                      }
                      className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${
                        form.level === lvl
                          ? "bg-sky-600 border-sky-400 text-white shadow-lg"
                          : "bg-neutral-800 border-neutral-700 text-neutral-500 hover:border-neutral-500"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                type="submit"
                disabled={!form.level || !form.title}
                className={`py-3 rounded-lg font-bold transition active:scale-95 ${
                  editingId
                    ? "bg-orange-600 hover:bg-orange-500"
                    : "bg-sky-600 hover:bg-sky-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
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

        {/* LIST SECTION */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">All Exams ({exams.length})</h2>
          {exams.length === 0 ? (
            <p className="text-neutral-500 italic">
              No exams found. Create one to get started.
            </p>
          ) : (
            exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-neutral-800 p-5 rounded-xl border border-neutral-700 flex justify-between items-center group hover:border-sky-500/50 transition shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-bold">
                    {exam.title}{" "}
                    <span className="text-sky-500 text-xs ml-2">
                      {exam.level}
                    </span>
                  </h3>
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
