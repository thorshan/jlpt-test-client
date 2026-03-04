import { useEffect, useState } from "react";
import {
  questionApi,
  type Question,
  QuestionModule,
  QuestionCategory,
} from "../api/questionApi";
import axios from "axios";
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
}

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<QuestionForm>({
    refText: "",
    text: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    module: QuestionModule.M1,
    category: QuestionCategory.Vocab,
    point: 1,
    refImage: "",
    refAudio: "",
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await questionApi.getQuestions();
      setQuestions(res.data?.data || []);
    } catch (error) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        console.log(error.status);
        console.error(error.response);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await questionApi.updateQuestion(editingId, form);
        const updatedQuestion = res.data?.data;
        fetchQuestions();

        if (updatedQuestion) {
          setQuestions((prev) =>
            prev.map((q) => (q._id === editingId ? updatedQuestion : q)),
          );
        }
      } else {
        const res = await questionApi.createQuestion(form);
        const newQuestion = res.data?.data;
        fetchQuestions();

        if (newQuestion) {
          setQuestions((prev) => [...prev, newQuestion]);
        }
      }
      resetForm();
    } catch (error) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        console.log(error.status);
        console.error(error.response);
      } else {
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setForm({
      refText: "",
      text: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      module: QuestionModule.M1,
      category: QuestionCategory.Vocab,
      point: 1,
      refImage: "",
      refAudio: "",
    });
    setEditingId(null);
  };

  const handleEdit = (q: Question) => {
    setEditingId(q._id);
    setForm({
      ...q,
      options: [...q.options],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete question?")) {
      try {
        await questionApi.deleteQuestion(id);
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      } catch (error) {
        if (
          axios.isAxiosError<ValidationError, Record<string, unknown>>(error)
        ) {
          console.log(error.status);
          console.error(error.response);
        } else {
          console.error(error);
        }
      }
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen p-8 bg-neutral-900 text-slate-100">
      <h1 className="text-2xl font-bold mb-8 text-amber-500">Question Bank</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* FORM */}
        <section className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 h-fit sticky top-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              className="bg-neutral-900 p-3 rounded border border-neutral-600 outline-none focus:border-amber-500"
              placeholder="Question Text..."
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              required
            />

            <textarea
              className="bg-neutral-900 p-3 rounded border border-neutral-600 outline-none focus:border-amber-500"
              placeholder="Question Paragraph Text Only..."
              value={form.refText}
              onChange={(e) => setForm({ ...form, refText: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              {form.options.map((opt, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <input
                    className={`p-2 rounded border outline-none text-sm bg-neutral-900 ${
                      form.correctOptionIndex === i
                        ? "border-amber-500"
                        : "border-neutral-600"
                    }`}
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...form.options];
                      newOpts[i] = e.target.value;
                      setForm({ ...form, options: newOpts });
                    }}
                    required
                  />
                  <label className="text-[10px] flex items-center gap-1 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="correct"
                      checked={form.correctOptionIndex === i}
                      onChange={() =>
                        setForm({ ...form, correctOptionIndex: i })
                      }
                    />{" "}
                    Correct
                  </label>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                className="bg-neutral-900 p-2 rounded border border-neutral-600 text-sm"
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
                className="bg-neutral-900 p-2 rounded border border-neutral-600 text-sm"
                value={form.module}
                onChange={(e) =>
                  setForm({ ...form, module: e.target.value as QuestionModule })
                }
              >
                {Object.values(QuestionModule).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input
                className="bg-neutral-900 p-2 rounded border border-neutral-600 text-sm"
                type="number"
                value={form.point}
                onChange={(e) =>
                  setForm({ ...form, point: Number(e.target.value) })
                }
              />
              <input
                className="bg-neutral-900 p-2 rounded border border-neutral-600 text-sm"
                placeholder="Image URL"
                value={form.refImage}
                onChange={(e) => setForm({ ...form, refImage: e.target.value })}
              />
              <input
                className="bg-neutral-900 p-2 rounded border border-neutral-600 text-sm"
                placeholder="Audio URL"
                value={form.refAudio}
                onChange={(e) => setForm({ ...form, refAudio: e.target.value })}
              />
            </div>

            <button
              className={`py-3 rounded font-bold transition active:scale-95 ${editingId ? "bg-amber-600" : "bg-sky-600"}`}
            >
              {editingId ? "Update Question" : "Create Question"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs underline text-neutral-400"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        {/* LIST */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold mb-2">
            Current Questions ({questions?.length || 0})
          </h2>
          {questions.map((q) => (
            <div
              key={q._id}
              className="bg-neutral-800 p-4 rounded border border-neutral-700 flex justify-between items-center group hover:border-amber-500/50 transition"
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-[10px] bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded uppercase">
                    {q.category}
                  </span>
                  <span className="text-[10px] bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded">
                    {q.module}
                  </span>
                </div>
                <p className="font-semibold truncate">{q.text}</p>
                <p className="text-xs text-neutral-500">{q.point} Points</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(q)}
                  className="text-sky-400 text-xs font-bold hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="text-red-500 text-xs font-bold hover:underline"
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

export default Questions;
