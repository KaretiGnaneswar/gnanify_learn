import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TUTORIALS, findCategory, findTopic } from '../../data/tutorials';

export default function SideNavbar() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const isTutorials = pathParts[0] === 'tutorials';
  const currentCategory = isTutorials ? pathParts[1] : undefined;
  const currentTopic = isTutorials ? pathParts[2] : undefined;
  const catData = currentCategory ? findCategory(currentCategory) : undefined;
  const topicData = currentCategory && currentTopic ? findTopic(currentCategory, currentTopic) : undefined;

  return (
    <div className="sticky top-28 border-r border-neutral-200 dark:border-neutral-800 pr-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
      <div className="p-4 space-y-6 text-sm">
        {!isTutorials && (
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-3 font-semibold">Browse</div>
            <ul className="space-y-1.5">
              {TUTORIALS.map((c) => (
                <li key={c.slug}>
                  <Link to={`/tutorials/${c.slug}/${c.topics[0]?.slug ?? 'intro'}`} className="block px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 hover:text-blue-600 dark:hover:text-blue-400">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isTutorials && catData && (
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-3 font-semibold">{catData.title}</div>
            <ul className="space-y-1.5">
              {catData.topics.map((t) => {
                const active = t.slug === currentTopic;
                return (
                  <li key={t.slug}>
                    <Link to={`/tutorials/${catData.slug}/${t.slug}`} className={`block px-2 py-1 rounded-md transition-colors duration-150 ${active ? 'bg-neutral-100 dark:bg-neutral-800 text-blue-600 dark:text-blue-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-blue-600 dark:hover:text-blue-400'}`}>
                      {t.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {isTutorials && catData && topicData && (
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-3 font-semibold">Subtopics</div>
            <ul className="space-y-1.5">
              {topicData.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
