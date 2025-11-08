import React from "react";
import { Link } from "react-router-dom";
import { TUTORIALS } from "../../data/tutorials";
import { Map } from "lucide-react";
import { getProgressPercent } from "../../utils/progress";

export default function RoadmapPanel() {
  const paths = React.useMemo(() => {
    return TUTORIALS.slice(0, 5).map((c) => ({
      slug: c.slug,
      title: c.title,
      to: `/roadmap/${c.slug}`,
      steps: c.topics.slice(0, 5).map((t) => t.title),
      total: c.topics.length,
    }));
  }, []);

  // No dropdown state; right sidebar remains simple

  return (
    <div className="p-6 bg-gradient-to-br from-white to-emerald-50 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            Learning Roadmaps
          </h2>
        </div>
        <Link
          to="/roadmap"
          className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Roadmap Cards */}
      <div className="grid gap-4">
        {paths.map((p) => (
          <div key={p.slug} className="hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-neutral-800 rounded-xl border border-transparent transition">
            <div className="group flex flex-col gap-2 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-all duration-300 shadow-sm">
              <div className="flex items-center justify-between">
                <Link to={p.to} className="font-semibold text-neutral-900 dark:text-neutral-100 hover:text-emerald-600 dark:hover:text-emerald-400">
                  {p.title}
                </Link>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {getProgressPercent(p.slug, p.total)}%
                </span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {p.steps.join(" • ")}
                {p.total > 5 ? " • …" : ""}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                {p.total} total topics
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
