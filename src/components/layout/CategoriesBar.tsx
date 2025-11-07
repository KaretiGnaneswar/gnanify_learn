import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TUTORIALS } from '../../data/tutorials';

export default function CategoriesBar() {
  const location = useLocation();
  const items = React.useMemo(() => {
    return TUTORIALS.map((c) => ({
      to: `/tutorials/${c.slug}/${c.topics[0]?.slug ?? 'intro'}`,
      label: c.title.split(' ')[0] === 'Data' ? 'DSA' : c.title.split(' ')[0],
    }));
  }, []);

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-white/80 via-white/60 to-white/80 dark:from-neutral-900/80 dark:via-neutral-900/60 dark:to-neutral-900/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 h-12 flex items-center gap-3 overflow-x-auto scrollbar-hide">
        {items.map((it) => {
          const isActive = location.pathname.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`relative text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
              }`}
            >
              {it.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
