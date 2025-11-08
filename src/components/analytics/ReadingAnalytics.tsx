import React from 'react';
import { markComplete } from '../../utils/progress';

// Local storage key
const KEY = 'gn_reading_stats';

type StatItem = {
  path: string;
  ts: number; // timestamp
  dur: number; // seconds
  scroll: number; // 0-100
};

function readStats(): StatItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr as StatItem[];
    return [];
  } catch {
    return [];
  }
}

function writeStats(stats: StatItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(stats.slice(-500))); } catch {}
}

function useReadingTracker() {
  const path = React.useMemo(() => window.location.pathname + window.location.hash, []);
  const accRef = React.useRef<number>(0);
  const lastVisibleRef = React.useRef<number>(Date.now());
  const maxScrollRef = React.useRef<number>(0);

  React.useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const y = doc.scrollTop;
      const pct = Math.min(100, Math.max(0, (y / total) * 100));
      if (pct > maxScrollRef.current) maxScrollRef.current = pct;
    }
    function onVisibility() {
      const now = Date.now();
      if (document.visibilityState === 'hidden') {
        accRef.current += (now - lastVisibleRef.current) / 1000;
      } else if (document.visibilityState === 'visible') {
        lastVisibleRef.current = now;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    const interval = window.setInterval(() => {
      // Periodically update max scroll in case of no scroll events
      onScroll();
    }, 1500);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('scroll', onScroll as any);
      document.removeEventListener('visibilitychange', onVisibility as any);
      const now = Date.now();
      if (document.visibilityState === 'visible') {
        accRef.current += (now - lastVisibleRef.current) / 1000;
      }
      const duration = Math.max(0, Math.round(accRef.current));
      const item: StatItem = { path, ts: Date.now(), dur: duration, scroll: Math.round(maxScrollRef.current) };
      const stats = readStats();
      stats.push(item);
      writeStats(stats);

      // If this is a tutorial page, auto-mark complete on sufficient scroll depth
      try {
        const url = new URL(window.location.href);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts[0] === 'tutorials' && parts[1] && parts[2]) {
          const category = parts[1];
          const topic = parts[2];
          if (maxScrollRef.current >= 60) {
            markComplete(category, topic);
          }
        }
      } catch {}
    };
  }, [path]);
}

function secsToStr(s: number) {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return `${m}m ${r}s`;
}

export default function ReadingAnalytics() {
  useReadingTracker();
  const [stats, setStats] = React.useState<StatItem[]>([]);

  React.useEffect(() => {
    const load = () => setStats(readStats());
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, []);

  const path = window.location.pathname;
  const recent = React.useMemo(() => {
    const now = Date.now();
    const last30d = stats.filter(s => now - s.ts < 30 * 24 * 3600 * 1000);
    const perPath = last30d.filter(s => s.path.startsWith(path));
    const avgDur = perPath.length ? Math.round(perPath.reduce((a, b) => a + b.dur, 0) / perPath.length) : 0;
    const avgScroll = perPath.length ? Math.round(perPath.reduce((a, b) => a + b.scroll, 0) / perPath.length) : 0;
    const completedArticles = new Set<string>();
    last30d.forEach(s => { if (s.scroll >= 60) completedArticles.add(s.path.split('#')[0]); });
    return { count: perPath.length, avgDur, avgScroll, completed: completedArticles.size };
  }, [stats, path]);

  const latestForThis = React.useMemo(() => {
    const same = stats.filter(s => s.path.split('#')[0] === path).slice(-1)[0];
    return same;
  }, [stats, path]);

  return (
    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 shadow-sm">
      <div className="text-sm font-semibold mb-3">📈 Reading Analytics</div>
      <div className="space-y-3 text-sm">
        <div>
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Avg time on this topic</span>
            <span>{secsToStr(recent.avgDur)}</span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded">
            <div className="h-2 bg-emerald-500 rounded" style={{ width: `${Math.min(100, (recent.avgDur / 300) * 100)}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Avg scroll depth</span>
            <span>{recent.avgScroll}%</span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded">
            <div className="h-2 bg-emerald-500 rounded" style={{ width: `${recent.avgScroll}%` }} />
          </div>
        </div>
        <div className="text-xs text-neutral-600 dark:text-neutral-300">
          Completed articles (30d): <span className="font-medium">{recent.completed}</span>
        </div>
        {latestForThis && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Last session: {secsToStr(latestForThis.dur)} • {latestForThis.scroll}% scroll
          </div>
        )}
      </div>
    </div>
  );
}
