const fs = require('node:fs');
const path = require('node:path');
const { root, siteUrl, readPosts, isoDate } = require('./blog-data.cjs');
const staticPaths = ['/', '/blog', '/science', '/about', '/contact', '/privacy-policy', '/terms-conditions', '/refund-policy'];
const entries = staticPaths.map(route => ({ url: siteUrl + route }));
for (const post of readPosts()) entries.push({ url: siteUrl + '/blog/' + post.slug, modified: isoDate(post.dateModified || post.date) });
const escapeXml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  entries.map(entry => '  <url>\n    <loc>' + escapeXml(entry.url) + '</loc>' + (entry.modified ? '\n    <lastmod>' + entry.modified + '</lastmod>' : '') + '\n  </url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
console.log('Sitemap: ' + entries.length + ' canonical URLs from actual blog slugs.');
