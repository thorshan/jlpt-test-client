import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collabsApi } from "../api/collabsApi";
import { userApi } from "../api/userApi";
import { useUser } from "../hooks/useUser";

const Collaboration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { loginCollabs, user, updateUser } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("review");
  const [form, setForm] = useState({
    name: "",
    category: "",
    email: "",
    password: "",
  });

  const reviewSection = async () => {
    await userApi.createUser(form);
    await loginCollabs({ email: form.email, password: form.password });
    setStep(3);
  };

  const takeoff = async () => {
    setIsProcessing(true);
    try {
      setStatus("completed");
      await collabsApi.createCollabs(form);
      await userApi.updateRole(user!._id);
      updateUser({ role: "admin" });
    } catch (error) {
      await userApi.clearUser(user!._id);
      console.error(error);
    } finally {
      setIsProcessing(false);
      navigate("/admin");
    }
  };

  useEffect(() => {
    if (status === "completed") {
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 md:p-6 overflow-hidden relative">
      <SEO
        title="Get Started - Join JLPTX"
        description="Join JLPTX and start practicing for your Japanese Language Proficiency Test. Practice N1, N2, N3, N4, and N5 levels."
        canonical="/collabs"
      />
      {/* 1. ANIMATED GRID (Matches Home Page) */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ backgroundPosition: "0px 0px" }}
        animate={{ backgroundPosition: ["0px 0px", "48px 48px"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
          radial-gradient(circle at 1px 1px, rgb(14 165 233 / 0.15) 1px, transparent 0),
          linear-gradient(rgb(30 41 59 / 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgb(30 41 59 / 0.3) 1px, transparent 1px)
        `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* 2. BACKGROUND ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[50%] bg-sky-600/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-900/30 blur-[150px] rounded-full"
        />
      </div>

      {/* CARD CONTENT */}
      <div className="w-full max-w-md bg-sky-950/20 backdrop-blur-2xl border border-sky-500/10 p-6 md:p-10 rounded-[40px] shadow-2xl relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: REGISTRATION - INFO - 1 */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col"
            >
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-sky-500/10 rounded-3xl flex items-center justify-center border border-sky-500/20 mb-6 shadow-2xl shadow-sky-500/10">
                  <img
                    src="/JLPTX.png"
                    alt="Logo"
                    className="w-12 h-12 object-contain brightness-110"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white text-center leading-[1.6]">
                  {t("welcome")}
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <input
                    placeholder={t("collab_name_placeholder")}
                    className="mt-3 w-full bg-black/40 border border-sky-900/50 p-4 rounded-2xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all text-xs text-white placeholder:text-sky-900"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                  {t("select_category")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Language School",
                    "Engineering School",
                    "Consultant",
                    "Non-Profit Organization",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`px-3 py-2 rounded-xl text-[9px] font-black border transition-all ${
                        form.category === cat
                          ? "bg-sky-500 border-sky-400 text-slate-950"
                          : "bg-white/5 border-white/5 text-slate-500"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <button
                    disabled={isProcessing}
                    onClick={() => {
                      setStep(2);
                    }}
                    className="w-full py-5 bg-sky-600 font-black rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(14,165,233,0.3)] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        {t("proceed")} <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: REGISTRATION - INFO - 2 */}
          {step === 2 && (
            <div className="flex flex-col">
              <div className="my-5">
                <h4 className="text-2xl font-black text-center">
                  {t("incharge_info")}
                </h4>
              </div>
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col"
              >
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <input
                      placeholder={t("email")}
                      className="mt-3 w-full bg-black/40 border border-sky-900/50 p-4 rounded-2xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all text-base text-white placeholder:text-sky-900"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      placeholder={t("password")}
                      className="mt-3 w-full bg-black/40 border border-sky-900/50 p-4 rounded-2xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all text-base text-white placeholder:text-sky-900"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                <button
                  disabled={isProcessing}
                  onClick={reviewSection}
                  className="w-full py-5 bg-sky-600 font-black rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(14,165,233,0.3)] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      {t("proceed")} <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          )}

          {/* STEP 3: REGISTRATION - INFO - REVIEW */}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black mb-2 leading-[1.6]">
                  {t("confirm_info")}
                </h2>
                <p className="text-sky-500/60 text-sm leading-[1.6]">
                  {t("confirm_info_desc")}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {Object.entries(form).map(([key, value]) => {
                  return (
                    <div
                      key={key}
                      onClick={() => console.log(form)}
                      className="group w-full p-4 md:p-5 border border-sky-900/40 rounded-2xl font-black flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 disabled:opacity-50 disabled:cursor-not-allowed sm:col-span-1"
                    >
                      <span className="text-[14px] text-sky-500 capitalize">
                        {key}
                      </span>
                      <span className="text-sm capitalize text-white">
                        {value}
                      </span>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center gap-2">
                  <button
                    disabled={isProcessing}
                    onClick={() => setStep(1)}
                    className="mt-6 w-full py-5 font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <ArrowLeft size={20} /> {t("back")}
                      </>
                    )}
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={takeoff}
                    className="mt-6 w-full py-5 bg-sky-600 font-black rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(14,165,233,0.3)] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        {t("proceed")} <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Collaboration;
