import { useEffect, useMemo, useState } from "react";
import { ResultPreview } from "@/components/ResultPreview";
import { generateReading, NumerologyReading } from "@/lib/numerology";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Activity,
  Briefcase,
  Calendar as CalendarIcon,
  CheckCircle2,
  Compass,
  Crown,
  Fingerprint,
  Gem,
  Hash,
  HeartHandshake,
  Lightbulb,
  Lock,
  Moon,
  Music,
  Orbit,
  Palette,
  Scale,
  Shield,
  Sparkles,
  Star,
  StarHalf,
  VenetianMask,
  Zap,
  ChevronRight, // Added
  Unlock, // Added
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
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
  const [api, setApi] = useState<CarouselApi>();

  const scrollToTop = () => {
    const topElement = document.getElementById("top");
    if (topElement) {
      topElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api]);
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
    // Enforce Dark Mode Only
    document.documentElement.classList.add("dark");
  }, []);

  // Session Persistence: Load from localStorage or URL Share Link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("v");
    const sharedData = params.get("data");

    if (v || sharedData) {
      try {
        let name = "";
        let dob = new Date();
        let unlocked = false;

        if (v) {
          // New Short Format: Name|Timestamp|Unlocked
          const decodedRaw = decodeURIComponent(atob(v));
          const [n, d, u] = decodedRaw.split("|");
          name = n;
          dob = new Date(parseInt(d));
          unlocked = u === "1";
        } else if (sharedData) {
          // Fallback for old JSON format
          const decoded = JSON.parse(atob(sharedData));
          name = decoded.n;
          dob = new Date(decoded.d);
          unlocked = decoded.u === true || decoded.u === 1;
        }

        if (name && dob) {
          const newReading = generateReading(name, dob);
          setReading(newReading);
          setIsUnlocked(unlocked);
          setState("preview");

          // Clean up URL to keep it pretty
          window.history.replaceState({}, document.title, window.location.pathname);

          toast({
            title: "Cosmic Report Loaded! ✨",
            description: `Welcome back, ${name}. Your unique vibration has been restored.`,
          });
          return;
        }
      } catch (e) {
        console.error("Failed to parse shared link data", e);
      }
    }

    const savedState = localStorage.getItem("numerology_session");
    if (savedState) {
      try {
        const { reading: savedReading, isUnlocked: savedIsUnlocked, state: savedAppState } = JSON.parse(savedState);
        if (savedReading) {
          // Convert string back to Date object
          savedReading.dob = new Date(savedReading.dob);
          setReading(savedReading);
          setIsUnlocked(savedIsUnlocked);
          setState(savedAppState);
        }
      } catch (e) {
        console.error("Failed to load saved session", e);
      }
    }
  }, []);

  // Session Persistence: Save to localStorage (Only if not in landing state)
  useEffect(() => {
    if (reading) {
      localStorage.setItem("numerology_session", JSON.stringify({
        reading,
        isUnlocked,
        state
      }));
    }
  }, [isUnlocked, reading, state]);

  // Handle auto-scroll to top when transitioning to preview state
  useEffect(() => {
    if (state === "preview") {
      document.body.style.overflow = "auto"; // Force reset body overflow
      window.scrollTo({ top: 0, behavior: "instant" });
      // Extra safety: some browsers need a small delay after render
      const timeoutId = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.body.style.overflow = "auto";
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [state]);

  const handleReset = () => {
    localStorage.removeItem("numerology_session");
    setReading(null);
    setIsUnlocked(false);
    setState("landing");
    setFullName("");
    setFullDob(undefined);
    scrollToTop();
  };

  // Removed toggleTheme to enforce dark mode only

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
        setIsSampleResultOpen(false); // Ensure modal is closed
        window.scrollTo({ top: 0, behavior: "instant" }); // Instant scroll to top for new view
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
        window.scrollTo({ top: 0, behavior: "instant" });
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
      <div id="top" className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col">
        <Dialog open={isSampleResultOpen} onOpenChange={setIsSampleResultOpen}>
          <DialogContent className="w-[95vw] max-w-3xl p-0 border-none bg-transparent shadow-none sm:overflow-hidden overflow-hidden flex flex-col max-h-[90vh]">
            {/* Outer Static Framework - Border & Glow stay here */}
            <div className="relative w-full rounded-[1.5rem] border-2 border-[#D100D1]/40 shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-[#0d000d]/95 backdrop-blur-2xl flex flex-col h-full overflow-hidden">
              <div className="edge-glow z-20 pointer-events-none" />

              {/* Premium Cosmic Background Elements - Fixed position */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[100px] rounded-full" />
              </div>

              {/* Scrollable Content Container */}
              <div className="overflow-y-auto custom-scrollbar relative z-10 p-0 w-full flex-grow">
                <div className="relative px-5 py-6 sm:px-8 sm:py-8">
                  <DialogHeader className="relative text-center mb-4">
                    <div className="reveal-up stagger-1 mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-[8px] sm:text-[9px] font-bold tracking-[0.15em] uppercase text-secondary">
                      <Orbit className="h-3 w-3 fill-current animate-spin-slow" />
                      Mystical Analysis
                    </div>
                    <DialogTitle className="reveal-up stagger-2 text-xl sm:text-4xl font-black tracking-tight leading-tight text-center">
                      Your Numerological <span className="text-gradient-gold">Blueprint</span>
                    </DialogTitle>
                    <DialogDescription className="reveal-up stagger-3 mx-auto mt-2 max-w-lg text-[10px] sm:text-sm leading-relaxed text-white/50">
                      Your cosmic vibration reveals hidden patterns. Based on your birth date, we've decoded your fundamental essence.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-12 mb-4">
                    {/* Quick Insight Card - Fixed Mobile Order */}
                    <div className="reveal-up stagger-1 md:col-span-4 group relative overflow-hidden rounded-xl glass-morphism p-4 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] hover:border-secondary/30 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-secondary/10 order-2 md:order-1 flex flex-col">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 border border-secondary/30 mb-3 transition-colors duration-500">
                        <Zap className="h-5 w-5 text-secondary" />
                      </div>
                      <h4 className="text-[10px] sm:text-[10px] font-bold uppercase tracking-widest text-secondary/80 mb-1">Micro Hack</h4>
                      <h3 className="text-sm sm:text-sm font-bold text-white mb-2 transition-colors duration-500">Vibrational Micro-Remedy</h3>
                      <p className="text-xs sm:text-[11px] text-white/60 leading-relaxed italic border-l border-secondary/30 pl-3 py-0.5 transition-colors duration-500">
                        “{freeReport?.quickInsight ?? ""}”
                      </p>
                    </div>

                    {/* Life Path Central Card */}
                    <div className="reveal-up stagger-2 md:col-span-4 group relative overflow-hidden rounded-xl bg-gradient-to-b from-secondary/15 to-transparent border border-secondary/30 p-4 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/20 order-1 md:order-2 flex flex-col justify-center min-h-[160px]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/15 border border-secondary/25 mb-3 mx-auto md:mx-0 transition-all duration-500">
                        <Fingerprint className="h-5 w-5 text-secondary" />
                      </div>
                      <h4 className="text-[10px] sm:text-[10px] font-bold uppercase tracking-widest text-secondary/80 mb-1 text-center md:text-left">Core Identity</h4>
                      <h3 className="text-base sm:text-base font-black text-white text-center md:text-left transition-all duration-500">Life Path Number</h3>
                      <div className="mt-1 sm:mt-2 flex items-baseline justify-center transition-transform duration-700 ease-out">
                        <span className="text-6xl sm:text-7xl font-black text-gradient-gold drop-shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all">
                          {freeReport?.lifePath ?? "-"}
                        </span>
                      </div>
                      <div className="mt-2 text-[9px] sm:text-[9px] text-center font-bold tracking-[0.1em] uppercase text-secondary/50 transition-colors duration-500">
                        {[11, 22, 33].includes(Number(freeReport?.lifePath)) ? "MASTER NUMBER" : "DESTINY PATHWAY"}
                      </div>
                    </div>

                    {/* Vibe & Details Column */}
                    <div className="md:col-span-4 flex flex-col gap-3 order-3">
                      {/* Lucky Color */}
                      <div className="reveal-up stagger-3 group relative overflow-hidden rounded-xl glass-morphism p-4 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] hover:border-secondary/20 hover:bg-white/5 hover:shadow-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Palette className="h-4 w-4 text-secondary transition-transform" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary/80">Vibrational Match</h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            className="h-10 w-10 sm:h-10 sm:w-10 rounded-xl border-2 border-white/10 shadow-lg transition-all duration-500"
                            style={{
                              backgroundColor: freeReport?.luckyColor.hex,
                              boxShadow: `0 0 15px ${freeReport?.luckyColor.hex}44`
                            } as React.CSSProperties}
                          />
                          <div>
                            <p className="text-xs sm:text-xs font-bold text-white uppercase tracking-tight transition-colors">{freeReport?.luckyColor.name}</p>
                            <p className="text-[10px] sm:text-[9px] text-white/50 leading-tight mt-0.5 max-w-[140px] transition-colors">{freeReport?.luckyColor.line}</p>
                          </div>
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="reveal-up stagger-4 group relative overflow-hidden rounded-xl glass-morphism p-4 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] hover:border-secondary/20 hover:bg-white/5 hover:shadow-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="h-4 w-4 text-secondary transition-transform" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary/80">Foundation</h4>
                        </div>
                        <p className="text-base sm:text-base font-black text-white tracking-[0.15em] transition-colors duration-500">{freeReport?.dob}</p>
                      </div>
                    </div>
                  </div>

                  {/* Premium Teaser Sections */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                      <span className="text-sm sm:text-base font-black uppercase tracking-[0.25em] text-gradient-gold drop-shadow-sm">Premium Insights</span>
                      <div className="h-px bg-gradient-to-l from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {freeReport?.premiumTeasers.map((teaser, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#030303]/60 p-5 transition-all duration-500 hover:border-secondary/30 shadow-lg">
                          {/* Razor-thin highlight */}
                          <div className="absolute inset-0 border border-transparent group-hover:border-secondary/10 rounded-[1.5rem] pointer-events-none transition-all duration-500" />

                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20">
                              <Lock className="h-4 w-4 text-secondary/70" />
                            </div>
                            <h4 className="text-[13px] font-black text-white uppercase tracking-tight truncate">
                              {teaser.title}
                            </h4>
                          </div>
                          <div className="relative">
                            <p className="text-[11px] leading-relaxed text-white/40 select-none px-1 italic blur-[1.2px]">
                              {teaser.content}
                            </p>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-secondary bg-black/80 px-2 py-1 rounded-full border border-secondary/20 shadow-xl">
                                Unlock Insight
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

                    <div className="space-y-6">
                      {freeReport?.premiumModules.map((module, idx) => (
                        <div
                          key={idx}
                          className="group relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#030303] p-5 pt-8 md:p-6 transition-all duration-500 hover:border-secondary/30 shadow-xl"
                        >
                          {/* Floating Icon for Mobile */}
                          <div className="absolute -top-6 md:-top-7 left-5 p-3 rounded-2xl bg-[#0d000d] border border-secondary/20 shadow-2xl group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-500">
                            <span className="material-icons-round text-secondary text-xl font-bold">{module.icon}</span>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[15px] font-black text-white uppercase tracking-wider">{module.title}</h4>
                              <Lock className="h-3.5 w-3.5 text-secondary/40 shrink-0" />
                            </div>

                            <div className="relative">
                              <p className="text-[11px] leading-relaxed text-white/40 select-none italic blur-[1.2px]">
                                {module.description}
                              </p>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-secondary bg-black/80 px-2 py-1 rounded-full border border-secondary/20">
                                  Premium Content
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Premium Color Guidance Teaser */}
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px bg-gradient-to-r from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                      <span className="text-sm sm:text-base font-black uppercase tracking-[0.25em] text-gradient-gold drop-shadow-sm text-center">Color Alchemy & Guidance</span>
                      <div className="h-px bg-gradient-to-l from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-secondary/20 bg-secondary/[0.02] p-6 transition-all duration-500 hover:bg-secondary/[0.05]">
                      <div className="flex flex-col gap-6">
                        <div className="space-y-2 text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <Palette className="h-4 w-4 text-secondary" />
                            <h4 className="text-sm font-black text-white uppercase tracking-wider">{freeReport?.colorTeasers.luckyTitle}</h4>
                          </div>
                          <p className="text-[11px] text-white/60 leading-relaxed italic">{freeReport?.colorTeasers.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Lucky Colors Teaser */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest pl-1">Supportive Tones</span>
                            <div className="space-y-2">
                              {[1, 2].map(i => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
                                  <div className="w-8 h-8 rounded-lg bg-white/10 blur-[2px] shrink-0" />
                                  <div className="h-2 w-24 bg-white/10 rounded blur-[2px]" />
                                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Lock className="h-3 w-3 text-secondary" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Challenging Colors Teaser */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest pl-1">Challenging Tones</span>
                            <div className="space-y-2">
                              {[1, 2].map(i => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
                                  <div className="w-8 h-8 rounded-lg bg-white/10 blur-[2px] shrink-0" />
                                  <div className="h-2 w-24 bg-white/10 rounded blur-[2px]" />
                                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Lock className="h-3 w-3 text-secondary" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                          <p className="text-[9px] text-white/40 text-center italic leading-relaxed">
                            Your personalised Color Tones as per the Numerology for <span className="text-secondary font-bold font-sans tracking-wider">{freeReport?.dob}</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Premium Number Alignment Teaser */}
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px bg-gradient-to-r from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                      <span className="text-sm sm:text-base font-black uppercase tracking-[0.25em] text-gradient-gold drop-shadow-sm text-center">Cosmic Number Alignment</span>
                      <div className="h-px bg-gradient-to-l from-transparent via-secondary/40 to-secondary/60 flex-grow" />
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-secondary/20 bg-secondary/[0.02] p-6 transition-all duration-500 hover:bg-secondary/[0.05]">
                      <div className="flex flex-col gap-6">
                        <div className="space-y-2 text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <Activity className="h-4 w-4 text-emerald-400" />
                            <h4 className="text-sm font-black text-white uppercase tracking-wider">The Power of Choice</h4>
                          </div>
                          <p className="text-[11px] text-white/60 leading-relaxed italic">{freeReport?.numberTeasers.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Friendly Allies Teaser */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest pl-1">{freeReport?.numberTeasers.friendlyTitle}</span>
                            <div className="flex flex-wrap gap-2">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="relative w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
                                  <div className="w-4 h-4 bg-white/20 rounded blur-[1px]" />
                                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Lock className="h-3 w-3 text-emerald-400" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Growth Triggers Teaser */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest pl-1">{freeReport?.numberTeasers.growthTitle}</span>
                            <div className="flex flex-wrap gap-2">
                              {[1, 2].map(i => (
                                <div key={i} className="relative w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center overflow-hidden">
                                  <div className="w-4 h-4 bg-white/20 rounded blur-[1px]" />
                                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Lock className="h-3 w-3 text-orange-400" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                          <p className="text-[9px] text-white/40 text-center italic leading-relaxed">
                            These numbers are specific keys to your material and spiritual expansion.
                          </p>
                        </div>
                      </div>
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
                                  <Fingerprint className="h-3 w-3 text-secondary/40 opacity-0 group-hover/path:opacity-100 transition-opacity" />
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
                        <Orbit className="h-4 w-4 text-secondary shrink-0 animate-spin-slow" />
                        Claim Your High-Vibrational Future. Unlock your personalized Manifestation Day, Sacred Ritual Colors, and 12+ cosmic alignment shifts now.
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
                    // Add delay to allow modal to close fully and body overflow to reset
                    setTimeout(() => {
                      const element = document.getElementById("premium-report");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }, 300);
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
              <div className="flex items-center gap-2 group cursor-pointer" onClick={handleReset}>
                <div className="p-1.5 rounded-lg bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-all duration-500">
                  <Orbit className="h-6 w-6 text-secondary group-hover:rotate-180 transition-transform duration-1000 ease-in-out" />
                </div>
                <span className="font-bold text-2xl tracking-tighter group-hover:text-secondary transition-colors">NumGuru</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <button
                  className="text-sm font-medium hover:text-secondary transition-all hover:drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] px-3 py-1.5 rounded-full hover:bg-secondary/5"
                  onClick={scrollToTop}
                >
                  Try Free Sample
                </button>
                <a className="text-sm font-medium hover:text-secondary transition-all hover:drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] px-3 py-1.5 rounded-full hover:bg-secondary/5" href="#what-is-numerology">
                  What is Numerology?
                </a>
                <a className="text-sm font-medium hover:text-secondary transition-all hover:drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] px-3 py-1.5 rounded-full hover:bg-secondary/5" href="#premium-report">
                  Premium Report
                </a>
                <a className="text-sm font-medium hover:text-secondary transition-all hover:drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] px-3 py-1.5 rounded-full hover:bg-secondary/5" href="#testimonials">
                  Reviews
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main id="main-content" className="flex-grow pt-14 md:pt-16">
          <section id="free-sample" className="relative isolate pt-4 pb-12 lg:pt-8 lg:pb-16 overflow-hidden bg-[#0d000d] scroll-mt-20">
            {/* Fallback & Loading State Gradient */}
            <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#1a1b3a] via-[#0a0518] to-[#1a1b3a]" />

            <video
              className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none transition-opacity duration-1000"
              src="/vidoes/hero%20sec.mp4"
              poster="/images/hero-poster.jpg.png"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <div className="absolute inset-0 z-10 bg-background/60 dark:bg-background/70 pointer-events-none" />

            <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-secondary opacity-50 animate-pulse" />
            <div className="absolute bottom-40 right-10 w-4 h-4 rounded-full bg-secondary opacity-30 animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-10">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold mb-4 border border-border">
                  <span className="material-icons-round text-sm">verified</span>
                  Pythagorean System
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] mb-4 tracking-tight">
                  Discover your <span className="text-secondary">Destiny</span> <br className="hidden sm:block" /> through Numbers
                </h1>

                <p className="text-base md:text-lg text-muted-foreground mb-5 max-w-lg mx-auto lg:mx-0">
                  Unlock the secrets of your personality, lucky numbers &amp; colors. Get a full comprehensive report or try a free sample now.
                </p>

                <div
                  className="bg-[#030303]/90 border border-[#D100D1]/20 p-5 sm:p-6 rounded-[2rem] shadow-2xl max-w-lg mx-auto lg:mx-0 mb-6 relative overflow-hidden group backdrop-blur-xl transition-all duration-500 hover:border-[#D100D1]/40"
                  id="free-sample-card"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                  }}
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#D100D1]/20 rounded-full blur-2xl group-hover:bg-[#D100D1]/30 transition-all duration-500" />
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
                        <PopoverContent
                          className="w-auto p-0 border-none bg-transparent shadow-none animate-in fade-in zoom-in-95 duration-300 z-[100]"
                          align="center"
                          side="top"
                          sideOffset={-100}
                          avoidCollisions={false}
                        >
                          <Calendar
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={today.getFullYear()}
                            mode="single"
                            selected={sampleDob}
                            defaultMonth={sampleDob || new Date(2000, 0)}
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

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="material-icons-round text-secondary text-sm">bolt</span>
                    Instant Results
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons-round text-secondary text-sm">group</span>
                    10K+ Users
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons-round text-secondary text-sm">lock</span>
                    Private &amp; Secure
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full max-w-md mx-auto lg:mx-0" id="premium-form-container">
                <div
                  className="bg-[#030303]/95 glass-panel p-5 sm:p-6 rounded-[2rem] shadow-2xl border-2 border-secondary/40 relative transition-all duration-500 hover:border-secondary/70"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                  }}
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground font-black px-4 py-1 rounded-full text-[11px] shadow-lg border border-white/20 z-30 tracking-wider whitespace-nowrap">
                    FULL PREMIUM REPORT
                  </div>
                  <div className="text-center mb-3 mt-1">
                    <h3 className="text-base font-bold">Comprehensive Analysis</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Deep dive into your Life Path, Soul Urge &amp; Destiny.</p>
                  </div>

                  <form className="space-y-3" onSubmit={handleFullSubmit}>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" htmlFor="fullname">
                        Your Full Legal Name
                      </label>
                      <input
                        className="w-full px-4 py-2 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
                        id="fullname"
                        placeholder="As per birth certificate"
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5" htmlFor="dob-full">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Popover open={isFullDobOpen} onOpenChange={setIsFullDobOpen}>
                          <PopoverTrigger asChild>
                            <button
                              className="w-full px-4 py-2 rounded-lg bg-background border border-input text-foreground text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
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
                          <PopoverContent
                            className="w-auto p-0 border-none bg-transparent shadow-none animate-in fade-in zoom-in-95 duration-300 z-[100]"
                            align="center"
                            side="top"
                            sideOffset={-280}
                            avoidCollisions={false}
                          >
                            <Calendar
                              captionLayout="dropdown"
                              fromYear={1900}
                              toYear={today.getFullYear()}
                              mode="single"
                              selected={fullDob}
                              defaultMonth={fullDob || new Date(2000, 0)}
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
                      className="w-full py-3 px-6 rounded-lg gradient-gold text-secondary-foreground font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                      type="submit"
                    >
                      <span className="material-icons-round">lock_open</span>
                      Unlock Full Report
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border">
                      <span className="text-muted-foreground line-through">₹499</span>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          90% OFF
                        </span>
                        <span className="font-bold text-xl text-secondary">₹49</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-20 relative overflow-hidden" id="samples">
            {/* Background Video & Black Overlay */}
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/vidoes/gradient 2.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[9px] font-black uppercase tracking-[0.3em] mb-6 shadow-2xl">
                  Cosmic Preview
                </div>
                <h2 className="text-4xl md:text-5xl font-sans font-black mb-4 text-white tracking-tighter leading-none">
                  Try Your <span className="text-secondary italic drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">Free Sample</span>
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed font-semibold">
                  Stop guessing. Get an instant, high-vibrational snapshot of your numeric DNA. Accurate, fast, and 100% free.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="group relative p-5 rounded-2xl bg-[#2a002a]/40 backdrop-blur-md border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:border-secondary/50 hover:shadow-[0_20px_40px_rgba(234,179,8,0.1)] overflow-hidden flex flex-col text-left">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary group-hover:text-black transition-all duration-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <Hash className="h-6 w-6 text-secondary group-hover:text-black transition-colors" />
                      </div>
                      <div className="pt-0.5">
                        <div className="inline-block px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[8px] font-black uppercase tracking-[0.1em] mb-1.5 border border-secondary/20">
                          Vibration 01
                        </div>
                        <h3 className="text-lg md:text-xl font-sans font-black text-white tracking-tight">Life Path Number</h3>
                      </div>
                    </div>

                    <p className="text-slate-400 mb-6 leading-relaxed font-medium text-sm">
                      The core frequency of your soul. Reveals the innate strengths and the 'Divine Path' you were born to conquer.
                    </p>

                    <div className="w-full h-px bg-white/5 mb-8" />

                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Instant Reveal</span>
                    </div>
                  </div>
                </div>

                <div className="group relative p-5 rounded-2xl bg-[#2a002a]/40 backdrop-blur-md border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:border-secondary/50 hover:shadow-[0_20px_40px_rgba(234,179,8,0.1)] overflow-hidden flex flex-col text-left">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary group-hover:text-black transition-all duration-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <Zap className="h-6 w-6 text-secondary group-hover:text-black transition-colors" />
                      </div>
                      <div className="pt-0.5">
                        <div className="inline-block px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[8px] font-black uppercase tracking-[0.1em] mb-1.5 border border-secondary/20">
                          Vibration 02
                        </div>
                        <h3 className="text-lg md:text-xl font-sans font-black text-white tracking-tight">Micro-Remedy</h3>
                      </div>
                    </div>

                    <p className="text-slate-400 mb-6 leading-relaxed font-medium text-sm">
                      Instant alignment hacks to clear energy blocks. Daily rituals to keep your vibration high and attract luck.
                    </p>

                    <div className="w-full h-px bg-white/5 mb-8" />

                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Locked Inside</span>
                    </div>
                  </div>
                </div>

                <div className="group relative p-5 rounded-2xl bg-[#2a002a]/40 backdrop-blur-md border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:border-secondary/50 hover:shadow-[0_20px_40px_rgba(234,179,8,0.1)] overflow-hidden flex flex-col text-left">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary group-hover:text-black transition-all duration-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <Palette className="h-6 w-6 text-secondary group-hover:text-black transition-colors" />
                      </div>
                      <div className="pt-0.5">
                        <div className="inline-block px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[8px] font-black uppercase tracking-[0.1em] mb-1.5 border border-secondary/20">
                          Vibration 03
                        </div>
                        <h3 className="text-lg md:text-xl font-sans font-black text-white tracking-tight">Vibrational Color</h3>
                      </div>
                    </div>

                    <p className="text-slate-400 mb-6 leading-relaxed font-medium text-sm">
                      The exact color frequencies that resonate with your numeric DNA. Use them to amplify your presence daily.
                    </p>

                    <div className="w-full h-px bg-white/5 mb-8" />

                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily Hacks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Premium Report Showcase Section - REVAMPED */}
          <section id="premium-report" className="py-20 md:py-32 relative overflow-hidden bg-[#0d000d] scroll-mt-20">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[10%] left-[-5%] w-[50%] h-[50%] bg-secondary/15 rounded-full blur-[140px] opacity-40 animate-pulse" />
              <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px] opacity-30 animate-pulse delay-1000" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                  The Full Access Experience
                </div>
                <h2 className="text-4xl md:text-7xl font-sans font-black mb-8 text-white tracking-tight leading-[0.9]">
                  What's Inside Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-red-500 to-secondary italic">Premium Report?</span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-medium">
                  We don't just give you numbers. We give you a <span className="text-white">strategic life-guide</span> designed to help you navigate every challenge with divine clarity.
                </p>
              </div>

              <div className="space-y-24">

                {/* Sub-section: Premium Insights */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="h-px bg-gradient-to-r from-transparent to-[#D100D1]/40 flex-grow" />
                    <h3 className="text-2xl md:text-4xl font-sans font-black text-white uppercase tracking-widest text-center">
                      Premium <span className="text-[#D100D1]">Insights</span>
                    </h3>
                    <div className="h-px bg-gradient-to-l from-transparent to-[#D100D1]/40 flex-grow" />
                  </div>

                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          title: "One habit blocking your growth",
                          benefit: "Discover the specific subconscious pattern that acts as an 'anchor' preventing your natural career and personal expansion."
                        },
                        {
                          title: "Inner conflict you face quietly",
                          benefit: "Identify the hidden dissonance between your desires and actions, and learn precisely how to harmonize your internal state."
                        },
                        {
                          title: "Why you feel misunderstood",
                          benefit: "Understand the 'Vibrational Gap' between how you perceive yourself and how the world sees you, to improve every connection."
                        },
                        {
                          title: "Decision-making patterns",
                          benefit: "Map your unique logic cycle to identify where you've compromised in the past and how to make 'Life-Correcting' choices."
                        },
                        {
                          title: "What drains your energy faster",
                          benefit: "Uncover specific environments and personality types that clash with your frequency, and learn how to shield your aura."
                        },
                        {
                          title: "Practical remedies for balance",
                          benefit: "Receive actionable, daily micro-rituals designed to recalibrate your energy and attract favorable 'synchronicity' events."
                        }
                      ].map((insight, i) => (
                        <div key={i} className="group relative p-6 rounded-2xl bg-[#2a002a]/40 border border-white/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col h-full">
                          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                          <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                <Lock className="h-4 w-4" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">Insight {i + 1}</span>
                            </div>

                            <h4 className="text-lg font-sans font-black text-white mb-3 tracking-tight leading-tight">
                              {insight.title}
                            </h4>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow font-medium">
                              {insight.benefit}
                            </p>

                            <div className="pt-4 border-t border-white/5 mt-auto">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all duration-300 cursor-pointer group/unlock">
                                <Crown className="h-3 w-3 group-hover:rotate-12 transition-transform" />
                                <span className="drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">Unlock to Read</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-section: Included in Full Report */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="h-px bg-gradient-to-r from-transparent to-[#D100D1]/40 flex-grow" />
                    <h3 className="text-2xl md:text-4xl font-sans font-black text-white uppercase tracking-widest text-center">
                      Included in <span className="text-[#D100D1]">Full Report</span>
                    </h3>
                    <div className="h-px bg-gradient-to-l from-transparent to-[#D100D1]/40 flex-grow" />
                  </div>

                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { title: "Your Personal Growth Guidance", icon: Compass, label: "Core Path", benefit: "A comprehensive 15+ page breakdown of your life purpose, hidden hurdles, and the master plan for your spiritual and material evolution." },
                        { title: "Do This, Avoid This (Guidance)", icon: Lightbulb, label: "Daily Strategy", benefit: "Specific, actionable list of behaviors to embrace and patterns to avoid based on your current numeric phase and planetary influences." },
                        { title: "Work Style & Career Environment", icon: Briefcase, label: "Career Map", benefit: "Discover the specific professional settings where you will naturally excel and the industries that best align with your 'Success Frequency'." },
                        { title: "Emotional Pattern Decoder", icon: Fingerprint, label: "Soul Logic", benefit: "Deep analysis of why you react emotionally the way you do, helping you gain mastery over your reactions and find lasting inner calm." },
                        { title: "Decision-Making Guide", icon: Scale, label: "Success Logic", benefit: "A tactical manual on how to choose your battles, when to hit the accelerator, and when to step back for maximum strategic advantage." },
                        { title: "Relationship Communication Style", icon: HeartHandshake, label: "Bond Synergy", benefit: "Decode how you naturally connect with others and learn the secret to resolving friction in your most important personal and professional bonds." }
                      ].map((item, i) => (
                        <div key={i} className="group relative p-6 rounded-2xl bg-[#2a002a]/40 border border-white/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col h-full">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                          <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                <item.icon className="h-5 w-5" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">{item.label}</span>
                            </div>

                            <h4 className="text-lg font-sans font-black text-white mb-3 tracking-tight leading-tight">
                              {item.title}
                            </h4>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow font-medium">
                              {item.benefit}
                            </p>

                            <div className="pt-4 border-t border-white/5 mt-auto">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all duration-300 cursor-pointer group/unlock">
                                <Lock className="h-3 w-3" />
                                <span className="drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">Unlock to Read</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-section: Color Alchemy & Guidance */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="h-px bg-gradient-to-r from-transparent to-[#D100D1]/40 flex-grow" />
                    <h3 className="text-2xl md:text-4xl font-sans font-black text-white uppercase tracking-widest text-center">
                      Color <span className="text-[#D100D1]">Alchemy</span> & Guidance
                    </h3>
                    <div className="h-px bg-gradient-to-l from-transparent to-[#D100D1]/40 flex-grow" />
                  </div>

                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { title: "Your Power Success Color", icon: Palette, label: "Aura Boost", benefit: "Identify the specific wavelength that amplifies your natural charisma and luck, making you more persuasive in important meetings and social events." },
                        { title: "Energy-Draining Colors to Avoid", icon: Zap, label: "Protection", benefit: "Discover which colors create a 'Vibrational Leak' in your aura, causing unnecessary fatigue and slowing your progress during critical moments." },
                        { title: "Daily Attire Vibration Tuning", icon: Star, label: "Magnetic", benefit: "Learn the secret of using colors as 'frequency controllers' to stay grounded, protected, and highly magnetic regardless of the environment." }
                      ].map((item, i) => (
                        <div key={i} className="group relative p-6 rounded-2xl bg-[#2a002a]/40 border border-white/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col h-full">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                          <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                <item.icon className="h-5 w-5" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">{item.label}</span>
                            </div>

                            <h4 className="text-lg font-sans font-black text-white mb-3 tracking-tight leading-tight">
                              {item.title}
                            </h4>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow font-medium">
                              {item.benefit}
                            </p>

                            <div className="pt-4 border-t border-white/5 mt-auto">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all duration-300 cursor-pointer group/unlock">
                                <Lock className="h-3 w-3" />
                                <span className="drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">Unlock to Read</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-section: Cosmic Number Alignment */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="h-px bg-gradient-to-r from-transparent to-[#D100D1]/40 flex-grow" />
                    <h3 className="text-2xl md:text-4xl font-sans font-black text-white uppercase tracking-widest text-center">
                      Cosmic Number <span className="text-[#D100D1]">Alignment</span>
                    </h3>
                    <div className="h-px bg-gradient-to-l from-transparent to-[#D100D1]/40 flex-grow" />
                  </div>

                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { title: "Psychic & Life Path Synergy", icon: Orbit, label: "Deep Sync", benefit: "Understand how your basic instincts and your higher destiny numbers interact, revealing the 'Master Frequency' that should guide your biggest life decisions." },
                        { title: "Name & Date of Birth Balancing", icon: Hash, label: "Identity", benefit: "Discover if your legal name is in harmony with your birth date, and receive specific corrections to ensure your social presence matches your soul's blueprint." },
                        { title: "Destiny Number Implementation", icon: Fingerprint, label: "Action", benefit: "A tactical guide on how to 'embody' your destiny number daily, turning theoretical knowledge into a powerful magnet for real-world opportunities." }
                      ].map((item, i) => (
                        <div key={i} className="group relative p-6 rounded-2xl bg-[#2a002a]/40 border border-white/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col h-full">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                          <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                <item.icon className="h-5 w-5" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">{item.label}</span>
                            </div>

                            <h4 className="text-lg font-sans font-black text-white mb-3 tracking-tight leading-tight">
                              {item.title}
                            </h4>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow font-medium">
                              {item.benefit}
                            </p>

                            <div className="pt-4 border-t border-white/5 mt-auto">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all duration-300 cursor-pointer group/unlock">
                                <Lock className="h-3 w-3" />
                                <span className="drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">Unlock to Read</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-section: The Cosmic Remedies Library */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="h-px bg-gradient-to-r from-transparent to-[#D100D1]/40 flex-grow" />
                    <h3 className="text-2xl md:text-4xl font-sans font-black text-white uppercase tracking-widest text-center">
                      The Cosmic <span className="text-[#D100D1]">Remedies</span> Library
                    </h3>
                    <div className="h-px bg-gradient-to-l from-transparent to-[#D100D1]/40 flex-grow" />
                  </div>

                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { title: "Personalized Mantras & Daily Japa", icon: Zap, label: "Vibration", benefit: "Receive custom Sanskrit or phonetic seed sounds tailored to your active life-path number, designed to clean your mental slate daily." },
                        { title: "Sacred Habits & Morning Rituals", icon: Sparkles, label: "Routine", benefit: "Specific morning sequences—from the direction you face to the order of tasks—that align your physical body with the day's cosmic vibe." },
                        { title: "Gemstone & Crystal Guide", icon: Gem, label: "Frequency", benefit: "Identify the earth-frequencies (stones) that act as permanent vibrational anchors for your energy, providing protection and focus." },
                        { title: "Affirmation Shielding Techniques", icon: Shield, label: "Protection", benefit: "Learn to build a 'Mental Shield' using specific linguistic commands that repel negative external influences and self-doubt." },
                        { title: "Sound Healing & Frequencies", icon: Music, label: "Audio Meta", benefit: "Discover the exact Hertz frequencies (Binaural beats/Solfeggio) that resonate with your numeric signature for deep meditation." },
                        { title: "Space Clearing Divine Guidance", icon: Moon, label: "Zen Space", benefit: "How to arrange your immediate living or work environment to ensure energy flows freely according to your primary numeric destiny." }
                      ].map((item, i) => (
                        <div key={i} className="group relative p-6 rounded-2xl bg-[#2a002a]/40 border border-white/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col h-full">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                          <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                <item.icon className="h-5 w-5" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">{item.label}</span>
                            </div>

                            <h4 className="text-lg font-sans font-black text-white mb-3 tracking-tight leading-tight">
                              {item.title}
                            </h4>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow font-medium">
                              {item.benefit}
                            </p>

                            <div className="pt-4 border-t border-white/5 mt-auto">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all duration-300 cursor-pointer group/unlock">
                                <Lock className="h-3 w-3" />
                                <span className="drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">Unlock to Read</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-24 text-center">
                  <button
                    onClick={() => {
                      const datePicker = document.querySelector('[name="dob"]') as HTMLInputElement;
                      if (datePicker) {
                        datePicker.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setTimeout(() => datePicker.focus(), 500);
                      }
                    }}
                    className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-gradient-to-r from-secondary to-red-600 text-black font-black text-sm md:text-base uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(234,179,8,0.4)]"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    <Crown className="h-6 w-6" />
                    <span>Get My Premium Report Now</span>
                  </button>
                  <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2"><Lock className="h-3 w-3" /> Secure Payment</span>
                    <span className="flex items-center gap-2"><Crown className="h-3 w-3" /> Lifetime Access</span>
                    <span className="hidden md:block h-1 w-1 bg-slate-700 rounded-full" />
                    <span className="text-white">One-Time Payment: ₹49 Only</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What is Numerology Section - SEO Optimized with Premium Layout */}
          <section id="what-is-numerology" className="relative overflow-hidden bg-[#0d000d] border-y border-white/5 scroll-mt-20">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40%] h-[60%] bg-red-900/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-stretch">
              {/* Left Side: Tall Premium Image */}
              <div className="w-full md:w-[45%] lg:w-[40%] relative min-h-[400px] md:min-h-[650px] overflow-hidden">
                <img
                  alt="Ancient stone tablet with golden numerology symbols, sacred geometry Metatron's cube, and mystical numbers representing the foundations of numerological science."
                  className="absolute inset-0 w-full h-full object-cover object-center grayscale-[0.2] contrast-[1.1] hover:scale-105 transition-transform duration-[2000ms]"
                  src="/images/what is num.jpg"
                />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0d000d] to-transparent hidden md:block" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d000d] to-transparent md:hidden" />
              </div>

              {/* Right Side: Content */}
              <div className="flex-1 p-8 md:p-16 lg:p-20 flex flex-col justify-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-6 w-fit">
                  Ancient Science
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-black mb-8 text-white tracking-tight leading-tight">
                  What is <span className="text-secondary italic">Numerology?</span>
                </h2>

                <div className="space-y-6 text-slate-300 text-base md:text-lg leading-relaxed">
                  <p>
                    Numerology is the ancient art and science of decoding the hidden language of numbers that governs your life. For over 2,500 years, mystics, philosophers, and scientists have used <strong className="text-secondary" >numerology</strong> to unlock the blueprint of human destiny.
                  </p>
                  <p>
                    Unlike astrology, which looks to the stars, numerology finds meaning in the numbers embedded in your <strong>birth date</strong> and <strong>name</strong>. Every letter carries a vibrational frequency, and when combined, they reveal your <em className="text-white">life path number</em>, personality traits, and even future opportunities.
                  </p>
                  <p>
                    We use the time-tested <strong className="text-secondary">Pythagorean system</strong>—the same mathematical framework that ancient Greek philosophers relied on to understand the cosmos. By converting your name into numbers, we map your soul's <em className="italic text-white">energetic signature</em>.
                  </p>

                  <div className="mt-10 p-6 rounded-2xl bg-white/[0.03] border border-white/5 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex gap-4">
                      <div className="text-3xl">💡</div>
                      <div>
                        <p className="text-sm md:text-base">
                          <strong className="text-white block mb-1">The Digital DNA of Soul</strong>
                          Just as DNA encodes your biological instructions, numbers encode your spiritual blueprint. Numerology is the key to reading that code and aligning with your natural frequency.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <a
                    className="group inline-flex items-center gap-2 text-secondary font-black text-sm uppercase tracking-widest hover:text-white transition-colors"
                    href="#how-it-works"
                  >
                    <span>Learn the methodology</span>
                    <div className="w-8 h-px bg-secondary group-hover:w-12 group-hover:bg-white transition-all" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 relative overflow-hidden scroll-mt-20" id="how-it-works">
            {/* Background Video & Black Overlay */}
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/vidoes/gradient 1.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  The Journey
                </div>
                <h2 className="text-4xl md:text-6xl font-sans font-black mb-6 text-white tracking-tight">
                  How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-400">Works</span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                  Your path from curiosity to clarity takes only <span className="text-white">three simple steps</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[20%] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent z-0" />

                {[
                  {
                    step: "01",
                    title: "Soul DNA Input",
                    desc: "Provide your birth name and date. Our system treats your data as sacred and 100% private.",
                    icon: Fingerprint,
                    benefit: "Instant Identity Sync"
                  },
                  {
                    step: "02",
                    title: "Frequency Mapping",
                    desc: "We apply Pythagorean principles to map your unique vibrational code across the cosmos.",
                    icon: Activity,
                    benefit: "Precision Calculation"
                  },
                  {
                    step: "03",
                    title: "Destiny Reveal",
                    desc: "Unlock your full 20+ page blueprint and start aligning with your true purpose today.",
                    icon: Crown,
                    benefit: "Future Clarity"
                  }
                ].map((item, i) => (
                  <div key={i} className="group relative z-10">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-8">
                        <div className="w-24 h-24 rounded-full bg-black/40 border border-secondary/30 flex items-center justify-center group-hover:border-secondary group-hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-500 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <item.icon className="h-10 w-10 text-secondary group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0d000d] border border-secondary/40 flex items-center justify-center text-secondary text-[10px] font-black group-hover:bg-secondary group-hover:text-black transition-all">
                          {item.step}
                        </div>
                      </div>

                      <h3 className="text-2xl font-sans font-black text-white mb-3 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-base leading-relaxed mb-6 px-4 font-medium">
                        {item.desc}
                      </p>

                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest group-hover:border-secondary/40 group-hover:text-secondary transition-all">
                        <div className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                        {item.benefit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 relative overflow-hidden bg-[#0d000d] scroll-mt-20" id="testimonials">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[160px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  Community Feedback
                </div>
                <h2 className="text-4xl md:text-5xl font-sans font-black mb-6 text-white tracking-tight">
                  What Our <span className="text-secondary italic">Users Say</span>
                </h2>
                <div className="flex justify-center items-center gap-4">
                  <div className="flex text-secondary drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                    <StarHalf className="h-5 w-5 fill-current" />
                  </div>
                  <span className="text-slate-400 font-black tracking-widest text-sm uppercase text-white/90">4.8 out of 5 Overall Rating</span>
                </div>
              </div>

              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="py-8">
                  {[
                    {
                      name: "Priya Sharma",
                      location: "Mumbai, Maharashtra",
                      text: "The detailed premium report helped me understand my life path completely. I discovered my lucky numbers, favorable colors, and the best remedies for my problems. The future predictions were spot-on!",
                      avatar: "PS"
                    },
                    {
                      name: "Rajesh Kumar",
                      location: "Delhi",
                      text: "The premium report exceeded my expectations! I learned about my good and bad numbers which helped me make better choices. The remedies section was very practical and easy to follow. Best investment!",
                      avatar: "RK"
                    },
                    {
                      name: "Sneha Patel",
                      location: "Ahmedabad, Gujarat",
                      text: "I was confused about my career path but NumGuru's premium report gave me complete clarity. I now know my lucky colors and numbers which I use in my daily life. The guidance section was incredibly helpful!",
                      avatar: "SP"
                    },
                    {
                      name: "Amit Verma",
                      location: "Pune, Maharashtra",
                      text: "Amazing premium report! I got detailed insights about my personality based on my date of birth. The remedies suggested have brought positive changes in my life. I learned how to align my vibrations for success.",
                      avatar: "AV"
                    },
                    {
                      name: "Kavita Reddy",
                      location: "Hyderabad, Telangana",
                      text: "NumGuru's premium report helped me overcome my financial struggles. The report showed me my lucky colors and numbers which I applied in my business. The future predictions gave me hope and clarity.",
                      avatar: "KR"
                    },
                    {
                      name: "Vikram Singh",
                      location: "Jaipur, Rajasthan",
                      text: "I checked my premium report and it was a game-changer! I discovered my bad numbers to avoid and good numbers to embrace. The growth strategies mentioned in the report are working wonderfully for me!",
                      avatar: "VS"
                    },
                    {
                      name: "Meera Iyer",
                      location: "Bangalore, Karnataka",
                      text: "The premium numerology report gave me complete guidance about my life journey. The lucky colors recommendation has brought positive energy into my home. Worth every rupee!",
                      avatar: "MI"
                    },
                    {
                      name: "Sanjay Gupta",
                      location: "Lucknow, Uttar Pradesh",
                      text: "I was skeptical but the premium report proved me wrong! Based on my name and DOB, I received accurate predictions about my future. The remedies section solved many of my personal problems.",
                      avatar: "SG"
                    },
                    {
                      name: "Anjali Desai",
                      location: "Surat, Gujarat",
                      text: "NumGuru's premium report helped me find direction in life. I discovered my good and bad numbers which explained so many past events. The growth guidance showed me how to improve my career.",
                      avatar: "AD"
                    },
                    {
                      name: "Rahul Joshi",
                      location: "Indore, Madhya Pradesh",
                      text: "Best decision to get the premium report! I learned everything about my numerology - from lucky numbers to favorable colors. The remedies are simple and practical. I now plan my investments wisely!",
                      avatar: "RJ"
                    },
                    {
                      name: "Deepika Nair",
                      location: "Kochi, Kerala",
                      text: "The premium report from NumGuru gave me clarity about my life purpose. I found out my lucky colors and numbers which have brought amazing opportunities. The future guidance prepared me for challenges.",
                      avatar: "DN"
                    },
                    {
                      name: "Manish Agarwal",
                      location: "Kolkata, West Bengal",
                      text: "I checked my premium report and it answered all my questions! I learned about my good numbers for business and bad numbers to avoid. The growth tips are practical and really working!",
                      avatar: "MA"
                    }
                  ].map((item, i) => (
                    <CarouselItem key={i} className="md:basis-1/3 sm:basis-1/2 basis-full px-2">
                      <div className="group relative p-6 rounded-2xl bg-[#2a002a]/40 backdrop-blur-md border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-secondary/40 hover:shadow-[0_20px_40px_rgba(234,179,8,0.05)] flex flex-col h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex text-secondary mb-4 drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">
                            {[...Array(5)].map((_, starI) => (
                              <Star key={starI} className="h-3 w-3 fill-current" />
                            ))}
                          </div>

                          <p className="text-slate-300 italic mb-8 leading-relaxed font-medium text-xs flex-grow">
                            "{item.text}"
                          </p>

                          <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-auto">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center font-black text-secondary text-xs shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                              {item.avatar}
                            </div>
                            <div className="text-left">
                              <div className="font-sans font-black text-white text-xs tracking-tight leading-tight">{item.name}</div>
                              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.location}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary hover:text-black transition-all" />
                  <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary hover:text-black transition-all" />
                </div>
              </Carousel>


            </div>
          </section>

          <section className="py-24 relative overflow-hidden bg-[#0d000d]">
            {/* Background Video & Black Overlay */}
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/vidoes/gradient 3.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[160px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[12px] font-black uppercase tracking-[0.4em] mb-10 animate-pulse">
                The Final Revelation
              </div>

              <h2 className="text-4xl md:text-7xl font-sans font-black text-white mb-8 tracking-tighter leading-none shadow-secondary/10">
                Ready to Uncover Your <br />
                <span className="text-secondary italic">Divine Destiny?</span>
              </h2>

              <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                Join over <span className="text-white font-black">50,000+ seekers</span> who have decoded their cosmic frequency.
                Your personalized master report is waiting to reveal your path to success, health, and harmony.
              </p>

              <div className="flex flex-col items-center gap-8">
                <button
                  className="group relative py-6 px-16 rounded-full bg-secondary hover:scale-105 transition-all duration-500 shadow-[0_20px_40px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] overflow-hidden"
                  onClick={scrollToTop}
                  type="button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                  <span className="relative z-10 text-black font-black text-2xl tracking-tight flex items-center gap-3">
                    Get Your Premium Report Now
                    <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                  </span>
                </button>

                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
                  {[
                    { icon: Lock, text: "100% Privacy Secured" },
                    { icon: Zap, text: "Instant Digital Access" },
                    { icon: Star, text: "Expert Numerology Logic" }
                  ].map((marker, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <marker.icon className="w-5 h-5 text-secondary" />
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{marker.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#0d000d] border-t border-white/5 py-12">
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
                    <a className="hover:text-secondary transition-colors" href="#what-is-numerology">
                      What is Numerology?
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-secondary transition-colors" href="#premium-report">
                      Premium Report
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
      onReset={handleReset}
      isLoading={isLoading}
    />
  );
};

export default Index;
