import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Orbit, ChevronRight, Zap, Sparkles, Star, Rocket, Compass, X } from "lucide-react";
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
    const [isBrowseOpen, setIsBrowseOpen] = useState(false);
    const [sections, setSections] = useState([
        { id: "top", label: "Introduction", icon: Sparkles },
    ]);

    useEffect(() => {
        const fetchPost = () => {
            try {
                // Use Vite's magic to find the post in the folder
                const postModules = import.meta.glob("/src/content/blogs/*.json", { eager: true });

                const posts = Object.values(postModules).map((module: any) => {
                    return module.default || module;
                });

                const foundPost = posts.find((p: any) => p.slug === slug);

                if (foundPost) {
                    setPost(foundPost);

                    // SEO Magic: Update browser title and meta tags for Google
                    document.title = `${foundPost.title} | NumGuru Blog`;

                    let metaDesc = document.querySelector('meta[name="description"]');
                    if (!metaDesc) {
                        metaDesc = document.createElement('meta');
                        metaDesc.setAttribute('name', 'description');
                        document.head.appendChild(metaDesc);
                    }
                    metaDesc.setAttribute('content', foundPost.excerpt || "Discover numerology insights on NumGuru.");

                    // Add Canonical Link
                    let canonicalLink = document.querySelector('link[rel="canonical"]');
                    if (!canonicalLink) {
                        canonicalLink = document.createElement('link');
                        canonicalLink.setAttribute('rel', 'canonical');
                        document.head.appendChild(canonicalLink);
                    }
                    canonicalLink.setAttribute('href', `https://numguru.online/blog/${slug}`);

                    // JSON-LD Structured Data for Google Indexing
                    // Build image URL — handle relative and absolute paths
                    const imageUrl = foundPost.image
                        ? `https://numguru.online${foundPost.image.startsWith('/') ? '' : '/'}${foundPost.image}`
                        : "https://numguru.online/og-image.png";

                    // Extract keywords from title + category
                    const keywordList = [
                        ...(foundPost.category ? [foundPost.category] : []),
                        "numerology",
                        "NumGuru",
                        ...(foundPost.title || "").split(" ").filter((w: string) => w.length > 4).slice(0, 5),
                    ].join(", ");

                    // Estimate word count from content
                    const wordCount = foundPost.content
                        ? foundPost.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length
                        : 500;

                    // Parse date safely
                    const parsedDate = foundPost.date ? new Date(foundPost.date) : new Date("2026-01-27");
                    const isoDate = isNaN(parsedDate.getTime())
                        ? "2026-01-27"
                        : parsedDate.toISOString().split('T')[0];

                    const jsonLd = {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": foundPost.title,
                        "description": foundPost.excerpt || "",
                        "image": {
                            "@type": "ImageObject",
                            "url": imageUrl,
                            "width": 1200,
                            "height": 630
                        },
                        "author": {
                            "@type": "Organization",
                            "name": "NumGuru",
                            "url": "https://numguru.online"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "NumGuru",
                            "url": "https://numguru.online",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://numguru.online/favicon.svg",
                                "width": 60,
                                "height": 60
                            }
                        },
                        "datePublished": isoDate,
                        "dateModified": isoDate,
                        "inLanguage": "en-IN",
                        "keywords": keywordList,
                        "wordCount": wordCount,
                        "articleSection": foundPost.category || "Numerology",
                        "url": `https://numguru.online/blog/${slug}`,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://numguru.online/blog/${slug}`
                        },
                        "isPartOf": {
                            "@type": "Blog",
                            "@id": "https://numguru.online/blog",
                            "name": "NumGuru Blog",
                            "publisher": {
                                "@type": "Organization",
                                "name": "NumGuru"
                            }
                        }
                    };

                    // Inject or update the JSON-LD script tag
                    let script = document.querySelector('#blog-post-json-ld') as HTMLScriptElement;
                    if (!script) {
                        script = document.createElement('script') as HTMLScriptElement;
                        script.id = 'blog-post-json-ld';
                        script.type = 'application/ld+json';
                        document.head.appendChild(script);
                    }
                    script.textContent = JSON.stringify(jsonLd, null, 2);
                } else {
                    console.error("Post not found in folder for slug:", slug);
                    navigate("/blog");
                }
            } catch (error) {
                console.error("Error loading post from folder:", error);
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

    useEffect(() => {
        if (!post) return;
        
        // Give a small delay for HTML to render
        const timer = setTimeout(() => {
            const headings = document.querySelectorAll(".blog-content h2");
            const dynamicSections = Array.from(headings).map((h, i) => {
                const id = `heading-${i}`;
                h.id = id;
                return {
                    id: id,
                    label: h.textContent || `Section ${i + 1}`,
                    icon: Star
                };
            });

            setSections([
                { id: "top", label: "Introduction", icon: Sparkles },
                ...dynamicSections,
                { id: "final-cta", label: "Final Reveal", icon: Rocket }
            ]);
        }, 500);
        
        return () => clearTimeout(timer);
    }, [post]);

    // Lock body scroll when Browse is open
    useEffect(() => {
        if (isBrowseOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isBrowseOpen]);

    const scrollToSection = (id: string) => {
        if (id === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setIsBrowseOpen(false);
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100; // Account for fixed header
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setIsBrowseOpen(false);
        }
    };

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
                                    src={post.image.startsWith('http') || post.image.startsWith('/') ? encodeURI(post.image) : `/${encodeURI(post.image)}`}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200";
                                    }}
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

                            {/* Related Insights Section */}
                            <div className="mt-32 pt-20 border-t border-white/5">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                                    <div className="flex flex-col">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[9px] font-black uppercase tracking-[0.3em] mb-4 w-fit">
                                            Keep Exploring
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-serif font-black tracking-tight">Related <span className="text-secondary italic">Insights</span></h3>
                                    </div>
                                    <Link to="/blog" className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all">
                                        View All Library
                                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {(() => {
                                        const postModules = import.meta.glob("/src/content/blogs/*.json", { eager: true });
                                        const allPosts = Object.values(postModules).map((m: any) => m.default || m);
                                        const related = allPosts
                                            .filter((p: any) => p.slug !== post.slug)
                                            .sort((a, b) => {
                                                // Priority 1: Same category
                                                if (a.category === post.category && b.category !== post.category) return -1;
                                                if (a.category !== post.category && b.category === post.category) return 1;
                                                return 0;
                                            })
                                            .slice(0, 3);

                                        return related.map((r: any) => (
                                            <Link key={r.slug} to={`/blog/${r.slug}`} onClick={() => window.scrollTo(0,0)} className="group flex flex-col gap-4">
                                                <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 relative">
                                                    <img 
                                                        src={r.image.startsWith('http') || r.image.startsWith('/') ? r.image : `/${r.image}`}
                                                        alt={r.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800"; }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary/60">{r.category}</span>
                                                    <h4 className="text-lg font-bold text-white group-hover:text-secondary transition-colors line-clamp-2 leading-tight">{r.title}</h4>
                                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/30 mt-2">
                                                        <span>{r.date}</span>
                                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                                        <span>{r.readTime}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ));
                                    })()}
                                </div>
                            </div>

                            {/* Professional CTA Section */}
                            <div className="mt-40 space-y-20" id="final-cta">
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

            {/* Vertical Browse Button (Desktop Only) */}
            <button
                onClick={() => setIsBrowseOpen(true)}
                className="hidden lg:flex fixed right-1 top-1/2 -translate-y-1/2 z-[60] bg-[#0d000d] backdrop-blur-2xl border border-secondary/50 py-10 px-3.5 rounded-[2.5rem] group transition-all duration-500 hover:bg-[#1a001a] hover:border-secondary hover:px-5 shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_20px_rgba(234,179,8,0.2)] active:scale-95 flex flex-col items-center gap-8"
            >
                <div className="flex flex-col gap-2 items-center">
                    {"BROWSE".split("").map((char, i) => (
                        <span key={i} className="text-[13px] font-black text-secondary group-hover:text-white transition-colors leading-none tracking-tighter">
                            {char}
                        </span>
                    ))}
                </div>
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
            </button>

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 w-[94vw] max-w-[440px]">
                <button
                    onClick={() => setIsBrowseOpen(true)}
                    className="flex-1 flex flex-col items-center justify-center gap-1 bg-[#0d000d]/95 backdrop-blur-2xl border border-secondary/40 py-3.5 px-4 rounded-[2rem] text-secondary shadow-[0_10px_40px_rgba(0,0,0,0.6)] active:scale-95 transition-all group"
                >
                    <Compass className="h-7 w-7 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Browse Article</span>
                </button>
                <Link
                    to="/blog"
                    className="flex-1 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 py-3.5 px-4 rounded-[2rem] text-black shadow-[0_10px_40px_rgba(234,179,8,0.3)] active:scale-95 transition-all group"
                >
                    <Orbit className="h-7 w-7 group-hover:rotate-180 transition-transform duration-1000" />
                    <span className="text-[11px] font-black uppercase tracking-widest">More Blogs</span>
                </Link>
            </div>

            {/* Browse Navigation Overlay */}
            <div
                className={`fixed inset-0 z-[70] transition-all duration-500 ${isBrowseOpen ? "visible opacity-100" : "invisible opacity-0"}`}
            >
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsBrowseOpen(false)}
                />

                <div
                    className={`absolute lg:right-0 lg:left-auto lg:inset-y-0 lg:w-full lg:max-w-[340px] inset-x-4 bottom-24 lg:bottom-auto lg:top-0 h-auto max-h-[85vh] lg:max-h-none lg:h-full bg-[#020202] lg:border-l border border-white/5 lg:border-none shadow-2xl transition-all duration-500 ease-out p-6 lg:p-8 flex flex-col rounded-3xl lg:rounded-none ${isBrowseOpen
                            ? "translate-y-0 opacity-100 lg:translate-x-0"
                            : "translate-y-10 opacity-0 lg:translate-y-0 lg:opacity-100 lg:translate-x-full"
                        }`}
                >
                    <div className="flex items-center justify-between mb-8 shrink-0">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Navigate Article</span>
                            <h3 className="text-xl lg:text-2xl font-serif font-black text-white tracking-tighter">Blog Guide</h3>
                        </div>
                        <button
                            onClick={() => setIsBrowseOpen(false)}
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar scroll-smooth flex-grow pb-4">
                        {sections.map((section, idx) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-secondary/40 hover:bg-secondary/5 transition-all duration-300 text-left shrink-0"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-secondary/10 group-hover:border-secondary/20 group-hover:text-secondary transition-all">
                                    <section.icon className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-secondary/60 transition-colors">Section {idx + 1}</span>
                                    <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors line-clamp-1">{section.label}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 ml-auto text-white/5 group-hover:text-secondary/40 transition-all group-hover:translate-x-1" />
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/5">
                        <div className="flex items-center gap-4 text-white/20">
                            <Orbit className="h-5 w-5 animate-spin-slow" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Article Insight Map</span>
                        </div>
                    </div>
                </div>
            </div>

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
