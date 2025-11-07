import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Topic() {
  const { slug } = useParams();
  const sections = [
    { id: 'intro', title: 'Introduction', content: 'This is an introduction to the topic.' },
    { id: 'syntax', title: 'Syntax', content: 'Syntax details and examples.' },
    { id: 'examples', title: 'Examples', content: 'Walkthrough examples to learn quickly.' },
  ];

  return (
    <article className="prose prose-slate max-w-none dark:prose-invert">
      <h1 className="mb-4">{(slug || '').replaceAll('-', ' ')}</h1>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <h2>{s.title}</h2>
              <p>{s.content}</p>
            </section>
          ))}
        </div>
        <nav className="md:col-span-1 sticky top-20 self-start">
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
            <div className="text-sm font-semibold mb-2">On this page</div>
            <ul className="text-sm space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-neutral-600 dark:text-neutral-400 hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Link to="/tutorials" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">← Back to Tutorials</Link>
        <Link to="/practice" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Practice →</Link>
      </div>
    </article>
  );
}
