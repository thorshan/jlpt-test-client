import { useEffect, useState } from "react";
import { examApi } from "../api/examApi";
import { sectionApi } from "../api/sectionApi";
import { questionApi } from "../api/questionApi";
import axios from "axios";

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

const Dashboard = () => {
  const [stats, setStats] = useState({ exams: 0, sections: 0, questions: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [e, s, q] = await Promise.all([
          examApi.getExams(),
          sectionApi.getSections(),
          questionApi.getQuestions(),
        ]);
        setStats({
          exams: e.data.data.length,
          sections: s.data.data.length,
          questions: q.data.data.length,
        });
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
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Exams",
      value: stats.exams,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
    },
    {
      label: "Total Sections",
      value: stats.sections,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Questions",
      value: stats.questions,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-8">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 flex flex-col gap-2"
          >
            <span className="text-neutral-400 text-sm font-medium">
              {card.label}
            </span>
            <span className={`text-4xl font-black ${card.color}`}>
              {card.value}
            </span>
            <div className={`h-1 w-full mt-4 rounded-full ${card.bg}`}>
              <div
                className={`h-full rounded-full bg-current ${card.color}`}
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-neutral-900/50 border border-dashed border-neutral-800 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold text-neutral-400">
          Welcome to the Admin Engine
        </h3>
        <p className="text-neutral-600 max-w-md mt-2">
          Select a category from the sidebar to manage your test content, assign
          sections to exams, or update question banks.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
