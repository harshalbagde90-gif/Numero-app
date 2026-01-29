import os
import datetime

def update_sitemap():
    root_dir = os.getcwd()
    blog_dir = os.path.join(root_dir, 'src', 'content', 'blogs')
    sitemap_path = os.path.join(root_dir, 'public', 'sitemap.xml')
    base_url = 'https://numguru.online'
    today = datetime.date.today().isoformat()

    blog_urls = []
    if os.path.exists(blog_dir):
        for filename in os.listdir(blog_dir):
            if filename.endswith('.json'):
                slug = filename[:-5]
                blog_urls.append(f"{base_url}/blog/{slug}")
    
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{base_url}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>{base_url}/blog</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>{base_url}/privacy-policy</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>{base_url}/terms-conditions</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>{base_url}/refund-policy</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
"""

    for url in blog_urls:
        xml += f"""  <url>
    <loc>{url}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n"""

    xml += "</urlset>"

    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(xml)
    
    print(f"Sitemap updated with {len(blog_urls)} blogs.")

if __name__ == "__main__":
    update_sitemap()
