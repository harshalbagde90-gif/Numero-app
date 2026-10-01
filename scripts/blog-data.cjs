const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const siteUrl = 'https://numguru.online';

function isoDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid blog date: ${value}`);
  return date.toISOString().slice(0, 10);
}

function readPosts() {
  const directory = path.join(root, 'src/content/blogs');
  const seen = new Set();
  return fs.readdirSync(directory).filter(file => file.endsWith('.json')).sort().map(file => {
    const post = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8').replace(/^\uFEFF/, ''));
    if (!post.title || !post.content || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
      throw new Error(`Invalid blog title, content or slug in ${file}`);
    }
    if (seen.has(post.slug)) { console.warn('Skipping duplicate slug in ' + file + ': ' + post.slug); return null; }
    seen.add(post.slug);
    isoDate(post.date);
    if (post.dateModified) isoDate(post.dateModified);
    return { ...post, sourcePath: '/src/content/blogs/' + file };
  }).filter(Boolean).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || a.slug.localeCompare(b.slug));
}

module.exports = { root, siteUrl, readPosts, isoDate };
