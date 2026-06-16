import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.5, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const Soon = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30 relative overflow-x-hidden flex flex-col">
      <div className="absolute inset-0 bg-[url('/BG.jpeg')] bg-cover -left-50 md:left-0 bg-left md:bg-center bg-no-repeat opacity-60">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 mt-20 flex-1 flex flex-col items-center p-6">
        <section className="flex justify-center items-center w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative group w-full max-w-lg"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

            {/* Glassmorphism Card */}
            <motion.div
              variants={itemVariants}
              className="relative p-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl flex flex-col items-center gap-6"
            >
              <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-200 tracking-tight leading-relaxed">
                Coming Soon
              </h2>
              <p className="text-sky-100/70 text-center font-medium">
                We are crafting something extraordinary. Stay tuned for the
                launch.
              </p>

              {/* Subtle accent line */}
              <Link
                to={"/"}
                className=" bg-sky-400/50 rounded mt-5 py-2 px-5 hover:bg-sky-500 transition-colors cursor-pointer"
              >
                Back
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <div className="text-center my-10 text-4xl text-sky-600/30">•</div>

        <footer className="mt-auto py-6">
          <div className="text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} JLPTX
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Soon;
