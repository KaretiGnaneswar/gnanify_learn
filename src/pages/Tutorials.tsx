import React from 'react';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import { TUTORIALS, findTopic, findCategory } from '../data/tutorials';
import Seo from '../components/Seo';

function CategoryIndex() {
  return (
    <div className="space-y-6">
      <Seo
        title="Tutorials – Gnanify Learn"
        description="Browse structured tutorials across programming, DSA, AI/ML and more at Gnanify Learn."
        canonical="/tutorials"
      />
      {TUTORIALS.map((c) => (
        <div key={c.slug} className="card">
          <div className="card-body">
            <div className="text-lg font-semibold mb-2">{c.title}</div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {c.topics.map((t) => (
                <Link key={t.slug} to={`/tutorials/${c.slug}/${t.slug}`} className="px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-sm">
                  {t.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TopicDetail() {
  const { category, topic } = useParams();
  const t = findTopic(category, topic);
  const cat = findCategory(category);
  const articleRef = React.useRef<HTMLElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  if (!t) {
    return <div className="text-sm text-neutral-500">Topic not found.</div>;
  }
  const nextTopicSlug = React.useMemo(() => {
    if (!cat) return undefined;
    const idx = cat.topics.findIndex((x) => x.slug === t.slug);
    if (idx === -1) return undefined;
    const next = cat.topics[idx + 1];
    return next?.slug;
  }, [cat, t.slug]);
  React.useEffect(() => {
    if (articleRef.current) {
      articleRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [category, topic]);

  return (
    <article ref={articleRef} className="prose prose-slate max-w-none dark:prose-invert">
      <Seo
        title={`${t.title} — ${cat?.title ?? 'Tutorial'} | Gnanify Learn`}
        description={t.summary}
        canonical={`/tutorials/${category}/${topic}`}
      />
      <div className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">{t.difficulty} • {t.readTime}</div>
      <h1 ref={titleRef} tabIndex={-1} className="mb-2 outline-none">{t.title}</h1>
      <p className="lead">{t.summary}</p>
      <div className="grid md:grid-cols-4 gap-6 mt-4">
        <div className="md:col-span-3 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {t.sections.map((s) => (
              <Link
                key={s.id}
                to={`/tutorials/${category}/${topic}/${s.id}`}
                className="block px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
              >
                <div className="text-base font-semibold mb-1">{s.title}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{s.content}</div>
              </Link>
            ))}
          </div>
          {nextTopicSlug && (
            <div className="mt-2 flex justify-end">
              <Link
                to={`/tutorials/${category}/${nextTopicSlug}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-500 text-white hover:brightness-105 shadow-sm"
              >
                Next Topic →
              </Link>
            </div>
          )}
        </div>
        {/* Right column intentionally empty; global sidebar shows Roadmaps & Analytics */}
      </div>
      <div className="mt-6">
        <Link to="/tutorials" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">← Back to Tutorials</Link>
      </div>
    </article>
  );
}

export default function Tutorials() {
  return (
    <Routes>
      <Route index element={<CategoryIndex />} />
      <Route path=":category/:topic" element={<TopicDetail />} />
    </Routes>
  );
}
