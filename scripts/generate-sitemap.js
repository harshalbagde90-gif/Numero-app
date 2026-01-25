const fs = require('fs');
const path = require('path');

function updateSitemap() {
    try {
        const rootDir = process.cwd();
        const blogDir = path.join(rootDir, 'src/content/blogs');
        const sitemapPath = path.join(rootDir, 'public/sitemap.xml');
        const baseUrl = 'https://numguru.online';
        const today = new Date().toISOString().split('T')[0];

        console.log(`Working directory: ${rootDir}`);
        console.log(`Checking blog directory: ${blogDir}`);

        let blogUrls = [];
        if (fs.existsSync(blogDir)) {
            const files = fs.readdirSync(blogDir);
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    const slug = file.replace('.json', '');
                    blogUrls.push(`${baseUrl}/blog/${slug}`);
                }
            });
        } else {
            console.error('Blog directory not found!');
        }

        console.log(`Found ${blogUrls.length} blog posts.`);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;

        blogUrls.forEach(url => {
            xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
        });

        xml += `</urlset>`;

        fs.writeFileSync(sitemapPath, xml);
        console.log(`Successfully updated ${sitemapPath}`);
    } catch (err) {
        console.error('An error occurred:', err);
        process.exit(1);
    }
}

updateSitemap();
