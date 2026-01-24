import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Orbit, Calendar, Clock, ChevronRight, Sparkles, Zap, Moon } from "lucide-react";
import { Footer } from "@/components/Footer";

const Blog = () => {
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("/blog-posts.json");
                const data = await response.json();
                const validPosts = Array.isArray(data) ? data.filter(p => p.id && p.slug) : [];
                setBlogPosts(validPosts);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
                window.scrollTo(0, 0);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center gap-6">
                <div className="relative w-24 h-24">
                    <Orbit className="w-full h-full text-secondary animate-spin-slow" />
                    <Sparkles className="absolute inset-0 w-full h-full text-secondary animate-pulse scale-50" />
                </div>
                <p className="text-secondary/60 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Consulting the Stars...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-secondary/30 overflow-x-hidden">
            {/* Minimal Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-secondary/5 rounded-full blur-[150px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020202]/80 backdrop-blur-2xl border-b border-white/5 h-16 md:h-20 transition-all duration-300">
                <div className="max-w-7xl mx-auto h-full px-6 md:px-10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group transition-all active:scale-95">
                        <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-all duration-500">
                            <Orbit className="h-5 w-5 text-secondary group-hover:rotate-180 transition-transform duration-1000" />
                        </div>
                        <span className="font-serif font-black text-2xl text-white tracking-tighter">NumGuru</span>
                    </Link>

                    <Link to="/" className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-white/50 hover:text-white transition-all group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Return Home
                    </Link>
                </div>
            </nav>

            <main className="relative pt-32 md:pt-40 pb-32 px-6 md:px-10">
                <div className="max-w-6xl mx-auto">

                    {/* Centered Editorial Header */}
                    <div className="relative mb-24 md:mb-40 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-secondary/40" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">The Blog</span>
                            <div className="h-px w-8 bg-secondary/40" />
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tighter leading-[0.9] mb-10 max-w-4xl">
                            Welcome to the <br />
                            <span className="text-secondary italic">NumGuru Blog</span>
                        </h1>
                        <p className="max-w-2xl text-slate-400 text-lg md:text-xl font-medium leading-relaxed opacity-80">
                            Discover how numbers shape your life, career, and future. We share easy-to-understand numerology insights and practical tips to help you stay aligned with your highest potential.
                        </p>
                    </div>

                    {/* Editorial Blog Feed */}
                    <div className="flex flex-col gap-20 md:gap-32">
                        {blogPosts.map((post, index) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className="group block focus:outline-none"
                            >
                                <article className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
                                    {/* Professional Image Box (50%) */}
                                    <div className="w-full lg:w-1/2 aspect-[16/10] overflow-hidden relative rounded-2xl md:rounded-3xl border border-white/5 shadow-2xl">
                                        <img
                                            src={encodeURI(post.image)}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                                    </div>

                                    {/* Editorial Content Section (50%) */}
                                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">
                                                {index === 0 ? "Featured Choice" : post.category}
                                            </span>
                                            <div className="w-6 h-px bg-white/10" />
                                        </div>

                                        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-sans font-bold leading-tight mb-5 transition-colors duration-500 group-hover:text-secondary">
                                            {post.title}
                                        </h2>

                                        <p className="text-slate-400 text-sm md:text-base lg:text-lg leading-relaxed font-medium mb-6 line-clamp-3 md:line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        {/* Meta Info Fixed at Bottom of Text Block */}
                                        <div className="mt-auto w-full pt-8 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-6 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{post.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>{post.readTime}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-secondary group-hover:translate-x-2 transition-transform duration-500">
                                                <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Read Story</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {/* Empty State */}
                    {!loading && blogPosts.length === 0 && (
                        <div className="py-24 text-center">
                            <Moon className="w-16 h-16 text-secondary/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-serif font-black mb-2 tracking-tight">The Archive is Silent</h3>
                            <p className="text-slate-500 uppercase tracking-widest text-xs">Divine insights are being prepared.</p>
                        </div>
                    )}

                    {/* Newsletter / CTA Section (Editorial Refined) */}
                    <div className="mt-48 pt-32 border-t border-white/5">
                        <div className="max-w-4xl mx-auto text-center px-6 py-20 bg-secondary/5 rounded-[4rem] border border-secondary/10 relative overflow-hidden">
                            <Sparkles className="w-8 h-8 text-secondary/40 mx-auto mb-8 animate-pulse" />
                            <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tighter leading-tight mb-8">
                                Stay Aligned with <br /> <span className="text-secondary italic">Cosmic Updates</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
                                Join our inner circle to receive weekly numerology wisdom and celestial alerts.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-grow px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-secondary/50 outline-none text-white font-bold transition-all text-center sm:text-left"
                                />
                                <button className="px-10 py-5 rounded-2xl bg-secondary text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style dangerouslySetInnerHTML={{
                __html: `
                .animate-spin-slow {
                    animation: spin 15s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default Blog;
