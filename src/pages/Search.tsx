import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

  const API = (import.meta as any).env?.VITE_LEARN_API_BASE_URL || '/api/learn';
  const [results, setResults] = useState<{ title: string; to: string; meta: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const query = q.trim();
    if (!query) { setResults([]); setError(null); return; }
    setLoading(true);
    fetch(`${API}/search?q=${encodeURIComponent(query)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then((json) => { if (alive) { setResults(json?.results || []); setError(null); } })
      .catch((e) => { if (alive) setError(e?.message || 'Search failed'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [API, q]);
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
          {q && loading && (<div className="text-sm text-neutral-500">Searching…</div>)}
          {q && !loading && results.length === 0 && !error && (
            <div className="text-sm text-neutral-500">No matches found in categories, topics, or sections.</div>
          )}
          {error && (<div className="text-sm text-red-600 dark:text-red-400">{error}</div>)}
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
