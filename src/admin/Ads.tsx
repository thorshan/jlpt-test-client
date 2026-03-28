import React, { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Trash2,
  AlertTriangle,
  Megaphone,
  Calendar,
  Image as ImageIcon,
  Save,
  Loader2,
} from "lucide-react";

import { adApi, type Ad } from "../api/adApi";
import { LoadingScreen } from "../components/LoadingScreen";

const Ads: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    duration: 1,
    image: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adApi.getAllAds();
      setAds(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      alert("Please provide an image URL");
      return;
    }

    setSubmitting(true);
    try {
      const res = await adApi.createAd(form);
      setAds((prev) => [res.data.data, ...prev]);
      resetForm();
    } catch (error) {
      console.error("Error creating ad:", error);
      alert("Failed to create ad");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", content: "", duration: 1, image: "" });
  };

  const openDeleteModal = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await adApi.deleteAd(itemToDelete);
        setAds((prev) => prev.filter((ad) => ad._id !== itemToDelete));
      } catch (error) {
        console.error("Error deleting ad:", error);
      } finally {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col font-sans overflow-hidden text-[13px]">
      <main className="relative z-10 p-6 md:p-12 max-w-5xl mx-auto w-full h-full flex flex-col overflow-hidden">
        <header className="mb-8 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter italic flex items-center gap-4 text-white uppercase">
              <Megaphone className="text-sky-500" size={32} />
              Promotions
            </h1>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2">
              Ad Management System
            </p>
          </motion.div>
        </header>

        <div className="flex flex-col gap-12 flex-1 overflow-y-auto pr-4 custom-scrollbar pb-20">
          {/* CREATE AD FORM */}
          <section className="w-full shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 mb-6 shrink-0 flex items-center gap-2">
                <PlusCircle size={14} />
                Create New Promotion
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                        Campaign Title
                      </label>
                      <input
                        className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500 transition-all font-bold"
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        placeholder="e.g., Summer JPLT Prep Course"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                        Ad Content
                      </label>
                      <textarea
                        className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500 transition-all font-medium text-slate-300 min-h-[100px] resize-none"
                        value={form.content}
                        onChange={(e) =>
                          setForm({ ...form, content: e.target.value })
                        }
                        placeholder="Main message of the advertisement..."
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                        Duration (Months)
                      </label>
                      <div className="flex gap-2">
                        {[1, 3, 6, 12].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setForm({ ...form, duration: m })}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${
                              form.duration === m
                                ? "bg-white text-slate-950"
                                : "bg-white/5 border-white/5 text-slate-500"
                            }`}
                          >
                            {m}M
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* IMAGE URL INPUT */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                        Supabase Image URL
                      </label>
                      <input
                        className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 outline-none focus:border-sky-500 transition-all font-bold"
                        value={form.image}
                        onChange={(e) =>
                          setForm({ ...form, image: e.target.value })
                        }
                        placeholder="https://your-project.supabase.co/storage/v1/object/public/..."
                        required
                      />
                    </div>

                    <div className="relative h-[180px] bg-slate-950/50 border-2 border-dashed border-white/5 rounded-[2rem] overflow-hidden group hover:border-sky-500/50 transition-all">
                      {form.image ? (
                        <div className="absolute inset-0">
                          <img
                            src={form.image}
                            alt="Preview"
                            className="w-full h-full object-cover opacity-60"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <ImageIcon size={32} className="text-slate-700 mb-2" />
                          <span className="text-[10px] font-black uppercase text-slate-600">
                            URL Preview
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-sky-500 text-slate-950 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Launch Promotion
                  </button>
                </div>
              </form>
            </motion.div>
          </section>

          {/* LIST SECTION */}
          <section className="w-full">
            <div className="shrink-0 mb-8 flex justify-between items-end px-2">
              <div>
                <h2 className="text-xl font-black italic uppercase">
                  Active Promotions
                </h2>
                <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">
                  Live Campaigns: {ads.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {ads.map((ad) => (
                  <motion.div
                    layout
                    key={ad._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/5 border border-white/5 backdrop-blur-md rounded-[2.5rem] overflow-hidden group hover:bg-sky-500/[0.03] transition-all flex flex-col"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x200?text=Image+Not+Found";
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                        <Calendar size={12} className="text-sky-400" />
                        <span className="text-[9px] font-black uppercase text-slate-300">
                          {new Date(ad.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-black text-lg truncate uppercase italic group-hover:text-sky-400 transition-colors mb-2">
                        {ad.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-4">
                        {ad.content}
                      </p>
                      <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {ad.duration} Month Duration
                        </span>
                        <button
                          onClick={() => openDeleteModal(ad._id)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-slate-950 rounded-xl transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0f172a] border border-white/10 p-8 rounded-[3rem] max-w-sm w-full shadow-3xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black italic uppercase mb-2">
                Terminate Campaign
              </h3>
              <p className="text-xs text-slate-400 mb-8 font-medium">
                This action is permanent and will immediately remove the promotion from the user system.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-500 text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-2xl"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-4 bg-white/5 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl"
                >
                  Abort
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14, 165, 233, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Ads;
