import { useEffect, useMemo, useState } from "react";
import { ResultPreview } from "@/components/ResultPreview";
import { generateReading, NumerologyReading } from "@/lib/numerology";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Crown, Lightbulb, Lock, Palette, Sparkles, Star } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { generateFreeReportFromDob, FreeNumerologyReport } from "@/lib/numerology";

type AppState = "landing" | "preview";

const PRICE = 49; // INR

const Index = () => {
  const [state, setState] = useState<AppState>("landing");
  const [reading, setReading] = useState<NumerologyReading | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [fullDob, setFullDob] = useState<Date | undefined>(undefined);
  const [sampleDob, setSampleDob] = useState<Date | undefined>(undefined);
  const [isSampleDobOpen, setIsSampleDobOpen] = useState(false);
  const [isFullDobOpen, setIsFullDobOpen] = useState(false);
  const [isSampleResultOpen, setIsSampleResultOpen] = useState(false);
  const [freeReport, setFreeReport] = useState<FreeNumerologyReport | null>(null);

  const { initiatePayment } = useRazorpay();
  const { toast } = useToast();

  const today = useMemo(() => new Date(), []);
  const minDob = useMemo(() => new Date(1900, 0, 1), []);

  const prefersDark = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && prefersDark)
    ) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [prefersDark]);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      html.classList.add("dark");
      localStorage.theme = "dark";
    }
  };

  const handleFormSubmit = (name: string, dob: Date) => {
    const newReading = generateReading(name, dob);
    setReading(newReading);
    setState("preview");
  };

  const handleSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleDob) {
      toast({
        title: "Invalid Date",
        description: "Please select a date of birth.",
        variant: "destructive",
      });
      return;
    }

    const report = generateFreeReportFromDob(sampleDob);
    setFreeReport(report);
    setIsSampleResultOpen(true);
  };

  const handleFullSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = fullName.trim();
    if (!name) return;
    if (!fullDob) {
      toast({
        title: "Invalid Date",
        description: "Please select a date of birth.",
        variant: "destructive",
      });
      return;
    }

    const newReading = generateReading(name, fullDob);
    setReading(newReading);
    setIsLoading(true);

    initiatePayment(
      PRICE,
      name,
      () => {
        setIsUnlocked(true);
        setIsLoading(false);
        setState("preview");
        toast({
          title: "Payment Successful! 🎉",
          description: "Your full report is now unlocked.",
        });
      },
      (error) => {
        setIsLoading(false);
        toast({
          title: "Payment Unsuccessful",
          description: error,
          variant: "destructive",
        });
      }
    );
  };

  const handleUnlock = () => {
    if (!reading) return;

    setIsLoading(true);
    initiatePayment(
      PRICE,
      reading.name,
      () => {
        setIsUnlocked(true);
        setIsLoading(false);
        toast({
          title: "Payment Successful! 🎉",
          description: "Your full numerology reading is now unlocked.",
        });
      },
      (error) => {
        setIsLoading(false);
        toast({
          title: "Payment Unsuccessful",
          description: error,
          variant: "destructive",
        });
      }
    );
  };

  if (state === "landing" || !reading) {
    return (
      <div className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
        <Dialog open={isSampleResultOpen} onOpenChange={setIsSampleResultOpen}>
          <DialogContent className="w-[95vw] max-w-3xl p-0 border-none bg-transparent shadow-none sm:overflow-hidden overflow-hidden flex flex-col max-h-[90vh]">
            {/* Outer Static Framework - Border & Glow stay here */}
            <div className="relative w-full rounded-[1.5rem] premium-border-gold shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-[#0a0518]/95 backdrop-blur-2xl flex flex-col h-full overflow-hidden">
              <div className="edge-glow z-20 pointer-events-none" />

              {/* Premium Cosmic Background Elements - Fixed position */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[100px] rounded-full" />
              </div>

              {/* Scrollable Content Container */}
              <div className="overflow-y-auto custom-scrollbar relative z-10 p-0 w-full flex-grow">
                <div className="relative px-5 py-6 sm:px-8 sm:py-8">
                  <DialogHeader className="relative text-center mb-6">
                    <div className="reveal-up stagger-1 mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-[8px] sm:text-[9px] font-bold tracking-[0.15em] uppercase text-secondary">
                      <Sparkles className="h-3 w-3 fill-current" />
                      Mystical Analysis
                    </div>
                    <DialogTitle className="reveal-up stagger-2 text-xl sm:text-4xl font-black tracking-tight leading-tight text-center">
                      Your Numerological <span className="text-gradient-gold">Blueprint</span>
                    </DialogTitle>
                    <DialogDescription className="reveal-up stagger-3 mx-auto mt-2 max-w-lg text-[10px] sm:text-sm leading-relaxed text-white/50">
                      Your cosmic vibration reveals hidden patterns. Based on your birth date, we've decoded your fundamental essence.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-12 mb-6">
                    {/* Quick Insight Card - Fixed Mobile Order */}
                    <div className="reveal-up stagger-1 md:col-span-4 group relative overflow-hidden rounded-xl glass-morphism p-4 transition-all duration-500 hover:-translate-y-1 hover:border-secondary/20 hover:bg-white/5 order-2 md:order-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 border border-secondary/30 mb-3">
                        <Lightbulb className="h-5 w-5 text-secondary" />
                      </div>
                      <h4 className="text-[10px] sm:text-[10px] font-bold uppercase tracking-widest text-secondary/80 mb-1">Key Insight</h4>
                      <h3 className="text-sm sm:text-sm font-bold text-white mb-2">Daily Alignment</h3>
                      <p className="text-xs sm:text-[11px] text-white/60 leading-relaxed italic border-l border-secondary/30 pl-3 py-0.5">
                        “{freeReport?.quickInsight ?? ""}”
                      </p>
                    </div>

                    {/* Life Path Central Card */}
                    <div className="reveal-up stagger-2 md:col-span-4 group relative overflow-hidden rounded-xl bg-gradient-to-b from-secondary/15 to-transparent border border-secondary/30 p-5 transition-all duration-500 hover:-translate-y-1 order-1 md:order-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/15 border border-secondary/25 mb-3 mx-auto md:mx-0">
                        <Sparkles className="h-5 w-5 text-secondary" />
                      </div>
                      <h4 className="text-[10px] sm:text-[10px] font-bold uppercase tracking-widest text-secondary/80 mb-1 text-center md:text-left">Core Identity</h4>
                      <h3 className="text-base sm:text-base font-black text-white text-center md:text-left">Life Path Number</h3>
                      <div className="mt-3 sm:mt-4 flex items-baseline justify-center">
                        <span className="text-6xl sm:text-7xl font-black text-gradient-gold drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                          {freeReport?.lifePath ?? "-"}
                        </span>
                      </div>
                      <div className="mt-2 text-[9px] sm:text-[9px] text-center font-bold tracking-[0.1em] uppercase text-secondary/50">
                        {[11, 22, 33].includes(Number(freeReport?.lifePath)) ? "MASTER NUMBER" : "DESTINY PATHWAY"}
                      </div>
                    </div>

                    {/* Vibe & Details Column */}
                    <div className="md:col-span-4 flex flex-col gap-3 order-3">
                      {/* Lucky Color */}
                      <div className="reveal-up stagger-3 group relative overflow-hidden rounded-xl glass-morphism p-4 transition-all duration-500 hover:-translate-y-1 hover:border-secondary/20 hover:bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Palette className="h-4 w-4 text-secondary" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary/80">Vibrational Match</h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            className="h-10 w-10 sm:h-10 sm:w-10 rounded-xl border-2 border-white/10 shadow-lg"
                            style={{
                              backgroundColor: freeReport?.luckyColor.hex,
                              boxShadow: `0 0 15px ${freeReport?.luckyColor.hex}44`
                            } as React.CSSProperties}
                          />
                          <div>
                            <p className="text-xs sm:text-xs font-bold text-white uppercase tracking-tight">{freeReport?.luckyColor.name}</p>
                            <p className="text-[10px] sm:text-[9px] text-white/50 leading-tight mt-0.5 max-w-[140px]">{freeReport?.luckyColor.line}</p>
                          </div>
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="reveal-up stagger-4 group relative overflow-hidden rounded-xl glass-morphism p-4 transition-all duration-500 hover:-translate-y-1 hover:border-secondary/20 hover:bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="h-4 w-4 text-secondary" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary/80">Foundation</h4>
                        </div>
                        <p className="text-base sm:text-base font-black text-white tracking-[0.15em]">{freeReport?.dob}</p>
                      </div>
                    </div>
                  </div>

                  {/* Premium Teaser Sections */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-px bg-gradient-to-r from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                      <span className="text-sm sm:text-base font-black uppercase tracking-[0.25em] text-gradient-gold drop-shadow-sm">Premium Insights</span>
                      <div className="h-px bg-gradient-to-l from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {freeReport?.premiumTeasers.map((teaser, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-[transform,background-color,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-secondary/30 hover:bg-white/[0.04]">
                          <div className="flex items-center gap-2 mb-2 w-full">
                            <Lock className="h-3 w-3 text-secondary/60 shrink-0" />
                            <h4 className="text-[12px] sm:text-[13px] font-bold text-white tracking-tight leading-none truncate flex-grow">
                              {teaser.title}
                            </h4>
                          </div>
                          <div className="relative mt-2">
                            <p
                              className="text-[10px] leading-relaxed text-white/60 select-none px-1"
                              style={{ filter: 'blur(1.5px)', willChange: 'filter' }}
                            >
                              {teaser.content}
                            </p>

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none">
                              <span className="text-[8px] font-bold uppercase tracking-widest text-secondary bg-black/80 px-2 py-1 rounded-full border border-secondary/30 shadow-lg backdrop-blur-sm">
                                Unlock to Read
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Premium Modules Section */}
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px bg-gradient-to-r from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                      <span className="text-sm sm:text-base font-black uppercase tracking-[0.25em] text-gradient-gold drop-shadow-sm text-center">Included in Full Report</span>
                      <div className="h-px bg-gradient-to-l from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                    </div>

                    <div className="space-y-3">
                      {freeReport?.premiumModules.map((module, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-xl border border-white/5 bg-secondary/[0.03] p-4 transition-[transform,background-color,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:bg-secondary/[0.08] hover:border-secondary/40 shadow-sm hover:shadow-secondary/5">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-0.5">
                              <span className="material-icons-round text-secondary/70 text-xl">{module.icon}</span>
                            </div>
                            <div className="flex-grow text-left">
                              <h4 className="text-sm sm:text-[15px] font-black text-white mb-2 uppercase tracking-wide text-left leading-snug">{module.title}</h4>
                              <div className="relative text-left mt-1">
                                <p
                                  className="text-[11px] leading-relaxed text-white/40 pr-8 text-left select-none"
                                  style={{ filter: 'blur(1.5px)', willChange: 'filter' }}
                                >
                                  {module.description}
                                </p>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                  <span className="text-[8px] font-bold uppercase tracking-widest text-secondary bg-black/80 px-2 py-1 rounded-full border border-secondary/30 shadow-lg backdrop-blur-sm">
                                    Unlock to Read
                                  </span>
                                </div>

                                <div className="absolute right-0 top-0 opacity-40 group-hover:opacity-0 transition-opacity">
                                  <Lock className="h-3 w-3 text-secondary" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Cosmic Remedies Library (Brighter & More Premium) */}
                  <div className="relative space-y-8 mb-12">
                    {/* Vibrant Background Glow for Section */}
                    <div className="absolute inset-0 -z-10 bg-secondary/5 blur-[80px] rounded-full opacity-60" />

                    <div className="flex flex-col items-center gap-2 mb-6">
                      <div className="flex items-center w-full gap-4">
                        <div className="h-px bg-gradient-to-r from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                        <span className="text-lg sm:text-xl font-black uppercase tracking-[0.2em] text-gradient-gold drop-shadow-sm">
                          The Cosmic Remedies Library
                        </span>
                        <div className="h-px bg-gradient-to-l from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                      </div>
                      <div className="text-center max-w-xl mx-auto px-4 mt-2">
                        <p className="text-[13px] sm:text-[14px] text-white/70 leading-relaxed font-medium italic">
                          Align with the hidden frequencies of your numbers. Explore spiritual rituals, manifestation days, and energy-shifting remedies tailored specifically for your vibrational blueprint.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 pr-0">
                      {[
                        { num: 1, tag: "The Fearless Pioneer", line: "Master the art of focused leadership and original action." },
                        { num: 2, tag: "The Intuitive Peacekeeper", line: "Harness the power of emotional harmony and sacred partnerships." },
                        { num: 3, tag: "The Creative Manifestor", line: "Unlock the flow of creative expression and contagious joy." },
                        { num: 4, tag: "The Divine Architect", line: "Build a foundation of absolute stability and mental strength." },
                        { num: 5, tag: "The Dynamic Catalyst", line: "Balance wild freedom with intentional cosmic focus." },
                        { num: 6, tag: "The Radiant Healer", line: "Protect your energy while nurturing the world with love." },
                        { num: 7, tag: "The Mystic Seeker", line: "Decode the deep secrets of your inner wisdom and clarity." },
                        { num: 8, tag: "The Abundance Master", line: "Step into your power of success and material alignment." },
                        { num: 9, tag: "The Golden Humanitarian", line: "Align with the high frequency of universal compassion." }
                      ].map((path) => (
                        <div
                          key={path.num}
                          className={`relative group/path overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-1 ${Number(freeReport?.lifePath) === path.num ? 'border-secondary/50 bg-[#160f2e] shadow-[0_0_30px_rgba(234,179,8,0.1)]' : 'border-white/10 bg-[#120a24]'}`}
                        >
                          {Number(freeReport?.lifePath) === path.num && (
                            <div className="absolute top-0 right-0 p-3">
                              <div className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full shadow-xl">
                                <Star className="h-2.5 w-2.5 fill-current animate-pulse" />
                                <span className="text-[8px] font-black uppercase tracking-tighter">Your Path</span>
                              </div>
                            </div>
                          )}

                          <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/40 to-secondary/10 flex items-center justify-center text-secondary font-black text-xl border border-secondary/30 shadow-inner">
                                {path.num}
                              </div>
                              <div className="text-left">
                                <h4 className="text-[14px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                  {path.tag}
                                  <Sparkles className="h-3 w-3 text-secondary/40 opacity-0 group-hover/path:opacity-100 transition-opacity" />
                                </h4>
                                <p className="text-[11px] text-white/50 leading-relaxed font-medium">{path.line}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              {[1, 2, 3].map((r) => (
                                <div key={r} className="relative py-4 px-2 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center justify-center gap-2 group/remedy transition-all duration-300 hover:border-secondary/40 hover:bg-secondary/[0.02]">
                                  <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest transition-colors group-hover/remedy:text-secondary/60 text-center">Remedy {r}</span>
                                  <div className="p-1.5 rounded-full bg-white/5 border border-white/10 group-hover/remedy:border-secondary/20 transition-all">
                                    <Lock className="h-3 w-3 text-white/20 group-hover/remedy:text-secondary group-hover/remedy:animate-pulse" />
                                  </div>

                                  {/* Premium Hover Overlay - Enhanced */}
                                  <div className="absolute inset-0 bg-[#0a0518]/80 backdrop-blur-[4px] opacity-0 group-hover/remedy:opacity-100 transition-all duration-300 flex flex-col items-center justify-center rounded-xl scale-95 group-hover/remedy:scale-100 border border-secondary/30">
                                    <div className="p-2 rounded-full bg-secondary text-secondary-foreground mb-1.5 shadow-lg shadow-secondary/40">
                                      <Lock className="h-3.5 w-3.5 fill-current" />
                                    </div>
                                    <span className="text-[7px] font-black text-secondary uppercase tracking-[0.25em]">Unlock</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/20 via-secondary/5 to-transparent border border-secondary/30 text-center shadow-2xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-secondary/5 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      <p className="text-[11px] text-white/80 leading-relaxed font-semibold relative z-10 text-center flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 text-secondary shrink-0" />
                        Unlock 12+ paths including your personalized Manifestation Day, Ritual Color, and 5-Min Alignment Shifts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer CTA - Always visible at bottom of modal */}
              <div className="relative z-30 bg-[#0a0518]/90 backdrop-blur-xl border-t border-white/10 p-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[9px] sm:text-[10px] leading-tight text-white/40 max-w-[280px] text-center sm:text-left">
                  Full name-based analysis included in premium.
                  <div className="mt-0.5 opacity-50 italic">
                    {freeReport?.disclaimer}
                  </div>
                </div>

                <Button
                  className="w-full sm:w-auto gradient-gold text-secondary-foreground shadow-2xl hover:-translate-y-1 transition-all duration-500 px-6 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] premium-glow glow-pulse group/btn"
                  style={{
                    '--glow-color': `${freeReport?.luckyColor.hex}44`,
                    '--glow-color-bright': `${freeReport?.luckyColor.hex}aa`,
                  } as React.CSSProperties}
                  onClick={() => {
                    setIsSampleResultOpen(false);
                    document.getElementById("premium-report")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  type="button"
                >
                  <Crown className="mr-2 h-4 w-4 sm:h-5 sm:w-5 fill-current transition-transform duration-500 group-hover/btn:rotate-12" />
                  Upgrade to Premium — ₹49
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


        <nav className="w-full fixed top-0 z-50 glass-panel bg-background/70 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-secondary text-3xl">auto_awesome</span>
                <span className="font-bold text-xl tracking-tight">NumeroInsight</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a className="text-sm font-medium hover:text-secondary transition-colors" href="#free-sample">
                  Try Free Sample
                </a>
                <a className="text-sm font-medium hover:text-secondary transition-colors" href="#how-it-works">
                  How it Works
                </a>
                <a className="text-sm font-medium hover:text-secondary transition-colors" href="#samples">
                  Sample Report
                </a>
                <a className="text-sm font-medium hover:text-secondary transition-colors" href="#testimonials">
                  Reviews
                </a>
                <button
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  onClick={toggleTheme}
                  type="button"
                >
                  <span className="material-icons-round dark:hidden">dark_mode</span>
                  <span className="material-icons-round hidden dark:block">light_mode</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow pt-16">
          <section className="relative isolate pt-6 pb-16 lg:pt-10 lg:pb-24 overflow-hidden">
            <video
              className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
              src="/vidoes/hero%20sec.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 z-10 bg-background/60 dark:bg-background/70 pointer-events-none" />

            <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-secondary opacity-50 animate-pulse" />
            <div className="absolute bottom-40 right-10 w-4 h-4 rounded-full bg-secondary opacity-30 animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start justify-between gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold mb-6 border border-border">
                  <span className="material-icons-round text-sm">verified</span>
                  Pythagorean System
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Discover your <span className="text-secondary">Destiny</span> through Numbers
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                  Unlock the secrets of your personality, lucky numbers &amp; colors. Get a full comprehensive report or try a free sample now.
                </p>

                <div
                  className="bg-card border border-border p-6 rounded-2xl shadow-lg max-w-lg mx-auto lg:mx-0 mb-8 relative overflow-hidden group"
                  id="free-sample"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all duration-500" />
                  <div className="flex items-center gap-2 mb-4 relative z-10">
                    <span className="material-icons-round text-secondary">redeem</span>
                    <h3 className="font-bold text-lg">Try a Free Sample Reading</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 relative z-10">
                    Enter your birth date to see your lucky number instantly.
                  </p>
                  <form className="flex flex-col sm:flex-row gap-3 relative z-10" onSubmit={handleSampleSubmit}>
                    <div className="relative flex-grow">
                      <Popover open={isSampleDobOpen} onOpenChange={setIsSampleDobOpen}>
                        <PopoverTrigger asChild>
                          <button
                            className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background text-sm"
                            onClick={() => setIsSampleDobOpen(true)}
                            type="button"
                          >
                            {sampleDob ? format(sampleDob, "dd-MM-yyyy") : "Select date of birth"}
                          </button>
                        </PopoverTrigger>
                        <button
                          aria-label="Open calendar"
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-muted"
                          onClick={() => setIsSampleDobOpen(true)}
                          type="button"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </button>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={today.getFullYear()}
                            mode="single"
                            selected={sampleDob}
                            onSelect={(d) => {
                              setSampleDob(d);
                              if (d) setIsSampleDobOpen(false);
                            }}
                            disabled={{ before: minDob, after: today }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <button
                      className="whitespace-nowrap px-6 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                      type="submit"
                    >
                      Show My Number
                    </button>
                  </form>
                </div>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="material-icons-round text-secondary text-base">bolt</span>
                    Instant Results
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons-round text-secondary text-base">group</span>
                    10K+ Users
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons-round text-secondary text-base">lock</span>
                    Private &amp; Secure
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full max-w-md mx-auto lg:mx-0" id="premium-report">
                <div className="bg-card/90 dark:bg-card glass-panel p-8 rounded-2xl shadow-2xl border-2 border-secondary/20 relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground font-bold px-4 py-1 rounded-full text-sm shadow-md">
                    Full Premium Report
                  </div>
                  <div className="text-center mb-6 mt-2">
                    <h3 className="text-xl font-bold">Comprehensive Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-1">Deep dive into your Life Path, Soul Urge &amp; Destiny.</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleFullSubmit}>
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="fullname">
                        Your Full Legal Name
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
                        id="fullname"
                        placeholder="As per birth certificate"
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="dob-full">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Popover open={isFullDobOpen} onOpenChange={setIsFullDobOpen}>
                          <PopoverTrigger asChild>
                            <button
                              className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
                              id="dob-full"
                              onClick={() => setIsFullDobOpen(true)}
                              type="button"
                            >
                              {fullDob ? format(fullDob, "dd-MM-yyyy") : "Select date of birth"}
                            </button>
                          </PopoverTrigger>
                          <button
                            aria-label="Open calendar"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-muted"
                            onClick={() => setIsFullDobOpen(true)}
                            type="button"
                          >
                            <CalendarIcon className="h-4 w-4" />
                          </button>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout="dropdown"
                              fromYear={1900}
                              toYear={today.getFullYear()}
                              mode="single"
                              selected={fullDob}
                              onSelect={(d) => {
                                setFullDob(d);
                                if (d) setIsFullDobOpen(false);
                              }}
                              disabled={{ before: minDob, after: today }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground flex gap-2 items-start">
                      <span className="material-icons-round text-sm text-secondary mt-0.5">info</span>
                      <p>Full name is required for accurate Pythagorean calculation of your Soul Urge and Expression numbers.</p>
                    </div>

                    <button
                      className="w-full py-4 px-6 rounded-lg gradient-gold text-secondary-foreground font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                      type="submit"
                    >
                      <span className="material-icons-round">lock_open</span>
                      Unlock Full Report
                    </button>

                    <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground line-through">₹499</span>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded text-xs font-semibold">
                          90% OFF
                        </span>
                        <span className="font-bold text-2xl text-secondary">₹49</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-card" id="samples">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Sample Reading Insights</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Here is a preview of what you'll discover in your premium report. We analyze your name and birth date to generate a comprehensive profile.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-2xl bg-muted border border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4">
                    <span className="material-icons-round text-secondary text-2xl">fingerprint</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Life Path Number</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Reveals your greater purpose, including strengths, challenges, talents, and ambitions.
                  </p>
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Example Result</div>
                    <div className="font-semibold text-secondary">Number 7: The Seeker</div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-muted border border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4">
                    <span className="material-icons-round text-secondary text-2xl">favorite</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Soul Urge</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Uncovers your inner cravings, likes, dislikes, and your deepest heart's desires.
                  </p>
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Example Result</div>
                    <div className="font-semibold text-secondary">Number 3: Creative Expression</div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-muted border border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4">
                    <span className="material-icons-round text-secondary text-2xl">palette</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Lucky Colors &amp; Gems</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Personalized suggestions for colors and gemstones that resonate with your vibration.
                  </p>
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Example Result</div>
                    <div className="font-semibold text-secondary">Deep Blue &amp; Sapphire</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-secondary/5 skew-y-3 transform origin-bottom-right scale-110" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 order-2 md:order-1">
                <img
                  alt="Abstract mystical constellation and stars background representing numerology"
                  className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-background w-full object-cover h-80 md:h-96"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs60hX_nmhbjU55cj1fPsMZfTV4v8RN10FK_L7JjSKaQ6mFK7Rct_1Vaiak4kMcCae-OqtbVq8g0ohbVfbXb3Cb7WYYNn_BNuLZwONJ7cAXj7kKL7VG8QeGDqYvN9rgXVnzUObXJyDHPPaJfKBY5UWq33M7EsQEifT8OIvf7qlkfkr5YU4S_H2tGupseFITy5O6xUXrG2q1K5tBv0C5Ij7fgbYURcEwxXkE7VygKngAsJUJM3OHMSs2OjEQDdQg0JP40E8kkPkVQ"
                />
              </div>
              <div className="flex-1 order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">What is Numerology?</h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    Numerology is the study of the spiritual meaning of numbers. It is an ancient science that dates back thousands of years, with roots in Babylonia, China, and Greece.
                  </p>
                  <p>
                    We utilize the <strong className="text-secondary">Pythagorean system</strong>, which assigns a numerical value to letters in your name to uncover patterns in your personality and life path.
                  </p>
                  <p>It's not magic—it's a language. Just as DNA codes our biology, numbers code our vibrational essence.</p>
                </div>
                <div className="mt-8">
                  <a className="inline-flex items-center text-secondary font-bold hover:underline" href="#how-it-works">
                    Learn how it works <span className="material-icons-round ml-1">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-card" id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                <p className="text-muted-foreground">Your journey to self-discovery in three simple steps.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
                <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border z-0" />

                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto rounded-full bg-background border-4 border-border flex items-center justify-center mb-6 shadow-md">
                    <span className="material-icons-round text-4xl text-secondary">edit_note</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">1. Enter Details</h3>
                  <p className="text-muted-foreground text-sm px-4">
                    Provide your full birth name and date of birth. Our system ensures your data remains private.
                  </p>
                </div>

                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto rounded-full bg-background border-4 border-border flex items-center justify-center mb-6 shadow-md">
                    <span className="material-icons-round text-4xl text-secondary">calculate</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">2. Calculation</h3>
                  <p className="text-muted-foreground text-sm px-4">
                    Our algorithm applies Pythagorean numerology principles to calculate your core numbers instantly.
                  </p>
                </div>

                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto rounded-full bg-background border-4 border-border flex items-center justify-center mb-6 shadow-md">
                    <span className="material-icons-round text-4xl text-secondary">auto_stories</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">3. Reveal Insight</h3>
                  <p className="text-muted-foreground text-sm px-4">
                    Unlock your detailed report containing personality traits, lucky factors, and life guidance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-muted" id="testimonials">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
                <div className="flex justify-center items-center gap-2 mb-2">
                  <div className="flex text-secondary">
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star_half</span>
                  </div>
                  <span className="text-muted-foreground font-medium">4.8/5 Average Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
                  <div className="flex text-secondary mb-4 text-sm">
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                  </div>
                  <p className="text-muted-foreground italic mb-6">
                    "I was skeptical at first, but the Life Path description was scary accurate. It really helped me understand why I react to things the way I do."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm">SP</div>
                    <div>
                      <div className="font-bold text-sm">Sarah P.</div>
                      <div className="text-xs text-muted-foreground">Verified User</div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
                  <div className="flex text-secondary mb-4 text-sm">
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                  </div>
                  <p className="text-muted-foreground italic mb-6">
                    "The lucky colors section is my favorite. I started wearing more blue as suggested and I genuinely feel more confident at work."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-blue-800 dark:text-white font-bold text-sm">RK</div>
                    <div>
                      <div className="font-bold text-sm">Rahul K.</div>
                      <div className="text-xs text-muted-foreground">Verified User</div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
                  <div className="flex text-secondary mb-4 text-sm">
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round">star</span>
                    <span className="material-icons-round text-muted-foreground">star</span>
                  </div>
                  <p className="text-muted-foreground italic mb-6">
                    "Fast, simple, and very insightful. For the price of a coffee, the report offers incredible value. Highly recommended."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-200 dark:bg-green-700 flex items-center justify-center text-green-800 dark:text-white font-bold text-sm">MJ</div>
                    <div>
                      <div className="font-bold text-sm">Michael J.</div>
                      <div className="text-xs text-muted-foreground">Verified User</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 gradient-mystic z-0" />
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">Ready to uncover your destiny?</h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Get your personalized numerology report instantly. No account creation required for initial check.
              </p>
              <button
                className="py-4 px-10 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                type="button"
              >
                Get Started Now
              </button>
              <p className="mt-4 text-sm text-primary-foreground/70">100% Satisfaction Guarantee</p>
            </div>
          </section>
        </main>

        <footer className="bg-card border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-icons-round text-secondary text-2xl">auto_awesome</span>
                  <span className="font-bold text-lg">NumeroInsight</span>
                </div>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Based on Pythagorean numerology system. We are dedicated to providing accurate and insightful readings to help you navigate life's journey.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a className="hover:text-secondary transition-colors" href="#">
                      Home
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-secondary transition-colors" href="#how-it-works">
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-secondary transition-colors" href="#samples">
                      Sample Report
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-secondary transition-colors" href="#">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a className="hover:text-secondary transition-colors" href="#">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-secondary transition-colors" href="#">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-secondary transition-colors" href="#">
                      Refund Policy
                    </a>
                  </li>
                  <li className="flex items-center gap-1 mt-4">
                    <span className="material-icons-round text-base">lock</span>
                    Secure Payment
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
              <p>© 2023 NumeroInsight. All rights reserved. Your data is not stored permanently.</p>
            </div>
          </div>
        </footer>
      </div >
    );
  }

  return (
    <ResultPreview
      reading={reading}
      isUnlocked={isUnlocked}
      onUnlock={handleUnlock}
      isLoading={isLoading}
    />
  );
};

export default Index;
