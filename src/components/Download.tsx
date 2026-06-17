import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, DownloadIcon, ShieldCheck, Trophy } from "lucide-react";
import { resultApi, type Result } from "../api/resultApi";
import { useTranslation } from "../hooks/useTranslation";
import { useReactToPrint } from "react-to-print";

const Download = () => {
  const { id } = useParams();
  const [certLang, setCertLang] = useState<"en" | "jp">("en");
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await resultApi.getResultsById(id as string);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePrint = useReactToPrint({
    documentTitle: `JLPT_Certificate_${typeof data?.user === "object" ? data.user.name : "Student"}`,
  });

  if (loading)
    return <div className="p-10 text-white">Loading Certificate...</div>;
  if (!data) return <div className="p-10 text-white">No data found.</div>;

  const isPassed = data.status;

  return (
    <div className="relative min-h-screen pt-24">
      <nav className="fixed top-0 left-0 w-full z-50 bg-sky-950/20 backdrop-blur-md px-4 md:px-15 py-3 border-b border-b-sky-500/10 flex flex-wrap justify-between items-center gap-3">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 cursor-pointer hover:text-sky-500 transition-colors"
        >
          <ArrowLeft size={18} className="text-sky-500" />
          <span className="hidden sm:inline">{t("back")}</span>
        </div>

        {/* Lang Switcher - Adjusted size for mobile */}
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5 h-10">
          <button
            onClick={() => setCertLang("en")}
            className={`px-3 rounded-lg text-[9px] font-black uppercase ${certLang === "en" ? "bg-sky-500 text-slate-950" : "text-slate-500"}`}
          >
            EN
          </button>
          <button
            onClick={() => setCertLang("jp")}
            className={`px-3 rounded-lg text-[9px] font-black uppercase ${certLang === "jp" ? "bg-sky-500 text-slate-950" : "text-slate-500"}`}
          >
            JP
          </button>
        </div>

        {/* Download Button */}
        <button
          disabled={loading}
          onClick={async () => {
            if (certificateRef.current) {
              setLoading(true);
              try {
                await handlePrint(() => certificateRef.current);
              } finally {
                setLoading(false);
              }
            }
          }}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 rounded-xl font-black transition-all h-10 text-xs"
        >
          <DownloadIcon size={16} />
          <span>{loading ? t("processing") : t("download")}</span>
        </button>
      </nav>
      <div className="flex justify-center p-4">
        <div
          ref={certificateRef}
          className="w-212.5 bg-[#020617] p-12 relative border border-white/10 flex flex-col justify-between overflow-scroll"
          style={{ minHeight: "650px" }}
        >
          {/* Watermark/Corners */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url('/JLPTX.png')`,
              backgroundSize: "120px",
            }}
          />
          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-sky-500 m-6 opacity-50" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-sky-500 m-6 opacity-50" />

          {/* Certificate Content */}
          <div className="relative z-10">
            <div className="flex justify-between items-start border-b border-white/5 pb-8 mb-8">
              <div className="flex items-center gap-5">
                <img src="/JLPTX.png" alt="Logo" className="h-16 w-auto" />
                <div>
                  <h4 className="text-white font-black text-3xl tracking-tighter">
                    JLPTX
                  </h4>
                  <p className="text-sky-500 text-[10px] font-black uppercase">
                    {certLang === "en"
                      ? "Japanese Proficiency"
                      : "日本語能力認定"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-[9px] font-black uppercase mb-1">
                  {certLang === "en" ? "Certificate No." : "証書番号"}
                </p>
                <p className="text-xs font-mono text-white mb-4">
                  #JLPT-{data.level}-{data._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-slate-500 text-[9px] font-black uppercase mb-1">
                  {certLang === "en" ? "Issued Date" : "発行日"}
                </p>
                <p className="text-sm font-bold text-white">
                  {new Date(data.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center py-3">
              <p className="text-sky-500 uppercase text-[11px] font-black tracking-[0.5em] mb-4">
                {certLang === "en" ? "Official Result" : "公式結果"}
              </p>
              <h2 className="text-6xl font-black text-white">
                {typeof data.user === "object" ? data.user?.name : "Examinee"}
              </h2>
              <div className="max-w-sm flex justify-center items-center my-5 gap-5">
                <h6 className="text-sky-500 text-md font-black">
                  {certLang === "en" ? "Date of Birth" : "生年月日"}
                </h6>
                <h6 className="text-md">
                  {typeof data?.user === "object"
                    ? new Date(data.user.dob)
                        .toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        .replace(/(\d+)\s(\w+)\s(\d+)/, "$1, $2 $3")
                    : ""}
                </h6>
              </div>
              <p className="text-center text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                {certLang === "en"
                  ? "Has successfully demonstrated proficiency in the Japanese language assessment at the level specified below."
                  : "貴殿は、当プログラムが実施した日本語能力アセスメントにおいて、下記の通り優秀な成績を収め、所定のレベルに達したことをここに証します。"}
              </p>
              <div className="flex items-center justify-center gap-8 mt-10">
                <div className="h-[1px] w-20 bg-white/10" />
                <div className="px-10 py-3 bg-white text-slate-950 font-black text-2xl rounded-sm skew-x-[-10deg] shadow-lg">
                  {certLang === "en" ? "LEVEL" : "レベル"} {data.level}
                </div>
                <div className="h-[1px] w-20 bg-white/10" />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-6 my-10">
              <div className="col-span-2 bg-white/5 border border-white/5 p-6 rounded-xl">
                <p className="text-[10px] text-sky-500 font-black uppercase mb-4 tracking-widest">
                  {certLang === "en" ? "Score Data" : "得点データ"}
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {certLang === "en" ? "Total" : "合計"}
                    </span>
                    <span className="text-2xl font-black text-white">
                      {Math.round(data.totalEarnedPoints)}/
                      {data.totalPossiblePoints}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      JLPT
                    </span>
                    <span className="text-2xl font-black text-sky-500">
                      {data.gradeJLPT}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      CEFR
                    </span>
                    <span className="text-2xl font-black text-white">
                      {data.grade}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-3 bg-white/5 border border-white/5 p-6 rounded-xl">
                <p className="text-[10px] text-sky-500 font-black uppercase mb-4 tracking-widest">
                  {certLang === "en" ? "Breakdown" : "得点内訳"}
                </p>
                <table className="w-full text-left">
                  <thead className="text-[9px] text-slate-500 uppercase border-b border-white/10">
                    <th className="pb-2">
                      {certLang === "en" ? "Section" : "セクション"}
                    </th>
                    <th className="pb-2 text-center">
                      {certLang === "en" ? "Score" : "得点"}
                    </th>
                    <th className="pb-2 text-right">
                      {certLang === "en" ? "Grade" : "判定"}
                    </th>
                  </thead>
                  <tbody className="text-[11px] font-bold">
                    {data.sectionDetails?.map((sec, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="py-2.5 text-slate-200">
                          {sec.sectionTitle}
                        </td>
                        <td className="py-2.5 text-center text-white">
                          {Math.round(sec.earnedPoints)}/{sec.totalPoints}
                        </td>
                        <td className="py-2.5 text-right text-sky-400 font-black">
                          {sec.gradeJLPT}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-8 mt-auto">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {certLang === "en" ? "Signature Verified" : "署名検証済み"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Trophy size={14} className="text-sky-500" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {certLang === "en"
                    ? `Validated via ${
                        typeof data?.user === "object" &&
                        data.user !== null &&
                        typeof data.user.association === "object"
                          ? data.user.association?.name
                          : "JLPTX"
                      }`
                    : `${
                        typeof data?.user === "object" &&
                        data.user !== null &&
                        typeof data.user.association === "object"
                          ? data.user.association?.name
                          : "JLPTX"
                      }による承認`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="h-10 w-40 border-b border-white/10 mb-1 flex items-end justify-end">
                  <span
                    className={`text-2xl font-black ${isPassed ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {isPassed
                      ? certLang === "en"
                        ? "PASSED"
                        : "合格"
                      : certLang === "en"
                        ? "FAILED"
                        : "不合格"}
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                  {certLang === "en" ? "Validation Status" : "検証ステータス"}
                </p>
              </div>
              <img
                src="/JLPTX.png"
                alt="Logo"
                className="h-16 w-auto opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
