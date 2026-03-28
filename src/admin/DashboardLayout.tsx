import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  HelpCircle,
  User as UserIcon,
  LogOut,
  Award,
  AlertTriangle,
  MessageSquare,
  Activity,
  BarChart3,
  Megaphone,
} from "lucide-react";

import { useUser } from "../hooks/useUser";

const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isSuperAdmin = user?.role === "s-admin";

  const navItems = [
    {
      name: "Overview",
      path: "/admin",
      icon: <LayoutDashboard size={18} />,
      visible: true,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <UserIcon size={18} />,
      visible: isSuperAdmin ? true : false,
    },
    {
      name: "Results",
      path: "/admin/results",
      icon: <Award size={18} />,
      visible: true,
    },
    {
      name: "Exams",
      path: "/admin/exams",
      icon: <BookOpen size={18} />,
      visible: true,
    },
    {
      name: "Sections",
      path: "/admin/sections",
      icon: <Layers size={18} />,
      visible: true,
    },
    {
      name: "Questions",
      path: "/admin/questions",
      icon: <HelpCircle size={18} />,
      visible: true,
    },
    {
      name: "Requests",
      path: "/admin/requests",
      icon: <MessageSquare size={18} />,
      visible: isSuperAdmin ? true : false,
    },
    {
      name: "Activity Logs",
      path: "/admin/logs",
      icon: <Activity size={18} />,
      visible: isSuperAdmin ? true : false,
    },
    {
      name: "Ads Insights",
      path: "/admin/ads-insights",
      icon: <BarChart3 size={18} />,
      visible: isSuperAdmin ? true : false,
    },
    {
      name: "Promotions",
      path: "/admin/ads",
      icon: <Megaphone size={18} />,
      visible: isSuperAdmin ? true : false,
    },

  ];


  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
      {/* --- LOGOUT CONFIRMATION DIALOG --- */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white italic">
                    Terminate Session?
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Are you sure you want to log out of the admin dashboard?
                  </p>
                </div>
                <div className="flex w-full gap-3 mt-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-black uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          {navItems
            .filter((nav) => nav.visible === true)
            .map((item) => {
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

              {/* Logout Button triggers the dialog instead of direct logout */}
              <button
                type="button"
                title="Terminate Session"
                className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-all text-slate-500 hover:text-red-400"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
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
