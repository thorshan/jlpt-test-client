import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Layers, HelpCircle } from "lucide-react";

const DashboardLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: "Overview", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Exams", path: "/admin/exams", icon: <BookOpen size={20} /> },
    { name: "Sections", path: "/admin/sections", icon: <Layers size={20} /> },
    {
      name: "Questions",
      path: "/admin/questions",
      icon: <HelpCircle size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-amber-500 tracking-tight">
            Admin Panel
          </h1>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === item.path
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  : "hover:bg-neutral-800 text-slate-400"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-8 bg-neutral-900/30">
          <div className="text-sm text-neutral-500">
            Path: <span className="text-neutral-300">{location.pathname}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-neutral-900 font-bold">
              A
            </div>
          </div>
        </header>

        {/* This is where Exams, Sections, and Questions pages will appear */}
        <section className="flex-1 overflow-y-auto bg-neutral-950">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
