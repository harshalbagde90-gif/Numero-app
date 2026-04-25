import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Orbit, Calendar, Clock, ChevronRight, Sparkles, Moon, Search, X, ChevronLeft, Star } from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const STOP_WORDS = new Set([
  "a","an","the","and","or","of","in","is","to","for","on","your","you",
  "how","why","what","with","its","it","are","be","by","at","as","from",
  "that","this","guide","vs","my","our","their","has","have","which","can",
  "will","do","does","not","all","more","most","than","about","but","was",
  "were","who","so","up","out","into","i","we","they","us","me","him","her",
]);

// Score a post against a search query — fuzzy/smart matching
function scorePost(post: any, q: string): number {
  if (!q) return 0;
  const query = q.toLowerCase().trim();
  const title = (post.title || "").toLowerCase();
  const excerpt = (post.excerpt || "").toLowerCase();
  const category = (post.category || "").toLowerCase();

  // Exact full match in title
  if (title === query) return 100;
  // Title starts with query
  if (title.startsWith(query)) return 90;
  // Title contains full query
  if (title.includes(query)) return 80;
  // Category exact match
  if (category === query) return 75;
  // Category contains query
  if (category.includes(query)) return 65;
  // Excerpt contains full query
  if (excerpt.includes(query)) return 60;

  // Partial word matching — score based on how many query words match
  const queryWords = query.split(/\s+/).filter(w => w.length > 1);
  let wordScore = 0;
  for (const word of queryWords) {
    if (title.includes(word)) wordScore += 15;
    else if (excerpt.includes(word)) wordScore += 8;
    else if (category.includes(word)) wordScore += 5;
  }
  if (wordScore > 0) return wordScore;

  // Fuzzy: check if query chars appear in order in title (loose match)
  let qi = 0;
  for (let ci = 0; ci < title.length && qi < query.length; ci++) {
    if (title[ci] === query[qi]) qi++;
  }
  if (qi === query.length) return 2; // loose fuzzy match

  return 0;
}

// Score a post against a keyword tag
function scorePostByKeyword(post: any, kw: string): number {
  if (!kw) return 0;
  const keyword = kw.toLowerCase();
  const title = (post.title || "").toLowerCase();
  const excerpt = (post.excerpt || "").toLowerCase();

  if (title.includes(keyword)) return 100;
  if (excerpt.includes(keyword)) return 50;
  return 0;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeKeyword, setActiveKeyword] = useState("");
  const keywordScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = () => {
      try {
        document.title = "Numerology Insights & Articles | NumGuru Blog";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', "Explore the NumGuru blog for deep insights into numerology, life paths, and celestial wisdom.");

        const postModules = import.meta.glob("/src/content/blogs/*.json", { eager: true });
        const posts = Object.values(postModules).map((m: any) => m.default || m);

        // Deduplicate by slug
        const seen = new Set<string>();
        const validPosts = posts
          .filter((p: any) => p.id && p.slug && !seen.has(p.slug) && seen.add(p.slug))
          .sort((a: any, b: any) => String(b.id).localeCompare(String(a.id)));

        setBlogPosts(validPosts);
      } catch (err) {
        console.error("Error loading blogs:", err);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const cats = blogPosts.map((p: any) => p.category).filter(Boolean);
    return ["All", ...Array.from(new Set<string>(cats as string[]))];
  }, [blogPosts]);

  const keywords = useMemo(() => {
    const wordCount: Record<string, number> = {};
    blogPosts.forEach((post: any) => {
      const words = (post.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/);
      words.forEach((w: string) => {
        if (w.length > 2 && !STOP_WORDS.has(w)) {
          wordCount[w] = (wordCount[w] || 0) + 1;
        }
      });
    });
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
  }, [blogPosts]);

  // Smart filtered + sorted posts
  const { displayPosts, topPost } = useMemo(() => {
    // Step 1: apply category filter (hard filter)
    let pool = activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((p: any) => p.category === activeCategory);

    // Step 2: apply smart search scoring
    const q = searchQuery.trim();
    if (q) {
      const scored = pool
        .map((p: any) => ({ post: p, score: scorePost(p, q) }))
        .sort((a, b) => b.score - a.score);

      // Show all that have any score, fallback to all posts if nothing matched
      const matched = scored.filter(s => s.score > 0);
      pool = (matched.length > 0 ? matched : scored).map(s => s.post);
    }

    // Step 3: apply keyword relevance sorting (not filtering)
    if (activeKeyword) {
      const scored = pool
        .map((p: any) => ({ post: p, kwScore: scorePostByKeyword(p, activeKeyword) }))
        .sort((a, b) => b.kwScore - a.kwScore);

      const top = scored[0]?.kwScore > 0 ? scored[0].post : null;
      const rest = top ? scored.slice(1).map(s => s.post) : scored.map(s => s.post);
      return { displayPosts: rest, topPost: top };
    }

    return { displayPosts: pool, topPost: null };
  }, [blogPosts, searchQuery, activeCategory, activeKeyword]);

  const clearAll = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveKeyword("");
  };

  const scrollKeywords = (dir: "left" | "right") => {
    keywordScrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const isFiltered = searchQuery || activeCategory !== "All" || activeKeyword;
  const totalShown = (topPost ? 1 : 0) + displayPosts.length;

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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-secondary/5 rounded-full blur-[150px] opacity-30" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020202]/80 backdrop-blur-2xl border-b border-white/5 h-16 md:h-20">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group active:scale-95">
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-all duration-500">
              <Orbit className="h-4 w-4 md:h-5 md:w-5 text-secondary group-hover:rotate-180 transition-transform duration-1000" />
            </div>
            <span className="font-serif font-black text-xl md:text-2xl text-white tracking-tighter">NumGuru</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all group">
            <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover:-translate-x-1 transition-transform" />
            Return Home
          </Link>
        </div>
      </nav>

      <main className="relative pt-24 md:pt-40 pb-32 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="relative mb-12 md:mb-20 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-6 md:w-8 bg-secondary/40" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-secondary">The Blog</span>
              <div className="h-px w-6 md:w-8 bg-secondary/40" />
            </div>
            <h1 className="text-4xl md:text-8xl font-serif font-black tracking-tighter leading-[1.1] md:leading-[0.9] mb-6 max-w-4xl px-2">
              Welcome to the <br />
              <span className="text-secondary italic">NumGuru Blog</span>
            </h1>
            <p className="max-w-xl text-slate-400 text-base md:text-xl font-medium leading-relaxed opacity-80 px-4 md:px-0">
              Discover how numbers shape your life, career, and future.
            </p>
          </div>

          {/* Search + Filters */}
          <div className="mb-12 md:mb-16 flex flex-col gap-5">

            {/* Search */}
            <div className="relative max-w-xl mx-auto w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/60 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search blogs — we'll find the closest match..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-secondary/50 outline-none text-white placeholder:text-white/30 font-medium text-sm transition-all focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(234,179,8,0.1)]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors">
                  <X className="h-3.5 w-3.5 text-white/40" />
                </button>
              )}
            </div>

            {/* Keyword Tags with Auto-Rotating Carousel */}
            {keywords.length > 0 && (
              <div className="relative max-w-4xl mx-auto w-full group py-2 px-12">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                    dragFree: true,
                  }}
                  plugins={[
                    Autoplay({
                      delay: 3500,
                      stopOnInteraction: false,
                      stopOnMouseEnter: true,
                    }),
                  ]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-3">
                    {keywords.map(kw => (
                      <CarouselItem key={kw} className="pl-3 basis-auto">
                        <button
                          onClick={() => setActiveKeyword(activeKeyword === kw ? "" : kw)}
                          className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 border relative overflow-hidden group/tag ${
                            activeKeyword === kw
                              ? "text-black border-transparent shadow-[0_0_30px_rgba(234,179,8,0.5)] scale-105"
                              : "bg-white/[0.03] border-white/10 text-white/40 hover:border-secondary/40 hover:text-secondary hover:bg-secondary/5 hover:scale-105"
                          }`}
                        >
                          {activeKeyword === kw && (
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600" />
                          )}
                          {activeKeyword === kw && (
                            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/tag:animate-shimmer-shine pointer-events-none" 
                                 style={{ animation: 'shimmer-shine 2s infinite' }} />
                          )}
                          <span className="relative z-10 flex items-center gap-2">
                            <span className={activeKeyword === kw ? "text-black/50" : "text-secondary/40"}>#</span>
                            <span className={activeKeyword === kw ? "text-black font-black" : ""}>{kw}</span>
                          </span>
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {/* Arrows positioned on sides */}
                  <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 w-9 h-9 bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary hover:text-black transition-all" />
                  <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 w-9 h-9 bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary hover:text-black transition-all" />
                </Carousel>
              </div>
            )}


            {/* Results count + Clear */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="h-px w-12 bg-white/10" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">
                Found <span className="text-secondary">{totalShown}</span> Insights
                {activeKeyword && <span className="text-white/20"> · #{activeKeyword}</span>}
              </p>
              <div className="h-px w-12 bg-white/10" />
              
              {isFiltered && (
                <button 
                  onClick={clearAll} 
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-secondary hover:bg-secondary hover:text-black transition-all duration-300 flex items-center gap-2"
                >
                  <X className="h-3 w-3" /> Reset View
                </button>
              )}
            </div>
          </div>

          {/* Blog Feed */}
          <div className="flex flex-col gap-12 md:gap-32">

            {/* TOP / Most Relevant post when keyword is active */}
            {topPost && (
              <>
                {/* Featured label */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-secondary/30" />
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/30">
                    <Star className="h-3 w-3 text-secondary fill-secondary" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary">Most Relevant for #{activeKeyword}</span>
                    <Star className="h-3 w-3 text-secondary fill-secondary" />
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-secondary/30" />
                </div>

                <Link key={topPost.slug} to={`/blog/${topPost.slug}`} className="group block focus:outline-none -mt-20">
                  <article className="flex flex-col lg:flex-row items-center gap-6 md:gap-16 p-6 md:p-0 rounded-3xl ring-1 ring-secondary/30 shadow-[0_0_40px_rgba(234,179,8,0.08)] md:ring-0 md:shadow-none">
                    <div className="w-full lg:w-1/2 aspect-[16/10] overflow-hidden relative rounded-2xl md:rounded-3xl border border-secondary/30 shadow-[0_0_30px_rgba(234,179,8,0.12)]">
                      <img
                        src={topPost.image?.startsWith('http') || topPost.image?.startsWith('/') ? encodeURI(topPost.image) : `/${encodeURI(topPost.image)}`}
                        alt={topPost.title}
                        className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200"; }}
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left px-2 md:px-0">
                      <div className="flex items-center gap-3 mb-3 md:mb-4">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-secondary">{topPost.category}</span>
                        <div className="w-4 md:w-6 h-px bg-white/10" />
                      </div>
                      <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-sans font-bold leading-tight mb-4 md:mb-5 transition-colors duration-500 group-hover:text-secondary">{topPost.title}</h2>
                      <p className="text-slate-400 text-sm md:text-base lg:text-lg leading-relaxed font-medium mb-5 md:mb-6 line-clamp-3">{topPost.excerpt}</p>
                      <div className="mt-auto w-full pt-6 md:pt-8 border-t border-secondary/20 flex items-center justify-between">
                        <div className="flex items-center gap-4 md:gap-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                          <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" /><span>{topPost.date}</span></div>
                          <div className="flex items-center gap-1.5"><Clock className="h-3 w-3 md:h-3.5 md:w-3.5" /><span>{topPost.readTime}</span></div>
                        </div>
                        <div className="flex items-center gap-2 text-secondary group-hover:translate-x-2 transition-transform duration-500">
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden sm:inline">Read Story</span>
                          <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>

                {/* Divider before rest */}
                {displayPosts.length > 0 && (
                  <div className="flex items-center gap-3 -mt-16">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">All Articles</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                )}
              </>
            )}

            {/* Remaining / all posts */}
            {displayPosts.map((post: any, index: number) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group block focus:outline-none">
                <article className="flex flex-col lg:flex-row items-center gap-6 md:gap-16">
                  <div className="w-full lg:w-1/2 aspect-[16/10] overflow-hidden relative rounded-2xl md:rounded-3xl border border-white/5 shadow-2xl">
                    <img
                      src={post.image?.startsWith('http') || post.image?.startsWith('/') ? encodeURI(post.image) : `/${encodeURI(post.image)}`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200"; }}
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <div className="w-full lg:w-1/2 flex flex-col items-start text-left px-2 md:px-0">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-secondary">
                        {!topPost && !isFiltered && index === 0 ? "Featured Choice" : post.category}
                      </span>
                      <div className="w-4 md:w-6 h-px bg-white/10" />
                    </div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-sans font-bold leading-tight mb-4 md:mb-5 transition-colors duration-500 group-hover:text-secondary">{post.title}</h2>
                    <p className="text-slate-400 text-sm md:text-base lg:text-lg leading-relaxed font-medium mb-5 md:mb-6 line-clamp-3">{post.excerpt}</p>
                    <div className="mt-auto w-full pt-6 md:pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4 md:gap-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-white/30">
                        <div className="flex items-center gap-1.5 md:gap-2"><Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" /><span>{post.date}</span></div>
                        <div className="flex items-center gap-1.5 md:gap-2"><Clock className="h-3 w-3 md:h-3.5 md:w-3.5" /><span>{post.readTime}</span></div>
                      </div>
                      <div className="flex items-center gap-2 text-secondary group-hover:translate-x-2 transition-transform duration-500">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden sm:inline">Read Story</span>
                        <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}

            {/* Empty state - only if truly no results */}
            {totalShown === 0 && (
              <div className="py-24 text-center">
                <Moon className="w-16 h-16 text-secondary/20 mx-auto mb-6" />
                <h3 className="text-2xl font-serif font-black mb-2 tracking-tight">No Blogs Found</h3>
                <p className="text-slate-500 uppercase tracking-widest text-xs mb-6">Try a different search or category</p>
                <button onClick={clearAll} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-600 text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Newsletter CTA */}
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
                <input type="email" placeholder="your@email.com" className="flex-grow px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-secondary/50 outline-none text-white font-bold transition-all text-center sm:text-left" />
                <button className="px-10 py-5 rounded-2xl bg-secondary text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default Blog;
