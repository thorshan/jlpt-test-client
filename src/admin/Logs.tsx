import { useEffect, useState } from "react";
import { activityApi, type ActivityLog } from "../api/activityApi";
import { LoadingScreen } from "../components/LoadingScreen";
import { History, User as UserIcon, Clock, Terminal } from "lucide-react";

const Logs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await activityApi.getLogs();
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 text-left">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic flex items-center gap-3">
            <History className="text-sky-500" size={32} />
            System Activity logs
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1">
            Historical record of administrative and user actions
          </p>
        </div>
        <button 
          onClick={fetchLogs}
          className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/5 active:scale-95"
          title="Refresh Logs"
        >
          <Clock size={20} />
        </button>
      </div>
      
      <div className="space-y-4">
        {logs.map((log) => (
          <div 
            key={log._id} 
            className="group relative bg-white/5 border border-white/5 hover:border-sky-500/20 p-6 rounded-[2rem] transition-all overflow-hidden backdrop-blur-md"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 transition-opacity group-hover:opacity-10 ${
              log.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'
            }`} />

            <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
              {/* Status Indicator */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
              }`}>
                <Terminal size={24} />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
                    {log.action}
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <Clock size={12} />
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-300 font-medium leading-relaxed">{log.message}</p>
              </div>

              {/* User Metadata */}
              <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-2xl border border-white/5 self-start md:self-center">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sky-300">
                  <UserIcon size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Performed By</p>
                  <p className="text-xs text-white font-bold tracking-wide">{log.user}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="bg-white/5 border border-dashed border-white/10 p-20 rounded-[3rem] text-center">
            <p className="text-slate-500 font-black uppercase tracking-widest">No activity logs found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
