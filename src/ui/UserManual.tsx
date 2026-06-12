import { ArrowLeft, Signpost } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import SEO from "../components/SEO";
import { AnimatePresence, motion } from "framer-motion";

const UserManual = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 selection:bg-sky-500/30 relative overflow-x-hidden flex flex-col gap-5">
      <SEO
        title="User Manual"
        description="Take free Japanese Language Proficiency Test (JLPT) mock exams online. Practice for N1, N2, N3, N4, and N5 with real questions and instant results."
        canonical="/user-manual"
      />
      <nav className="bg-sky-950/20 backdrop-blur-md fixed top-0 left-0 w-full z-100 px-5 md:px-15 py-5 border-b border-b-sky-500/10 flex justify-between items-center">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 cursor-pointer hover:text-sky-500 transition-colors"
        >
          <ArrowLeft size={18} className="text-sm text-sky-500" /> {t("back")}
        </div>
        <div className="hidden sm:block text-md text-sky-500 font-black">
          {"User Manual"}
        </div>
        <div>
          <img src="/JLPTX.png" className="w-12 h-12 object-cover" />
        </div>
      </nav>

      <main className="mt-20 flex-1">
        <section>
          <div className="p-10 mb-10 bg-sky-950/20 backdrop-blur-sm rounded flex flex-col items-center gap-5">
            <Signpost size={50} className="text-sky-500" />
            <div className="text-2xl md:text-3xl font-black">User Manual</div>
            <div className="text-sm font-black text-sky-500">
              Last Updated: June 10, 2026
            </div>
            <p>
              Welcome to JLPTX. We will provide a manual of how to use JLPTX
              site and how things work.
            </p>
          </div>
        </section>
        <section>
          <div className="w-full flex flex-col items-center justify-center">
            <AnimatePresence>
              <div className="flex flex-col md:flex-row gap-5 md:w-full">
                <div className="w-full md:w-1/2 md:mb-5">
                  <div>
                    <h1 className="text-3xl text-sky-500 font-black mb-2">
                      {t("registration")}
                    </h1>
                    <div className="hidden md:flex flex-col">
                      <div className="bg-sky-900/5 rounded-2xl p-3 my-1.5 border border-slate-700/50">
                        <h5 className="text-xl mb-1.5">{t("process")} - 1</h5>
                        <p className="text-sm leading-relaxed">
                          {t("proc_1_txt")}
                        </p>
                      </div>
                      <div className="bg-sky-900/5 rounded-2xl p-3 my-1.5 border border-slate-700/50">
                        <h5 className="text-xl mb-1.5">{t("process")} - 2</h5>
                        <p className="text-sm leading-relaxed">
                          {t("proc_2_txt")}
                        </p>
                      </div>
                      <div className="bg-sky-900/5 rounded-2xl p-3 my-1.5 border border-slate-700/50">
                        <h5 className="text-xl mb-1.5">{t("process")} - 3</h5>
                        <p className="text-sm leading-relaxed">
                          {t("proc_3_txt")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.img
                  src="/img/Register-1.png"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  className="object-fit w-full md:w-1/2 rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
                <div className="md:hidden flex mb-5">
                  <div className="flex-col">
                    <div className="">
                      <h5 className="text-xl mb-1.5">{t("process")} - 1</h5>
                      <p className="text-sm leading-relaxed">
                        {t("proc_1_txt")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-5 md:w-full">
                <motion.img
                  src="/img/Register-2.png"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  className="object-fit w-full md:w-1/2 rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
                <div className="md:hidden flex mb-5">
                  <div className="flex-col">
                    <div className="">
                      <h5 className="text-xl mb-1.5">{t("process")} - 2</h5>
                      <p className="text-sm leading-relaxed">
                        {t("proc_2_txt")}
                      </p>
                    </div>
                  </div>
                </div>
                <motion.img
                  src="/img/Register-3.png"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  className="object-fit w-full md:w-1/2 rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
                <div className="md:hidden flex mb-5">
                  <div className="flex-col">
                    <div className="">
                      <h5 className="text-xl mb-1.5">{t("process")} - 3</h5>
                      <p className="text-sm leading-relaxed">
                        {t("proc_3_txt")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/**/}
              <div className="flex flex-col gap-5 md:w-full">
                <h1 className="text-3xl text-sky-500 font-black">
                  {t("level_select")}
                </h1>
                <div className="flex flex-col md:flex-col-reverse">
                  <motion.img
                    src="/img/level-select.png"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                    className="object-fit w-full rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                      maskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    }}
                  />
                  <div className="mb-5">
                    <div className="flex-col">
                      <div className="">
                        <p className="text-sm leading-relaxed">
                          {t("lvl_sel_txt")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 md:w-full">
                <h1 className="text-3xl text-sky-500 font-black">
                  {t("home_page")}
                </h1>
                <div className="flex flex-col md:flex-col-reverse">
                  <motion.img
                    src="/img/Home-page.png"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                    className="object-fit w-full rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                      maskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    }}
                  />
                  <div className="mb-5">
                    <div className="flex-col">
                      <div className="">
                        <p className="text-sm leading-relaxed">
                          {t("home_page_txt")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              //
              <div>
                <div className="flex flex-col gap-5 md:w-full">
                  <h1 className="text-3xl text-sky-500 font-black">
                    {t("test_res")}
                  </h1>
                  <div className="flex flex-col">
                    <div className="md:flex gap-5">
                      <div className="flex flex-col md:flex-col-reverse">
                        <motion.img
                          src="/img/Q-1.png"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          transition={{
                            type: "spring",
                            duration: 0.5,
                            bounce: 0.2,
                          }}
                          className="object-fit w-full rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                          style={{
                            WebkitMaskImage:
                              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                            maskImage:
                              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                          }}
                        />
                        <div className="mb-5">
                          <div className="flex-col">
                            <div className="">
                              <h5 className="text-xl mb-1.5">
                                {t("test_q")} - 1
                              </h5>
                              <p className="text-sm leading-relaxed">
                                {t("test_q_1_txt")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-col-reverse">
                        <motion.img
                          src="/img/Q-2.png"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          transition={{
                            type: "spring",
                            duration: 0.5,
                            bounce: 0.2,
                          }}
                          className="object-fit w-full rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                          style={{
                            WebkitMaskImage:
                              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                            maskImage:
                              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                          }}
                        />
                        <div className="mb-5">
                          <div className="flex-col">
                            <div className="">
                              <h5 className="text-xl mb-1.5">
                                {t("test_q")} - 2
                              </h5>
                              <p className="text-sm leading-relaxed">
                                {t("test_q_2_txt")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:flex gap-5">
                      <div className="flex flex-col md:flex-col-reverse">
                        <motion.img
                          src="/img/Result.png"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          transition={{
                            type: "spring",
                            duration: 0.5,
                            bounce: 0.2,
                          }}
                          className="object-fit w-full rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                          style={{
                            WebkitMaskImage:
                              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                            maskImage:
                              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                          }}
                        />
                        <div className="mb-5">
                          <div className="flex-col">
                            <div className="">
                              <h5 className="text-xl mb-1.5">
                                {t("test_res")}
                              </h5>
                              <p className="text-sm leading-relaxed">
                                {t("test_res_txt")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-col-reverse">
                        <motion.img
                          src="/img/Certificate.png"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          transition={{
                            type: "spring",
                            duration: 0.5,
                            bounce: 0.2,
                          }}
                          className="object-fit w-full rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                          style={{
                            WebkitMaskImage:
                              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                            maskImage:
                              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                          }}
                        />
                        <div className="mb-5">
                          <div className="flex-col">
                            <div className="">
                              <h5 className="text-xl mb-1.5">
                                {t("certifications")}
                              </h5>
                              <p className="text-sm leading-relaxed">
                                {t("cert_txt")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-5 md:w-full mt-5">
                <div className="w-full md:w-1/2 md:mb-5">
                  <div>
                    <h1 className="text-3xl text-sky-500 font-black mb-2">
                      {t("user_acc")}
                    </h1>
                    <div className="hidden md:flex flex-col">
                      <div className="bg-sky-900/5 rounded-2xl p-3 my-1.5 border border-slate-700/50">
                        <h5 className="text-xl mb-1.5">{t("profile")}</h5>
                        <p className="text-sm leading-relaxed">
                          {t("profile_txt")}
                        </p>
                      </div>
                      <div className="bg-sky-900/5 rounded-2xl p-3 my-1.5 border border-slate-700/50">
                        <h5 className="text-xl mb-1.5">{t("info_act")}</h5>
                        <p className="text-sm leading-relaxed">
                          {t("info_act_txt")}
                        </p>
                      </div>
                      <div className="bg-sky-900/5 rounded-2xl p-3 my-1.5 border border-slate-700/50">
                        <h5 className="text-xl mb-1.5">
                          {t("account_control")}
                        </h5>
                        <p className="text-sm leading-relaxed">
                          {t("acc_ctrl_txt")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.img
                  src="/img/Profile-1.png"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  className="object-fit w-full md:w-1/2 rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
                <div className="md:hidden flex mb-5">
                  <div className="flex-col">
                    <div className="">
                      <h5 className="text-xl mb-1.5">{t("profile")}</h5>
                      <p className="text-sm leading-relaxed">
                        {t("profile_txt")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-5 md:w-full">
                <motion.img
                  src="/img/Profile-2.png"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  className="object-fit w-full md:w-1/2 rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
                <div className="md:hidden flex mb-5">
                  <div className="flex-col">
                    <div className="">
                      <h5 className="text-xl mb-1.5">{t("info_act")}</h5>
                      <p className="text-sm leading-relaxed">
                        {t("info_act_txt")}
                      </p>
                    </div>
                  </div>
                </div>
                <motion.img
                  src="/img/Profile-3.png"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  className="object-fit w-full md:w-1/2 rounded-3xl border border-slate-700/50 flex flex-row justify-center items-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
                <div className="md:hidden flex mb-5">
                  <div className="flex-col">
                    <div className="">
                      <h5 className="text-xl mb-1.5">{t("account_control")}</h5>
                      <p className="text-sm leading-relaxed">
                        {t("acc_ctrl_txt")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatePresence>
          </div>
        </section>
        <div className="text-center my-10 text-4xl text-sky-600/30">•</div>
        <footer>
          <div className="text-center text-xs text-slate-400">&copy; JLPTX</div>
        </footer>
      </main>
    </div>
  );
};

export default UserManual;
