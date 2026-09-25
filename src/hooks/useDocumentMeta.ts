import { useEffect } from 'react';

const DEFAULT_TITLE = 'AI Video Systems - Get More Qualified Sales Calls.';
const DEFAULT_DESCRIPTION =
  '$60m+ in tracked revenue across 96+ clients. AI Video Systems installs a done-for-you lead generation system for service businesses: content, ads, funnel and email marketing, tailored to the business and run for you. 30-day money-back guarantee.';

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
