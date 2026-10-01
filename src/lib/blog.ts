import summaries from '@/content/blog-index.json';

export interface BlogSummary {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  dateModified?: string;
  readTime: string;
  category: string;
  image: string;
  sourcePath: string;
  wordCount: number;
}
export interface BlogPostData extends BlogSummary { content: string }

export const blogPosts = summaries as BlogSummary[];
const loaders = import.meta.glob('/src/content/blogs/*.json');

export async function loadBlogPost(slug: string): Promise<BlogPostData | null> {
  const summary = blogPosts.find(post => post.slug === slug);
  if (!summary || !loaders[summary.sourcePath]) return null;
  const module = await loaders[summary.sourcePath]() as { default: BlogPostData };
  return { ...summary, ...module.default };
}
