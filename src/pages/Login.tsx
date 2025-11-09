import React from 'react';
import { useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Login failed');
      }
      const data = await res.json();
      if (data?.token) {
        try { localStorage.setItem('auth_token', data.token); } catch {}
        // Fetch profile
        try {
          const pRes = await fetch(`${API_BASE}/auth/profile/`, {
            headers: { Authorization: `Bearer ${data.token}` },
            credentials: 'include',
          });
          if (pRes.ok) {
            const profile = await pRes.json();
            try { localStorage.setItem('gn_user', JSON.stringify(profile)); } catch {}
          }
        } catch {}
        window.dispatchEvent(new Event('user:changed'));
        navigate('/', { replace: true });
      } else {
        throw new Error('Invalid response: missing token');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const redirectToBTA = () => {
    const BTA_BASE = (import.meta as any).env?.VITE_BTA_BASE_URL || 'https://bta.gnanify.com';
    const origin = window.location.origin;
    const callback = `${origin}/auth/callback`;
    const url = `${BTA_BASE.replace(/\/$/, '')}/login?redirect_uri=${encodeURIComponent(callback)}`;
    window.location.href = url;
  };

  return (
    <div className="max-w-md mx-auto">
      <Seo
        title="Login – Gnanify Learn"
        description="Sign in to Gnanify Learn to sync your progress across devices and access personalized learning."
        canonical="/login"
      />
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <div className="space-y-3 mb-6">
        <button onClick={redirectToBTA} className="btn-primary w-full">Continue with Gnanify</button>
        <div className="text-xs text-neutral-500 text-center">or use fallback form</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>
        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
