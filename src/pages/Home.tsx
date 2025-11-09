import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { learnApi } from '../services/learn';
import Seo from '../components/Seo';

export default function Home() {
  const [categories, setCategories] = React.useState<Array<{ to: string; title: string; desc: string }>>([]);
  const [featuredTopics, setFeaturedTopics] = React.useState<Array<{ to: string; title: string; summary?: string; meta?: string }>>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    learnApi.listCategories()
      .then((json) => {
        if (!alive) return;
        const cats = (json.categories || []);
        const catCards = cats.map((c: any) => {
          const legacyTopics = Array.isArray(c.topics) ? c.topics : [];
          const subjectTopics = Array.isArray(c.subjects)
            ? c.subjects.flatMap((s: any) => (s.topics || []))
            : [];
          const totalTopics = subjectTopics.length || legacyTopics.length || 0;
          return {
            to: `/tutorials/${c.slug}`,
            title: c.title,
            desc: `${totalTopics} topics`,
          };
        });
        setCategories(catCards);
        const raw = cats.flatMap((c: any) => {
          const legacy = (c.topics || []).slice(0, 2).map((t: any) => ({
            to: `/tutorials/${c.slug}/${t.slug}`,
            title: t.title,
            summary: t.summary,
            meta: `${t.difficulty || ''} ${t.readTime ? `• ${t.readTime}` : ''}`.trim(),
          }));
          const subjects = Array.isArray(c.subjects)
            ? c.subjects.flatMap((s: any) => (s.topics || []).slice(0, 2).map((t: any) => ({
                to: `/tutorials/${c.slug}/${t.tutorialSlug || t.slug}`,
                title: t.title,
                summary: t.summary,
                meta: `${t.difficulty || ''} ${t.readTime ? `• ${t.readTime}` : ''}`.trim(),
              })))
            : [];
          return [...subjects, ...legacy];
        });
        const seen = new Set<string>();
        setFeaturedTopics(raw.filter((x) => (seen.has(x.to) ? false : (seen.add(x.to), true))).slice(0, 6));
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="space-y-10">
      <Seo
        title="Learnify by Gnanify – Learn Coding, AI, and DSA"
        description="Learn DSA, AI/ML, Web Development, and more at Gnanify Learn. Structured tutorials, examples, and practice to become job-ready."
        canonical="/"
      />
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 bg-gradient-to-br from-emerald-50 via-white to-white dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-3">
              Crack Your Dream Job
            </div>
            <h1 className="text-4xl font-extrabold mb-3 text-emerald-700 dark:text-emerald-400 tracking-tight">Gnanify Learn</h1>
            <p className="text-neutral-700 dark:text-neutral-300 max-w-2xl leading-relaxed">
              Master in-demand tech skills with our structured learning paths. Land your dream job with confidence through our comprehensive tutorials and hands-on practice.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/tutorials"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                Browse Tutorials
              </Link>
              <Link
                to="/practice"
                className="px-5 py-2.5 border border-emerald-600 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-neutral-800 transition-all"
              >
                Practice
              </Link>
            </div>
          </div>
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search tutorials, topics, and examples"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/80 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              />
              <div className="absolute right-2 top-2 text-xs text-neutral-500 dark:text-neutral-400">Press ⏎</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      <section>
        <div className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Popular Categories</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c) => (
            <motion.div
              key={c.to}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={c.to}
                className="block rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{c.title}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{c.desc}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Topics */}
      <section>
        <div className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Featured Topics</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredTopics.map((t) => (
            <motion.div key={t.to} whileHover={{ y: -2 }}>
              <Link to={t.to} className="block rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{t.meta}</div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">{t.title}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">{t.summary}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Panel */}
      <section>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xl font-semibold">Level up your skills</div>
              <div className="text-sm opacity-90">Practice problems and track your progress with curated paths.</div>
            </div>
            <div className="flex gap-3">
              <Link to="/practice" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Start Practicing</Link>
              <Link to="/tutorials" className="px-4 py-2 rounded-lg bg-black/20 hover:bg-black/30 transition">Explore Tutorials</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
