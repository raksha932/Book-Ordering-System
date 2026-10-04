import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

const categoryGradientMap = {
  Technology: "from-blue-900 via-slate-900 to-indigo-950",
  Fiction: "from-purple-900 via-slate-900 to-violet-950",
  Business: "from-emerald-900 via-slate-900 to-teal-950",
  "Self-Help": "from-amber-900 via-slate-900 to-orange-950",
  Science: "from-cyan-900 via-slate-900 to-blue-950",
  Philosophy: "from-rose-900 via-slate-900 to-pink-950",
  History: "from-orange-900 via-slate-900 to-amber-950",
  Mystery: "from-slate-800 via-slate-900 to-slate-950"
};

const BookImage = ({ src, alt, title, author, category, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  // If image URL is missing or failed to load, render custom designed book cover
  if (hasError || !src) {
    const gradient = categoryGradientMap[category] || "from-indigo-900 via-slate-900 to-purple-950";

    return (
      <div
        className={`w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br ${gradient} text-white select-none relative overflow-hidden shadow-inner ${className}`}
      >
        {/* Book spine accent line */}
        <div className="absolute top-0 bottom-0 left-0 w-2 bg-white/20 border-r border-white/10" />

        {/* Top Header: Category & Icon */}
        <div className="flex items-center justify-between pl-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded backdrop-blur-sm">
            {category || "Book"}
          </span>
          <BookOpen className="w-4 h-4 text-white/80" />
        </div>

        {/* Middle: Title & Author */}
        <div className="my-auto py-3 pl-2">
          <h4 className="font-extrabold text-sm sm:text-base leading-snug text-white line-clamp-3 drop-shadow-sm">
            {title || alt || "Book Title"}
          </h4>
          {author && (
            <p className="text-xs text-white/70 mt-1.5 font-medium line-clamp-1">
              by {author}
            </p>
          )}
        </div>

        {/* Bottom: College Edition Badge */}
        <div className="pt-2 pl-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60 font-mono">
          <span>ORIGINAL EDITION</span>
          <span className="text-amber-400 font-bold">★ 4.8</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || title || "Book cover"}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};

export default BookImage;
