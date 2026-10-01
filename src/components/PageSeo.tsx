import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { blogPosts } from '@/lib/blog';
import images from '@/content/blog-images.json';
import { pageSeo } from '@/lib/seo.js';

export function PageSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = pageSeo(pathname, blogPosts, images);
    document.title = seo.title;
    const meta = (attribute: 'name' | 'property', key: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>('meta[' + attribute + '="' + key + '"]');
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = value;
    };
    meta('name', 'description', seo.description);
    meta('name', 'robots', seo.robots);
    for (const [key, value] of Object.entries({
      'og:title': seo.title, 'og:description': seo.description, 'og:url': seo.url,
      'og:image': seo.image, 'og:type': seo.type, 'og:site_name': 'NumGuru',
      'twitter:card': 'summary_large_image', 'twitter:title': seo.title,
      'twitter:description': seo.description, 'twitter:url': seo.url, 'twitter:image': seo.image,
    })) meta('property', key, value);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = seo.url;
    document.querySelectorAll('script[type="application/ld+json"]:not(#page-json-ld)').forEach(element => element.remove());
    let schema = document.head.querySelector<HTMLScriptElement>('#page-json-ld');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'page-json-ld';
      schema.type = 'application/ld+json';
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify(seo.schemas);
  }, [pathname]);
  return null;
}
