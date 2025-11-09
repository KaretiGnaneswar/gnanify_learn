import type { VercelRequest, VercelResponse } from '@vercel/node';
import { TUTORIALS } from '../src/data/tutorials';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const q = (req.query.q as string | undefined)?.toLowerCase().trim() || '';
  if (!q) return res.status(200).json({ results: [] });

  const out: { title: string; to: string; meta: string }[] = [];
  for (const cat of TUTORIALS) {
    if (cat.title.toLowerCase().includes(q)) {
      out.push({ title: `${cat.title}`, to: `/tutorials/${cat.slug}/${cat.topics[0]?.slug ?? 'intro'}`, meta: 'Category' });
    }
    for (const t of cat.topics) {
      if (t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)) {
        out.push({ title: `${t.title} — ${cat.title}`, to: `/tutorials/${cat.slug}/${t.slug}`, meta: `${t.difficulty} • ${t.readTime}` });
      }
      for (const s of t.sections) {
        if (s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)) {
          out.push({ title: `${s.title} — ${t.title}`, to: `/tutorials/${cat.slug}/${t.slug}/${s.id}`, meta: `Section • ${cat.title}` });
        }
      }
    }
  }
  const seen = new Set<string>();
  const results = out.filter((r) => (seen.has(r.to) ? false : (seen.add(r.to), true))).slice(0, 50);
  res.status(200).json({ results });
}
