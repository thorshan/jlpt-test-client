import { ArrowLeft, Signpost } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import SEO from "../components/SEO";
import PageNode, { type Page } from "../components/PageNode";

const SiteMap = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  //
  const pages = [
    {
      id: 1,
      path: "/",
      text: "Home Page",
      child: [],
      description: "The main landing page for JLPTX.",
      image: "/img/Index.png",
    },
    {
      id: 2,
      text: "Collabs Page",
      description: "The main page for Collabs.",
      image: "/img/Collabs.png",
      child: [
        {
          text: "Collabs",
          path: "/collabs",
          description: "Welcome page for collabs",
          image: "/img/Collabs.png",
        },
        {
          text: "Start New Collab",
          path: "/collabs/get-started",
          description: "Get start page for creating new collab",
          image: "/img/Collab-1.png",
        },
      ],
    },
    {
      id: 3,
      path: "/auth",
      text: "Authentication Page",
      child: [],
      description: "The main page for authentication.",
      image: "/img/Login.png",
    },
    {
      id: 4,
      path: "/user-manual",
      text: "User Manual Page",
      child: [],
      description: "The main page for user manual.",
      image: "/img/Manual.png",
    },
    {
      id: 5,
      text: "User Page",
      description: "The main landing page for JLPTX.",
      image: "/img/Home-page.png",
      child: [
        {
          text: "Dashboard",
          path: "/test",
          description: "Dashboard page for user",
          image: "/img/Home-page.png",
        },
        {
          text: "Profile",
          path: "/test",
          description: "User profile page",
          image: "/img/Profile-1.png",
        },
        {
          text: "Exams",
          path: "/test",
          description: "Exam screen page",
          image: "/img/Q-1.png",
        },
        {
          text: "Results",
          path: "/test",
          description: "Results after finishing an exam",
          image: "/img/Result.png",
        },
        {
          text: "Certifications",
          path: "/test",
          description: "Certificate after finishing an exam",
          image: "/img/Certificate.png",
        },
      ],
    },
    {
      id: 6,
      text: "Legal Page",
      description: "Legal pages (Privacy, Policy, Terms, Conditions).",
      child: [
        {
          text: "Privacy & Policy",
          path: "/legal/privacy",
          description: "Privacy and policy page.",
          image: "/img/Privacy.png",
        },
        {
          text: "Terms & Conditions",
          path: "/legal/terms",
          description: "Terms and conditions page.",
          image: "/img/Terms.png",
        },
      ],
    },
  ];
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 selection:bg-sky-500/30 relative overflow-x-hidden flex flex-col gap-5">
      <SEO
        title="Site map"
        description="Take free Japanese Language Proficiency Test (JLPT) mock exams online. Practice for N1, N2, N3, N4, and N5 with real questions and instant results."
        canonical="/site-map"
      />
      <nav className="bg-sky-950/20 backdrop-blur-md fixed top-0 left-0 w-full z-100 px-5 md:px-15 py-5 border-b border-b-sky-500/10 flex justify-between items-center">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 cursor-pointer hover:text-sky-500 transition-colors"
        >
          <ArrowLeft size={18} className="text-sm text-sky-500" /> {t("back")}
        </div>
        <div className="hidden sm:block text-md text-sky-500 font-black">
          {"Site Map"}
        </div>
        <div>
          <img src="/JLPTX.png" className="w-12 h-12 object-cover" />
        </div>
      </nav>

      <main className="mt-20 flex-1">
        <section>
          <div className="p-10 mb-10 bg-sky-950/20 backdrop-blur-sm rounded flex flex-col items-center gap-5">
            <Signpost size={50} className="text-sky-500" />
            <div className="text-2xl md:text-3xl font-black">Site Map</div>
            <div className="text-sm font-black text-sky-500">
              Last Updated: June 10, 2026
            </div>
            <p>
              Welcome to JLPTX. We will provide a site map to make sure you can
              reach to your destinations.
            </p>
          </div>
        </section>
        <section className="w-full mx-auto">
          {pages.map((page) => (
            <PageNode key={page.id} page={page as unknown as Page} />
          ))}
        </section>
        <div className="text-center my-10 text-4xl text-sky-600/30">•</div>
        <footer>
          <div className="text-center text-xs text-slate-400">&copy; JLPTX</div>
        </footer>
      </main>
    </div>
  );
};

export default SiteMap;
