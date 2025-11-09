import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCompletedSections, toggleSectionComplete, getTopicSectionPercent, getProgressPercent } from '../../utils/progress';
import { ChevronDown } from 'lucide-react';
import { learnApi } from '../../services/learn';

export default function SideNavbar() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const isTutorials = pathParts[0] === 'tutorials';
  const currentCategory = isTutorials ? pathParts[1] : undefined;
  const currentTopic = isTutorials ? pathParts[2] : undefined;
  const [catData, setCatData] = React.useState<any | undefined>(undefined);
  const [topicData, setTopicData] = React.useState<any | undefined>(undefined);
  const [browseItems, setBrowseItems] = React.useState<Array<{ slug: string; title: string; firstTopic?: string }>>([]);
  const [sectionsMap, setSectionsMap] = React.useState<Record<string, Array<{ id: string; title: string }>>>({});
  React.useEffect(() => {
    let alive = true;
    if (currentCategory) {
      learnApi.getCategory(currentCategory).then((c) => { if (alive) setCatData(c as any); }).catch(() => { if (alive) setCatData(undefined); });
    } else {
      setCatData(undefined);
    }
    if (currentCategory && currentTopic) {
      learnApi.getTopic(currentCategory, currentTopic).then((t) => { if (alive) setTopicData(t as any); }).catch(() => { if (alive) setTopicData(undefined); });
    } else {
      setTopicData(undefined);
    }
    return () => { alive = false; };
  }, [currentCategory, currentTopic]);
  const [, force] = React.useReducer((x) => x + 1, 0);
  const [openTopic, setOpenTopic] = React.useState<string | null>(null);
  React.useEffect(() => {
    const onChange = () => force();
    window.addEventListener('progress:changed', onChange);
    return () => window.removeEventListener('progress:changed', onChange);
  }, []);

  // Load sections for a topic when it is opened, if not already cached
  React.useEffect(() => {
    let alive = true;
    if (openTopic && currentCategory && !sectionsMap[openTopic]) {
      learnApi
        .getTopic(currentCategory, openTopic)
        .then((t) => {
          if (!alive) return;
          setSectionsMap((m) => ({ ...m, [openTopic]: t.sections || [] }));
        })
        .catch(() => {
          if (!alive) return;
          setSectionsMap((m) => ({ ...m, [openTopic]: [] }));
        });
    }
    return () => { alive = false; };
  }, [openTopic, currentCategory, sectionsMap]);

  // Fetch browse categories once
  React.useEffect(() => {
    let alive = true;
    learnApi.listCategories()
      .then((json) => {
        if (!alive) return;
        const seen = new Set<string>();
        const arr = (json.categories || [])
          .filter((c: any) => (seen.has(c.slug) ? false : (seen.add(c.slug), true)))
          .map((c: any) => {
            const subjTopics = Array.isArray(c.subjects)
              ? c.subjects.flatMap((s: any) => (s.topics || []))
              : [];
            const legacyFirst = c.topics && c.topics[0]?.slug;
            const subjectFirst = subjTopics[0]?.tutorialSlug || subjTopics[0]?.slug;
            return ({ slug: c.slug, title: c.title, firstTopic: subjectFirst || legacyFirst });
          });
        setBrowseItems(arr);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <div className="sticky top-28 border-r border-neutral-200 dark:border-neutral-800 pr-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
      <div className="p-4 space-y-6 text-sm">
        {!isTutorials && (
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-3 font-semibold">Browse</div>
            <ul className="space-y-1.5">
              {browseItems.map((c) => (
                <li key={c.slug}>
                  <Link to={`/tutorials/${c.slug}/${c.firstTopic ?? 'intro'}`} className="block px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 hover:text-blue-600 dark:hover:text-blue-400">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isTutorials && catData && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-semibold">
                {catData.title}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-5 h-5">
                  <svg className="w-full h-full" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="17" fill="none" className="stroke-neutral-200 dark:stroke-neutral-700" strokeWidth="6"/>
                    <circle 
                      cx="20" 
                      cy="20" 
                      r="17" 
                      fill="none" 
                      className="stroke-emerald-600 dark:stroke-emerald-400" 
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="100"
                      strokeDashoffset={100 - getProgressPercent(catData.slug, catData.topics.length)}
                      transform="rotate(-90 20 20)"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {Math.round(getProgressPercent(catData.slug, catData.topics.length))}%
                </span>
              </div>
            </div>
            {/* If no topic chosen yet: show only subjects list; clicking subject opens its first topic */}
            {Array.isArray(catData.subjects) && catData.subjects.length > 0 && !currentTopic ? (
              <ul className="space-y-1.5">
                {catData.subjects.map((sub: any) => {
                  const first = (sub.topics || [])[0];
                  const firstSlug = first?.tutorialSlug || first?.slug;
                  return (
                    <li key={sub.slug}>
                      <Link to={firstSlug ? `/tutorials/${catData.slug}/${firstSlug}` : `/tutorials/${catData.slug}`} className="block px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150">
                        {sub.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : Array.isArray(catData.subjects) && catData.subjects.length > 0 && currentTopic ? (
              // With a topic chosen: find the subject that contains it, and render ONLY that subject's topics
              (() => {
                const subject = (catData.subjects || []).find((sub: any) => (sub.topics || []).some((t: any) => (t.tutorialSlug || t.slug) === currentTopic));
                if (!subject) return (
                  <div className="text-sm text-neutral-500">No subject found for this topic.</div>
                );
                return (
                  <div>
                    <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">{subject.title}</div>
                    <ul className="space-y-1.5">
                      {(subject.topics || []).map((t: any) => {
                        const slug = t.tutorialSlug || t.slug;
                        const active = slug === currentTopic;
                        const isOpen = openTopic === slug;
                        const sections = sectionsMap[slug] || t.sections || [];
                        return (
                          <li key={slug}>
                            <div className={`flex items-center justify-between px-2 py-1 rounded-md transition-colors duration-150 ${active ? 'bg-neutral-100 dark:bg-neutral-800' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                              <Link to={`/tutorials/${catData.slug}/${slug}`} className={`${active ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                {t.title}
                              </Link>
                              <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-label={isOpen ? 'Hide subtopics' : 'Show subtopics'}
                                onClick={() => setOpenTopic(prev => prev === slug ? null : slug)}
                                className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                              >
                                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                            {isOpen && (
                              <ul className="mt-1 ml-2 space-y-1.5">
                                {sections.map((s: any) => {
                                  const done = getCompletedSections(catData.slug, slug).has(s.id);
                                  return (
                                    <li key={s.id} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150">
                                      <input
                                        type="checkbox"
                                        checked={done}
                                        onChange={() => toggleSectionComplete(catData.slug, slug, s.id, sections.length)}
                                        className="shrink-0"
                                      />
                                      <Link to={`/tutorials/${catData.slug}/${slug}/${s.id}`} className="flex-1 text-xs">
                                        {s.title}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()
            ) : (
              <ul className="space-y-1.5">
                {(catData.topics || []).map((t: any) => {
                  const active = t.slug === currentTopic;
                  const isOpen = openTopic === t.slug;
                  const sections = sectionsMap[t.slug] || t.sections || [];
                  return (
                    <li key={t.slug}>
                      <div className={`flex items-center justify-between px-2 py-1 rounded-md transition-colors duration-150 ${active ? 'bg-neutral-100 dark:bg-neutral-800' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                        <Link to={`/tutorials/${catData.slug}/${t.slug}`} className={`${active ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                          {t.title}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-label={isOpen ? 'Hide subtopics' : 'Show subtopics'}
                          onClick={() => setOpenTopic(prev => prev === t.slug ? null : t.slug)}
                          className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      {isOpen && (
                        <ul className="mt-1 ml-2 space-y-1.5">
                          {sections.map((s: any) => {
                            const done = getCompletedSections(catData.slug, t.slug).has(s.id);
                            return (
                              <li key={s.id} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150">
                                <input
                                  type="checkbox"
                                  checked={done}
                                  onChange={() => toggleSectionComplete(catData.slug, t.slug, s.id, sections.length)}
                                  className="shrink-0"
                                />
                                <Link to={`/tutorials/${catData.slug}/${t.slug}/${s.id}`} className="flex-1 text-xs">
                                  {s.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

