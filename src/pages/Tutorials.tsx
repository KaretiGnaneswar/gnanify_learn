import React from 'react';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { learnApi } from '../services/learn';

function CategoryIndex() {
  const [data, setData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    learnApi.listCategories()
      .then((json) => { if (alive) { setData(json); setError(null); } })
      .catch((e) => { if (alive) setError(e?.message || 'Failed to load'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  return (
    <div className="space-y-6">
      <Seo
        title="Tutorials – Gnanify Learn"
        description="Browse structured tutorials across programming, DSA, AI/ML and more at Gnanify Learn."
        canonical="/tutorials"
      />
      {loading && <div className="text-sm text-neutral-500">Loading…</div>}
      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      {data?.categories?.map((c: any) => (
        <div key={c.slug} className="card">
          <div className="card-body space-y-4">
            <div className="text-lg font-semibold">{c.title}</div>

            {/* Link to category view so sidebar shows subjects */}
            <div>
              <Link to={`/tutorials/${c.slug}`} className="inline-block px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-sm">
                View Subjects
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TopicDetail() {
  const { category, topic } = useParams();
  const [topicData, setTopicData] = React.useState<any | null>(null);
  const [catData, setCatData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const articleRef = React.useRef<HTMLElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      learnApi.getTopic(category as string, topic as string),
      learnApi.getCategory(category as string).catch(() => null),
    ])
      .then(([tJson, cJson]) => { if (alive) { setTopicData(tJson); setCatData(cJson); setError(null); } })
      .catch((e) => { if (alive) setError(e?.message || 'Failed to load topic'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [category, topic]);
  React.useEffect(() => {
    if (articleRef.current) {
      articleRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [category, topic]);
  const nextTopicSlug = React.useMemo(() => {
    const cat = catData;
    const t = topicData;
    if (!cat || !t) return undefined;
    const idx = cat.topics.findIndex((x: any) => x.slug === t.slug);
    const next = idx >= 0 ? cat.topics[idx + 1] : undefined;
    return next?.slug;
  }, [catData, topicData]);
  if (loading) return <div className="text-sm text-neutral-500">Loading…</div>;
  if (error) return <div className="text-sm text-red-600 dark:text-red-400">{error}</div>;
  if (!topicData) return <div className="text-sm text-neutral-500">Topic not found.</div>;
  return (
    <article ref={articleRef} className="prose prose-slate max-w-none dark:prose-invert">
      <Seo
        title={`${topicData.title} — ${topicData.category?.title ?? 'Tutorial'} | Gnanify Learn`}
        description={topicData.summary}
        canonical={`/tutorials/${category}/${topic}`}
      />
      <div className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">{topicData.difficulty} • {topicData.readTime}</div>
      <h1 ref={titleRef} tabIndex={-1} className="mb-2 outline-none">{topicData.title}</h1>
      <p className="lead">{topicData.summary}</p>
      <div className="grid md:grid-cols-4 gap-6 mt-4">
        <div className="md:col-span-3 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {topicData.sections.map((s: any) => (
              <Link
                key={s.id}
                to={`/tutorials/${category}/${topic}/${s.id}`}
                className="block px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
              >
                <div className="text-base font-semibold mb-1">{s.title}</div>
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

function CategoryOnly() {
  const { category } = useParams();
  const [catData, setCatData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    learnApi
      .getCategory(category as string)
      .then((c) => { if (alive) { setCatData(c as any); setError(null); } })
      .catch((e) => { if (alive) setError(e?.message || 'Failed to load category'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [category]);

  return (
    <div className="space-y-6">
      <Seo
        title={`${catData?.title || category} – Subjects | Gnanify Learn`}
        description={`Browse subjects under ${catData?.title || category}`}
        canonical={`/tutorials/${category}`}
      />
      <div className="text-lg font-semibold">{catData?.title || 'Category'}</div>
      {loading && <div className="text-sm text-neutral-500">Loading…</div>}
      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      {Array.isArray(catData?.subjects) && catData.subjects.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          {catData.subjects.map((s: any) => {
            const first = (s.topics || [])[0];
            const firstSlug = first?.tutorialSlug || first?.slug;
            return (
              <Link
                key={s.slug}
                to={firstSlug ? `/tutorials/${category}/${firstSlug}` : `/tutorials/${category}`}
                className="px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-sm"
              >
                {s.title}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-neutral-500">No subjects yet.</div>
      )}
    </div>
  );
}

export default function Tutorials() {
  return (
    <Routes>
      <Route index element={<CategoryIndex />} />
      <Route path=":category" element={<CategoryOnly />} />
      <Route path=":category/:topic" element={<TopicDetail />} />
    </Routes>
  );
}
