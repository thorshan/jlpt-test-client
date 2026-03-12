import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, User, ChevronRight, Zap } from "lucide-react";
import { useUser } from "../hooks/useUser";
import axios from "axios";

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

const Login = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ name, token });

      navigate("/admin");
    } catch (error) {
      if (axios.isAxiosError<ValidationError>(error)) {
        console.error("API Error:", error.response);
        setError(error.response?.data?.message || "Authentication failed.");
      }
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl relative">
          {/* Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 mb-4 border border-sky-500/20 shadow-lg shadow-sky-500/10">
              <Zap size={28} className="animate-pulse" />
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Terminal <span className="text-sky-500">Access</span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                Identifier (Name)
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors"
                  size={18}
                />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all"
                  placeholder="Your Name ..."
                />
              </div>
            </div>

            {/* Token Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                Access Key
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors"
                  size={18}
                />
                <input
                  type="Access Token"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest bg-red-500/10 py-2 rounded-lg border border-red-500/20"
              >
                {error}
              </motion.p>
            )}

            <button
              disabled={loading}
              className="w-full py-4 bg-sky-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-95 shadow-lg shadow-sky-500/20"
            >
              {loading ? "Decrypting..." : "Login"} <ChevronRight size={16} />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-600 text-[12px] font-black">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
