import { useEffect } from 'react';

const DEFAULT_TITLE = 'AI Video Systems — More Qualified Sales Calls From Your Ad Spend';
const DEFAULT_DESCRIPTION =
  "AI Video Systems helps established service businesses spending $5k+/month on ads turn cold traffic into better-prepared prospects, qualified sales calls and trackable revenue—without constant filming.";

function setMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Sets document title + meta description for the current route, and restores the
 * site defaults on unmount so client-side navigation back to "/" doesn't leave a
 * stale title behind (full page loads always get the correct tags from index.html).
 */
export default function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    setMetaTag('description', description);

    return () => {
      document.title = DEFAULT_TITLE;
      setMetaTag('description', DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}
