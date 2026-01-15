import React from "react";
import {
  NumerologyReading,
  getCoreAlignmentUseCase,
  getFriendlyGrowthAdvice
} from "@/lib/numerology";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Unlock,
  Download,
  Activity,
  PenTool,
  Flame,
  Fingerprint,
  HeartHandshake,
  Sprout,
  ShieldAlert,
  Scale,
  EyeOff,
  Compass,
  ZapOff,
  Gem,
  LayoutGrid,
  Trophy,
  Star,
  Moon,
  Sun,
  Palette,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Brain,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Users,
  TrendingUp,
  Heart,
  User,
  Zap,
  ShieldCheck,
  Contrast,
  HelpCircle,
  Atom,
  VenetianMask,
  Share2,
  Copy,
  Check,
  Info,
  LogOut,
  Orbit,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResultPreviewProps {
  reading: NumerologyReading | null;
  isUnlocked: boolean;
  onUnlock: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export function ResultPreview({
  reading,
  isUnlocked,
  onUnlock,
  onReset,
  isLoading,
}: ResultPreviewProps) {
  const [isLearningHubOpen, setIsLearningHubOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const reportRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const shareUrl = React.useMemo(() => {
    if (!reading) return "";
    try {
      // Super-short pipe format: Name|Timestamp|Unlocked
      // This removes JSON overhead (quotes, brackets, keys)
      const rawData = `${reading.name}|${reading.dob.getTime()}|${isUnlocked ? 1 : 0}`;
      const encodedData = btoa(encodeURIComponent(rawData));
      const slug = reading.name.trim().toLowerCase().replace(/\s+/g, '-');
      return `${window.location.origin}${window.location.pathname}?v=${encodedData}&report=${slug}`;
    } catch (e) {
      return window.location.href;
    }
  }, [reading, isUnlocked]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link Copied! 🔗",
      description: "You can now share your report anywhere.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyShareLink = () => {
    setIsShareModalOpen(true);
  };



  if (!reading) {
    return null;
  }

  // --- Helper Components for the Design ---

  const CoreNumberCard = ({
    icon: Icon,
    label,
    number,
    subtext,
    colorClass
  }: {
    icon: any,
    label: string,
    number: number,
    subtext: string,
    colorClass: string
  }) => (
    <Card className="bg-[#1a1b2e] border-white/5 border shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <div className={`p-2.5 w-fit rounded-xl bg-opacity-20 ${colorClass.replace('text-', 'bg-')}`}>
              <Icon className={`h-5 w-5 ${colorClass}`} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-[0.2em] mt-3 ${colorClass}`}>
              {label}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
              {label === "Expression Number" ? "Destiny & Talents" :
                label === "Soul Urge Number" ? "Heart's Desire" : "Aura Image"}
            </span>
          </div>
          <span className="text-4xl font-serif text-white/90 font-black tracking-tighter drop-shadow-sm">{number}</span>
        </div>
        <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
          {subtext}
        </p>
      </CardContent>
    </Card>
  );

  const ReportModuleItem = ({
    id,
    icon: Icon,
    title,
    colorClass,
    content
  }: {
    id: string,
    icon: any,
    title: string,
    colorClass: string,
    content: { para: string, points: string[] }
  }) => (
    <AccordionItem
      value={id}
      className="group relative border border-white/5 mb-8 md:mb-4 bg-[#030303] rounded-[1.8rem] md:rounded-[1.5rem] shadow-2xl transition-all duration-700 hover:border-amber-500/30 no-zoom"
    >
      {/* Razor-Thin Gold Edge Glow */}
      <div className="absolute inset-0 border border-transparent group-hover:border-amber-500/10 rounded-[1.8rem] md:rounded-[1.5rem] pointer-events-none transition-all duration-700" />

      <AccordionTrigger className="hover:no-underline py-5 md:py-6 px-4 md:px-5 [&>svg]:text-amber-500/50 [&>svg]:group-hover:text-amber-500 transition-all [&>svg]:transition-all pt-10 md:pt-6">
        <div className="flex items-center gap-4 md:gap-5 text-left relative z-10 w-full">
          {/* Floating Icon for Mobile, Standard for Desktop */}
          <div className={`absolute -top-14 md:relative md:top-0 left-2 md:left-0 p-3 md:p-3.5 rounded-2xl bg-[#0a0518] md:bg-white/[0.03] border border-amber-500/20 md:border-white/10 shadow-2xl group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all duration-500 ${colorClass}`}>
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="flex flex-col ml-1 md:ml-0">
            <span className="font-serif text-[18px] md:text-xl text-white tracking-tight font-bold group-hover:text-amber-400 transition-colors duration-500">
              {title}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-amber-500/50 transition-colors font-bold">
              Module Analysis
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5 md:px-16 pb-8 relative">
        {/* Sacred Node Vertical Line - Slimmer on mobile, dashed on desktop */}
        <div className="absolute left-[26px] md:left-[39px] top-6 bottom-12 w-px border-l border-white/5 md:border-dashed md:border-white/10" />

        <div className="space-y-6 relative z-10">
          <p className="text-white/80 leading-relaxed font-medium text-[14px] md:text-[16px] max-w-3xl border-l-2 border-indigo-500/20 pl-4 py-1 italic">
            {content.para}
          </p>

          <ul className="space-y-5 md:space-y-4">
            {content.points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 md:gap-4 text-[13px] md:text-[15px] text-white/70 group/item">
                <div className="relative mt-1.5 flex-shrink-0">
                  {/* Glowing Sacred Node */}
                  <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B] group-hover/item:scale-125 transition-transform" />
                  <div className="absolute inset-x-[-5px] inset-y-[-5px] border border-amber-500/30 rounded-full scale-0 group-hover/item:scale-100 transition-transform duration-300" />
                </div>
                <span className="leading-snug group-hover/item:text-white transition-colors duration-300">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const PremiumInsightCard = ({
    id,
    question,
    description,
    subPoints,
    index
  }: {
    id: string,
    question: string,
    description: string,
    subPoints: string[],
    index: number
  }) => {
    const icons = [ShieldAlert, Contrast, HelpCircle, Scale, ZapOff, ShieldCheck];
    const Icon = icons[index % icons.length];

    return (
      <AccordionItem value={id} className="border border-amber-500/20 mb-6 bg-[#050505] rounded-[2rem] shadow-2xl transition-all duration-700 group overflow-hidden hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] relative">
        <AccordionTrigger className="hover:no-underline py-7 px-8 group-data-[state=open]:pb-5 [&>svg]:text-amber-500/70 [&>svg]:h-6 [&>svg]:w-6 transition-all">
          <div className="flex items-center gap-6 text-left relative z-10">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <Icon className="h-7 w-7 animate-pulse-slow" />
            </div>
            <span className="font-serif text-[20px] md:text-2xl text-white group-hover:text-amber-200 transition-colors font-bold tracking-tight leading-tight">{question}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-8 md:pl-28 md:pr-12 pb-10">
          <div className="space-y-8">
            <div className="relative">
              {/* Floating Metallic Gold Line */}
              <div className="absolute -left-6 top-1 bottom-1 w-0.5 bg-gradient-to-b from-amber-500/60 via-amber-200/40 to-transparent rounded-full" />
              <p className="text-amber-50/90 leading-relaxed text-[15px] md:text-[17px] font-medium opacity-90 drop-shadow-sm">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {subPoints.map((point, idx) => (
                <div key={idx} className="bg-black/60 px-5 py-2.5 rounded-xl border border-amber-500/30 flex items-center gap-3 group/point hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300 shadow-lg">
                  <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] group-hover/point:scale-125 transition-transform" />
                  <span className="text-[10px] md:text-[11px] leading-tight font-black text-amber-100 uppercase tracking-[0.2em]">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div id="top" className="min-h-screen relative font-sans animate-in fade-in duration-700 pb-20 bg-[#0a0518] text-white">
      <style>{`
        @keyframes flow-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1.1); }
          50% { transform: translate(8vw, 12vh) rotate(5deg) scale(1); }
        }
        @keyframes flow-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(-10vw, -8vh) rotate(-5deg) scale(1.1); }
        }
        @keyframes flow-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(5vw, -15vh) scale(1.2); opacity: 0.8; }
        }
        .animate-flow-1 { animation: flow-1 25s ease-in-out infinite; }
        .animate-flow-2 { animation: flow-2 30s ease-in-out infinite; }
        .animate-flow-3 { animation: flow-3 35s ease-in-out infinite; }
        
        @keyframes shake-glow {
          0%, 85%, 100% { transform: scale(1); filter: brightness(1); }
          90% { transform: scale(1.05) rotate(-2deg); filter: brightness(1.2); }
          92% { transform: scale(1.05) rotate(2deg); filter: brightness(1.3); }
          94% { transform: scale(1.05) rotate(-2deg); filter: brightness(1.2); }
          96% { transform: scale(1.05) rotate(2deg); filter: brightness(1.3); }
        }
        .animate-shake-glow {
          animation: shake-glow 5s ease-in-out infinite;
        }
        @keyframes gold-glimmer {
          0%, 100% { opacity: 0.3; filter: blur(40px); }
          50% { opacity: 0.6; filter: blur(60px); }
        }
        .gold-glow-effect {
          animation: gold-glimmer 4s ease-in-out infinite;
        }
        @keyframes spin-ultra-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-ultra-slow {
          animation: spin-ultra-slow 20s linear infinite;
        }
        @keyframes spin-circular-glow {
          0% { transform: rotate(0deg); filter: drop-shadow(0 0 5px rgba(234, 179, 8, 0.4)); }
          50% { transform: rotate(180deg); filter: drop-shadow(0 0 15px rgba(234, 179, 8, 0.7)); }
          100% { transform: rotate(360deg); filter: drop-shadow(0 0 5px rgba(234, 179, 8, 0.4)); }
        }
        .animate-spin-circular-glow {
          animation: spin-circular-glow 30s linear infinite;
        }
      `}</style>

      {/* --- Cosmic Nebula: Premium Deep Purple & Midnight Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0518]">
        {/* Soft Purple Luminous Veil */}
        <div className="absolute -top-[15%] -left-[10%] w-[70%] h-[70%] bg-primary/20 rounded-[100%] blur-[130px] animate-flow-1" />

        {/* Ethereal Gold Luminous Veil */}
        <div className="absolute top-[20%] -right-[10%] w-[65%] h-[65%] bg-secondary/10 rounded-[100%] blur-[140px] animate-flow-2" />

        {/* Deep Violet Cosmic Breath */}
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-primary/15 rounded-[100%] blur-[120px] animate-flow-3" />

        {/* Deep Core Glow */}
        <div className="absolute top-[40%] left-[35%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[110px] opacity-50" />

        {/* Texture Layer */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <div className="relative z-10">

        {/* --- Top Navigation Bar --- */}
        <div className={`sticky top-0 z-50 transition-all duration-500 border-b ${scrolled
          ? "bg-black/80 backdrop-blur-2xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2"
          : "bg-black/95 backdrop-blur-xl border-white/5 py-1"
          }`}>
          <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <button
              onClick={onReset}
              className="flex items-center gap-2 group hover:opacity-80 transition-all active:scale-95 duration-200"
            >
              <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20 group-hover:drop-shadow-[0_0_12px_rgba(234,179,8,0.6)] transition-all duration-500">
                <Orbit className="h-5 w-5 text-secondary group-hover:rotate-180 transition-transform duration-1000" />
              </div>
              <div className="flex flex-col -space-y-1 text-left">
                <span className="font-serif font-black text-xl text-white tracking-tight">NumGuru</span>
                <span className="text-secondary font-sans text-[9px] font-black uppercase tracking-[0.3em] drop-shadow-sm opacity-80">Premium Portal</span>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-3 text-[10px] font-bold tracking-widest text-white uppercase">

              <a href="#core" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-secondary hover:bg-secondary/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all flex items-center gap-2">
                <Activity className="h-3 w-3 text-secondary" />
                <span className="tracking-[0.2em] font-black">Core</span>
              </a>
              <a href="#soul" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-indigo-400 hover:bg-indigo-400/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all flex items-center gap-2">
                <VenetianMask className="h-3 w-3 text-indigo-400" />
                <span className="tracking-[0.2em] font-black">Soul</span>
              </a>
              <a href="#color" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-emerald-400/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
                <Palette className="h-3 w-3 text-emerald-400" />
                <span className="tracking-[0.2em] font-black">Color</span>
              </a>
              <a href="#blueprint" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-amber-400/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2">
                <LayoutGrid className="h-3 w-3 text-amber-400" />
                <span className="tracking-[0.2em] font-black">Blueprint</span>
              </a>
              <a href="#remedies" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-rose-400 hover:bg-rose-400/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all flex items-center gap-2">
                <Gem className="h-3 w-3 text-rose-400" />
                <span className="tracking-[0.2em] font-black">Remedies</span>
              </a>

              <div className="h-4 w-px bg-white/20 mx-1" />

              <button
                onClick={() => setIsLearningHubOpen(true)}
                className="relative group px-5 py-2 rounded-full overflow-hidden transition-all duration-300 active:scale-95 animate-smooth-shake"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-amber-400 blur-md opacity-50 group-hover:opacity-80 group-hover:blur-lg transition-all animate-pulse" />
                <span className="relative z-10 text-[#3d2a1a] flex items-center gap-2 px-1">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="tracking-[0.12em] font-black pointer-events-none whitespace-nowrap text-[12px] md:text-sm">Learning Hub</span>
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="relative group px-6 py-2.5 rounded-full overflow-hidden transition-all duration-500 active:scale-95 shadow-[0_0_25px_rgba(234,179,8,0.1)] animate-smooth-shake"
              >
                {/* Thick Metallic Gold Border */}
                <div className="absolute inset-0 border-[2px] border-amber-500/60 rounded-full group-hover:border-amber-400 transition-colors pointer-events-none z-20" />

                {/* Obsidian Black Background */}
                <div className="absolute inset-0 bg-[#030303]">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Gold Glow Aura */}
                <div className="absolute inset-0 bg-amber-500/10 blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />

                <span className="relative z-10 text-amber-500 group-hover:text-amber-300 flex items-center gap-2.5 px-1 transition-colors">
                  <Share2 className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="tracking-[0.15em] font-black text-[10px] uppercase whitespace-nowrap">Share Profile</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div ref={reportRef}>
          {/* --- Hero Section - Optimized Padding --- */}
          <div className="bg-[#0f1021] text-white pt-12 pb-12 md:pt-16 md:pb-16 relative overflow-hidden">
            {/* Background Decorative Elements */}


            <div className="container max-w-6xl mx-auto px-4 relative z-10">
              <div className="grid md:grid-cols-12 gap-8 items-center">

                {/* Left Side: Personal Identity - Enhanced spacing for maximum premium feel */}
                <div className="md:col-span-7 space-y-10 md:-mt-10">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">
                      Personal Cosmic Blueprint
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight leading-[1.2]">
                      <span className="block text-white capitalize">{reading.name}</span>
                      <span className="text-gradient-gold italic">{reading.lifePathTraits.title}</span>
                    </h1>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-3 glass-morphism px-3 py-2 rounded-xl border-white/5">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <Calendar className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Foundation</p>
                        <p className="text-xs font-black tracking-widest text-white">{new Date(reading.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 glass-morphism px-3 py-2 rounded-xl border-white/5">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <Fingerprint className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Core Destiny</p>
                        <p className="text-xs font-black tracking-widest text-white">Path {reading.lifePathNumber}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-400 max-w-xl text-base leading-relaxed font-light italic border-l-2 border-secondary/30 pl-5 opacity-80">
                    "{reading.cosmicInsight}"
                  </p>
                </div>

                {/* Right Side: Lucky Matrix Grid - NEW WIDE LAYOUT */}
                <div className="md:col-span-12 lg:col-span-5 flex justify-center lg:justify-end mt-8 lg:mt-0">
                  <div className="relative glass-morphism p-4 md:p-6 rounded-3xl border-white/10 overflow-hidden shadow-2xl w-full max-w-xl">
                    {/* Internal Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-secondary/5 blur-[50px] pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary whitespace-nowrap">Lucky Matrix</h3>
                        <div className="h-[1px] w-full bg-gradient-to-r from-secondary/40 to-transparent" />
                      </div>

                      <div className="grid grid-cols-2 lg:flex lg:items-center lg:justify-between gap-3">
                        {reading.luckyNumbers.slice(0, 4).map((num, idx) => (
                          <div key={idx} className="group relative h-16 md:h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center transition-all duration-500 hover:bg-white/[0.08] hover:border-secondary/40 hover:-translate-y-1">
                            <span className="text-2xl md:text-4xl font-serif font-black text-gradient-gold group-hover:drop-shadow-[0_0_12px_rgba(234,179,8,0.5)] transition-all">
                              {num}
                            </span>
                            <div className="absolute -bottom-1 text-[6px] font-black uppercase tracking-tight text-slate-500 opacity-0 group-hover:opacity-100 group-hover:bottom-2 transition-all">Portal {idx + 1}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                          Four primary numeric pillars aligned with your cosmic frequency.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* --- NEW SECTION: Core Alignment & Frequencies (Rectangle Dark Style) --- */}
          <div id="core" className="container max-w-6xl mx-auto px-4 mt-20 md:mt-32 relative z-30 pb-16">
            <div className="space-y-12">
              <div className="flex flex-col items-center text-center space-y-10">
                <div className="relative group">
                  {/* Pulsing Outer Aura */}
                  <div className="absolute -inset-12 bg-amber-500/10 blur-[80px] rounded-full gold-glow-effect" />

                  {/* Circular Border with Rotation & Glow */}
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-2 border-dashed border-amber-500/30 p-1 animate-spin-circular-glow">
                    <div className="absolute inset-0 rounded-full border border-amber-400/20 shadow-[0_0_20px_rgba(234,179,8,0.2)]" />

                    {/* Custom Crafted 3D Puffed Star SVG - Dot Removed */}
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                      <defs>
                        <linearGradient id="starGradient3d" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FDE047" />
                          <stop offset="50%" stopColor="#EAB308" />
                          <stop offset="100%" stopColor="#A16207" />
                        </linearGradient>
                        <radialGradient id="starHighlight" cx="30%" cy="30%" r="50%">
                          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="url(#starGradient3d)"
                        stroke="#FACC15"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M12 4.5L13.8 8.8L18.5 9.5L15 12.8L16 17.5L12 15.3L8 17.5L9 12.8L5.5 9.5L10.2 8.8L12 4.5Z"
                        fill="url(#starHighlight)"
                        opacity="0.3"
                        style={{ mixBlendMode: 'overlay' }}
                      />
                    </svg>
                  </div>
                </div>

                <div className="space-y-6 max-w-5xl mx-auto px-4">
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-black tracking-tighter leading-none whitespace-nowrap drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                    <span className="text-white">Core Alignment</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-100 ml-4">
                      & Frequencies
                    </span>
                  </h2>

                  <div className="flex items-center justify-center gap-6 whitespace-nowrap">
                    <div className="hidden md:block h-px w-32 bg-gradient-to-r from-transparent to-amber-500/40" />
                    <p className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.8em] font-sans drop-shadow-lg leading-relaxed">
                      The structural numbers of your ethereal existence
                    </p>
                    <div className="hidden md:block h-px w-32 bg-gradient-to-l from-transparent to-amber-500/40" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Psychic Number (Mulank) Rectangle */}
                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-amber-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Activity className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-white tracking-wide">Psychic Number</h4>
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest opacity-80">Mulank</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed mb-8 relative z-10">
                    <p className="mb-3 text-white font-bold italic text-base border-l-2 border-amber-500/50 pl-4">
                      {getCoreAlignmentUseCase(reading.driverNumber, 'psychic').theme}
                    </p>
                    <p className="opacity-80 font-medium">
                      {getCoreAlignmentUseCase(reading.driverNumber, 'psychic').significance}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-amber-600 flex items-center justify-center text-2xl font-black text-black shadow-[0_0_15px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform duration-500">
                      {reading.driverNumber}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-500/80">Action Fuel</span>
                  </div>
                </div>

                {/* Expression Number Rectangle */}
                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-amber-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Palette className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-white tracking-wide">Expression Number</h4>
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest opacity-80">Bhagyank</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed mb-8 relative z-10">
                    <p className="mb-3 text-white font-bold italic text-base border-l-2 border-amber-500/50 pl-4">
                      {getCoreAlignmentUseCase(reading.expressionNumber, 'expression').theme}
                    </p>
                    <p className="opacity-80 font-medium">
                      {getCoreAlignmentUseCase(reading.expressionNumber, 'expression').significance}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-amber-600 flex items-center justify-center text-2xl font-black text-black shadow-[0_0_15px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform duration-500">
                      {reading.expressionNumber}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-500/80">Vibrational Talent</span>
                  </div>
                </div>

                {/* Soul Urge Rectangle */}
                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-amber-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Flame className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-white tracking-wide">Soul Urge Number</h4>
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest opacity-80">Heart's Goal</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed mb-8 relative z-10">
                    <p className="mb-3 text-white font-bold italic text-base border-l-2 border-amber-500/50 pl-4">
                      {getCoreAlignmentUseCase(reading.soulUrgeNumber, 'soulUrge').theme}
                    </p>
                    <p className="opacity-80 font-medium">
                      {getCoreAlignmentUseCase(reading.soulUrgeNumber, 'soulUrge').significance}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-amber-600 flex items-center justify-center text-2xl font-black text-black shadow-[0_0_15px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform duration-500">
                      {reading.soulUrgeNumber}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-500/80">Heart Desire</span>
                  </div>
                </div>

                {/* Personality Rectangle */}
                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-amber-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <VenetianMask className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-white tracking-wide">Personality Number</h4>
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest opacity-80">Persona Reflection</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed mb-8 relative z-10">
                    <p className="mb-3 text-white font-bold italic text-base border-l-2 border-amber-500/50 pl-4">
                      {getCoreAlignmentUseCase(reading.personalityNumber, 'personality').theme}
                    </p>
                    <p className="opacity-80 font-medium">
                      {getCoreAlignmentUseCase(reading.personalityNumber, 'personality').significance}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-amber-600 flex items-center justify-center text-2xl font-black text-black shadow-[0_0_15px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform duration-500">
                      {reading.personalityNumber}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-500/80">Outer Persona</span>
                  </div>
                </div>

                {/* Friendly Numbers Rectangle */}
                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-amber-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <HeartHandshake className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-white tracking-wide">Friendly Numbers</h4>
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest opacity-80">Harmony Matrix</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-8 font-medium italic opacity-85">
                    {getFriendlyGrowthAdvice('friendly', reading.friendlyNumbers)}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {reading.friendlyNumbers.slice(0, 4).map((n, i) => (
                      <div key={i} className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 flex items-center justify-center text-lg font-black text-black shadow-lg group-hover:rotate-12 transition-transform">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Numbers Rectangle */}
                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-amber-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Sprout className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-white tracking-wide">Growth Numbers</h4>
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest opacity-80">Catalyst Frequencies</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-8 font-medium italic opacity-85">
                    {getFriendlyGrowthAdvice('growth', reading.enemyNumbers)}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {reading.enemyNumbers.slice(0, 5).map((n, i) => (
                      <div key={i} className="h-12 w-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-lg font-black text-white hover:bg-amber-500 hover:text-black transition-colors">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container max-w-6xl mx-auto px-4 mt-24 md:mt-32 relative z-20 space-y-24 md:space-y-32">

            {/* --- Deep Soul Analysis Section --- */}
            <div id="soul" className="space-y-16">
              <div className="flex flex-col items-center text-center space-y-10">
                <div className="relative group">
                  {/* Pulsing Outer Soul Aura - Gold theme */}
                  <div className="absolute -inset-12 bg-amber-500/10 blur-[80px] rounded-full animate-flow-3" />

                  {/* Circular Border with Rotation & Glow */}
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-2 border-dashed border-amber-500/30 p-1 animate-spin-circular-glow" style={{ animationDuration: '40s' }}>
                    <div className="absolute inset-0 rounded-full border border-amber-400/20 shadow-[0_0_20px_rgba(234,179,8,0.2)]" />

                    {/* Custom Crafted 3D Sacred Hexagram SVG - Inspired by reference image */}
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                      <defs>
                        <linearGradient id="soulStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FDE047" />
                          <stop offset="50%" stopColor="#EAB308" />
                          <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                      </defs>
                      {/* Interlocking Triangles - Sacred Hexagram */}
                      <path
                        d="M12 3L20 17H4L12 3Z"
                        stroke="url(#soulStarGradient)"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        opacity="0.9"
                      />
                      <path
                        d="M12 21L20 7H4L12 21Z"
                        stroke="url(#soulStarGradient)"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        opacity="0.9"
                      />
                      {/* Inner Core Glow */}
                      <circle cx="12" cy="12" r="3" fill="#FDE047" fillOpacity="0.3" filter="blur(2px)" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-6 max-w-5xl mx-auto px-4">
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-black tracking-tighter leading-none whitespace-nowrap drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                    <span className="text-white">Deep Soul</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-100 ml-4">
                      Analysis
                    </span>
                  </h2>

                  <div className="flex items-center justify-center gap-6 whitespace-nowrap">
                    <div className="hidden md:block h-px w-32 bg-gradient-to-r from-transparent to-amber-500/40" />
                    <p className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.8em] font-sans drop-shadow-lg leading-relaxed">
                      Personalized Psycho-Numeric Breakdown
                    </p>
                    <div className="hidden md:block h-px w-32 bg-gradient-to-l from-transparent to-amber-500/40" />
                  </div>
                </div>
              </div>
              {!isUnlocked && (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 font-bold px-3 py-1">
                  PREMIUM ONLY
                </Badge>
              )}

              <div className="relative">
                {!isUnlocked && (
                  <div className="absolute inset-x-0 bottom-0 top-0 z-10 bg-gradient-to-t from-[#fdfcfe] via-[#fdfcfe]/90 to-transparent pointer-events-none" />
                )}

                <Accordion type="single" collapsible className="grid md:grid-cols-2 gap-x-6 gap-y-0 items-start">
                  {reading.premiumInsights.map((insight, idx) => (
                    <div key={idx} className={!isUnlocked && idx > 1 ? "opacity-20 translate-y-4 blur-[2px]" : ""}>
                      <PremiumInsightCard
                        id={`insight-${idx}`}
                        question={insight.question}
                        description={insight.description}
                        subPoints={insight.subPoints}
                        index={idx}
                      />
                    </div>
                  ))}
                </Accordion>

                {!isUnlocked && (
                  <div className="flex justify-center -mt-20 relative z-20 pb-10">
                    <Button
                      onClick={onUnlock}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 h-12 rounded-full shadow-lg shadow-amber-200 animate-bounce"
                    >
                      UNLOCK ALL INSIGHTS
                    </Button>
                  </div>
                )}
              </div>
            </div>



            {/* --- Color Alchemy Section --- */}
            <div id="color" className="space-y-16 pt-12">
              <div className="flex flex-col items-center text-center space-y-8">
                <div className="relative group">
                  {/* Energy Aura - Larger Spread */}
                  <div className="absolute -inset-16 bg-gradient-to-tr from-amber-500/10 via-indigo-500/10 to-amber-500/10 blur-[100px] rounded-full animate-flow-1" />

                  {/* Master Chromatic Frequency Waves Header Icon - Removed overflow-hidden to prevent ripple clipping */}
                  <div className="relative w-32 h-32 flex items-center justify-center rounded-full">
                    {/* Background Soft Aura */}
                    <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />

                    {/* Dynamic Rippling Waves */}
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      {[
                        { color: '#A855F7', delay: '0s', size: '100%' },   // Violet
                        { color: '#3B82F6', delay: '-0.5s', size: '80%' }, // Blue
                        { color: '#10B981', delay: '-1s', size: '60%' },   // Emerald
                        { color: '#F59E0B', delay: '-1.5s', size: '40%' }, // Amber
                        { color: '#EF4444', delay: '-2s', size: '20%' }    // Red
                      ].map((wave, i) => (
                        <div
                          key={i}
                          className="absolute border-[3px] rounded-full animate-ripple-fast"
                          style={{
                            borderColor: wave.color,
                            width: wave.size,
                            height: wave.size,
                            animationDelay: wave.delay,
                            filter: 'drop-shadow(0 0 8px ' + wave.color + ')',
                          }}
                        />
                      ))}
                      {/* Central Soft Energy Point */}
                      <div className="relative w-3.5 h-3.5 rounded-full bg-white/90 shadow-[0_0_15px_#fff] animate-pulse z-10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-5 max-w-5xl mx-auto px-4">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-none drop-shadow-2xl">
                    <span className="text-white">Color Alchemy</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 ml-3">
                      & Vibrational Guidance
                    </span>
                  </h2>

                  <div className="flex items-center justify-center gap-6 whitespace-nowrap">
                    <div className="hidden md:block h-px w-24 bg-gradient-to-r from-transparent to-amber-500/30" />
                    <p className="text-[9px] md:text-[10px] font-black text-amber-500/60 uppercase tracking-[0.6em] font-sans">
                      Harnessing the Frequencies of your Aura
                    </p>
                    <div className="hidden md:block h-px w-24 bg-gradient-to-l from-transparent to-amber-500/30" />
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                {/* Supportive Tones */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-6 relative group">
                    <div className="absolute bottom-0 left-0 h-[1.5px] w-32 bg-gradient-to-r from-emerald-500 to-transparent" />

                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 rounded-full bg-emerald-500" />
                      <div>
                        <h3 className="text-lg md:text-xl font-serif font-black text-white tracking-tight uppercase">Supportive Tones</h3>
                      </div>
                    </div>

                    {/* Highlighted Counter Badge */}
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                      <span className="text-2xl font-serif font-black text-emerald-400 leading-none">{reading.colorGuidance.luckyColors.length}</span>
                      <div className="w-[1px] h-4 bg-emerald-500/20 mx-1" />
                      <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">Frequencies</span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {reading.colorGuidance.luckyColors.map((color, idx) => (
                      <Card key={idx} className="group relative overflow-hidden rounded-[1.2rem] bg-[#050505] border border-white/5 transition-all duration-300 shadow-xl no-zoom">
                        {/* Immersive Color Flood - High contrast hover */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-[0.92] transition-all duration-500 pointer-events-none z-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-black/20 z-0 pointer-events-none" />

                        <CardContent className="p-5 flex items-center gap-6 relative z-10">
                          <div className="relative flex-shrink-0">
                            {/* Aura Sphere with contrast border */}
                            <div
                              className="w-14 h-14 rounded-full shadow-lg relative z-10 p-0.5 border-2 border-white/80 transition-all duration-500 group-hover:border-white"
                              style={{
                                background: `radial-gradient(circle at 30% 30%, ${color.hex}, #000)`,
                                boxShadow: `0 0 15px ${color.hex}66`
                              }}
                            />
                            <div className="absolute inset-0 rounded-full blur-[10px] opacity-20 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: color.hex }} />
                          </div>

                          <div className="flex-grow space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-serif text-lg text-white tracking-tight uppercase font-bold drop-shadow-md">
                                {color.name}
                              </h4>
                              <div className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20">
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Harmony</span>
                              </div>
                            </div>
                            <p className="text-[13px] md:text-[14px] text-white/80 leading-relaxed font-normal group-hover:text-white group-hover:font-medium transition-all duration-500 drop-shadow-sm line-clamp-2">
                              {color.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Challenging Tones */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-6 relative group">
                    <div className="absolute bottom-0 left-0 h-[1.5px] w-32 bg-gradient-to-r from-red-600 to-transparent" />

                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 rounded-full bg-red-600" />
                      <div>
                        <h3 className="text-lg md:text-xl font-serif font-black text-rose-100 tracking-tight uppercase">Challenging Tones</h3>
                      </div>
                    </div>

                    {/* Highlighted Conflict Badge */}
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.05)]">
                      <span className="text-2xl font-serif font-black text-red-500 leading-none">{reading.colorGuidance.challengingColors.length}</span>
                      <div className="w-[1px] h-4 bg-red-500/20 mx-1" />
                      <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">Conflicts</span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {reading.colorGuidance.challengingColors.map((color, idx) => (
                      <Card key={idx} className="group relative overflow-hidden rounded-[1.2rem] bg-[#050505] border border-white/5 transition-all duration-300 shadow-xl grayscale-[0.5] hover:grayscale-0 no-zoom">
                        {/* Immersive Color Flood - High contrast hover */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-[0.88] transition-all duration-500 pointer-events-none z-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-black/40 z-0 pointer-events-none" />

                        <CardContent className="p-5 flex items-center gap-6 relative z-10">
                          <div className="relative flex-shrink-0">
                            {/* Muted Aura Sphere with contrast */}
                            <div
                              className="w-14 h-14 rounded-full shadow-lg relative z-10 p-0.5 border-2 border-white/70 saturate-[0.6] transition-all duration-500 group-hover:border-white group-hover:saturate-100"
                              style={{
                                background: `radial-gradient(circle at 30% 30%, ${color.hex}, #000)`,
                                boxShadow: `0 0 10px ${color.hex}44`
                              }}
                            />
                            <div className="absolute inset-0 rounded-full blur-[12px] opacity-10 group-hover:opacity-70 transition-opacity duration-500" style={{ backgroundColor: color.hex }} />
                          </div>

                          <div className="flex-grow space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-serif text-lg text-white/90 tracking-tight uppercase font-bold drop-shadow-md group-hover:text-white">
                                {color.name}
                              </h4>
                              <div className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20">
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Static</span>
                              </div>
                            </div>
                            <p className="text-[13px] md:text-[14px] text-white/60 leading-relaxed font-normal italic opacity-70 group-hover:text-white group-hover:opacity-100 transition-all duration-500 drop-shadow-sm line-clamp-2">
                              {color.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto pt-8">
                <div className="bg-[#050505] rounded-[2rem] p-8 md:p-10 border border-white/10 text-white overflow-hidden relative shadow-2xl h-auto min-h-[160px]">
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative shrink-0">
                      {/* Sub-Card Chromatic Frequency Waves Icon - Removed overflow-hidden to let waves breathe */}
                      <div className="w-20 h-20 rounded-[1.5rem] bg-black/40 border border-white/5 flex items-center justify-center relative">
                        <div className="relative w-14 h-14 flex items-center justify-center">
                          {[
                            { color: '#A855F7', delay: '0s' },
                            { color: '#10B981', delay: '-0.8s' },
                            { color: '#EF4444', delay: '-1.6s' }
                          ].map((wave, i) => (
                            <div
                              key={i}
                              className="absolute border-[2.5px] rounded-full animate-ripple-fast"
                              style={{
                                borderColor: wave.color,
                                width: '100%',
                                height: '100%',
                                animationDelay: wave.delay,
                                filter: 'drop-shadow(0 0 6px ' + wave.color + '88)',
                              }}
                            />
                          ))}
                          <div className="relative w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center md:text-left space-y-4 flex-grow">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Zap className="h-3 w-3 text-amber-500 animate-pulse" />
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Molecular Strategy</span>
                      </div>
                      <h4 className="text-2xl md:text-3xl font-serif font-black text-white tracking-tight">Use Case of Vibrational & Color Tones</h4>
                      <div className="space-y-4">
                        <p className="text-[15px] md:text-[16px] text-white/90 leading-relaxed font-normal italic border-l-2 border-amber-500/30 pl-4">
                          Your surroundings act as a silent amplifier for your core frequencies.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-amber-500/20 transition-all">
                            <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[13px] text-white/70 leading-snug"><span className="text-white font-bold block mb-1">Environmental Sync</span> Align your workspace with these tones to calibrate focus.</p>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-amber-500/20 transition-all">
                            <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[13px] text-white/70 leading-snug"><span className="text-white font-bold block mb-1">Aura Shielding</span> Use these specific shades to protect your mental frequency.</p>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-amber-500/20 transition-all">
                            <Gem className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[13px] text-white/70 leading-snug"><span className="text-white font-bold block mb-1">Social Resonance</span> Wear these colors to manifest trust and influence.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Main Content Split --- */}
            <div className="space-y-12" id="blueprint">

              {/* Left Column: Full Report (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="relative mb-12">
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />
                  <div className="flex flex-col md:flex-row md:items-center gap-7 relative z-10 p-1">
                    <div className="relative group animate-smooth-shake">
                      {/* Royal Strategic Clipboard - Custom SVG Icon */}
                      <div className="w-20 h-20 shrink-0 rounded-3xl bg-[#0a0518] border border-white/10 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group-hover:border-amber-500/30 transition-all duration-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.2)]">
                          {/* Clipboard Body */}
                          <path d="M7 4V2H17V4" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
                          <rect x="5" y="4" width="14" height="18" rx="2" stroke="white" strokeWidth="1.2" strokeOpacity="0.3" />

                          {/* Strategy Lines */}
                          <path d="M8 9H16" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
                          <path d="M8 13H14" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
                          <path d="M8 17H12" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />

                          {/* Success Badge (Checkmark Circle) */}
                          <circle cx="17" cy="18" r="4.5" fill="#030303" stroke="#FBBF24" strokeWidth="1" />
                          <path d="M15 18L16.5 19.5L19 16.5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                          {/* Subtle Energy Glow on Checkmark */}
                          <circle cx="17" cy="18" r="2" fill="#FBBF24" className="animate-pulse opacity-20" />
                        </svg>

                        {/* Internal Aura */}
                        <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent blur-xl" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl md:text-5xl font-serif font-black text-white tracking-tight">Your Strategic Life Roadmap</h2>
                        <div className="hidden md:block h-px w-24 bg-gradient-to-r from-amber-500/50 to-transparent" />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.3em] font-sans">Premium Insight Report</p>
                        <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20" />
                        <p className="text-[13px] md:text-[14px] text-white/50 font-medium tracking-wide">Advanced Archetype Decoding • Strategic Frequency Roadmap</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Locked State Overlay Logic */}
                <div className="relative">
                  {!isUnlocked && (
                    <div className="absolute inset-0 z-30 bg-[#0a0518]/60 backdrop-blur-[4px] flex flex-col items-center justify-start pt-20 text-center rounded-2xl border-2 border-dashed border-white/10">
                      <div className="bg-[#1a1b2e] p-8 rounded-2xl shadow-2xl max-w-md mx-auto text-white space-y-6">
                        <Lock className="h-12 w-12 text-[#d4af37] mx-auto" />
                        <div>
                          <h3 className="text-2xl font-serif mb-2">Save Your Report</h3>
                          <p className="text-slate-300 text-sm">
                            Unlock the detailed analysis of your Personal Growth Guidance, Career, and Relationships.
                          </p>
                        </div>
                        <Button
                          onClick={onUnlock}
                          disabled={isLoading}
                          className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold h-12 text-base"
                        >
                          {isLoading ? "Processing..." : "UNLOCK FULL REPORT"}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className={!isUnlocked ? "opacity-40 pointer-events-none select-none h-[800px] overflow-hidden" : ""}>
                    <Accordion type="single" collapsible className="space-y-4">

                      <ReportModuleItem
                        id="growth"
                        icon={Lightbulb}
                        title="Personal Growth Guidance"
                        colorClass="text-emerald-500"
                        content={reading.growthBlueprint}
                      />

                      <ReportModuleItem
                        id="guidance"
                        icon={AlertTriangle}
                        title="Do This, Avoid This (Guidance)"
                        colorClass="text-amber-500"
                        content={reading.guidanceModule}
                      />

                      <ReportModuleItem
                        id="career"
                        icon={Briefcase}
                        title="Work Style & Career Environment"
                        colorClass="text-blue-500"
                        content={reading.careerModule}
                      />

                      <ReportModuleItem
                        id="emotions"
                        icon={Brain}
                        title="Emotional Pattern Decoder"
                        colorClass="text-pink-500"
                        content={reading.emotionsModule}
                      />

                      <ReportModuleItem
                        id="decision"
                        icon={Compass}
                        title="Decision-Making Guide"
                        colorClass="text-purple-500"
                        content={reading.decisionModule}
                      />

                      <ReportModuleItem
                        id="relationships"
                        icon={MessageCircle}
                        title="Relationship Communication Style"
                        colorClass="text-rose-500"
                        content={reading.relationshipModule}
                      />

                    </Accordion>
                  </div>
                </div>
              </div>

              {/* --- NEW SECTION: Sacred Remedies (Full Width) --- */}
              <div id="remedies" className="space-y-8">
                <div className="relative mb-12">
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />
                  <div className="flex flex-col md:flex-row md:items-center gap-7 relative z-10 p-1">
                    <div className="relative group animate-smooth-shake">
                      {/* Sacred Lotus Sparkle - Custom SVG Icon */}
                      <div className="w-20 h-20 shrink-0 rounded-3xl bg-[#0a0518] border border-white/10 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group-hover:border-amber-500/30 transition-all duration-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                          <path d="M12 2L14.5 9H9.5L12 2Z" fill="#FBBF24" />
                          <path d="M12 22L9.5 15H14.5L12 22Z" fill="#FBBF24" />
                          <path d="M22 12L15 9.5V14.5L22 12Z" fill="#FBBF24" />
                          <path d="M2 12L9.5 14.5V9.5L2 12Z" fill="#FBBF24" />
                          <circle cx="12" cy="12" r="4" fill="#FBBF24" fillOpacity="0.8" className="animate-pulse" />
                          <path d="M12 8V4M12 20V16M16 12H20M4 12H8" stroke="#FBBF24" strokeWidth="1" strokeLinecap="round" />
                        </svg>

                        {/* Internal Aura */}
                        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent blur-xl" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl md:text-5xl font-serif font-black text-white tracking-tight">Sacred Remedies</h2>
                        <div className="hidden md:block h-px w-24 bg-gradient-to-r from-amber-500/50 to-transparent" />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.3em] font-sans">Auric Harmonization</p>
                        <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20" />
                        <p className="text-[13px] md:text-[14px] text-white/50 font-medium tracking-wide">Vibrational Shields • Daily Rituals • Cosmic Sync</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* 1. Daily Habit - Obsidian Style */}
                  <div className="group relative overflow-hidden rounded-[2rem] bg-[#030303] p-8 border border-white/5 transition-all duration-700 hover:border-amber-500/30 no-zoom flex flex-col gap-6 shadow-2xl">
                    <div className="absolute inset-0 border border-transparent group-hover:border-amber-500/10 rounded-[2rem] pointer-events-none transition-all duration-700" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/10 transition-all duration-500">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-serif text-[18px] text-white font-bold group-hover:text-amber-400 transition-colors">Daily Habit</h4>
                        <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Ritual Sync</span>
                      </div>
                    </div>
                    <p className="text-white/70 text-[15px] leading-relaxed font-medium pl-4 border-l border-amber-500/20 group-hover:text-white transition-colors">
                      {reading.remedies.habit}
                    </p>
                  </div>

                  {/* 2. Power Color - Obsidian Style */}
                  <div className="group relative overflow-hidden rounded-[2rem] bg-[#030303] p-8 border border-white/5 transition-all duration-700 hover:border-indigo-500/30 no-zoom flex flex-col gap-6 shadow-2xl">
                    <div className="absolute inset-0 border border-transparent group-hover:border-indigo-500/10 rounded-[2rem] pointer-events-none transition-all duration-700" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-500">
                        <Palette className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-serif text-[18px] text-white font-bold group-hover:text-indigo-400 transition-colors">Power Color</h4>
                        <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Auric Shield</span>
                      </div>
                    </div>
                    <p className="text-white/70 text-[15px] leading-relaxed font-medium pl-4 border-l border-indigo-500/20 group-hover:text-white transition-colors">
                      Wear <span style={{ color: reading.remedies.color }} className="text-white font-bold underline decoration-amber-500/30 decoration-2 underline-offset-4">{reading.remedies.color}</span> on {reading.remedies.bestDay}s to amplify your energy field.
                    </p>
                  </div>

                  {/* 3. Cosmic Frequency - Obsidian Style */}
                  <div className="group relative overflow-hidden rounded-[2rem] bg-[#030303] p-8 border border-white/5 transition-all duration-700 hover:border-emerald-500/30 no-zoom flex flex-col gap-6 shadow-2xl">
                    <div className="absolute inset-0 border border-transparent group-hover:border-emerald-500/10 rounded-[2rem] pointer-events-none transition-all duration-700" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-500">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-serif text-[18px] text-white font-bold group-hover:text-emerald-400 transition-colors">Cosmic Frequency</h4>
                        <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Soul Mantra</span>
                      </div>
                    </div>
                    <div className="space-y-3 pl-4 border-l border-emerald-500/20">
                      <p className="text-white font-serif italic text-[17px] group-hover:text-emerald-300 transition-colors">
                        "{reading.cosmicFrequency.mantra}"
                      </p>
                      <p className="text-white/60 text-[13px] leading-snug">
                        {reading.cosmicFrequency.instruction}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Footer Actions --- */}
            <div className="pt-20 border-t border-slate-200/50 flex flex-col items-center gap-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-2">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-serif text-white italic">EndOf This Journey?</h4>
                <p className="text-slate-500 text-xs max-w-xs">Your data is saved locally, but you can clear it and start fresh anytime.</p>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsCloseModalOpen(true)}
                  variant="outline"
                  className="rounded-full px-8 py-6 border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-2 group"
                >
                  <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-black text-[11px] uppercase tracking-[0.2em]">Close Report</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Exit Confirmation Modal --- */}
        <Dialog open={isCloseModalOpen} onOpenChange={setIsCloseModalOpen}>
          <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-slate-900 shadow-2xl rounded-3xl">
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/20">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white mb-0.5">Wait! Don't Lose This.</DialogTitle>
                  <p className="text-xs text-slate-400">Important safety check before exit.</p>
                </div>
              </div>

              {/* Warning Note */}
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <p className="text-xs text-amber-200/90 leading-relaxed font-medium italic">
                  "Before closing this page please copy your personalised report link and save it other wise you will lost this report"
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={handleCopy}
                  className="h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                >
                  <Copy className="h-4 w-4" />
                  <span className="font-black text-xs uppercase tracking-widest">Copy Report Link</span>
                </Button>

                <Button
                  onClick={() => {
                    localStorage.removeItem("numerology_session");
                    onReset();
                  }}
                  variant="ghost"
                  className="h-14 text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold text-xs uppercase tracking-widest"
                >
                  Final Close & Home
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- Learning Hub Modal (Proper Wide Lightbox) --- */}
        <Dialog open={isLearningHubOpen} onOpenChange={setIsLearningHubOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-50/95 backdrop-blur-xl border-none p-0 rounded-[2rem] shadow-2xl">
            <div className="p-8 md:p-12 space-y-12 min-h-full">
              <DialogHeader className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                  Educational Guide
                </div>
                <DialogTitle className="text-4xl md:text-5xl font-serif text-white w-full text-center">The Learning Hub</DialogTitle>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-center">
                  Understand the "Why" and "How" behind your numerological blueprint. Each frequency serves a specific purpose in your journey.
                </p>
              </DialogHeader>
              {/* --- CORE ALIGNMENT SECTION --- */}
              <div className="space-y-8 p-1 md:p-10 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="relative z-10 space-y-2 text-center md:text-left">
                  <h3 className="text-3xl font-serif text-white italic">01. Core Alignment & Frequencies</h3>
                  <p className="text-slate-400 text-sm max-w-xl">The 6 foundational pillars that define your character, potential, and social interactions.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                  {/* 1. Psychic (Mulank) */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className="h-5 w-5 text-purple-400 group-hover:animate-pulse" />
                      <h4 className="font-serif text-lg">Psychic Number</h4>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      <p className="mb-2 text-purple-300 font-bold uppercase tracking-wider text-[10px]">
                        The 'Daily Tactics' Number
                      </p>
                      <p className="italic mb-1">This number means {getCoreAlignmentUseCase(reading.driverNumber, 'psychic').theme}.</p>
                      <p>It means that {getCoreAlignmentUseCase(reading.driverNumber, 'psychic').significance}</p>
                    </div>
                  </div>

                  {/* 2. Life Path */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3 mb-3">
                      <Compass className="h-5 w-5 text-indigo-400 group-hover:rotate-45 transition-transform" />
                      <h4 className="font-serif text-lg">Life Path</h4>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      <p className="mb-2 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                        The 'Grand Strategy' Number ({reading.lifePathNumber})
                      </p>
                      <p className="italic mb-1">This number represents the <strong>{reading.lifePathTraits.title}.</strong></p>
                      <p>It means your long-term expansion is found through {reading.lifePathTraits.title.toLowerCase()} and strategic growth.</p>
                    </div>
                  </div>

                  {/* 3. Expression */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3 mb-3">
                      <Palette className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      <h4 className="font-serif text-lg">Expression</h4>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      <p className="mb-2 text-blue-300 font-bold uppercase tracking-wider text-[10px]">
                        The 'Hidden Talent' Number
                      </p>
                      <p className="italic mb-1">This number means {getCoreAlignmentUseCase(reading.expressionNumber, 'expression').theme}.</p>
                      <p>It means that {getCoreAlignmentUseCase(reading.expressionNumber, 'expression').significance}</p>
                    </div>
                  </div>

                  {/* 4. Soul Urge */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3 mb-3">
                      <Flame className="h-5 w-5 text-rose-400 group-hover:scale-125 transition-transform" />
                      <h4 className="font-serif text-lg">Soul Urge</h4>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      <p className="mb-2 text-rose-300 font-bold uppercase tracking-wider text-[10px]">
                        The 'Internal Peace' Number
                      </p>
                      <p className="italic mb-1">This number means {getCoreAlignmentUseCase(reading.soulUrgeNumber, 'soulUrge').theme}.</p>
                      <p>It means that {getCoreAlignmentUseCase(reading.soulUrgeNumber, 'soulUrge').significance}</p>
                    </div>
                  </div>

                  {/* 5. Personality */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3 mb-3">
                      <VenetianMask className="h-5 w-5 text-amber-400 group-hover:opacity-70 transition-opacity" />
                      <h4 className="font-serif text-lg">Personality</h4>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      <p className="mb-2 text-amber-300 font-bold uppercase tracking-wider text-[10px]">
                        The 'First Impression' Number
                      </p>
                      <p className="italic mb-1">This number means {getCoreAlignmentUseCase(reading.personalityNumber, 'personality').theme}.</p>
                      <p>It means that {getCoreAlignmentUseCase(reading.personalityNumber, 'personality').significance}</p>
                    </div>
                  </div>

                  {/* 6. Friendly/Growth */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3 mb-3">
                      <HeartHandshake className="h-5 w-5 text-emerald-400 group-hover:-translate-y-1 transition-transform" />
                      <h4 className="font-serif text-lg">Friendly & Growth</h4>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      <p className="mb-2 text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
                        The 'Relationship Filter'
                      </p>
                      <p className="mb-1">{getFriendlyGrowthAdvice('friendly', reading.friendlyNumbers)}</p>
                      <p>{getFriendlyGrowthAdvice('growth', reading.enemyNumbers)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- LUCKY MATRIX SECTION --- */}
              <div className="space-y-6 p-1 md:p-8 rounded-[2.5rem] bg-[#1a1b2e] border border-amber-500/20 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />
                <div className="relative z-10 space-y-1 text-center md:text-left text-white">
                  <h3 className="text-3xl font-serif text-amber-400 italic">02. The Lucky Matrix Deep Dive</h3>
                  <p className="text-slate-400 text-sm max-w-xl">Your personal numeric 'cheat codes' to unlock manifestation.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                  {/* 1. Description Card */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                    <h4 className="font-serif text-lg text-amber-400 mb-2">What is the Matrix?</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      The Lucky Matrix consists of 4 unique frequencies derived from the intersection of your name and DOB. They act as <strong>Vibrational Magnets</strong>. When you align your environment with these numbers, luck increases.
                    </p>
                  </div>

                  {/* 2. Strategy Card */}
                  <div className="p-6 rounded-2xl bg-[#0a0518] border border-amber-500/30 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl opacity-50" />
                    <h4 className="font-bold text-amber-400 uppercase tracking-widest text-[10px] mb-2">Master Strategy</h4>
                    <p className="text-xs font-serif italic mb-2">"Manifestation is the art of aligning intent with frequency."</p>
                    <p className="text-[10px] text-slate-400"><strong>PRO TIP:</strong> Sign important documents at times or on dates that match your lucky numbers.</p>
                  </div>

                  {/* 3. Full-Width Pillars Card */}
                  <div className="md:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                    <h4 className="font-serif text-lg text-amber-400 mb-4 text-center md:text-left">The 4 Pillars of Luck</h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          id: "1",
                          label: "Financial Luck",
                          desc: "Your 'Wealth Magnet' frequency. Use for bank account endings, SIP dates, or setting product prices to align your financial energy."
                        },
                        {
                          id: "2",
                          label: "Social Harmony",
                          desc: "The 'Connection Key.' Use to schedule dates, social events, or networking to project your most charismatic and likable self."
                        },
                        {
                          id: "3",
                          label: "Career Momentum",
                          desc: "Your 'Success Signal.' Use when hitting 'send' on resumes, starting new projects, or choosing launch dates for business."
                        },
                        {
                          id: "4",
                          label: "Personal Soul-Sync",
                          desc: "A frequency for inner peace. Best for meditation timers, yoga sessions, or personal passwords to stay spiritually grounded."
                        }
                      ].map((item) => (
                        <div key={item.id} className="p-4 rounded-xl bg-[#0a0518] border border-white/10 flex flex-col gap-2 group hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300">
                          <div className="flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black flex items-center justify-center shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors">{item.id}</span>
                            <span className="font-bold text-white text-sm">{item.label}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- PHASE 03: COLOR ALCHEMY SECTION --- */}
              <div className="space-y-8 p-1 md:p-10 rounded-[2.5rem] bg-[#1a1b2e] border border-indigo-500/20 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 space-y-2 text-center md:text-left">
                  <h3 className="text-3xl font-serif text-indigo-400 italic">03. Color Alchemy & Vibrational Guidance</h3>
                  <p className="text-slate-400 text-sm max-w-xl">Harness the power of visible frequencies to shield your aura and project charisma.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm flex flex-col gap-4 group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Palette className="h-6 w-6 text-emerald-400 group-hover:text-white" />
                      </div>
                      <h4 className="font-serif text-lg text-white">Supportive Tones</h4>
                    </div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">The "Auric Shield"</p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      These are your <strong>Power Frequencies.</strong> Wear them when you need to lead, persuade, or stand out. They act as a vibrational battery that keeps your energy field charged.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm flex flex-col gap-4 group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <Zap className="h-6 w-6 text-rose-400 group-hover:text-white" />
                      </div>
                      <h4 className="font-serif text-lg text-white">Challenging Tones</h4>
                    </div>
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">The "Energy Leak"</p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      These vibrations clash with your frequency. Avoid them when feeling tired or low, as they can "drain" your aura.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row items-center gap-4 relative z-10">
                  <div className="h-10 w-10 shrink-0 bg-white/10 rounded-full flex items-center justify-center font-bold text-indigo-400">?</div>
                  <p className="text-[11px] text-slate-300 italic text-center md:text-left">
                    <strong>Practical Tip:</strong> If you love a Challenging color, use it in small accessories rather than main garments.
                  </p>
                </div>
              </div>

              <div className="flex justify-center pb-8 pt-4">
                <Button onClick={() => setIsLearningHubOpen(false)} className="rounded-full px-8">Got it, thanks!</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- Magic Share Modal --- */}
        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogContent className="max-w-[600px] w-[92vw] p-0 overflow-hidden border border-white/10 bg-[#0a0518] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] !duration-500">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
              <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
            </div>

            <div className="p-8 space-y-7 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
                  <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary border border-primary/30 shadow-inner">
                    <Share2 className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black text-white tracking-tight mb-0.5">Share Live Report</DialogTitle>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Digital Cosmic Blueprint</p>
                </div>
              </div>

              {/* Note Section - Enhanced Hover */}
              <div className="group/note p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4 hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-500 relative">
                <div className="flex items-center gap-2.5 text-primary">
                  <div className="p-1 rounded-full bg-primary/10 group-hover/note:scale-110 transition-transform">
                    <Info className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Guardian Note</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic pr-4">
                  "This link you can use anywhere in any device and you can also share this report link to you known one just save this link work for life time."
                </p>
                <div className="absolute bottom-4 right-4 text-[8px] font-black text-primary/30 uppercase group-hover/note:text-primary/60 transition-colors">Lifetime Access</div>
              </div>

              {/* Copy Link Interface - Glassmorphism */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Secret Magic Link</label>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[8px] font-bold text-secondary uppercase tracking-tighter">Live & Encrypted</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 h-14 glass-morphism rounded-2xl border border-white/10 px-5 flex items-center overflow-hidden group/link relative">
                    <span className="text-[11px] text-slate-300 font-mono tracking-tight group-hover/link:text-white transition-colors duration-300 break-all">{shareUrl}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000" />
                  </div>

                  <Button
                    onClick={handleCopy}
                    className={`h-14 px-8 rounded-2xl transition-all duration-500 flex items-center justify-center gap-2.5 shadow-xl relative overflow-hidden group/copy active:scale-95 ${copied ? 'bg-emerald-500 hover:bg-emerald-600 scale-[1.02]' : 'bg-primary hover:bg-primary/90'}`}
                  >
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5 group-hover/copy:scale-110 transition-all" />}
                    <span className="font-black text-xs uppercase tracking-[0.15em]">{copied ? 'Copied' : 'Copy Link'}</span>

                    {!copied && (
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setIsShareModalOpen(false)}
                  variant="ghost"
                  className="w-full text-slate-500 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] h-12 rounded-xl transition-all"
                >
                  Close Portal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
