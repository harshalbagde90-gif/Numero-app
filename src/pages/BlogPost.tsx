import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Orbit, Share2, ChevronRight, Zap, Sparkles, Star, Rocket } from "lucide-react";
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
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Try to fetch from the specific file in the folder first
                // This allows automation to just drop a new JSON file
                const individualResponse = await fetch(`/blog-posts/${slug}.json`);

                if (individualResponse.ok) {
                    const data = await individualResponse.json();
                    // Handle case where individual file might be the object directly or an array
                    const postData = Array.isArray(data) ? data[0] : data;
                    if (postData) {
                        setPost(postData);
                        setLoading(false);
                        return;
                    }
                }

                // Fallback: search in the main blog-posts.json if individual file not found
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

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020202] flex items-center justify-center">
                <Orbit className="w-12 h-12 text-secondary animate-spin" />
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-secondary/30 overflow-x-hidden">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-white/5">
                <div
                    className="h-full bg-secondary shadow-[0_0_10px_#EAB308] transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 h-16 md:h-20">
                <div className="max-w-7xl mx-auto h-full px-6 md:px-10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group transition-all active:scale-95">
                        <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                            <Orbit className="h-5 w-5 text-secondary group-hover:rotate-180 transition-transform duration-1000" />
                        </div>
                        <span className="font-serif font-black text-xl text-white tracking-tight">NumGuru</span>
                    </Link>

                    <Link to="/blog" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Library
                    </Link>
                </div>
            </nav>

            <main className="relative pt-32 md:pt-40 pb-24 px-6 md:px-10">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section: Side-by-Side Layout */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20 mb-20 md:mb-32">
                        {/* Left Side: Featured Image */}
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-video rounded-3xl md:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                                <img
                                    src={encodeURI(post.image)}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </div>

                        {/* Right Side: Heading & Meta */}
                        <div className="w-full lg:w-1/2 flex flex-col items-start">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary mb-8 backdrop-blur-md">
                                <Zap className="h-3.5 w-3.5 fill-secondary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{post.category}</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight leading-tight mb-10 text-gradient-gold">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-8 text-white/40 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] pt-10 border-t border-white/5 w-full">
                                <div className="flex items-center gap-2.5">
                                    <Calendar className="h-4 w-4 text-secondary/40" />
                                    <span>{post.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 md:px-8">
                        {/* Content Area with Direct Styling */}
                        <article className="relative">
                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Professional CTA Section */}
                            <div className="mt-40 space-y-20">
                                <div className="flex items-center gap-6 opacity-20">
                                    <div className="h-px flex-grow bg-white/50" />
                                    <Star className="h-5 w-5 fill-white" />
                                    <div className="h-px flex-grow bg-white/50" />
                                </div>

                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-secondary/50 via-primary/50 to-secondary/50 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                                    <div className="relative p-10 md:p-16 rounded-[4rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl flex flex-col items-center text-center gap-12">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Orbit className="w-40 h-40 animate-spin-slow text-white" />
                                        </div>

                                        <div className="max-w-2xl">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary mb-6 shadow-2xl">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Unlock Your Path</span>
                                            </div>
                                            <h3 className="text-4xl md:text-5xl font-serif font-black tracking-tighter leading-tight mb-6">
                                                Ready for Higher <br /> <span className="text-secondary italic">Cosmic Clarity?</span>
                                            </h3>
                                            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                                Take the next step in your spiritual journey. Whether you're a curious seeker or ready for a deep-dive transformation, we have the map for you.
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-md">
                                            <Link
                                                to="/"
                                                onClick={() => window.scrollTo(0, 0)}
                                                className="w-full group/btn inline-flex items-center justify-center gap-4 px-10 py-5 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                            >
                                                <Rocket className="w-4 h-4 text-primary" />
                                                Try Free Sample
                                                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1.5" />
                                            </Link>

                                            <Link
                                                to="/"
                                                onClick={() => window.scrollTo(0, 0)}
                                                className="w-full group/btn inline-flex items-center justify-center gap-4 px-10 py-5 rounded-[1.5rem] bg-secondary text-black font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(234,179,8,0.2)]"
                                            >
                                                <Star className="w-4 h-4 fill-black" />
                                                Premium Report
                                                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </main>

            <Footer />
            <style dangerouslySetInnerHTML={{
                __html: `
                .blog-content {
                    color: rgb(203 213 225);
                    line-height: 1.7;
                }
                .blog-content h1 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: white;
                    margin-top: 2rem;
                    margin-bottom: 1.5rem;
                    font-family: ui-sans-serif, system-ui, sans-serif;
                }
                .blog-content h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin-top: 3rem;
                    margin-bottom: 1.25rem;
                    border-left: 4px solid #EAB308;
                    padding-left: 1rem;
                    font-family: ui-sans-serif, system-ui, sans-serif;
                }
                .blog-content h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #EAB308;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    font-family: ui-sans-serif, system-ui, sans-serif;
                }
                .blog-content p {
                    font-size: 1rem;
                    color: rgb(203 213 225);
                    margin-bottom: 1.5rem;
                    line-height: 1.75;
                }
                .blog-content ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 1.5rem;
                    color: rgb(203 213 225);
                }
                .blog-content li {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                    line-height: 1.75;
                }
                .blog-content strong, .blog-content b {
                    color: white;
                    font-weight: 600;
                }
                .blog-content em, .blog-content i {
                    color: rgb(148 163 184);
                    font-style: italic;
                }
                .blog-content hr {
                    border-color: rgba(255, 255, 255, 0.1);
                    margin-top: 3rem;
                    margin-bottom: 3rem;
                }
                .blog-content img {
                    border-radius: 1rem;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                    margin-top: 2rem;
                    margin-bottom: 2rem;
                }
                .animate-spin-slow {
                    animation: spin 20s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default BlogPost;
