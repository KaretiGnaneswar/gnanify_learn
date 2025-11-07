import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Tutorials from './pages/Tutorials';
import Topic from './pages/Topic';
import Article from './pages/Article';
import Practice from './pages/Practice';
import Search from './pages/Search';
import Login from './pages/Login';
import Profile from './pages/Profile';

export default function App() {
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      let userObj: any = null;
      if (params.has('user')) {
        // base64-encoded JSON blob
        const decoded = atob(params.get('user') || '');
        userObj = JSON.parse(decoded);
      } else if (params.has('name') || params.has('email')) {
        userObj = {
          name: params.get('name') || undefined,
          email: params.get('email') || undefined,
          token: params.get('token') || undefined,
        };
      }
      if (userObj) {
        // If token present, persist as auth_token for API calls
        if (userObj.token) {
          try { localStorage.setItem('auth_token', userObj.token); } catch {}
          const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';
          // Try to fetch canonical profile and replace gn_user with it
          fetch(`${API_BASE}/auth/profile/`, {
            headers: { Authorization: `Bearer ${userObj.token}` },
            credentials: 'include',
          })
            .then(async (res) => {
              if (!res.ok) throw new Error('profile fetch failed');
              return res.json();
            })
            .then((profile) => {
              try { localStorage.setItem('gn_user', JSON.stringify(profile)); } catch {}
              window.dispatchEvent(new Event('user:changed'));
            })
            .catch(() => {
              // Fallback to whatever was passed
              try { localStorage.setItem('gn_user', JSON.stringify(userObj)); } catch {}
              window.dispatchEvent(new Event('user:changed'));
            });
        } else {
          // No token, just persist provided user object
          try { localStorage.setItem('gn_user', JSON.stringify(userObj)); } catch {}
          window.dispatchEvent(new Event('user:changed'));
        }
        // Clean URL
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
      }
    } catch (e) {
      // no-op
    }
  }, []);
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

function AppRouter() {
  const location = useLocation();
  if (location.pathname.startsWith('/search')) {
    return (
      <Routes>
        <Route path="/search" element={<Search />} />
      </Routes>
    );
  }
  if (location.pathname.startsWith('/login')) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutorials/*" element={<Tutorials />} />
        <Route path="/topic/:slug" element={<Topic />} />
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

