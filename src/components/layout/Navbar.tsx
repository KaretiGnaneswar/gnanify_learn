import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, Search, User } from 'lucide-react';
import SearchModal from '../modals/SearchModal';
import LoginModal from '../modals/LoginModal';

export default function Navbar() {
  const navigate = useNavigate();
  const storageKey = 'gn_theme';
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(storageKey);
    if (stored) return stored === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState<boolean>(getInitialTheme);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(() => {
    try {
      const raw = localStorage.getItem('gn_user');
      if (raw) return JSON.parse(raw);
    } catch {}
    return { name: 'Guest' };
  });
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try { return localStorage.getItem('auth_token'); } catch { return null; }
  });
  const isAuthed = Boolean(authToken);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  React.useEffect(() => {
    const loadUser = () => {
      try {
        const raw = localStorage.getItem('gn_user');
        if (raw) setUser(JSON.parse(raw)); else setUser({ name: 'Guest' });
      } catch { setUser({ name: 'Guest' }); }
      try { setAuthToken(localStorage.getItem('auth_token')); } catch { setAuthToken(null); }
    };
    window.addEventListener('storage', loadUser);
    window.addEventListener('user:changed', loadUser as EventListener);
    // initial sync
    loadUser();
    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('user:changed', loadUser as EventListener);
    };
  }, []);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(storageKey, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(storageKey, 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  const handleLogout = () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('gn_user');
    } catch {}
    setUser({ name: 'Guest' });
    setAuthToken(null);
    window.dispatchEvent(new Event('user:changed'));
    setProfileOpen(false);
    // Show Login button; user can click it to open the popup
    setLoginOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        
        <Link
          to="/"
          className="relative font-extrabold text-xl text-emerald-600 dark:text-emerald-400 tracking-tight"
        >
          <motion.span
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-[length:200%_200%] bg-clip-text text-transparent"
          >
            Gnanify Learn
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/tutorials" className="px-3 py-2 text-sm font-medium rounded-md text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            Tutorials
          </Link>
          <Link to="/courses" className="px-3 py-2 text-sm font-medium rounded-md text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            Courses
          </Link>
          <Link to="/practice" className="px-3 py-2 text-sm font-medium rounded-md text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            Practice
          </Link>
          <Link to="/jobs" className="px-3 py-2 text-sm font-medium rounded-md text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            Jobs
          </Link>
        </nav>

        {/* Center Actions (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Search className="h-4 w-4" />
            Search
          </button>

          {/* Switch to App Button */}
          {(() => {
            const BETA_URL = (import.meta as any).env?.VITE_BETA_URL || 'http://localhost:5173';
            const payload: any = {
              token: authToken || undefined,
              name: user?.full_name || user?.name || undefined,
              username: user?.username || undefined,
              email: user?.email || undefined,
            };
            // Remove undefined keys
            Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
            const qs = Object.keys(payload).length ? `?user=${encodeURIComponent(btoa(JSON.stringify(payload)))}` : '';
            const href = `${BETA_URL}${qs}`;
            return (
              <a
                href={href}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm hover:shadow-md hover:brightness-105 transition-all duration-200"
              >
                🚀 Switch to App
              </a>
            );
          })()}

          {/* Profile / Auth Controls */}
          {!isAuthed && (
            <button
              onClick={() => setLoginOpen(true)}
              className="ml-2 px-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Login
            </button>
          )}

          {/* Profile Avatar (only when authed) */}
          {isAuthed && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="ml-2 p-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/70 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Open profile menu"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <User className="h-4 w-4" />
                  </span>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{user.full_name || user.name || user.username || 'Guest'}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email || ''}</p>
                  </div>
                  <div className="h-px bg-neutral-200 dark:bg-neutral-800" />
                  <ul className="py-1 text-sm">
                    <li>
                      <button onClick={() => { setProfileOpen(false); navigate('/profile'); }} className="w-full text-left block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200">Profile</button>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200">Settings</a>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200">Sign out</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="ml-2 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
            )}
          </button>
        </div>
      </div>
    </header>
    <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
