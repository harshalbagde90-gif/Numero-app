const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const { root, readPosts } = require('./blog-data.cjs');

function fail(message) { throw new Error(message); }

async function main() {
  const args = process.argv.slice(2);
  const draftFlag = args.indexOf('--draft');
  const dryRun = args.includes('--dry-run');
  if (draftFlag < 0 || !args[draftFlag + 1]) fail('Usage: node scripts/publish-blog-from-draft.cjs --draft <absolute-json-path> [--dry-run]');
  const draftPath = path.resolve(args[draftFlag + 1]);
  const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8').replace(/^\uFEFF/, ''));
  const required = ['title', 'slug', 'excerpt', 'category', 'content'];
  for (const key of required) if (typeof draft[key] !== 'string' || !draft[key].trim()) fail(`Draft is missing ${key}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) fail('Slug must use lowercase words separated by hyphens');
  if (readPosts().some(post => post.slug === draft.slug)) fail(`Blog slug already exists: ${draft.slug}`);
  if (draft.title.length > 80 || draft.excerpt.length > 200) fail('Title or excerpt is too long');
  if (!/^<h2[ >]/i.test(draft.content.trim())) fail('Article must start with an h2 heading');
  if (/<(?:script|style|iframe|form|object|embed|svg)\b|\bon\w+\s*=|javascript:/i.test(draft.content)) fail('Article contains unsafe HTML');
  if (/<a\b[^>]*href\s*=\s*["'](?!\/|https:\/\/)/i.test(draft.content)) fail('Article links must be relative or HTTPS');
  const plainText = draft.content.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ');
  const words = plainText.split(/\s+/).filter(Boolean).length;
  if (words < 700 || words > 2200) fail(`Article must have 700–2200 words; got ${words}`);
  if (!draft.content.includes('href="/')) fail('Article needs at least one internal link');
  let image;
  let metadata;
  if (draft.imageSource) {
    const imageSource = path.resolve(draft.imageSource);
    if (!fs.existsSync(imageSource)) fail(`Missing image: ${imageSource}`);
    image = sharp(imageSource);
    metadata = await image.metadata();
    if (!['png', 'jpeg', 'webp'].includes(metadata.format) || (metadata.width || 0) < 800 || (metadata.height || 0) < 450) fail('Image must be PNG, JPEG or WebP and at least 800×450');
  } else {
    const xml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]));
    const words = draft.title.split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
      if ((line + ' ' + word).trim().length > 22 && line) { lines.push(line); line = word; }
      else line = (line + ' ' + word).trim();
    }
    if (line) lines.push(line);
    if (lines.length > 4) fail('Title is too long for the free branded cover; provide imageSource');
    const fontSize = lines.length > 3 ? 50 : 58;
    const lineHeight = lines.length > 3 ? 63 : 74;
    const title = lines.map((value, index) => `<text x="72" y="${204 + index * lineHeight}" font-size="${fontSize}" font-weight="700" fill="#fff8df">${xml(value)}</text>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><radialGradient id="sky"><stop stop-color="#321258"/><stop offset="1" stop-color="#0d061e"/></radialGradient><linearGradient id="gold"><stop stop-color="#fff3b2"/><stop offset=".5" stop-color="#e6a640"/><stop offset="1" stop-color="#fff3b2"/></linearGradient></defs><rect width="1200" height="630" fill="url(#sky)"/><circle cx="973" cy="327" r="182" fill="none" stroke="url(#gold)" stroke-width="4"/><circle cx="973" cy="327" r="135" fill="none" stroke="#dca13b" stroke-width="3"/><circle cx="973" cy="327" r="83" fill="none" stroke="#dca13b" stroke-width="3"/><circle cx="973" cy="327" r="49" fill="url(#gold)"/><circle cx="974" cy="145" r="15" fill="url(#gold)"/><circle cx="843" cy="291" r="11" fill="url(#gold)"/><circle cx="1089" cy="396" r="13" fill="url(#gold)"/><text x="72" y="89" font-size="28" font-weight="700" letter-spacing="5" fill="#eac476">NUMGURU ONLINE</text>${title}<text x="72" y="554" font-size="26" fill="#eac476">PYTHAGOREAN NUMEROLOGY  •  NUMGURU.ONLINE</text></svg>`;
    image = sharp(Buffer.from(svg));
    metadata = { width: 1200, height: 630, format: 'svg' };
  }
  const today = new Date().toISOString().slice(0, 10);
  const post = {
    id: draft.slug,
    title: draft.title.trim(),
    slug: draft.slug,
    excerpt: draft.excerpt.trim(),
    category: draft.category.trim(),
    date: today,
    readTime: `${Math.max(1, Math.ceil(words / 220))} min`,
    image_name: `${draft.slug}.webp`,
    image_prompt: draft.image_prompt?.trim() || 'Free branded NumGuru Online cover generated from the article title',
    image: `/blog-images/${draft.slug}.webp`,
    content: draft.content.trim(),
    status: 'ready',
  };
  const postPath = path.join(root, 'src', 'content', 'blogs', `${draft.slug}.json`);
  const imagePath = path.join(root, 'public', 'blog-images', `${draft.slug}.webp`);
  if (fs.existsSync(postPath) || fs.existsSync(imagePath)) fail('Destination already exists');
  if (dryRun) {
    console.log(`DRY RUN: ${post.slug}, ${words} words, ${metadata.width}×${metadata.height} ${metadata.format}`);
    return;
  }
  await image.rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toFile(imagePath);
  try {
    fs.writeFileSync(postPath, `${JSON.stringify(post, null, 2)}\n`);
  } catch (error) {
    fs.rmSync(imagePath, { force: true });
    throw error;
  }
  console.log(`Published source files: ${postPath} and ${imagePath}`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
