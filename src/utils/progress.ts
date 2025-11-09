import { LEARN_API_BASE } from '../services/api';

export type CategoryProgress = {
  topics: string[];
  sections?: { [topic: string]: string[] };
};

export type RoadmapProgress = {
  [category: string]: CategoryProgress | string[];
};

const KEY = 'gn_progress_v1';
let MEM_PROGRESS: RoadmapProgress | null = null;

function getCache(): RoadmapProgress {
  if (MEM_PROGRESS) return MEM_PROGRESS;
  try {
    const raw = localStorage.getItem(KEY);
    MEM_PROGRESS = raw ? JSON.parse(raw) : {};
  } catch {
    MEM_PROGRESS = {};
  }
  return MEM_PROGRESS || {};
}

function setCache(p: RoadmapProgress) {
  MEM_PROGRESS = p;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  try { window.dispatchEvent(new Event('progress:changed')); } catch {}
}

async function fetchProgress(category: string) {
  try {
    const res = await fetch(`${LEARN_API_BASE}/progress/${encodeURIComponent(category)}/`);
    if (!res.ok) return;
    const data = await res.json();
    const cache = getCache();
    cache[category] = { topics: data?.topics || [], sections: data?.sections || {} };
    setCache(cache);
  } catch {}
}

export function readProgress(): RoadmapProgress { return getCache(); }
export function writeProgress(p: RoadmapProgress) { setCache(p); }

export function getCompleted(category: string): Set<string> {
  // optimistic cache read
  const entry = getCache()[category];
  // async refresh in background
  fetchProgress(category);
  if (Array.isArray(entry)) return new Set(entry);
  const arr = (entry as CategoryProgress | undefined)?.topics || [];
  return new Set(arr);
}

export function isCompleted(category: string, topic: string): boolean {
  return getCompleted(category).has(topic);
}

export async function toggleComplete(category: string, topic: string) {
  try {
    await fetch(`${LEARN_API_BASE}/progress/${encodeURIComponent(category)}/${encodeURIComponent(topic)}/`, {
      method: 'POST'
    });
    await fetchProgress(category);
  } catch {}
}

export function getProgressPercent(category: string, totalTopics: number): number {
  if (totalTopics <= 0) return 0;
  const completed = getCompleted(category).size;
  return Math.min(100, Math.round((completed / totalTopics) * 100));
}

export function getCompletedSections(category: string, topic: string): Set<string> {
  const entry = getCache()[category];
  fetchProgress(category);
  if (Array.isArray(entry)) return new Set();
  const arr = (entry as CategoryProgress | undefined)?.sections?.[topic] || [];
  return new Set(arr);
}

export async function toggleSectionComplete(category: string, topic: string, sectionId: string, totalSections?: number) {
  try {
    await fetch(`${LEARN_API_BASE}/progress/${encodeURIComponent(category)}/${encodeURIComponent(topic)}/${encodeURIComponent(sectionId)}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(typeof totalSections === 'number' ? { totalSections } : {}),
    });
    await fetchProgress(category);
  } catch {}
}

export function getTopicSectionPercent(category: string, topic: string, totalSections: number): number {
  if (totalSections <= 0) return 0;
  const set = getCompletedSections(category, topic);
  return Math.min(100, Math.round((set.size / totalSections) * 100));
}

// Back-compat named exports (async). These ensure callers importing these names won't break.
export async function markComplete(category: string, topic: string) {
  const cur = isCompleted(category, topic);
  if (!cur) await toggleComplete(category, topic);
}

export async function markIncomplete(category: string, topic: string) {
  const cur = isCompleted(category, topic);
  if (cur) await toggleComplete(category, topic);
}
