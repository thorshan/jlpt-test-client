import { useEffect, useState } from "react";
import { requestApi, type RequestData } from "../api/requestApi";
import { LoadingScreen } from "../components/LoadingScreen";
import { MailCheck } from "lucide-react";

const Requests = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await requestApi.getRequests();
      setRequests(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, status: string) => {
    try {
      await requestApi.updateRequest(id, { status });
      setRequests(reqs => reqs.map(r => r._id === id ? { ...r, status } : r));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Certificate Requests</h2>
      </div>
      
      <div className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-sky-500/10 text-sky-400 text-[10px] uppercase font-black tracking-widest border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Result ID</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm font-medium">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-sky-300">{req.resultId}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-300">
                  <a href={`mailto:${req.email}`} className="hover:text-sky-400 transition-colors">{req.email}</a>
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    req.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  {req.status === "PENDING" && (
                    <button 
                      onClick={() => handleUpdate(req._id, "SENT")} 
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-lg active:scale-95 text-[10px] font-black uppercase tracking-widest"
                    >
                      <MailCheck size={14} />
                      Mark as Sent
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-bold">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Requests;
