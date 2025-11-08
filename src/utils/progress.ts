export type CategoryProgress = {
  topics: string[]; // completed topic slugs per category
  sections?: { [topic: string]: string[] }; // completed section ids per topic
};

export type RoadmapProgress = {
  [category: string]: CategoryProgress | string[]; // legacy array supported
};

const KEY = 'gn_progress_v1';

export function readProgress(): RoadmapProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const val = JSON.parse(raw);
    if (val && typeof val === 'object') return val as RoadmapProgress;
    return {};
  } catch {
    return {};
  }
}

export function writeProgress(p: RoadmapProgress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  try { window.dispatchEvent(new Event('progress:changed')); } catch {}
}

export function getCompleted(category: string): Set<string> {
  const p = readProgress();
  const entry = p[category];
  if (Array.isArray(entry)) return new Set(entry);
  const arr = entry?.topics || [];
  return new Set(arr);
}

export function isCompleted(category: string, topic: string): boolean {
  return getCompleted(category).has(topic);
}

export function markComplete(category: string, topic: string) {
  const p = readProgress();
  const entry = p[category];
  let base: CategoryProgress;
  if (Array.isArray(entry)) {
    base = { topics: [...entry], sections: {} };
  } else if (entry) {
    base = { topics: [...(entry.topics || [])], sections: entry.sections || {} };
  } else {
    base = { topics: [], sections: {} };
  }
  if (!base.topics.includes(topic)) base.topics.push(topic);
  p[category] = base;
  writeProgress(p);
}

export function markIncomplete(category: string, topic: string) {
  const p = readProgress();
  const entry = p[category];
  let base: CategoryProgress;
  if (Array.isArray(entry)) {
    base = { topics: entry.filter((t) => t !== topic), sections: {} };
  } else if (entry) {
    base = { topics: (entry.topics || []).filter((t) => t !== topic), sections: entry.sections || {} };
  } else {
    base = { topics: [], sections: {} };
  }
  // also clear sections for this topic
  if (base.sections) delete base.sections[topic];
  p[category] = base;
  writeProgress(p);
}

export function toggleComplete(category: string, topic: string) {
  if (isCompleted(category, topic)) markIncomplete(category, topic);
  else markComplete(category, topic);
}

export function getProgressPercent(category: string, totalTopics: number): number {
  if (totalTopics <= 0) return 0;
  const completed = getCompleted(category).size;
  return Math.min(100, Math.round((completed / totalTopics) * 100));
}

// Section-level helpers
export function getCompletedSections(category: string, topic: string): Set<string> {
  const p = readProgress();
  const entry = p[category];
  if (Array.isArray(entry)) return new Set();
  const arr = entry?.sections?.[topic] || [];
  return new Set(arr);
}

export function toggleSectionComplete(category: string, topic: string, sectionId: string, totalSections?: number) {
  const p = readProgress();
  const entry = p[category];
  let base: CategoryProgress = Array.isArray(entry)
    ? { topics: [...entry], sections: {} }
    : (entry ? { topics: [...(entry.topics || [])], sections: { ...(entry.sections || {}) } } : { topics: [], sections: {} });
  const set = new Set(base.sections?.[topic] || []);
  if (set.has(sectionId)) set.delete(sectionId); else set.add(sectionId);
  base.sections = base.sections || {};
  base.sections[topic] = Array.from(set);
  // If all sections completed, also mark topic complete
  if (typeof totalSections === 'number' && totalSections > 0 && set.size >= totalSections && !base.topics.includes(topic)) {
    base.topics.push(topic);
  }
  p[category] = base;
  writeProgress(p);
}

export function getTopicSectionPercent(category: string, topic: string, totalSections: number): number {
  if (totalSections <= 0) return 0;
  const set = getCompletedSections(category, topic);
  return Math.min(100, Math.round((set.size / totalSections) * 100));
}
