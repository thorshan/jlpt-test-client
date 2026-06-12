import { ArrowLeft, Signpost } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import SEO from "../components/SEO";
import { AnimatePresence, motion } from "framer-motion";

const SiteMap = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        <section>
          <div className="w-full flex flex-col items-center justify-center">
            <AnimatePresence>
              <div className="flex gap-5 w-full max-w-fit">
                <div className="w-1/2">
                  <div>
                    <h1>Registrations</h1>
                    <h5>Registrations - 1</h5>
                    <h5>Registrations - 2</h5>
                    <h5>Registrations - 3</h5>
                  </div>
                </div>
                <motion.img
                  src="/img/Register-1.png"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  className="object-fit w-1/2 rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
              </div>
              <div className="flex items-center gap-5 w-full max-w-fit">
                <motion.img
                  src="/img/Register-2.png"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  className="object-fit w-1/2 rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
                <motion.img
                  src="/img/Register-3.png"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  className="object-fit w-1/2 rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
              </div>
            </AnimatePresence>
          </div>
          <div className="text-center my-10 text-4xl text-sky-600/30">•</div>
          <footer>
            <div className="text-center text-xs text-slate-400">
              &copy; JLPTX
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default SiteMap;
