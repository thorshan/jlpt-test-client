import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import SEO from "../components/SEO";

const Privacy = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 selection:bg-sky-500/30 relative overflow-x-hidden flex flex-col gap-5">
      <SEO
        title="Privacy & Policy"
        description="Join JLPTX and start practicing for your Japanese Language Proficiency Test. Practice N1, N2, N3, N4, and N5 levels."
        canonical="/legal/privacy"
      />
      <nav className="bg-sky-950/20 backdrop-blur-md fixed top-0 left-0 w-full z-100 px-5 md:px-15 py-5 border-b border-b-sky-500/10 flex justify-between items-center">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 cursor-pointer hover:text-sky-500 transition-colors"
        >
          <ArrowLeft size={18} className="text-sm text-sky-500" /> {t("back")}
        </div>
        <div className="hidden sm:block text-md text-sky-500 font-black">
          {"Privacy & Policy"}
        </div>
        <div>
          <img src="/JLPTX.png" className="w-12 h-12 object-cover" />
        </div>
      </nav>

      <main className="mt-20 flex-1">
        <section>
          <div className="p-10 mb-10 bg-sky-950/20 backdrop-blur-sm rounded flex flex-col items-center gap-5">
            <Shield size={50} className="text-sky-500" />
            <div className="text-2xl md:text-3xl font-black">
              Privacy and Policy
            </div>
            <div className="text-sm font-black text-sky-500">
              Last Updated: June 10, 2026
            </div>
            <p>
              At JLPTX (https://jlptx.vercel.app/), we provide educational tools
              for JLPT practice. We believe in transparency regarding the data
              we collect to facilitate our platform’s features, such as
              authentication and certificate generation.
            </p>
          </div>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            1. The Data We Request
          </div>
          <p className="mb-5">
            To provide these services, our system requests:
          </p>
          <ul className="list-decimal px-5">
            <li>
              <p>
                Name: Used solely for display on your generated practice
                certificate.
              </p>
            </li>
            <li>
              <p>
                Email Address: Used for account authentication and as a unique
                identifier for your session.
              </p>
            </li>
            <li>
              <p>
                Date of Birth: Used exclusively as an additional parameter to
                ensure your certificate record is unique.
              </p>
            </li>
          </ul>
          <div className="mt-3">
            <span className="text-red-500">
              Important Note on Data Sensitivity
            </span>
            : We do not verify your identity. We encourage users to use
            pseudonyms or non-personal email addresses if they wish to remain
            anonymous. By using this service, you acknowledge that you are
            providing this information voluntarily, and we strongly advise you
            not to use your legal name or sensitive personal contact
            information.
          </div>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            2. Purpose of Collection
          </div>
          <p className="mb-5">
            We collect the data mentioned above exclusively for:
          </p>
          <ul className="list-decimal px-5">
            <li>
              <p>
                Authentication: Enabling access to our platform and maintaining
                your session.
              </p>
            </li>
            <li>
              <p>
                Certificate Generation: Populating your mock certificate with
                the information you provided.
              </p>
            </li>
            <li>
              <p>
                Database Uniqueness: Differentiating your records from other
                users for the purpose of issuing certificates.
              </p>
            </li>
          </ul>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            3. Data Protection and Retention
          </div>
          <p className="mb-5">
            We store your data within our secure database to ensure your
            progress and certificates are retrievable.
          </p>
          <ul className="list-decimal px-5">
            <li>
              <p>
                Data Minimization: We only collect the bare minimum information
                required for the functions described above.
              </p>
            </li>
            <li>
              <p>
                Non-Disclosure: We do not sell, trade, or share your data with
                third parties. Your information is used strictly to provide the
                services you requested on this website.
              </p>
            </li>
            <li>
              <p>
                Security: We employ industry-standard security measures (such as
                encrypted authentication) to protect your session. However,
                please be aware that no system is immune to unauthorized access.
              </p>
            </li>
          </ul>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            4. User Rights and Control
          </div>
          <p className="mb-5">
            You have full control over the information you provide:
          </p>
          <ul className="list-decimal px-5">
            <li>
              <p>
                Accuracy: You are solely responsible for the information you
                enter. Since we do not verify identity, you may change your
                profile information at any time via your account settings.
              </p>
            </li>
            <li>
              <p>
                Data Deletion: If you wish to delete your account and all
                associated data (including your generated certificates), you may
                do so by using the "Delete Account" function in your settings,
                or by contacting us at authooj@gmail.com with a request for data
                removal.
              </p>
            </li>
          </ul>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            5. Third-Party Services
          </div>
          <p>
            We use reputable third-party services to host our website and manage
            authentication (e.g., Vercel, Supabase/Firebase). These services may
            process data on our behalf, but only in accordance with our
            instructions and strict privacy standards. We do not share your data
            with advertisers or third-party marketers.
          </p>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            6. Updates to This Policy
          </div>
          <p>
            We may revise this policy to reflect changes in our website
            functions. The "Last Updated" date will always reflect the most
            recent version. Your continued use of the site signifies your
            agreement to these terms.
          </p>
        </section>
        <section className="my-5">
          <div className="text-2xl text-sky-500 underline mb-3">
            7. Contact Information
          </div>
          <p>
            If you have any questions or concerns regarding our privacy
            practices, please contact us at: authooj@gmail.com
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

export default Privacy;
