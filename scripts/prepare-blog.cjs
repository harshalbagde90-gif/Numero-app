const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const { root, readPosts } = require('./blog-data.cjs');

async function prepare() {
  const posts = readPosts();
  const sources = new Set(posts.map(post => post.image));
  ['/og-image.png', '/color_alchemy_side.jpg', '/cosmic_number_side.jpg', '/sacred_remedies_side.jpg'].forEach(src => sources.add(src));
  const manifest = {};
  let originalBytes = 0;
  let optimizedBytes = 0;
  const directory = path.join(root, 'public/blog-images/optimized');
  fs.mkdirSync(directory, { recursive: true });
  for (const src of sources) {
    if (!src || /^https?:\/\//.test(src)) continue;
    const normalized = '/' + src.replace(/^\/+/, '');
    const file = path.resolve(root, 'public', '.' + normalized);
    if (!file.startsWith(path.join(root, 'public') + path.sep)) throw new Error('Invalid image path: ' + src);
    if (!fs.existsSync(file)) throw new Error('Missing blog image: ' + src);
    const input = fs.readFileSync(file);
    const hash = crypto.createHash('sha256').update(input).update('webp-q78-v1').digest('hex').slice(0, 12);
    const name = path.basename(file, path.extname(file)).replace(/[^a-z0-9-]/gi, '-');
    const variants = [];
    for (const width of [480, 800, 1200]) {
      const filename = name + '-' + hash + '-' + width + '.webp';
      const target = path.join(directory, filename);
      if (!fs.existsSync(target)) await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(target);
      const info = await sharp(target).metadata();
      if (!variants.some(variant => variant.width === info.width)) variants.push({ src: '/blog-images/optimized/' + filename, width: info.width, height: info.height });
    }
    manifest[normalized] = { src: variants.at(-1).src, width: variants.at(-1).width, height: variants.at(-1).height, variants };
    originalBytes += input.length;
    optimizedBytes += fs.statSync(path.join(root, 'public', manifest[normalized].src)).size;
  }
  const summaries = posts.map(({ content, ...post }) => ({
    ...post,
    wordCount: content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length,
  }));
  fs.writeFileSync(path.join(root, 'src/content/blog-index.json'), JSON.stringify(summaries));
  fs.writeFileSync(path.join(root, 'src/content/blog-images.json'), JSON.stringify(manifest));
  console.log('Prepared ' + posts.length + ' blog summaries and ' + Object.keys(manifest).length + ' responsive images. Largest variants: ' + (originalBytes / 1048576).toFixed(2) + ' MiB -> ' + (optimizedBytes / 1048576).toFixed(2) + ' MiB.');
}
prepare().catch(error => { console.error(error); process.exitCode = 1; });
