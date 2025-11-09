import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { learnApi } from '../services/learn';

interface SubtopicParams {
  category: string;
  topic: string;
  subtopic: string;
}

export default function Subtopic() {
  const { category, topic, subtopic } = useParams<keyof SubtopicParams>() as SubtopicParams;
  const [subData, setSubData] = React.useState<any | null>(null);
  const [topicData, setTopicData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      learnApi.getSubtopic(category, topic, subtopic),
      learnApi.getTopic(category, topic).catch(() => null),
    ])
      .then(([sJson, tJson]) => { if (alive) { setSubData(sJson); setTopicData(tJson); setError(null); } })
      .catch((e) => { if (alive) setError(e?.message || 'Failed to load subtopic'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [category, topic, subtopic]);

  const currentIndex = React.useMemo(() => {
    if (!topicData?.sections) return -1;
    return topicData.sections.findIndex((s: any) => s.id === subtopic);
  }, [topicData, subtopic]);
  const prevSection = currentIndex > 0 ? topicData.sections[currentIndex - 1] : null;
  const nextSection = (topicData?.sections && currentIndex >= 0 && currentIndex < topicData.sections.length - 1) ? topicData.sections[currentIndex + 1] : null;

  if (loading) return <div className="text-sm text-neutral-500">Loading…</div>;
  if (error) return <div className="text-sm text-red-600 dark:text-red-400">{error}</div>;
  if (!subData?.subtopic) return <div className="text-sm text-neutral-500">Subtopic not found.</div>;

  const section = subData.subtopic;
  const title = section.title;
  const topicTitle = subData.topic?.title || topicData?.title || 'Topic';
  const description = (section.content || '').slice(0, 160);
  const isProdHost = typeof window !== 'undefined' && window.location && window.location.host === 'learn.gnanify.com';
  return (
    <article className="prose prose-slate max-w-none dark:prose-invert pb-20 md:pb-0">
      {isProdHost && (
        <Seo
          title={`${title} — ${topicTitle} | Gnanify Learn`}
          description={description}
          canonical={`/tutorials/${category}/${topic}/${subtopic}`}
        />
      )}
      <h1 className="mb-4">{title}</h1>
      <div className="mb-6">
        <Link 
          to={`/tutorials/${category}/${topic}`}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          ← Back to {topicTitle}
        </Link>
      </div>
      <div className="space-y-6">
        <p>{section.content}</p>
      </div>
      <div className="fixed bottom-3 inset-x-3 md:hidden flex items-center justify-between gap-3 bg-white/90 dark:bg-neutral-900/80 backdrop-blur rounded-xl border border-neutral-200 dark:border-neutral-800 p-2 shadow-lg">
        <Link
          to={prevSection ? `/tutorials/${category}/${topic}/${prevSection.id}` : `/tutorials/${category}/${topic}`}
          className={`px-3 py-2 rounded-lg text-sm ${prevSection ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-400 pointer-events-none'}`}
        >
          ← Prev
        </Link>
        <Link
          to={nextSection ? `/tutorials/${category}/${topic}/${nextSection.id}` : `/tutorials/${category}/${topic}`}
          className={`px-3 py-2 rounded-lg text-sm ${nextSection ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-400 pointer-events-none'}`}
        >
          Next →
        </Link>
      </div>
    </article>
  );
}
