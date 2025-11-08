import React from 'react';
import Navbar from './Navbar';
import CategoriesBar from './CategoriesBar';
import { Link, useLocation } from 'react-router-dom';
import SideNavbar from './SideNavbar';
import { TUTORIALS } from '../../data/tutorials';
import RoadmapPanel from '../roadmap/RoadmapPanel';
import ReadingAnalytics from '../analytics/ReadingAnalytics';
import AdSlot from '../ads/AdSlot';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isRoadmap = location.pathname.startsWith('/roadmap');
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-neutral-900/70 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <Navbar />
        <CategoriesBar />
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex">
          {/* Left Sidebar */}
          {!isRoadmap && (
            <aside className="w-64 shrink-0 hidden lg:block">
              <SideNavbar />
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 py-6 lg:max-w-none lg:mx-0 lg:px-6">
              <div className="flex gap-6">
                <main className="flex-1 min-w-0 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6 transition-all duration-200">
                  {children}
                  <div className="mt-6 md:hidden">
                    <AdSlot id="mobile-bottom" sizes="320x100,320x50" className="w-full h-[100px]" />
                  </div>
                </main>

                {/* Right Sidebar */}
                {!isRoadmap && (
                  <aside className="hidden lg:block shrink-0 lg:w-64 xl:w-72 2xl:w-80">
                    <div className="sticky top-28 space-y-4">
                      <ReadingAnalytics />
                      <AdSlot id="right-rail-inline" sizes="300x250,336x280" className="w-full h-[250px]" />
                      <RoadmapPanel />
                      <div className="hidden xl:block">
                        <AdSlot id="right-rail-sticky" sizes="300x600,160x600" className="w-full h-[600px]" />
                      </div>
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ad (above footer) */}
      {!isRoadmap && (
        <div className="border-t border-neutral-200/70 dark:border-neutral-800/70 bg-white/50 dark:bg-neutral-900/50">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <AdSlot
              id="bottom-leaderboard"
              sizes="320x100,728x90,970x250"
              className="w-full h-[100px] md:h-[90px] xl:h-[250px]"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-sm font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Gnanify Learn</div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Structured learning paths, tutorials, and practice to advance your skills.</p>
            </div>

            <div>
              <div className="text-sm font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Tutorials</div>
              <ul className="space-y-2 text-sm">
                {TUTORIALS.slice(0, 8).map((c) => (
                  <li key={c.slug}>
                    <Link to={`/tutorials/${c.slug}/${c.topics[0]?.slug ?? 'intro'}`} className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Explore</div>
              <ul className="space-y-2 text-sm">
                <li><Link to="/courses" className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400">Courses</Link></li>
                <li><Link to="/practice" className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400">Practice</Link></li>
                <li><Link to="/jobs" className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400">Jobs</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Resources</div>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-left text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400">Search</button></li>
                <li><Link to="/" className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} <span className="font-semibold text-blue-600 dark:text-blue-400">Gnanify Learn</span>. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
