import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

    async function run() {
      try {
        if (token) {
          try { localStorage.setItem('auth_token', token); } catch {}
          // Fetch canonical profile
          try {
            const res = await fetch(`${API_BASE}/auth/profile/`, {
              headers: { Authorization: `Bearer ${token}` },
              credentials: 'include',
            });
            if (res.ok) {
              const profile = await res.json();
              try { localStorage.setItem('gn_user', JSON.stringify(profile)); } catch {}
              window.dispatchEvent(new Event('user:changed'));
            }
          } catch {}
        }
      } finally {
        // Clean URL and go home
        navigate('/', { replace: true });
      }
    }
    run();
  }, [navigate]);

  return (
    <div className="text-sm">Signing you in…</div>
  );
}
