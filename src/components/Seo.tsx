import React from 'react';

type SeoProps = {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
};

const BASE_URL = 'https://learn.gnanify.com';
const DEFAULT_IMG = BASE_URL + '/og-image.png';

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  if (!value || typeof value !== 'string') return;
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) {
    if (selector.startsWith('meta[')) {
      el = document.createElement('meta');
      const m = selector.match(/\[(name|property)=["']([^"']+)["']\]/);
      if (m) (el as HTMLMetaElement).setAttribute(m[1], m[2]);
      document.head.appendChild(el);
    } else if (selector.startsWith('link[')) {
      el = document.createElement('link');
      const m = selector.match(/\[rel=["']([^"']+)["']\]/);
      if (m) (el as HTMLLinkElement).setAttribute('rel', m[1]);
      document.head.appendChild(el);
    }
  }
  if (el) (el as any).setAttribute(attr, value);
}

export default function Seo({ title, description, canonical, image }: SeoProps) {
  React.useEffect(() => {
    try {
      // Build absolute canonical safely
      let absUrl = '';
      const baseHost = (() => { try { return new URL(BASE_URL).host; } catch { return ''; } })();
      const currentHost = (typeof window !== 'undefined' && window.location && window.location.host) ? window.location.host : '';
      const isProdHost = baseHost && currentHost && baseHost === currentHost;
      // On non-production hosts (localhost, preview), only set document.title and skip meta tags to avoid browser URL strictness
      if (!isProdHost) {
        document.title = String(title || 'Gnanify Learn');
        return;
      }
      if (canonical) {
        const path = canonical.startsWith('/') ? canonical : `/${canonical}`;
        const candidate = canonical.startsWith('http') ? canonical : `${BASE_URL}${path}`;
        try {
          // Validate URL
          absUrl = new URL(candidate).toString();
        } catch {
          absUrl = '';
        }
      } else {
        absUrl = `${BASE_URL}/`;
      }
      const img = image && /^https?:\/\//.test(image) ? image : DEFAULT_IMG;
      document.title = String(title || 'Gnanify Learn');
      if (description) setMeta('meta[name="description"]', 'content', String(description));
      // Only set canonical on production host to avoid strict URL validation in some browsers on localhost
      if (absUrl && isProdHost) setMeta('link[rel="canonical"]', 'href', absUrl);
      setMeta('meta[property="og:type"]', 'content', 'website');
      setMeta('meta[property="og:site_name"]', 'content', 'Gnanify Learn');
      setMeta('meta[property="og:title"]', 'content', String(title || 'Gnanify Learn'));
      if (description) setMeta('meta[property="og:description"]', 'content', String(description));
      if (absUrl && isProdHost) setMeta('meta[property="og:url"]', 'content', absUrl);
      if (img) setMeta('meta[property="og:image"]', 'content', img);
      setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
      setMeta('meta[name="twitter:title"]', 'content', String(title || 'Gnanify Learn'));
      if (description) setMeta('meta[name="twitter:description"]', 'content', String(description));
      if (img) setMeta('meta[name="twitter:image"]', 'content', img);
    } catch {
      // swallow DOM exceptions to avoid breaking the route
    }
  }, [title, description, canonical, image]);

  return null;
}
