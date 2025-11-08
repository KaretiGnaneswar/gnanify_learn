import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { findCategory } from "../data/tutorials";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Map } from "lucide-react";
import { getCompleted, toggleComplete, getProgressPercent, getCompletedSections, toggleSectionComplete, getTopicSectionPercent } from "../utils/progress";
import Seo from "../components/Seo";

export default function Roadmap() {
  const { category } = useParams();
  const nav = useNavigate();
  const cat = findCategory(category);
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const onChange = () => force();
    window.addEventListener('progress:changed', onChange);
    return () => window.removeEventListener('progress:changed', onChange);
  }, []);
  // Collapsible subtopics state (avoid naming 'open' to not shadow window.open)
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({});
  const toggleOpenMap = (slug: string) => setOpenMap((o) => ({ ...o, [slug]: !o[slug] }));
  // Auto-open DSA Intro subtopics on first load
  React.useEffect(() => {
    if (cat?.slug === 'dsa') {
      const intro = cat.topics.find(t => t.slug === 'introduction-to-dsa');
      if (intro) {
        setOpenMap((o) => ({ ...o, [intro.slug]: true }));
      }
    }
  }, [cat?.slug]);

  if (!cat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <Map className="w-10 h-10 text-gray-400 mb-3" />
        <p className="text-sm text-gray-500 mb-2">No roadmap found.</p>
        <Link
          to="/tutorials"
          className="text-sm font-medium text-emerald-600 hover:underline"
        >
          Browse tutorials →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <Seo
        title={`${cat.title} Roadmap | Gnanify Learn`}
        description={`Follow the ${cat.title} roadmap with step-by-step topics and subtopics to master the fundamentals with progress tracking.`}
        canonical={`/roadmap/${cat.slug}`}
      />
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => nav(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {cat.title} Roadmap
          </h1>
          <p className="text-sm text-gray-500">
            Follow each step to complete your learning path
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {(() => {
        const percent = getProgressPercent(cat.slug, cat.topics.length);
        return (
          <div>
            <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300 mb-1">
              <span>Progress</span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 rounded bg-neutral-200 dark:bg-neutral-800">
              <div className="h-2 rounded bg-emerald-500" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })()}

      {/* Steps */}
      <div className="relative flex flex-col items-start border-l-2 border-emerald-200 dark:border-emerald-800 pl-6 space-y-6">
        {cat.topics.map((topic, i) => (
          <motion.div
            key={topic.slug}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 shadow-sm hover:shadow-md w-full"
          >
            <div className="absolute -left-[27px] top-5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900"></div>
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleOpenMap(topic.slug)}
                aria-expanded={!!openMap[topic.slug]}
                className="text-left"
              >
                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                  Step {i + 1}: {topic.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Learn about {topic.title} in this step.
                </p>
                {/* Per-topic section progress */}
                {(() => {
                  const percent = getTopicSectionPercent(cat.slug, topic.slug, topic.sections.length);
                  return (
                    <div className="mt-2">
                      <div className="flex justify-between text-[11px] text-neutral-500">
                        <span>Subtopic progress</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-1.5 rounded bg-neutral-200 dark:bg-neutral-800">
                        <div className="h-1.5 rounded bg-emerald-500" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })()}
              </button>
              <div className="flex items-center gap-2">
                {(() => {
                  const completed = getCompleted(cat.slug).has(topic.slug);
                  return (
                    <button
                      onClick={() => { toggleComplete(cat.slug, topic.slug); }}
                      className={`px-2 py-1 rounded text-xs font-medium border ${completed ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'}`}
                    >
                      {completed ? 'Completed' : 'Mark complete'}
                    </button>
                  );
                })()}
                <button
                  onClick={() => nav(`/tutorials/${cat.slug}/${topic.slug}`)}
                  className="px-2 py-1 rounded text-xs font-medium border border-emerald-300 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-neutral-800"
                >
                  Open
                </button>
                <button
                  onClick={() => toggleOpenMap(topic.slug)}
                  className="px-2 py-1 rounded text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {openMap[topic.slug] ? 'Hide subtopics' : 'Show subtopics'}
                </button>
              </div>
            </div>

            {/* Collapsible subtopics */}
            {openMap[topic.slug] && (
              <div className="mt-3 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-2">Subtopics checklist</div>
                <ul className="space-y-2">
                  {topic.sections.map((sec) => {
                    const done = getCompletedSections(cat.slug, topic.slug).has(sec.id);
                    return (
                      <li key={sec.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => toggleSectionComplete(cat.slug, topic.slug, sec.id, topic.sections.length)}
                          />
                          <span className={`text-sm ${done ? 'line-through text-neutral-500' : 'text-neutral-800 dark:text-neutral-200'}`}>{sec.title}</span>
                        </div>
                        <button
                          onClick={() => nav(`/tutorials/${cat.slug}/${topic.slug}/${sec.id}`)}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          Read
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Start Button */}
      <div className="flex justify-center">
        <Link
          to={`/tutorials/${cat.slug}/${cat.topics[0]?.slug ?? "intro"}`}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
        >
          <Play className="w-4 h-4" /> Start Learning
        </Link>
      </div>
    </div>
  );
}
