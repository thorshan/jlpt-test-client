import { useState } from "react";
import { Link } from "react-router-dom";

export interface Page {
  id?: string;
  text?: string;
  path?: string;
  description: string;
  image: string;
  child?: [
    {
      text: string;
      path: string;
      description: string;
      image: string;
    },
  ];
}

const PageNode = ({ page }: { page: Page }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = page?.child && page?.child.length > 0;

  return (
    <div className="mb-6 p-5 border border-sky-500/10 rounded-xl bg-sky-950/10 hover:bg-sky-950/30 transition-all">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {/* Render the Image */}
        {page.image && (
          <img
            src={page.image}
            alt={page.text}
            className="w-35 h-35 rounded-lg object-fit border border-sky-500/20"
          />
        )}

        <div className="flex-1">
          <div className="font-bold text-xl text-white">
            {page.path ? <Link to={page.path}>{page.text}</Link> : page.text}
          </div>
          <p className="text-sm text-slate-400">{page.description}</p>
        </div>

        {hasChildren && (
          <span className="text-sky-500 p-2">{isOpen ? "▼" : "▶"}</span>
        )}
      </div>

      {/* Children Section */}
      {hasChildren && isOpen && (
        <div className="mt-4 ml-8 border-l border-sky-500/20 pl-6 flex flex-col gap-4">
          {page.child?.map((child, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {/* Child Image */}
              <img
                src={child.image}
                alt={child.text}
                className="w-16 h-16 rounded object-fit border border-sky-500/20"
              />
              <div>
                <Link
                  to={child.path}
                  className="text-sky-300 font-semibold hover:text-sky-100"
                >
                  {child.text}
                </Link>
                <p className="text-xs text-slate-500">{child.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageNode;
