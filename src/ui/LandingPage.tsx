import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { userApi } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { useUser } from "../hooks/useUser";

const LandingPage = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [copied, setCopied] = useState(false);

  const { login, user, updateUser } = useUser();
  const navigate = useNavigate();

  const generateToken = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const nums = "123456789";
    let res = "";
    for (let i = 0; i < 3; i++)
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i = 0; i < 3; i++)
      res += nums.charAt(Math.floor(Math.random() * nums.length));
    setGeneratedToken(res);
  };

  const handleCreateUser = async () => {
    if (!name || !generatedToken) return;
    try {
      const res = await userApi.createUser(name, generatedToken);
      login(res.data.data);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyToken = () => {
    if (inputToken.toUpperCase() === generatedToken) setStep(3);
    else alert("Token mismatch!");
  };

  const selectLevel = async (lvl: string) => {
    try {
      await userApi.updateUser(user!._id!, lvl);
      updateUser({ level: lvl });
      navigate("/test");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 md:p-6 overflow-x-hidden">
      {/* BACKGROUND ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-sky-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 p-6 md:p-10 rounded-[32px] shadow-2xl relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: REGISTRATION */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col"
            >
              <div className="flex flex-col items-center mb-8">
                <img
                  src="/JLPTX.png"
                  alt="Logo"
                  className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(14,165,233,0.3)] mb-6"
                />
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  {t("welcome")}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">
                    {t("name_label")}
                  </label>
                  <input
                    placeholder={t("name_placeholder")}
                    className="w-full bg-black border border-neutral-800 p-4 rounded-2xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {!generatedToken ? (
                  <button
                    disabled={!name}
                    onClick={generateToken}
                    className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-neutral-200 transition-transform active:scale-[0.98] disabled:opacity-50"
                  >
                    {t("generate_token")}
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="w-full flex items-center justify-between bg-black p-5 rounded-2xl border-2 border-dashed border-sky-500/30">
                      <span className="text-2xl font-mono font-black tracking-[0.3em] text-sky-400">
                        {generatedToken}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedToken);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-2 bg-neutral-800 rounded-lg text-neutral-400 active:bg-neutral-700"
                      >
                        {copied ? (
                          <Check className="text-green-500" size={20} />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={handleCreateUser}
                      className="w-full py-5 bg-sky-600 font-black rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(14,165,233,0.2)] active:scale-[0.98] transition-transform"
                    >
                      {t("proceed")} <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: VERIFICATION */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center mb-6 text-sky-500">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2">{t("verify_token")}</h2>
              <p className="text-neutral-500 text-sm mb-8 px-4 leading-relaxed">
                {t("verify_desc")}
              </p>

              <input
                autoFocus
                autoComplete="off"
                placeholder="--- ---"
                className="w-full bg-black border border-neutral-800 p-5 rounded-2xl mb-6 text-center font-mono text-3xl font-black tracking-[0.4em] uppercase text-sky-400 outline-none focus:border-sky-500"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
              />

              <button
                disabled={inputToken.length < 6}
                onClick={verifyToken}
                className="w-full py-5 bg-sky-600 font-black rounded-2xl shadow-[0_10px_30px_rgba(14,165,233,0.2)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {t("verify_btn")}
              </button>
            </motion.div>
          )}

          {/* STEP 3: LEVEL SELECTION */}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black mb-2">
                  {t("select_level")}
                </h2>
                <p className="text-neutral-500 text-sm">{t("level_ask")}</p>
              </div>

              {/* Mobile Friendly Grid: 2 columns on mobile, 1 on larger */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                {["N1", "N2", "N3", "N4", "N5"].map((lvl, index) => (
                  <button
                    key={lvl}
                    onClick={() => selectLevel(lvl)}
                    className={`group w-full p-4 md:p-5 bg-neutral-800/50 border border-neutral-800 rounded-2xl font-black text-lg transition-all active:scale-[0.96] hover:bg-sky-600 hover:border-sky-400 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 ${
                      index === 4 ? "col-span-2 sm:col-span-1" : ""
                    }`}
                  >
                    <span className="text-sky-500 group-hover:text-white transition-colors">
                      {lvl}
                    </span>
                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-500 group-hover:text-sky-100 opacity-60">
                      {t("proficiency")}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPage;
