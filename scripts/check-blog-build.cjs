const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const { root, siteUrl, readPosts, isoDate } = require('./blog-data.cjs');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

async function check() {
  const posts = readPosts();
  const sitemap = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.equal(urls.length, new Set(urls).size, 'Sitemap contains duplicate URLs');
  assert.equal(urls.filter(url => url.includes('/blog/')).length, posts.length);
  assert.ok(urls.every(url => !url.endsWith('.png')), 'Image filenames leaked into blog URLs');
  for (const post of posts) {
    const url = siteUrl + '/blog/' + post.slug;
    assert.ok(urls.includes(url), 'Missing sitemap URL: ' + url);
    assert.ok(sitemap.includes('<lastmod>' + isoDate(post.dateModified || post.date) + '</lastmod>'));
    const html = fs.readFileSync(path.join(root, 'dist/blog', post.slug, 'index.html'), 'utf8');
    assert.equal((html.match(/<link[^>]+rel="canonical"/g) || []).length, 1, 'Multiple canonical links');
    assert.ok(html.includes('<link rel="canonical" href="' + url + '"'), 'Wrong initial canonical: ' + post.slug);
    assert.ok(html.includes('<title>' + escapeHtml(post.title + ' | NumGuru Blog') + '</title>'), 'Wrong initial title');
    assert.ok(html.includes('<h1 class="text-4xl font-bold mb-6">' + escapeHtml(post.title) + '</h1>'), 'Article missing from initial HTML');
    assert.ok(html.includes(post.content), 'Full article content missing from initial HTML');
    assert.ok(!html.includes('display:none;'), 'Hidden homepage heading leaked into article');
    const schema = JSON.parse(html.match(/<script id="page-json-ld" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema[0]['@type'], 'BlogPosting');
    assert.equal(schema[0].mainEntityOfPage['@id'], url);
    assert.equal(schema[1].itemListElement.at(-1).item, url);
    const initial = JSON.parse(html.match(/<script id="initial-blog-post" type="application\/json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(initial.slug, post.slug);
    assert.equal(initial.content, post.content);
    assert.ok(html.includes('property="og:type" content="article"'));
  }
  const listing = fs.readFileSync(path.join(root, 'dist/blog/index.html'), 'utf8');
  assert.ok(listing.includes('href="' + siteUrl + '/blog"'));
  for (const post of posts) assert.ok(listing.includes('href="/blog/' + post.slug + '"'));

  const images = JSON.parse(fs.readFileSync(path.join(root, 'src/content/blog-images.json'), 'utf8'));
  for (const image of Object.values(images)) {
    assert.ok(image.variants.length >= 1);
    const widths = image.variants.map(variant => variant.width);
    assert.equal(widths.length, new Set(widths).size, 'Duplicate srcset width');
    for (const variant of image.variants) {
      const file = path.join(root, 'dist', variant.src);
      assert.ok(fs.existsSync(file), 'Missing deployed image: ' + variant.src);
      const actual = await sharp(file).metadata();
      assert.equal(actual.width, variant.width, 'Incorrect responsive width descriptor');
      assert.equal(actual.height, variant.height);
      assert.equal(actual.format, 'webp');
    }
  }
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  assert.ok(config.rewrites.some(route => route.source === '/blog/:slug' && route.destination === '/blog/:slug/index.html'));
  console.log('PASS: ' + posts.length + ' article HTML pages, sitemap URLs, schemas, initial article data, listing links and ' + Object.keys(images).length + ' responsive image sets.');
}
check().catch(error => { console.error(error); process.exitCode = 1; });
