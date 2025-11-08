import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Topic() {
  const { slug } = useParams();
  const pretty = (slug || '').split('-').join(' ');
  const sections = [
    { id: 'intro', title: 'Introduction', content: 'This is an introduction to the topic.' },
    { id: 'syntax', title: 'Syntax', content: 'Syntax details and examples.' },
    { id: 'examples', title: 'Examples', content: 'Walkthrough examples to learn quickly.' },
  ];

  return (
    <article className="prose prose-slate max-w-none dark:prose-invert">
      <Seo
        title={`${pretty} | Gnanify Learn`}
        description={`Overview and examples for ${pretty}.`}
        canonical={`/topic/${slug}`}
      />
      <h1 className="mb-4">{pretty}</h1>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <h2>{s.title}</h2>
              <p>{s.content}</p>
            </section>
          ))}
        </div>
        {/* Right column intentionally empty; global sidebar shows Roadmaps & Analytics */}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Link to="/tutorials" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">← Back to Tutorials</Link>
        <Link to="/practice" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Practice →</Link>
      </div>
    </article>
  );
}
