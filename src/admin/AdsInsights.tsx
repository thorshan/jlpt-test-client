import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  MousePointer2,
  Eye,
  FileSpreadsheet,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";

import { adApi, type Ad } from "../api/adApi";
import { LoadingScreen } from "../components/LoadingScreen";

const AdsInsights: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adApi.getAllAds();
      setAds(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalImpressions = ads.reduce((acc, ad) => acc + (ad.impressions || 0), 0);
  const totalClicks = ads.reduce((acc, ad) => acc + (ad.clicks || 0), 0);
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const estRevenue = totalClicks * 0.5; // Dummy calculation for revenue

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (ads.length === 0) return;
    const headers = "Campaign,Impressions,Clicks,CTR,Status,ExpiresAt";
    const rows = ads
      .map(
        (ad) =>
          `${ad.title},${ad.impressions},${ad.clicks},${((ad.clicks / ad.impressions || 0) * 100).toFixed(2)}%,${ad.status},${new Date(ad.expiresAt).toLocaleDateString()}`,
      )
      .join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ads_insights.csv";
    a.click();
  };

  if (loading) return <LoadingScreen />;

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
            val: totalImpressions.toLocaleString(),
            icon: Eye,
            color: "text-sky-500",
          },
          {
            label: "Total Clicks",
            val: totalClicks.toLocaleString(),
            icon: MousePointer2,
            color: "text-emerald-500",
          },
          {
            label: "Avg. CTR",
            val: `${avgCtr.toFixed(2)}%`,
            icon: TrendingUp,
            color: "text-amber-500",
          },
          {
            label: "Est. Revenue",
            val: `$${estRevenue.toFixed(2)}`,
            icon: TrendingUp, // Changed from Users to TrendingUp
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
                LIVE
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
            <button
               onClick={fetchData}
               className="px-3 py-1 bg-white/5 text-sky-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all font-bold"
            >
              Refresh Data
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {ads.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-500 gap-4">
               <AlertCircle size={48} className="opacity-20" />
               <p className="font-black uppercase tracking-widest text-xs">No active campaigns found</p>
            </div>
          ) : (
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
                {ads.map((ad) => {
                  const adCtr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;
                  const adRevenue = ad.clicks * 0.5;
                  return (
                    <tr
                      key={ad._id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-8 py-5 text-white group-hover:text-sky-400 transition-colors">
                        {ad.title}
                      </td>
                      <td className="px-8 py-5 text-center text-slate-400">
                        {ad.impressions.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-center text-slate-400">
                        {ad.clicks.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-center text-emerald-500">
                        {adCtr.toFixed(2)}%
                      </td>
                      <td className="px-8 py-5 text-right text-white">
                        ${adRevenue.toFixed(2)}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ad.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}
                        >
                          {ad.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdsInsights;
