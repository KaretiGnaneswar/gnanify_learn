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
  if (!value) return;
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
    const absUrl = canonical?.startsWith('http') ? canonical : (canonical ? `${BASE_URL}${canonical}` : BASE_URL + '/');
    const img = image || DEFAULT_IMG;
    document.title = title;
    if (description) setMeta('meta[name="description"]', 'content', description);
    if (absUrl) setMeta('link[rel="canonical"]', 'href', absUrl);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:site_name"]', 'content', 'Gnanify Learn');
    setMeta('meta[property="og:title"]', 'content', title);
    if (description) setMeta('meta[property="og:description"]', 'content', description);
    if (absUrl) setMeta('meta[property="og:url"]', 'content', absUrl);
    if (img) setMeta('meta[property="og:image"]', 'content', img);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', title);
    if (description) setMeta('meta[name="twitter:description"]', 'content', description);
    if (img) setMeta('meta[name="twitter:image"]', 'content', img);
  }, [title, description, canonical, image]);

  return null;
}
