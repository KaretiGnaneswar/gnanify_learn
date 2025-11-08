import React from 'react';
import Seo from '../components/Seo';

export default function Profile() {
  const [profile, setProfile] = React.useState<any>(() => {
    try {
      const raw = localStorage.getItem('gn_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

  React.useEffect(() => {
    const token = (() => { try { return localStorage.getItem('auth_token'); } catch { return null; } })();
    if (!token) return; // show cached profile only if not authed
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/auth/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        try { localStorage.setItem('gn_user', JSON.stringify(data)); } catch {}
        window.dispatchEvent(new Event('user:changed'));
      })
      .catch((e) => setError(e.message || 'Failed to fetch profile'))
      .finally(() => setLoading(false));
  }, []);

  const renderField = (label: string, value: any) => (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 break-all">{value ?? '-'}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <Seo
        title="Profile – Gnanify Learn"
        description="Your account details and learning profile on Gnanify Learn."
        canonical="/profile"
      />
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Your account details shared across Gnanify apps.</p>
      </div>

      {loading && <div className="text-sm">Loading profile…</div>}
      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField('Full name', profile?.full_name || profile?.name)}
        {renderField('Username', profile?.username)}
        {renderField('Email', profile?.email || profile?.primary_email)}
        {renderField('First name', profile?.first_name)}
        {renderField('Last name', profile?.last_name)}
      </div>

      {profile && (
        <div className="mt-4">
          <details className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
            <summary className="cursor-pointer text-sm font-medium">Raw data</summary>
            <pre className="mt-3 text-xs overflow-auto bg-neutral-50 dark:bg-neutral-950 p-3 rounded">
{JSON.stringify(profile, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
