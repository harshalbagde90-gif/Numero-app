export const SITE_URL = 'https://numguru.online';

export function absoluteUrl(value = '/og-image.png') {
  return new URL(value, SITE_URL + '/').href;
}
function date(value) {
  const parsed = new Date(value);
  return value && !Number.isNaN(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : undefined;
}
export function pageSeo(pathname, posts, images) {
  const route = pathname.replace(/\/+$/, '') || '/';
  const url = SITE_URL + (route === '/' ? '/' : route);
  const organization = { '@type': 'Organization', name: 'NumGuru', url: SITE_URL + '/', logo: absoluteUrl('/favicon.svg') };
  const defaultImage = absoluteUrl(images['/og-image.png']?.src || '/og-image.png');
  const post = posts.find(item => route === '/blog/' + item.slug);
  if (post) {
    const image = images[post.image];
    const imageUrl = absoluteUrl(image?.src || post.image || '/og-image.png');
    const article = {
      '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': url + '#article',
      headline: post.title, description: post.excerpt, url,
      image: image ? { '@type': 'ImageObject', url: imageUrl, width: image.width, height: image.height } : imageUrl,
      author: organization, publisher: organization,
      datePublished: date(post.date), dateModified: date(post.dateModified || post.date),
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      isPartOf: { '@type': 'Blog', '@id': SITE_URL + '/blog' },
      articleSection: post.category, wordCount: post.wordCount, inLanguage: 'en',
    };
    const breadcrumbs = {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE_URL + '/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    };
    return { title: post.title + ' | NumGuru Blog', description: post.excerpt, url, image: imageUrl, type: 'article', schemas: [article, breadcrumbs], robots: 'index, follow' };
  }
  if (route === '/blog') return {
    title: 'Numerology Insights & Articles | NumGuru Blog',
    description: 'Explore the NumGuru blog for practical guides to Pythagorean numerology, life path numbers, and name calculations.',
    url, image: defaultImage, type: 'website', robots: 'index, follow',
    schemas: [{
      '@context': 'https://schema.org', '@type': 'Blog', '@id': url, name: 'NumGuru Blog',
      url, publisher: organization, inLanguage: 'en',
      blogPost: posts.map(item => ({ '@type': 'BlogPosting', headline: item.title, url: SITE_URL + '/blog/' + item.slug, datePublished: date(item.date) })),
    }],
  };
  const pages = {
    '/': ['NumGuru - Discover Your Life Purpose Through Pythagorean Numerology', 'NumGuru helps you unlock your true potential using ancient Pythagorean numerology. Get your free life path analysis or a premium cosmic report today. Start your journey of self-discovery.'],
    '/science': ['Pythagorean Numerology Explained | NumGuru', 'Learn how NumGuru calculates numerology numbers from your birth date and name.'],
    '/about': ['About NumGuru | Pythagorean Numerology', 'Learn about NumGuru and its Pythagorean numerology tools and personal reports.'],
    '/contact': ['Contact NumGuru', 'Get in touch with NumGuru for questions about numerology reports and support.'],
    '/privacy-policy': ['Privacy Policy | NumGuru', 'Read how NumGuru handles your personal information.'],
    '/terms-conditions': ['Terms & Conditions | NumGuru', 'Read the terms for using NumGuru tools and reports.'],
    '/refund-policy': ['Refund Policy | NumGuru', 'Read the refund policy for NumGuru digital reports.'],
    '/review': ['Share Your Review | NumGuru', 'Share your experience with NumGuru.'],
  };
  const details = pages[route] || ['Page Not Found | NumGuru', 'The requested NumGuru page could not be found.'];
  return { title: details[0], description: details[1], url, image: defaultImage, type: 'website', robots: pages[route] ? 'index, follow' : 'noindex, follow', schemas: route === '/' ? [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'NumGuru', url: SITE_URL + '/' }] : [] };
}
