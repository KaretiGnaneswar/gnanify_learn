import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TUTORIALS } from '../../data/tutorials';
import { X } from 'lucide-react';

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [] as { title: string; to: string; meta: string }[];
    const out: { title: string; to: string; meta: string }[] = [];
    for (const cat of TUTORIALS) {
      if (cat.title.toLowerCase().includes(query)) {
        out.push({ title: `${cat.title}`, to: `/tutorials/${cat.slug}/${cat.topics[0]?.slug ?? 'intro'}`, meta: 'Category' });
      }
      for (const t of cat.topics) {
        if (t.title.toLowerCase().includes(query) || t.summary.toLowerCase().includes(query)) {
          out.push({ title: `${t.title} — ${cat.title}`, to: `/tutorials/${cat.slug}/${t.slug}`, meta: `${t.difficulty} • ${t.readTime}` });
        }
        for (const s of t.sections) {
          if (s.title.toLowerCase().includes(query) || s.content.toLowerCase().includes(query)) {
            out.push({ title: `${s.title} — ${t.title}`, to: `/tutorials/${cat.slug}/${t.slug}#${s.id}`, meta: `Section • ${cat.title}` });
          }
        }
      }
    }
    const seen = new Set<string>();
    return out.filter((r) => (seen.has(r.to) ? false : (seen.add(r.to), true))).slice(0, 50);
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[min(800px,92vw)] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl relative">
        <button
          onClick={onClose}
          aria-label="Close search"
          className="absolute top-2 right-2 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search categories, topics, sections... (Esc to close)"
            className="w-full px-3 py-2 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {q && results.length === 0 && (
            <div className="text-sm text-neutral-500">No matches found.</div>
          )}
          <ul className="space-y-1">
            {results.map((r, i) => (
              <li key={i}>
                <Link onClick={onClose} to={r.to} className="flex items-center justify-between px-2 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <span className="text-emerald-700 dark:text-emerald-400">{r.title}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{r.meta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
