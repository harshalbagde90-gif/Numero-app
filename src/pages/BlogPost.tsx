import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Orbit, Share2, Bookmark, ChevronRight } from "lucide-react";
import { Footer } from "@/components/Footer";

interface BlogPostData {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
}

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPostData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch("/blog-posts.json");
                const posts: BlogPostData[] = await response.json();
                const foundPost = posts.find(p => p.slug === slug);

                if (foundPost) {
                    setPost(foundPost);
                } else {
                    navigate("/blog");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                navigate("/blog");
            } finally {
                setLoading(false);
                window.scrollTo(0, 0);
            }
        };

        fetchPost();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020202] flex items-center justify-center">
                <Orbit className="w-12 h-12 text-secondary animate-spin" />
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-secondary/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 h-16 md:h-20">
                <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group transition-all active:scale-95">
                        <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                            <Orbit className="h-5 w-5 text-secondary group-hover:rotate-180 transition-transform duration-1000" />
                        </div>
                        <span className="font-serif font-black text-xl text-white tracking-tight">NumGuru</span>
                    </Link>

                    <Link to="/blog" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Library
                    </Link>
                </div>
            </nav>

            <main className="relative pt-32 pb-24 px-4">
                <article className="max-w-4xl mx-auto">
                    {/* Post Header */}
                    <header className="mb-12">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary mb-6 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{post.category}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter leading-tight mb-8">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{post.readTime} Read</span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="relative h-[300px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-16 border border-white/10 shadow-2xl">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/60 to-transparent" />
                    </div>

                    {/* Post Content */}
                    <div
                        className="prose prose-invert prose-secondary max-w-none 
                                   prose-p:text-slate-300 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-8
                                   prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight
                                   prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                                   prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-secondary
                                   prose-ul:text-slate-300 prose-li:mb-2
                                   prose-strong:text-white"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Footer Actions */}
                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                        <button className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[10px]">
                            <Share2 className="w-4 h-4 text-secondary" />
                            Share Wisdom
                        </button>

                        <Link to="/" className="inline-flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-xs group">
                            Get Your Personal Report
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default BlogPost;
