import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Layers,
  HelpCircle,
  Zap,
  Users as UsersIcon,
  Activity as ActivityIcon,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { examApi } from "../api/examApi";
import { sectionApi } from "../api/sectionApi";
import { questionApi } from "../api/questionApi";
import { userApi } from "../api/userApi";
import { LoadingScreen } from "../components/LoadingScreen";
import { activityApi } from "../api/activityApi";

// Interface for Audit Logs
interface IActivity {
  _id: string;
  action: string;
  user: string;
  message: string;
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    exams: 0,
    sections: 0,
    questions: 0,
    users: 0,
  });
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<
    "online" | "offline" | "checking"
  >("checking");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [e, s, q, u, a] = await Promise.all([
          examApi.getExams(),
          sectionApi.getSections(),
          questionApi.getQuestions(),
          userApi.getAllUsers(),
          activityApi.getRecent(),
        ]);

        setStats({
          exams: e.data?.data?.length || 0,
          sections: s.data?.data?.length || 0,
          questions: q.data?.data?.length || 0,
          users: u.data?.data?.length || 0,
        });

        setActivities(a.data.data);

        setSystemStatus("online");
      } catch (err) {
        console.error("Sync Error:", err);
        setSystemStatus("offline");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: <UsersIcon size={20} />,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      desc: "Registered Users",
    },
    {
      label: "Total Exams",
      value: stats.exams,
      icon: <FileText size={20} />,
      color: "text-sky-400",
      border: "border-sky-500/20",
      desc: "Exams",
    },
    {
      label: "Total Sections",
      value: stats.sections,
      icon: <Layers size={20} />,
      color: "text-purple-400",
      border: "border-purple-500/20",
      desc: "Sections",
    },
    {
      label: "Total Questions",
      value: stats.questions,
      icon: <HelpCircle size={20} />,
      color: "text-amber-400",
      border: "border-amber-500/20",
      desc: "Questions",
    },
  ];

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans relative overflow-hidden">
      {/* --- BG DECORATION --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-sky-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* --- HEADER --- */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-sky-500 mb-2">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                Admin Terminal
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic uppercase text-white">
              System <span className="text-sky-500">Overview</span>
            </h1>
          </motion.div>

          <motion.div className="hidden md:flex items-center gap-6 px-6 py-3 bg-white/5 border border-white/5 backdrop-blur-xl rounded-2xl">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                Database Sync
              </p>
              <p
                className={`text-xs font-bold ${systemStatus === "online" ? "text-sky-400" : "text-red-500"}`}
              >
                {systemStatus === "online"
                  ? "100% OPERATIONAL"
                  : "SYNC FAILURE"}
              </p>
            </div>
            <Zap
              size={20}
              className={
                systemStatus === "online"
                  ? "text-sky-500 animate-pulse"
                  : "text-slate-700"
              }
            />
          </motion.div>
        </header>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white/5 border ${card.border} backdrop-blur-2xl p-6 rounded-[2.5rem] relative overflow-hidden group hover:bg-white/10 transition-all`}
            >
              <div
                className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity ${card.color}`}
              >
                {card.icon}
              </div>
              <div className="relative z-10">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  {card.label}
                </span>
                <p
                  className={`text-5xl font-black tracking-tighter italic ${card.color}`}
                >
                  {card.value}
                </p>
                <p className="text-slate-600 text-[9px] font-bold uppercase mt-2 italic">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- AUDIT LOGS SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/5 backdrop-blur-md rounded-[3rem] p-8 md:p-12 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 border border-sky-500/20">
                <ActivityIcon size={24} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                  System <span className="text-sky-500"> Logs</span>
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Real-time Activity
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {activities.map((log) => (
              <div
                key={log._id}
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-sky-500/5 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-2 h-2 rounded-full ${log.action.includes("USER") ? "bg-emerald-500" : "bg-sky-500"} shadow-[0_0_10px_rgba(14,165,233,0.3)]`}
                  />
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-200">
                        {`[ ${log.user} ] : `}
                      </span>
                      <p className="text-xs font-bold text-slate-200">
                        {log.message}
                      </p>
                    </div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[9px] font-black text-sky-500/50 uppercase tracking-widest">
                        {log.action}
                      </span>
                      <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">
                        {log.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-mono text-[10px] font-bold">
                  <Clock size={12} />
                  {new Date(log.createdAt).toLocaleTimeString([], {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14, 165, 233, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboard;
