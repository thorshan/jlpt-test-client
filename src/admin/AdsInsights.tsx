import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  MousePointer2,
  Eye,
  FileSpreadsheet,
  FileText,
  Calendar,
} from "lucide-react";

const AD_DATA = [
  {
    id: 1,
    campaign: "Kanji Master Premium",
    impressions: 12450,
    clicks: 850,
    ctr: "6.8%",
    revenue: "$425.00",
    status: "Active",
  },
  {
    id: 2,
    campaign: "JLPT N2 Mock Series",
    impressions: 8900,
    clicks: 620,
    ctr: "7.0%",
    revenue: "$310.00",
    status: "Paused",
  },
  {
    id: 3,
    campaign: "Grammar Intensive",
    impressions: 15600,
    clicks: 1100,
    ctr: "7.1%",
    revenue: "$550.00",
    status: "Active",
  },
  {
    id: 4,
    campaign: "Listening Pro Pack",
    impressions: 4200,
    clicks: 210,
    ctr: "5.0%",
    revenue: "$105.00",
    status: "Active",
  },
];

const AdsInsights: React.FC = () => {
  const [data] = useState(AD_DATA);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    // Basic CSV export logic
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ads_insights.csv";
    a.click();
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-3xl shadow-2xl">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <TrendingUp size={32} className="text-emerald-500" />
            Ads Performance Insights
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            Real-time Metrics & Analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl text-xs font-black uppercase border border-white/10 transition-all"
          >
            <FileText size={16} /> Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-emerald-500 text-slate-950 px-5 py-3 rounded-xl text-xs font-black uppercase shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <FileSpreadsheet size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Impressions",
            val: "41,150",
            icon: Eye,
            color: "text-sky-500",
          },
          {
            label: "Total Clicks",
            val: "2,780",
            icon: MousePointer2,
            color: "text-emerald-500",
          },
          {
            label: "Avg. CTR",
            val: "6.7%",
            icon: TrendingUp,
            color: "text-amber-500",
          },
          {
            label: "Est. Revenue",
            val: "$1,390.00",
            icon: Users,
            color: "text-purple-500",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/5 p-6 rounded-[2rem] backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}
              >
                <s.icon size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-600 bg-white/5 px-2 py-1 rounded">
                +12% vs LY
              </span>
            </div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">
              {s.label}
            </p>
            <h2 className="text-2xl font-black text-white">{s.val}</h2>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-sky-500 flex items-center gap-2">
            <Calendar size={14} /> Campaign Breakdown
          </h3>
          <div className="flex gap-2">
            {["Day", "Week", "Month", "Year"].map((t) => (
              <button
                key={t}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${t === "Month" ? "bg-sky-500 text-slate-950" : "bg-white/5 text-slate-500 hover:text-white"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black uppercase text-slate-500 bg-white/5 tracking-widest">
              <tr>
                <th className="px-8 py-5">Campaign Name</th>
                <th className="px-8 py-5 text-center">Impressions</th>
                <th className="px-8 py-5 text-center">Clicks</th>
                <th className="px-8 py-5 text-center">CTR</th>
                <th className="px-8 py-5 text-right">Revenue</th>
                <th className="px-8 py-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold divide-y divide-white/5">
              {data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-5 text-white group-hover:text-sky-400 transition-colors">
                    {row.campaign}
                  </td>
                  <td className="px-8 py-5 text-center text-slate-400">
                    {row.impressions.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-center text-slate-400">
                    {row.clicks.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-center text-emerald-500">
                    {row.ctr}
                  </td>
                  <td className="px-8 py-5 text-right text-white">
                    {row.revenue}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdsInsights;
