import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Orbit, Calendar, Clock, ChevronRight, Share2, Bookmark } from "lucide-react";
import { Footer } from "@/components/Footer";

const Blog = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const blogPosts = [
        {
            id: 1,
            title: "The Power of Life Path Number 11: Decoding the Master Intuitive",
            excerpt: "Discover why Life Path 11 is considered the 'Light Messenger' of numerology and how to harness its high-vibrational energy.",
            date: "Jan 15, 2026",
            readTime: "6 min",
            category: "Master Numbers",
            image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Pythagorean vs. Chaldean Numerology: Which System Should You Use?",
            excerpt: "An in-depth comparison of the two most powerful systems in numerology. Learn which one resonates most with your soul's journey.",
            date: "Jan 12, 2026",
            readTime: "8 min",
            category: "Advanced Wisdom",
            image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "3 Secret Numbers That Influence Your Career Success",
            excerpt: "Your birthday holds the key to your professional abundance. Find out which hidden numbers are guiding your career path.",
            date: "Jan 10, 2026",
            readTime: "5 min",
            category: "Abundance",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-secondary/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
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

                    <Link to="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Wisdom
                    </Link>
                </div>
            </nav>

            <main className="relative pt-32 pb-24 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="max-w-3xl mb-20">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary mb-6 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                            <Bookmark className="h-4 w-4 fill-secondary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Wisdom Hub</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none mb-8">
                            Cosmic Insights & <br />
                            <span className="text-secondary italic">Numerology Wisdom</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                            Deep dives into the mystical language of numbers. Understand your vibration, unlock your potential, and navigate your destiny with ancient wisdom.
                        </p>
                    </div>

                    {/* Featured Post */}
                    <div className="group relative mb-24 rounded-[3rem] overflow-hidden border border-white/10 bg-white/[0.02] shadow-2xl transition-all duration-700 hover:border-secondary/30">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="relative h-[300px] lg:h-auto overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1200&q=80"
                                    alt="Featured Post"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-transparent hidden lg:block" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent lg:hidden" />
                            </div>
                            <div className="p-10 md:p-16 flex flex-col justify-center gap-8 relative z-10">
                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-secondary">
                                    <span>Must Read</span>
                                    <div className="h-1 w-1 rounded-full bg-white/20" />
                                    <span className="text-white/60">Featured Wisdom</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-[1.1]">
                                    2026 Numerology Forecast: The Year of Global Harmony
                                </h2>
                                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                    The numbers align for a massive shift in consciousness. Discover what the '1' year cycle means for your personal and professional growth in 2026.
                                </p>
                                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                                            <Calendar className="h-4 w-4" />
                                            <span>Jan 18, 2026</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                                            <Clock className="h-4 w-4" />
                                            <span>12 min read</span>
                                        </div>
                                    </div>
                                    <Link to="#" className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-xs group/btn">
                                        Begin Reading
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <Link
                                key={post.id}
                                to="#"
                                className="group flex flex-col rounded-[2.5rem] bg-white/[0.02] border border-white/10 overflow-hidden hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-secondary text-[10px] font-black uppercase tracking-widest">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow gap-6">
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            {post.readTime}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-serif font-black tracking-tight leading-tight group-hover:text-secondary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto pt-6 flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all">
                                        Explore Insight
                                        <ChevronRight className="h-4 w-4 text-secondary" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Newsletter / CTA */}
                    <div className="mt-24 p-12 md:p-20 rounded-[3rem] bg-secondary text-black relative overflow-hidden shadow-[0_0_80px_rgba(234,179,8,0.2)]">
                        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[150%] bg-white/20 blur-[100px] rotate-12" />
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tighter leading-none mb-8">
                                Get Cosmic Wisdom <br />
                                <span className="italic opacity-80">Directly to You.</span>
                            </h2>
                            <p className="text-black/70 text-lg md:text-xl font-bold mb-10 leading-relaxed">
                                Join 5,000+ seekers who receive weekly numerology insights and cosmic alerts to stay aligned with the universe.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-grow px-8 py-5 rounded-2xl bg-black/10 border-2 border-black/10 focus:border-black/30 outline-none placeholder:text-black/40 font-bold text-lg"
                                />
                                <button className="px-10 py-5 rounded-2xl bg-black text-white font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
