import { ArrowLeft, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import SEO from "../components/SEO";

const Terms = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 selection:bg-sky-500/30 relative overflow-x-hidden flex flex-col gap-5">
      <SEO
        title="Terms & Conditions"
        description="Join JLPTX and start practicing for your Japanese Language Proficiency Test. Practice N1, N2, N3, N4, and N5 levels."
        canonical="/legal/terms"
      />
      <nav className="bg-sky-950/20 backdrop-blur-md fixed top-0 left-0 w-full z-100 px-5 md:px-15 py-5 border-b border-b-sky-500/10 flex justify-between items-center">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 cursor-pointer hover:text-sky-500 transition-colors"
        >
          <ArrowLeft size={18} className="text-sm text-sky-500" /> {t("back")}
        </div>
        <div className="hidden sm:block text-md text-sky-500 font-black">
          {"Terms & Conditions"}
        </div>
        <div>
          <img src="/JLPTX.png" className="w-12 h-12 object-cover" />
        </div>
      </nav>

      <main className="mt-20 flex-1">
        <section>
          <div className="p-10 mb-10 bg-sky-950/20 backdrop-blur-sm rounded flex flex-col items-center gap-5">
            <Scale size={50} className="text-sky-500" />
            <div className="text-2xl md:text-3xl font-black">
              Terms and Conditions
            </div>
            <div className="text-sm font-black text-sky-500">
              Last Updated: June 10, 2026
            </div>
            <p>
              Welcome to JLPTX (https://jlptx.vercel.app/). By accessing or
              using this website, you agree to be bound by these Terms and
              Conditions. If you do not agree with any part of these terms,
              please discontinue use of this website immediately.
            </p>
          </div>
        </section>
        <section>
          <div className="text-2xl text-sky-500 underline mb-3">
            1. No Official Affiliation
          </div>
          <p>
            JLPTX is an independent, non-profit educational website created for
            the purpose of providing free mock examination practice for the
            Japanese-Language Proficiency Test (JLPT). We are not affiliated,
            associated, authorized, endorsed by, or in any way officially
            connected with The Japan Foundation or Japan Educational Exchanges
            and Services (JEES).
          </p>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            2. Permitted Use
          </div>
          <ul className="list-decimal px-5">
            <li>
              <p>
                The content provided on this website is for your personal,
                non-commercial, educational use only.
              </p>
            </li>
            <li>
              <p>
                You may not reproduce, distribute, modify, or sell any content
                (including questions, layouts, or code) found on this website
                without explicit written permission from the administrators of
                JLPTX.
              </p>
            </li>
          </ul>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            3. Accuracy of Information
          </div>
          <p>
            While we strive to ensure that the content provided is accurate and
            helpful, all practice materials are provided "as is." We do not
            guarantee that the content is error-free, complete, or reflective of
            the current format of the official JLPT examination. Use these
            materials at your own risk.
          </p>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            4. Limitation of Liability
          </div>
          <p>
            Under no circumstances shall the creators of JLPTX be held liable
            for any damages—including but not limited to direct, indirect,
            incidental, or consequential damages—arising out of the use or
            inability to use the information provided on this website. This
            includes any impact on a user's performance on the official JLPT
            examination.
          </p>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            5. Third-Party Links
          </div>
          <p>
            Our website may contain links to third-party websites. These links
            are provided for your convenience. We have no control over the
            content, privacy policies, or practices of these third-party sites
            and accept no responsibility for them.
          </p>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            6. Changes to Terms
          </div>
          <p>
            We reserve the right to modify these Terms and Conditions at any
            time. Any changes will be effective immediately upon posting to this
            page. Your continued use of the website following any changes
            constitutes your acceptance of the updated terms.
          </p>
        </section>
        {/*<section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            7. Governing Law
          </div>
          <p>
            These terms are governed by the laws applicable in Myanmar. Any
            disputes arising from the use of this website shall be subject to
            the exclusive jurisdiction of the courts in Myanmar.
          </p>
        </section>*/}
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            7. Contact Information
          </div>
          <p>
            If you have any questions or concerns regarding these Terms and
            Conditions, please contact us at: authooj@gmail.com
          </p>
        </section>
        <div className="text-center my-10 text-4xl text-sky-600/30">•</div>
        <footer>
          <div className="text-center text-xs text-slate-400">&copy; JLPTX</div>
        </footer>
      </main>
    </div>
  );
};

export default Terms;
