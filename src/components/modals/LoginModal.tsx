import React from 'react';

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

  React.useEffect(() => {
    if (open) {
      setEmail('');
      setPassword('');
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
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
      if (!data?.token) throw new Error('Invalid response: missing token');
      try { localStorage.setItem('auth_token', data.token); } catch {}
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
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[min(480px,92vw)] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl">
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="text-lg font-semibold">Login</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">Access your Gnanify Learn account</div>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              required
            />
          </div>
          {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
