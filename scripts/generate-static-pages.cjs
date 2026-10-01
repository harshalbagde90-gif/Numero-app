const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { root, readPosts } = require('./blog-data.cjs');

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
async function generate() {
  const { pageSeo } = await import(pathToFileURL(path.join(root, 'src/lib/seo.js')).href);
  const posts = readPosts();
  const summaries = JSON.parse(fs.readFileSync(path.join(root, 'src/content/blog-index.json'), 'utf8'));
  const images = JSON.parse(fs.readFileSync(path.join(root, 'src/content/blog-images.json'), 'utf8'));
  const template = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
  function imageTag(post, priority = false) {
    const image = images[post.image];
    return '<img src="' + escapeHtml(image?.src || post.image) + '"' +
      (image ? ' srcset="' + escapeHtml(image.variants.map(variant => variant.src + ' ' + variant.width + 'w').join(', ')) + '" sizes="(min-width: 1024px) 896px, 100vw" width="' + image.width + '" height="' + image.height + '"' : '') +
      ' alt="' + escapeHtml(post.title) + '" loading="' + (priority ? 'eager' : 'lazy') + '" fetchpriority="' + (priority ? 'high' : 'auto') + '" decoding="async" class="w-full rounded-2xl" />';
  }
  function writePage(route, body, initialPost) {
    const seo = pageSeo(route, summaries, images);
    let html = template
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta\b[^>]*(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/gi, '')
      .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, '')
      .replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
    const metadata = '<title>' + escapeHtml(seo.title) + '</title>\n' +
      '<meta name="description" content="' + escapeHtml(seo.description) + '" />\n' +
      '<meta name="robots" content="' + seo.robots + '" />\n' +
      '<link rel="canonical" href="' + escapeHtml(seo.url) + '" />\n' +
      Object.entries({ 'og:title': seo.title, 'og:description': seo.description, 'og:url': seo.url, 'og:image': seo.image, 'og:type': seo.type, 'og:site_name': 'NumGuru', 'twitter:card': 'summary_large_image', 'twitter:title': seo.title, 'twitter:description': seo.description, 'twitter:url': seo.url, 'twitter:image': seo.image }).map(([key, value]) => '<meta property="' + key + '" content="' + escapeHtml(value) + '" />').join('\n') +
      '\n<script id="page-json-ld" type="application/ld+json">' + json(seo.schemas) + '</script>\n';
    html = html.replace('</head>', metadata + '</head>');
    html = html.replace(/<div id="root"><\/div>/, '<div id="root">' + body + '</div>');
    if (initialPost) html = html.replace('</body>', '<script id="initial-blog-post" type="application/json">' + json(initialPost) + '</script></body>');
    const directory = path.join(root, 'dist', route.slice(1));
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, 'index.html'), html);
  }
  const frame = content => '<div class="dark bg-background text-foreground min-h-screen"><main class="max-w-4xl mx-auto px-6 py-12"><nav class="mb-8"><a href="/">NumGuru</a> / <a href="/blog">Blog</a></nav>' + content + '</main></div>';
  writePage('/blog', frame('<h1 class="text-4xl font-bold mb-8">Numerology Insights &amp; Articles</h1>' + posts.map((post, index) => '<article class="mb-12"><a href="/blog/' + post.slug + '">' + imageTag(post, index === 0) + '<h2 class="text-2xl font-bold my-4">' + escapeHtml(post.title) + '</h2></a><p>' + escapeHtml(post.excerpt) + '</p></article>').join('')));
  for (const post of posts) {
    writePage('/blog/' + post.slug, frame('<article><h1 class="text-4xl font-bold mb-6">' + escapeHtml(post.title) + '</h1><p class="mb-6">' + escapeHtml(post.date) + ' · ' + escapeHtml(post.readTime) + '</p>' + imageTag(post, true) + '<div class="blog-content prose prose-invert max-w-none mt-8">' + post.content + '</div></article>'), post);
  }
  console.log('Generated initial HTML, social metadata and structured data for ' + posts.length + ' articles and the blog listing.');
}
generate().catch(error => { console.error(error); process.exitCode = 1; });
