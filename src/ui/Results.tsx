import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Printer,
  XCircle,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Trophy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { resultApi, type Result } from "../api/resultApi";
import { useUser } from "../hooks/useUser";

const Results: React.FC = () => {
  const { user } = useUser();
  const certificateRef = useRef<HTMLDivElement>(null);

  // --- STATE ---
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchLatestResult = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await resultApi.getResultsByUser(user._id);
        const resultsArray: Result[] = res?.data?.data;

        if (resultsArray && resultsArray.length > 0) {
          // Fixed 'any' by using the 'Result' type and safe date parsing
          const latest = resultsArray.sort((a: Result, b: Result) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          })[0];

          setData(latest);
        }
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResult();
  }, [user?._id]);

  // --- PRINT LOGIC ---
  const handlePrint = useReactToPrint({
    documentTitle: `JLPT_Certificate_${user?.name || "Student"}`,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-medium animate-pulse text-sm tracking-widest uppercase">
          Generating Official Report...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6 text-center">
        <XCircle className="w-16 h-16 text-neutral-800 mb-4" />
        <h2 className="text-2xl font-bold text-white">No Record Found</h2>
        <Link
          to="/test"
          className="mt-4 text-sky-500 flex items-center gap-2 hover:underline"
        >
          <ArrowLeft size={18} /> Return to Tests
        </Link>
      </div>
    );
  }

  const isPassed = data.status;

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 font-sans text-neutral-200">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* --- RESPONSIVE UI HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          {/* Exit Link - Centered on mobile, Left on desktop */}
          <Link
            to="/test"
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-all font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Exit to Dashboard
          </Link>

          {/* Actions Wrapper - Stacks on small mobile (xs), Rows on tablet+ */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Status Badge */}
            <div
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border w-full sm:w-auto ${
                isPassed
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                  : "border-red-500/30 bg-red-500/10 text-red-500"
              }`}
            >
              {isPassed ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span className="text-[10px] md:text-xs font-black tracking-widest uppercase">
                {isPassed ? "Exam Passed" : "Did Not Pass"}
              </span>
            </div>

            {/* Print Button - Full width on mobile, Auto on desktop */}
            <button
              onClick={() => {
                if (certificateRef.current) {
                  handlePrint(() => certificateRef.current);
                }
              }}
              className="flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-400 text-black px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl w-full sm:w-auto font-black transition-all shadow-[0_0_20px_rgba(14,165,233,0.2)] active:scale-95"
            >
              <Printer size={18} />
              <span className="text-sm md:text-base">PRINT CERTIFICATE</span>
            </button>
          </div>
        </div>

        {/* --- PRINTABLE CERTIFICATE --- */}
        <div className="overflow-x-auto pb-20">
          <div
            ref={certificateRef}
            className="w-[850px] mx-auto bg-black p-10 relative shadow-2xl border border-neutral-800 flex flex-col justify-between"
            style={{
              // Removed fixed aspect-ratio to prevent content clipping
              minHeight: "600px",
              boxSizing: "border-box",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
              // Ensure the background color and borders are forced in PDF
            }}
          >
            {/* BACKGROUND PATTERN - Lowered opacity slightly for better legibility */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.02] grayscale"
              style={{
                backgroundImage: `url('/JLPTX.png')`,
                backgroundSize: "120px",
                backgroundRepeat: "repeat",
              }}
            />

            {/* CORNER ACCENTS */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-sky-500 m-4" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-sky-500 m-4" />

            {/* --- Content Sections --- */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-neutral-800 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <img src="/JLPTX.png" alt="Logo" className="h-12 w-auto" />
                  <div>
                    <h4 className="text-white font-black text-2xl tracking-tighter leading-none">
                      JLPTX
                    </h4>
                    <p className="text-sky-500/80 text-[10px] font-black">
                      Japanese Language Proficiency Test
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest">
                    Certificate Number
                  </p>
                  <p className="text-xs font-mono text-white mb-2 uppercase">
                    #JLPT-{data.level}-{data._id.toUpperCase()}
                  </p>
                  <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest">
                    Date of Issue
                  </p>
                  <p className="text-sm font-bold text-white">
                    {new Date(data.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Examinee Identity */}
              <div className="text-center py-4">
                <p className="text-sky-500 uppercase text-[10px] font-black tracking-[0.5em] mb-2">
                  Result of Japanese Language Proficiency
                </p>
                <h2 className="text-5xl font-serif italic text-white mb-4 underline decoration-sky-500/30 underline-offset-8">
                  {user?.name || "Examinee"}
                </h2>
                <p className="text-neutral-400 text-xs max-w-md mx-auto">
                  Has successfully completed the competency assessment for the
                  Japanese Language Proficiency Test at the following level:
                </p>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="h-[1px] w-16 bg-neutral-800" />
                  <div className="px-8 py-2 bg-white text-black font-black text-xl rounded-sm skew-x-[-10deg]">
                    LEVEL {data.level}
                  </div>
                  <div className="h-[1px] w-16 bg-neutral-800" />
                </div>
              </div>

              {/* Score Breakdown Matrix */}
              <div className="grid grid-cols-5 gap-4 my-6">
                <div className="col-span-2 space-y-4">
                  <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-sm">
                    <p className="text-[9px] text-neutral-500 font-black uppercase mb-3 tracking-widest">
                      Score Summary
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] text-neutral-400 font-bold uppercase">
                          Total Points
                        </span>
                        <span className="text-xl font-black text-white">
                          {data.totalEarnedPoints}
                          <span className="text-xs text-neutral-600 font-normal">
                            {" "}
                            / {data.totalPossiblePoints}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] text-neutral-400 font-bold">
                          JLPT Grade (Overall)
                        </span>
                        <span className="text-xl font-black text-sky-500">
                          {data.gradeJLPT}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] text-neutral-400 font-bold">
                          CEFR Grade
                        </span>
                        <span className="text-xl font-black text-white">
                          {data.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-3 bg-neutral-900/40 border border-neutral-800 p-4 rounded-sm">
                  <p className="text-[9px] text-neutral-500 font-black uppercase mb-3 tracking-widest">
                    Sectional Breakdown
                  </p>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[8px] text-neutral-500 uppercase border-b border-neutral-800">
                        <th className="pb-1 font-black">Section</th>
                        <th className="pb-1 font-black text-center">Score</th>
                        <th className="pb-1 font-black text-right">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="text-[10px]">
                      {data.sectionDetails?.map((sec, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-neutral-800/50"
                        >
                          <td className="py-1.5 text-neutral-300 font-bold uppercase">
                            {sec.sectionTitle}
                          </td>
                          <td className="py-1.5 text-center text-white font-mono">
                            {sec.earnedPoints} / {sec.totalPoints}
                          </td>
                          <td className="py-1.5 text-right font-black text-sky-500">
                            {sec.gradeJLPT}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer / Security - This will now be pushed correctly to the bottom */}
            <div className="relative z-10 flex justify-between items-end border-t border-neutral-800 pt-6 mt-auto">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-neutral-600">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span className="text-[8px] font-bold uppercase">
                    Digital Signature Verified
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Trophy size={12} className="text-sky-500" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">
                    Validated via JLPTX
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="h-8 w-32 border-b border-neutral-700 mb-1 flex items-end justify-end">
                    <span
                      className={`text-lg font-black ${data.status === true ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {data.status === true ? "PASSED" : "FAILED"}
                    </span>
                  </div>
                  <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">
                    Status
                  </p>
                </div>
                <img src="/JLPTX.png" alt="Logo" className="h-12 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
