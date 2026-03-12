import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  HelpCircle,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { useUser } from "../hooks/useUser";

const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Overview", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Users", path: "/admin/users", icon: <UserIcon size={18} /> },
    { name: "Exams", path: "/admin/exams", icon: <BookOpen size={18} /> },
    { name: "Sections", path: "/admin/sections", icon: <Layers size={18} /> },
    {
      name: "Questions",
      path: "/admin/questions",
      icon: <HelpCircle size={18} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 border-r border-white/5 bg-slate-950/50 backdrop-blur-3xl hidden md:flex flex-col relative z-20">
        {/* LOGO SECTION */}
        <div className="p-8 mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center"
          >
            <img
              src="/JLPTX.png"
              alt="JLPTX Logo"
              className="h-25 w-auto object-contain brightness-110 contrast-125 drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            />
          </motion.div>
        </div>

        {/* NAVIGATION AREA */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[inset_0_0_20px_rgba(14,165,233,0.05)]"
                    : "hover:bg-white/5 text-slate-500 hover:text-slate-200 border border-transparent"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-sky-500/5 blur-md rounded-2xl"
                  />
                )}
                <span
                  className={`${isActive ? "text-sky-400" : "group-hover:text-sky-400 transition-colors"}`}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest italic">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* --- USER SECTION (BOTTOM) --- */}
        <div className="p-6 mt-auto border-t border-white/5 bg-white/[0.01]">
          <div className="flex flex-col gap-4">
            {/* User Profile Card */}
            <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
              <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/20 italic">
                {user?.name[0].toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-tight truncate text-white">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[9px] font-black text-sky-500 uppercase tracking-widest opacity-70">
                  {user?.role || "ROLE"}
                </p>
              </div>

              {/* Logout Button integrated into card */}
              <button
                title="Terminate Session"
                className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-all text-slate-500 hover:text-red-400"
                onClick={handleLogout}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Subtle Background Glow for Main Area */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        {/* Content Section */}
        <section className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14, 165, 233, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(14, 165, 233, 0.3); }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
