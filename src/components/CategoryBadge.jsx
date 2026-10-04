import React from 'react';

const categoryColorMap = {
  Fiction: "bg-purple-50 text-purple-700 border-purple-200",
  Technology: "bg-blue-50 text-blue-700 border-blue-200",
  Business: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Self-Help": "bg-amber-50 text-amber-700 border-amber-200",
  Science: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Philosophy: "bg-rose-50 text-rose-700 border-rose-200",
  History: "bg-orange-50 text-orange-700 border-orange-200",
  Mystery: "bg-slate-100 text-slate-700 border-slate-300"
};

const CategoryBadge = ({ category, className = "" }) => {
  const colorClass = categoryColorMap[category] || "bg-indigo-50 text-indigo-700 border-indigo-200";

  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${colorClass} ${className}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
