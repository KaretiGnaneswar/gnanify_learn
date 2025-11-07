import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TUTORIALS } from '../data/tutorials';

export default function Home() {
  const categories = TUTORIALS.map((c) => ({ to: `/tutorials/${c.slug}/${c.topics[0]?.slug ?? 'intro'}`, title: c.title, desc: `${c.topics.length} topics` }));
  const featuredTopics = TUTORIALS.flatMap((c) => c.topics.slice(0, 2).map((t) => ({
    to: `/tutorials/${c.slug}/${t.slug}`,
    title: t.title,
    summary: t.summary,
    meta: `${t.difficulty} • ${t.readTime}`,
  }))).slice(0, 6);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 bg-gradient-to-br from-emerald-50 via-white to-white dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-3 text-emerald-700 dark:text-emerald-400 tracking-tight">Gnanify Learn</h1>
            <p className="text-neutral-700 dark:text-neutral-300 max-w-2xl leading-relaxed">
              Structured tutorials, examples, and practice sets to help you learn efficiently—crafted with clarity and precision for CSE learners.
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
