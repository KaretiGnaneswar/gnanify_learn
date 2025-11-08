import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TUTORIALS } from '../data/tutorials';
import Seo from '../components/Seo';

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [q, setQ] = useState(params.get('q') || '');

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const nq = p.get('q') || '';
    setQ(nq);
  }, [location.search]);

  // Keep URL in sync as user types (live search)
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const curr = p.get('q') || '';
    if (q !== curr) {
      const next = new URLSearchParams();
      if (q) next.set('q', q);
      navigate({ pathname: '/search', search: next.toString() }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [] as { title: string; to: string; meta: string }[];
    const out: { title: string; to: string; meta: string }[] = [];
    for (const cat of TUTORIALS) {
      // match category
      if (cat.title.toLowerCase().includes(query)) {
        out.push({ title: `${cat.title}`, to: `/tutorials/${cat.slug}/${cat.topics[0]?.slug ?? 'intro'}`, meta: 'Category' });
      }
      for (const t of cat.topics) {
        // match topic
        if (
          t.title.toLowerCase().includes(query) ||
          t.summary.toLowerCase().includes(query)
        ) {
          out.push({ title: `${t.title} — ${cat.title}`, to: `/tutorials/${cat.slug}/${t.slug}`, meta: `${t.difficulty} • ${t.readTime}` });
        }
        // match sections
        for (const s of t.sections) {
          if (s.title.toLowerCase().includes(query) || s.content.toLowerCase().includes(query)) {
            out.push({ title: `${s.title} — ${t.title}`, to: `/tutorials/${cat.slug}/${t.slug}/${s.id}`, meta: `Section • ${cat.title}` });
          }
        }
      }
    }
    // de-dup by to
    const seen = new Set<string>();
    return out.filter((r) => (seen.has(r.to) ? false : (seen.add(r.to), true))).slice(0, 50);
  }, [q]);
  const title = q ? `Search “${q}” – Gnanify Learn` : 'Search – Gnanify Learn';
  const description = q
    ? `Find tutorials, topics and subtopics about ${q} across DSA, Web, Python, Java and more.`
    : 'Search Gnanify Learn tutorials, topics and subtopics across DSA, Web, Python, Java and more.';
  const canonical = q ? `/search?q=${encodeURIComponent(q)}` : '/search';
  return (
    <div className="space-y-4">
      <Seo title={title} description={description} canonical={canonical} />
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Search categories, topics, sections..."
          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
        />
      </div>
      <div className="card">
        <div className="card-body">
          <div className="text-sm font-semibold mb-2">Results {q ? `for "${q}"` : ''}</div>
          {q && results.length === 0 && (
            <div className="text-sm text-neutral-500">No matches found in categories, topics, or sections.</div>
          )}
          <ul className="space-y-2">
            {results.map((r,i)=> (
              <li key={i} className="flex items-center justify-between">
                <Link to={r.to} className="text-emerald-600 dark:text-emerald-400 hover:underline">{r.title}</Link>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{r.meta}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
