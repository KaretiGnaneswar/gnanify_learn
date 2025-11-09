const envBase: string | undefined = (import.meta as any).env?.VITE_LEARN_API_BASE_URL;
const isLocalHost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
export const LEARN_API_BASE: string = envBase || (isLocalHost ? 'http://127.0.0.1:8000/api/learn' : '/api/learn');

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: 'include',
    headers: { 'Accept': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: request as <T>(url: string) => Promise<T>,
};
