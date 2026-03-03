import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Printer,
  XCircle,
  Hash,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Trophy,
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
        const resultsArray = res?.data?.data;

        if (resultsArray && resultsArray.length > 0) {
          setData(resultsArray[resultsArray.length - 1]);
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
        <p className="text-neutral-500 font-medium animate-pulse">
          Calculating Proficiency...
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
        {/* --- UI HEADER --- */}
        <div className="flex justify-between items-center">
          <Link
            to="/test"
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest"
          >
            <ArrowLeft size={16} /> Exit to Dashboard
          </Link>
          <button
            onClick={() => {
              if (certificateRef.current) {
                handlePrint(() => certificateRef.current);
              }
            }}
            className="flex items-center gap-3 bg-sky-500 hover:bg-sky-600 text-black px-8 py-4 rounded-2xl font-black transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] active:scale-95"
          >
            <Printer size={20} /> PRINT CERTIFICATE
          </button>
        </div>

        {/* --- PRINTABLE CERTIFICATE --- */}
        <div className="overflow-x-auto pb-20">
          <div
            ref={certificateRef}
            className="w-[850px] mx-auto bg-black p-14 relative shadow-2xl border border-neutral-800 flex flex-col justify-between overflow-hidden"
            style={{
              aspectRatio: "1.414/1",
              boxSizing: "border-box",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            {/* ABSTRACT BACKGROUND PATTERN */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 2px 2px, #0ea5e9 1px, transparent 0),
                  linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111),
                  linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111)
                `,
                backgroundSize: "40px 40px, 80px 80px, 80px 80px",
                backgroundPosition: "0 0, 0 0, 40px 40px",
              }}
            />

            {/* CORNER ACCENTS */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-sky-500/20 m-6" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-sky-500/20 m-6" />

            {/* Row 1: Header */}
            <div className="relative z-10 flex justify-between items-center border-b border-neutral-800/50 pb-3">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg">
                  <img src="/JLPTX.png" alt="Logo" className="h-15 w-auto" />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-black text-lg leading-none">
                    JLPTX
                  </h4>
                  <p className="text-sky-500 text-[8px] font-black uppercase tracking-[0.3em]">
                    Official Certification
                  </p>
                </div>
              </div>
              <div className="text-right">
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

            {/* Row 2: User Identity */}
            <div className="relative z-10 text-center py-4">
              <p className="text-sky-500 uppercase text-[10px] font-black tracking-[0.5em] mb-4">
                Statement of Proficiency
              </p>
              <h2 className="text-6xl font-serif italic text-white mb-2">
                {user?.name || "Examinee"}
              </h2>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-sky-500" />
                <div className="px-8 py-2 bg-sky-500 text-black font-black text-xl rounded-sm">
                  JLPT {data.level}
                </div>
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-sky-500" />
              </div>
            </div>

            {/* Row 3: Grades Matrix */}
            <div className="relative z-10 grid grid-cols-2 gap-10 my-4">
              {/* Left Side: Summary */}
              <div className="space-y-4">
                <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                  <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest mb-3">
                    Overall Performance
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-black text-white">
                        {data.overAllScore}
                        <span className="text-sm text-neutral-600 ml-1">
                          /{data.sectionTotalScore}
                        </span>
                      </p>
                      <p className="text-[10px] text-sky-500 font-bold uppercase">
                        Total Point Score
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-sky-500">
                        {data.grade}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase">
                        CEFR Level
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Section Breakdown */}
              <div className="space-y-4">
                <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                  <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest mb-3">
                    JLPT Grades
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                      <span className="text-[11px] font-bold text-neutral-300 italic">
                        Overall
                      </span>
                      <span className="text-lg font-black text-white">
                        {data.gradeJLPT}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-sky-500/80 uppercase tracking-tighter">
                        Result Status
                      </span>
                      <span
                        className={`text-sm font-black ${isPassed ? "text-green-500" : "text-red-500"}`}
                      >
                        {isPassed ? "SUCCESS" : "FAILED"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Footer */}
            <div className="relative z-10 flex justify-between items-end border-t border-neutral-800/50 pt-2 ">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Hash size={12} />
                  <span className="text-[9px] font-mono tracking-widest uppercase">
                    Cert: {data._id.slice(-14).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Trophy size={12} className="text-sky-500/50" />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">
                    Verified by JLPT-X Assessment Engine
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest">
                    Authority Signature
                  </p>
                  <p className="text-neutral-600 text-[8px] font-serif italic">
                    Digital Audit Trail Secured
                  </p>
                </div>
                <div className="bg-sky-500/10 p-2 rounded-full border border-sky-500/20">
                  <ShieldCheck size={32} className="text-sky-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
