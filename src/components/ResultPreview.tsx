import React from "react";
import {
  NumerologyReading,
  getCoreAlignmentUseCase,
  getFriendlyGrowthAdvice
} from "@/lib/numerology";
import { Link } from "react-router-dom";
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
  Sparkles,
  ChevronRight,
  Coins,
  Banknote,
  Flower2,
  HandCoins,
  Ghost,
  DollarSign,
  X,
  Menu,
  Grid3X3,
  Target,
  Crown
} from "lucide-react";
import { Footer } from "./Footer";
import { useToast } from "@/hooks/use-toast";
import LanguageTranslator from "./LanguageTranslator";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const [isLogoSpinning, setIsLogoSpinning] = React.useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLogoSpinning) return;
    setIsLogoSpinning(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 800);
  };

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
    <Card className="bg-[#1a1b2e] border-white/5 border shadow-xl hover:shadow-primary/20 hover:-translate-y-2 hover:border-primary/50 transition-all duration-500 group">
      <CardContent className="p-6 flex flex-col h-full justify-between transition-transform duration-500 group-hover:scale-[1.02]">
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
          <span className="text-2xl sm:text-4xl font-serif text-white/90 font-black tracking-tighter drop-shadow-sm">{number}</span>
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
    <div
      className="group relative border border-white/5 mb-4 bg-[#030303] rounded-[1.8rem] md:rounded-[1.5rem] shadow-2xl transition-all duration-700 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-amber-500/5 no-zoom overflow-hidden"
    >
      {/* Razor-Thin Gold Edge Glow */}
      <div className="absolute inset-0 border border-transparent group-hover:border-amber-500/10 rounded-[1.8rem] md:rounded-[1.5rem] pointer-events-none transition-all duration-700" />

      {/* Header Part */}
      <div className="py-5 md:py-6 px-4 md:px-5 border-b border-white/5">
        <div className="flex items-center gap-4 md:gap-5 text-left relative z-10 w-full">
          {/* Integrated Icon */}
          <div className={`relative p-2.5 md:p-3.5 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/10 shadow-2xl group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all duration-500 ${colorClass}`}>
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
      </div>

      <div className="px-5 md:px-16 py-8 relative">
        {/* Sacred Node Vertical Line - Slimmer on mobile, dashed on desktop */}
        <div className="absolute left-[29px] md:left-[39px] top-6 bottom-12 w-px border-l border-white/5 md:border-dashed md:border-white/10" />

        <div className="space-y-6 relative z-10">
          <p translate="yes" className="text-white/80 leading-relaxed font-medium text-[14px] md:text-[16px] max-w-3xl border-l-2 border-indigo-500/20 pl-4 py-1 italic">
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
                <span translate="yes" className="leading-snug group-hover/item:text-white transition-colors duration-300">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
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
      <div className="border border-amber-500/20 mb-6 bg-[#050505] rounded-[2rem] shadow-2xl transition-all duration-700 group overflow-hidden hover:border-amber-400/50 hover:shadow-[0_0_50px_rgba(234,179,8,0.2)] hover:-translate-y-1 relative">
        <div className="py-7 px-8 border-b border-white/5">
          <div className="flex items-center gap-6 text-left relative z-10">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <Icon className="h-7 w-7 animate-pulse-slow" />
            </div>
            <span translate="yes" className="font-serif text-lg sm:text-2xl text-white group-hover:text-amber-200 transition-colors font-bold tracking-tight leading-tight">{question}</span>
          </div>
        </div>
        <div className="px-8 md:pl-28 md:pr-12 py-10">
          <div className="space-y-8">
            <div className="relative">
              {/* Floating Metallic Gold Line */}
              <div className="absolute -left-6 top-1 bottom-1 w-0.5 bg-gradient-to-b from-amber-500/60 via-amber-200/40 to-transparent rounded-full" />
              <p translate="yes" className="text-amber-50/90 leading-relaxed text-[15px] md:text-[17px] font-medium opacity-90 drop-shadow-sm">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {subPoints.map((point, idx) => (
                <div key={idx} className="bg-black/60 px-5 py-2.5 rounded-xl border border-amber-500/30 flex items-center gap-3 group/point hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300 shadow-lg">
                  <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] group-hover/point:scale-125 transition-transform" />
                  <span translate="yes" className="text-[10px] md:text-[11px] leading-tight font-black text-amber-100 tracking-[0.05em]">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
        @keyframes full-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-logo-spin {
          animation: full-spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 h-16 md:h-20' : 'bg-transparent h-20 md:h-24'}`}>
          <div className="max-w-[100vw] mx-auto h-full px-1 sm:px-4 xl:px-8 flex items-center justify-between">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-1.5 group hover:opacity-80 transition-all active:scale-95 duration-200 ml-0"
            >
              <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/20 group-hover:drop-shadow-[0_0_12px_rgba(234,179,8,0.6)] transition-all duration-500">
                <Orbit className={`h-6 w-6 text-secondary transition-transform duration-1000 ${isLogoSpinning ? 'animate-logo-spin' : 'group-hover:rotate-180'}`} />
              </div>
              <div className="flex flex-col text-left justify-center pl-1 sm:pl-2">
                <span className="font-serif font-black text-xl sm:text-3xl text-white tracking-[-0.02em] leading-none mb-1">
                  Num<span className="text-secondary drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">Guru</span>
                </span>
                <span className="text-secondary/70 font-sans text-[7px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] leading-none pl-0.5">
                  Premium Portal
                </span>
              </div>
            </button>

            <div className="hidden lg:flex items-center gap-1 xl:gap-2.5 text-[10px] font-bold tracking-widest text-white uppercase">
              <a href="#core" className="px-3 xl:px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-secondary hover:bg-secondary/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all flex items-center gap-1.5">
                <Activity className="h-3 w-3 text-secondary" />
                <span className="tracking-[0.1em] xl:tracking-[0.2em] font-black">Core</span>
              </a>
              <a href="#soul" className="px-3 xl:px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-indigo-400 hover:bg-indigo-400/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all flex items-center gap-1.5">
                <VenetianMask className="h-3 w-3 text-indigo-400" />
                <span className="tracking-[0.1em] xl:tracking-[0.2em] font-black">Soul</span>
              </a>
              <a href="#color" className="px-3 xl:px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-emerald-400/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5">
                <Palette className="h-3 w-3 text-emerald-400" />
                <span className="tracking-[0.1em] xl:tracking-[0.2em] font-black">Color</span>
              </a>
              <a href="#blueprint" className="px-3 xl:px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-amber-400/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-1.5">
                <LayoutGrid className="h-3 w-3 text-amber-400" />
                <span className="tracking-[0.1em] xl:tracking-[0.2em] font-black">Blueprint</span>
              </a>
              <a href="#remedies" className="px-3 xl:px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-rose-400 hover:bg-rose-400/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all flex items-center gap-1.5">
                <Gem className="h-3 w-3 text-rose-400" />
                <span className="tracking-[0.1em] xl:tracking-[0.2em] font-black">Remedies</span>
              </a>

              <div className="h-4 w-px bg-white/20 mx-0.5" />

              <button
                onClick={() => setIsLearningHubOpen(true)}
                className="relative group px-4 xl:px-5 py-2 rounded-full overflow-hidden transition-all duration-300 active:scale-95 animate-smooth-shake shadow-[0_0_20px_rgba(251,191,36,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 opacity-100" />
                <div className="absolute inset-0 bg-yellow-400 blur-md opacity-40 group-hover:opacity-70 group-hover:blur-lg transition-all animate-pulse" />
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-shine" />
                </div>
                <span className="relative z-10 text-[#1a0f02] flex items-center gap-1.5 px-0.5 xl:px-1">
                  <Star className="h-3.5 w-3.5 fill-red-600 text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse" />
                  <span className="tracking-[0.1em] xl:tracking-[0.12em] font-black pointer-events-none whitespace-nowrap text-[11px] xl:text-[12px] md:text-sm">Learning Hub</span>
                </span>
              </button>

              <Link to="/blog" className="px-3 xl:px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-secondary hover:bg-secondary/10 text-white hover:text-white hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all flex items-center gap-1.5 group">
                <BookOpen className="h-3 w-3 text-secondary group-hover:scale-110 transition-transform" />
                <span className="tracking-[0.1em] xl:tracking-[0.2em] font-black">Blog</span>
              </Link>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 xl:gap-3 ml-1">
              <div className="hidden lg:flex items-center">
                <LanguageTranslator id="google_translate_element_result" />
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="hidden lg:flex relative group px-3 xl:px-5 py-2 rounded-full overflow-hidden transition-all duration-500 active:scale-95 shadow-[0_0_25px_rgba(0,0,0,0.1)]"
                >
                  <div className="absolute inset-0 bg-[#FFFDF2] transition-colors group-hover:bg-white" />
                  <div className="absolute inset-0 bg-white/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent animate-shimmer-shine" />
                  </div>
                  <div className="absolute inset-0 border-[2px] border-amber-500/30 rounded-full group-hover:border-amber-500/60 transition-colors pointer-events-none z-20" />
                  <span className="relative z-10 text-[#1a0f02] group-hover:text-black flex items-center gap-1.5 px-0.5 transition-colors">
                    <Share2 className="h-3.5 w-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                    <span className="tracking-[0.1em] font-black text-[9px] xl:text-[10px] uppercase whitespace-nowrap">
                      Share Profile
                    </span>
                  </span>
                </button>

                <div className="lg:hidden flex items-center">
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white active:scale-90 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div ref={reportRef}>
          {/* --- Hero Section - Optimized Padding --- */}
          <div className="relative text-white pt-32 pb-12 md:pt-16 md:pb-16 overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center">
            {/* Background Video */}
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
              {/* 65% Black Overlay */}
              <div className="absolute inset-0 bg-black/65" />
            </div>

            <div className="container max-w-6xl mx-auto px-4 relative z-10">
              <div className="grid md:grid-cols-12 gap-8 items-center">

                {/* Left Side: Personal Identity - Enhanced spacing for maximum premium feel */}
                <div className="md:col-span-7 space-y-10 md:-mt-10">
                  <div className="space-y-6">
                    <div translate="yes" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.1em]">
                      Personal Cosmic Blueprint
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-black tracking-tight leading-[1.1] md:leading-[1.2]">
                      <span translate="no" className="block text-white capitalize overflow-hidden text-ellipsis">{reading.name}</span>
                      <span translate="yes" className="text-gradient-gold italic block sm:inline mt-1 sm:mt-0">{reading.lifePathTraits.title}</span>
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
                  <div className="group/matrix relative glass-morphism p-8 rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl w-full max-w-sm aspect-square flex flex-col items-center justify-center transition-all duration-700 hover:scale-[1.03] hover:border-amber-500/40 hover:shadow-[0_0_50px_rgba(234,179,8,0.15)] bg-black/20">
                    {/* Animated Highlighting Glows */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full group-hover/matrix:bg-amber-500/20 transition-all duration-700" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full group-hover/matrix:bg-purple-500/20 transition-all duration-700" />

                    {/* Internal Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500/5 blur-[100px] pointer-events-none opacity-0 group-hover/matrix:opacity-100 transition-opacity" />

                    <div className="relative z-10 w-full h-full flex flex-col">
                      <div className="grid grid-cols-2 flex-grow border-2 border-amber-500/20 rounded-[2rem] overflow-hidden bg-white/[0.02] relative">
                        {/* Centered Heading Point with Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center text-center">
                          <div className="absolute inset-0 bg-amber-500/40 blur-2xl rounded-full scale-150 animate-pulse" />
                          <div className="relative px-3 py-1 bg-[#1a1b2e] border border-amber-500/30 rounded-lg shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                            <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-amber-500 whitespace-nowrap drop-shadow-lg">Lucky Matrix</h3>
                          </div>
                        </div>

                        {[
                          { icon: DollarSign, label: "Wealth", num: reading.luckyNumbers[0], border: "border-r border-b", color: "text-emerald-400", pos: "left-6" },
                          { icon: Heart, label: "Social", num: reading.luckyNumbers[1], border: "border-b", color: "text-rose-400", pos: "right-6" },
                          { icon: Briefcase, label: "Career", num: reading.luckyNumbers[2], border: "border-r", color: "text-blue-400", pos: "left-6" },
                          { icon: Flower2, label: "Soul", num: reading.luckyNumbers[3], border: "", color: "text-purple-400", pos: "right-6" }
                        ].map((item, idx) => (
                          <div key={idx} className={`group relative flex flex-col items-center justify-center transition-all duration-500 hover:bg-amber-500/5 ${item.border} border-amber-500/20`}>
                            <item.icon className={`absolute top-6 ${item.pos} h-6 w-6 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all ${item.color}`} />
                            <span className="text-5xl md:text-6xl font-serif font-black text-gradient-gold drop-shadow-2xl relative -mt-4">
                              {item.num}
                            </span>
                            <span className="absolute bottom-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-amber-500/80 transition-colors">
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center justify-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
                          Geometric Alignment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* --- Premium Transition Divider --- */}
            <div className="absolute bottom-0 left-0 w-full z-20 overflow-hidden">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-24 h-8 bg-amber-500/10 blur-[30px] rounded-full sm:w-32" />
                <div className="w-1.5 h-1.5 rotate-45 bg-amber-500 border border-white/30 shadow-[0_0_10px_rgba(234,179,8,1)]" />
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
                  <h2 translate="yes" className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-black tracking-tighter leading-tight md:leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                    <span className="text-white">Core Alignment</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-100 sm:ml-4 block sm:inline">
                      & Frequencies
                    </span>
                  </h2>

                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <div className="hidden md:block h-px w-32 bg-gradient-to-r from-transparent to-amber-500/40" />
                    <p translate="yes" className="text-[8px] sm:text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.1em] sm:tracking-[0.2em] font-sans drop-shadow-lg leading-relaxed text-center px-4">
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
                      <h4 translate="yes" className="font-serif text-xl text-white tracking-wide">Personality Number</h4>
                      <p translate="yes" className="text-[10px] text-amber-500 font-black uppercase tracking-widest opacity-80">Persona Reflection</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed mb-8 relative z-10">
                    <p translate="yes" className="mb-3 text-white font-bold italic text-base border-l-2 border-amber-500/50 pl-4">
                      {getCoreAlignmentUseCase(reading.personalityNumber, 'personality').theme}
                    </p>
                    <p translate="yes" className="opacity-80 font-medium">
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

                {/* Challenging Numbers Rectangle */}
                <div className="group relative overflow-hidden rounded-[2rem] bg-[#050505] p-8 border border-amber-500/30 transition-all duration-700 hover:scale-[1.03] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Zap className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 translate="yes" className="font-serif text-xl text-white tracking-wide">Challenging Numbers</h4>
                      <p translate="yes" className="text-[10px] text-amber-500 font-black uppercase tracking-widest opacity-80">Evolutionary Triggers</p>
                    </div>
                  </div>
                  <p translate="yes" className="text-sm text-slate-300 leading-relaxed mb-8 font-medium italic opacity-85">
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
                  <h2 translate="yes" className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-black tracking-tighter leading-tight md:leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                    <span className="text-white">Deep Soul</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-100 sm:ml-4 block sm:inline">
                      Analysis
                    </span>
                  </h2>

                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <div className="hidden md:block h-px w-32 bg-gradient-to-r from-transparent to-amber-500/40" />
                    <p translate="yes" className="text-[8px] sm:text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.1em] sm:tracking-[0.2em] font-sans drop-shadow-lg leading-relaxed text-center px-4">
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

                <div className="grid md:grid-cols-2 gap-x-6 gap-y-0 items-start">
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
                </div>

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
                  <h2 translate="yes" className="text-xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight leading-tight drop-shadow-2xl px-2">
                    <span className="text-white">Color Alchemy</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 sm:ml-3 block sm:inline">
                      & Vibrational Guidance
                    </span>
                  </h2>

                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <div className="hidden md:block h-px w-24 bg-gradient-to-r from-transparent to-amber-500/30" />
                    <p translate="yes" className="text-[8px] sm:text-[10px] font-black text-amber-500/60 uppercase tracking-[0.1em] sm:tracking-[0.2em] font-sans text-center px-4">
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
                        <h3 translate="yes" className="text-lg md:text-xl font-serif font-black text-white tracking-tight uppercase">Supportive Tones</h3>
                      </div>
                    </div>

                    {/* Highlighted Counter Badge */}
                    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                      <span className="text-xl sm:text-2xl font-serif font-black text-emerald-400 leading-none">{reading.colorGuidance.luckyColors.length}</span>
                      <div className="w-[1px] h-3 sm:h-4 bg-emerald-500/20 mx-0.5 sm:mx-1" />
                      <span className="text-[7px] sm:text-[9px] font-black text-white/50 uppercase tracking-[0.1em] sm:tracking-[0.2em]">Frequencies</span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {reading.colorGuidance.luckyColors.map((color, idx) => (
                      <Card key={idx} className="group relative overflow-hidden rounded-[1.2rem] bg-[#050505] border border-white/5 transition-all duration-500 shadow-xl no-zoom hover:-translate-y-2 hover:border-white/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
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

                          <div className="flex-grow space-y-0.5 sm:space-y-1 overflow-hidden">
                            <div className="flex items-center justify-between gap-2">
                              <h4 translate="yes" className="font-serif text-base sm:text-lg text-white tracking-tight uppercase font-bold drop-shadow-md truncate">
                                {color.name}
                              </h4>
                              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
                                <span className="text-[7px] sm:text-[8px] font-black text-white uppercase tracking-widest">Harmony</span>
                              </div>
                            </div>
                            <p translate="yes" className="text-[11px] sm:text-[13px] md:text-[14px] text-white/80 leading-relaxed font-normal group-hover:text-white group-hover:font-medium transition-all duration-500 drop-shadow-sm line-clamp-2">
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
                    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-red-500/5 border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.05)]">
                      <span className="text-xl sm:text-2xl font-serif font-black text-red-500 leading-none">{reading.colorGuidance.challengingColors.length}</span>
                      <div className="w-[1px] h-3 sm:h-4 bg-red-500/20 mx-0.5 sm:mx-1" />
                      <span className="text-[7px] sm:text-[9px] font-black text-white/50 uppercase tracking-[0.1em] sm:tracking-[0.2em]">Conflicts</span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {reading.colorGuidance.challengingColors.map((color, idx) => (
                      <Card key={idx} className="group relative overflow-hidden rounded-[1.2rem] bg-[#050505] border border-white/5 transition-all duration-500 shadow-xl grayscale-[0.5] hover:grayscale-0 hover:-translate-y-2 hover:border-red-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] no-zoom">
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

                          <div className="flex-grow space-y-0.5 sm:space-y-1 overflow-hidden">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-serif text-base sm:text-lg text-white/90 tracking-tight uppercase font-bold drop-shadow-md group-hover:text-white truncate">
                                {color.name}
                              </h4>
                              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
                                <span className="text-[7px] sm:text-[8px] font-black text-white uppercase tracking-widest">Static</span>
                              </div>
                            </div>
                            <p className="text-[11px] sm:text-[13px] md:text-[14px] text-white/60 leading-relaxed font-normal italic opacity-70 group-hover:text-white group-hover:opacity-100 transition-all duration-500 drop-shadow-sm line-clamp-2">
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
                  <div className="flex flex-col items-center md:items-start md:flex-row gap-7 relative z-10 p-1">
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

                    <div className="space-y-2 flex flex-col items-center md:items-start text-center md:text-left">
                      <div className="flex flex-col items-center md:items-start md:flex-row gap-3 md:gap-6">
                        <h2 translate="yes" className="text-2xl sm:text-3xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight">Your Strategic Life Roadmap</h2>
                        <div className="hidden md:block h-px w-24 bg-gradient-to-r from-amber-500/50 to-transparent" />
                      </div>
                      <div className="flex flex-col items-center justify-center md:items-start md:justify-start gap-y-2 mt-2">
                        <p translate="yes" className="text-[11px] sm:text-[12px] font-black text-amber-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-sans">Premium Insight Report</p>
                        <div className="flex flex-col items-center md:flex-row md:items-center gap-x-4 gap-y-1">
                          <p className="text-[12px] md:text-[14px] text-white/50 font-medium tracking-wide leading-tight">Advanced Archetype Decoding</p>
                          <span className="hidden md:block w-1 h-1 rounded-full bg-white/20" />
                          <p className="text-[12px] md:text-[14px] text-white/50 font-medium tracking-wide leading-tight">Strategic Frequency Roadmap</p>
                        </div>
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
                    <div className="space-y-4">

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

                    </div>
                  </div>
                </div>
              </div>

              {/* --- NEW SECTION: Sacred Remedies (Full Width) --- */}
              <div id="remedies" className="space-y-8">
                <div className="relative mb-12">
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />
                  <div className="flex flex-col items-center md:items-start md:flex-row gap-7 relative z-10 p-1">
                    <div className="relative group animate-smooth-shake">
                      {/* Sacred Lotus Sparkle - Custom SVG Icon */}
                      <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl md:rounded-3xl bg-[#0a0518] border border-white/10 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group-hover:border-amber-500/30 transition-all duration-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)] md:w-[48px] md:h-[48px]">
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

                    <div className="space-y-2 flex flex-col items-center md:items-start text-center md:text-left">
                      <div className="flex flex-col items-center md:items-start md:flex-row gap-3 md:gap-6">
                        <h2 translate="yes" className="text-2xl sm:text-3xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight">Sacred Remedies</h2>
                        <div className="hidden md:block h-px w-24 bg-gradient-to-r from-amber-500/50 to-transparent" />
                      </div>
                      <div className="flex flex-col items-center justify-center md:items-start md:justify-start gap-y-2 mt-2">
                        <p translate="yes" className="text-[11px] sm:text-[12px] font-black text-amber-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-sans">Auric Harmonization</p>
                        <div className="flex flex-col items-center md:flex-row md:items-center gap-x-4 gap-y-1">
                          <p className="text-[12px] md:text-[14px] text-white/50 font-medium tracking-wide leading-tight">Vibrational Shields • Daily Rituals</p>
                          <span className="hidden md:block w-1 h-1 rounded-full bg-white/20" />
                          <p className="text-[12px] md:text-[14px] text-white/50 font-medium tracking-wide leading-tight">Cosmic Sync</p>
                        </div>
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
                    <p translate="yes" className="text-white/70 text-[15px] leading-relaxed font-medium pl-4 border-l border-amber-500/20 group-hover:text-white transition-colors">
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
                    <p translate="yes" className="text-white/70 text-[15px] leading-relaxed font-medium pl-4 border-l border-indigo-500/20 group-hover:text-white transition-colors">
                      Wear <span translate="no" style={{ color: reading.remedies.color }} className="text-white font-bold underline decoration-amber-500/30 decoration-2 underline-offset-4">{reading.remedies.color}</span> on {reading.remedies.bestDay}s to amplify your energy field.
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
                    <div translate="yes" className="space-y-3 pl-4 border-l border-emerald-500/20">
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
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-[#FDFBF7] border border-amber-100 p-0 rounded-[2.5rem] shadow-[0_20px_60px_rgba(180,140,40,0.15)] scrollbar-hide [&>button:last-child]:hidden">
            {/* Sticky Close Icon Container */}
            <div className="sticky top-0 z-[100] flex justify-end p-6 pointer-events-none">
              <button
                onClick={() => setIsLearningHubOpen(false)}
                className="pointer-events-auto h-10 w-10 bg-white/90 backdrop-blur-md rounded-full border border-amber-200 flex items-center justify-center text-[#1a0f02] shadow-xl hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all active:scale-90 group"
              >
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
            <div className="relative p-1 space-y-0">
              {/* Soft Golden Ambient Glow - Top only */}
              <div className="absolute top-0 left-1/4 w-[50%] h-[30%] bg-amber-100/50 blur-[130px] rounded-full -translate-y-1/2" />

              <div className="relative z-10 p-4 sm:p-8 md:p-16 !pb-0 space-y-12 sm:space-y-16">
                <div className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-full overflow-hidden">
                  <div className="inline-flex items-center justify-center mx-auto gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-600/10 border border-amber-600/20 text-amber-800 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2">
                    The Mastery Library
                  </div>

                  {/* New Navigation Slider - Fixed Width for Mobile */}
                  <div className="w-full max-w-[calc(100vw-4rem)] mx-auto overflow-x-auto scrollbar-hide pb-2">
                    <div className="flex items-center justify-start sm:justify-center gap-3 px-4 min-w-max">
                      {[
                        { id: 'lh-sec-01', label: 'Core Frequencies' },
                        { id: 'lh-sec-02', label: 'Lucky Matrix' },
                        { id: 'lh-sec-03', label: 'Color Alchemy' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' })}
                          className="px-5 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-900 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/10 transition-all whitespace-nowrap active:scale-95"
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <h2 className="text-3xl sm:text-5xl md:text-7xl font-sans font-black text-[#1a0f02] w-full text-center tracking-tight leading-[1.1] md:leading-[0.9]">
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 italic">Learning Hub</span>
                  </h2>
                  <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-center font-medium px-4">
                    Understand the "Why" and "How" behind your unique vibrational signature. This guide decodes the mechanics of your numeric destiny.
                  </p>
                </div>

                {/* --- CORE ALIGNMENT SECTION --- */}
                <div id="lh-sec-01" className="space-y-10 p-5 sm:p-8 md:p-14 rounded-[2.5rem] sm:rounded-[3rem] bg-amber-50/[0.4] border border-amber-100 relative overflow-hidden backdrop-blur-sm group/section">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover/section:bg-amber-600/10 transition-all duration-700" />
                  <div className="relative z-10 space-y-4 flex flex-col items-center justify-center text-center w-full">
                    <div className="flex flex-col items-center justify-center gap-4 w-full">
                      <div className="h-1.5 md:h-2.5 w-12 md:w-16 bg-amber-600 rounded-full shadow-[0_4px_10px_rgba(217,119,6,0.2)]" />
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-[#1a0f02] uppercase tracking-tight max-w-md">01. Core Alignment & Frequencies</h3>
                    </div>
                    <p className="text-slate-500 text-sm sm:text-base max-w-xl font-medium px-2 mx-auto">The 6 foundational pillars that define your character, potential, and how you interact with the world.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-8 relative z-10 w-full px-1 sm:px-0">
                    {/* 1. Psychic (Mulank) */}
                    <div className="flex flex-col h-full bg-gradient-to-br from-amber-400 to-amber-500 p-5 sm:p-7 rounded-[2rem] border-t border-white/40 shadow-[0_10px_30px_rgba(180,140,40,0.15)] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/30 group items-start text-left md:items-start md:text-left w-full mx-auto ml-2 -mr-8 sm:mx-0">
                      <div className="flex flex-row items-center justify-start gap-3 mb-3 px-1">
                        <div className="p-3 rounded-2xl bg-black/10 text-[#3d2a1a] group-hover:scale-110 transition-transform">
                          <Activity className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-xl text-[#1a0f02] font-black group-hover:text-black transition-colors">Psychic Number</h4>
                      </div>
                      <div className="text-sm text-[#3d2a1a]/80 leading-relaxed flex-grow space-y-4 w-full px-1">
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            What it means
                          </p>
                          <p className="leading-relaxed text-black font-semibold text-[16px] text-left">Your inner personality and how you see yourself. It shows your natural behavior, thinking style, and daily habits.</p>
                        </div>
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            How to use
                          </p>
                          <ul className="space-y-1.5 text-black/90 font-medium list-none text-[14px] flex flex-col items-start md:items-start">
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Use when making daily decisions to match your traits.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Wear colors associated with your number on important days.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Plan your daily routine according to your number's energy.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 2. Life Path */}
                    <div className="flex flex-col h-full bg-gradient-to-br from-amber-400 to-amber-500 p-5 sm:p-7 rounded-[2rem] border-t border-white/40 shadow-[0_10px_30px_rgba(180,140,40,0.15)] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/30 group items-start text-left md:items-start md:text-left w-full mx-auto ml-2 -mr-8 sm:mx-0">
                      <div className="flex flex-row items-center justify-start gap-3 mb-3 px-1">
                        <div className="p-3 rounded-2xl bg-black/10 text-[#3d2a1a] group-hover:rotate-45 transition-transform">
                          <Compass className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-xl text-[#1a0f02] font-black group-hover:text-black transition-colors">Life Path</h4>
                      </div>
                      <div className="text-sm text-[#3d2a1a]/80 leading-relaxed flex-grow space-y-4 w-full px-1">
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            What it means
                          </p>
                          <p className="leading-relaxed text-black font-semibold text-[16px] text-left">Your life's main purpose and direction. It reveals what you're meant to achieve and your life journey.</p>
                        </div>
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            How to use
                          </p>
                          <ul className="space-y-1.5 text-black/90 font-medium list-none text-[14px] flex flex-col items-start md:items-start">
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Use when choosing career fields to match your purpose.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Set your long-term life goals based on your path's direction.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Ask for alignment with this purpose during big life decisions.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 3. Expression */}
                    <div className="flex flex-col h-full bg-gradient-to-br from-amber-400 to-amber-500 p-5 sm:p-7 rounded-[2rem] border-t border-white/40 shadow-[0_10px_30px_rgba(180,140,40,0.15)] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/30 group items-start text-left md:items-start md:text-left w-full mx-auto ml-2 -mr-8 sm:mx-0">
                      <div className="flex flex-row items-center justify-start gap-3 mb-3 px-1">
                        <div className="p-3 rounded-2xl bg-black/10 text-[#3d2a1a] group-hover:scale-110 transition-transform">
                          <Palette className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-xl text-[#1a0f02] font-black group-hover:text-black transition-colors">Expression</h4>
                      </div>
                      <div className="text-sm text-[#3d2a1a]/80 leading-relaxed flex-grow space-y-4 w-full px-1">
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            What it means
                          </p>
                          <p className="leading-relaxed text-black font-semibold text-[16px] text-left">Your natural talents and special abilities. It reveals how you show yourself and your professional strengths.</p>
                        </div>
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            How to use
                          </p>
                          <ul className="space-y-1.5 text-black/90 font-medium list-none text-[14px] flex flex-col items-start md:items-start">
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Identify and develop the specific skills this number highlights.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Apply for roles that match your Expression Number's strengths.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Express yourself socially in ways your number suggests.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 4. Soul Urge */}
                    <div className="flex flex-col h-full bg-gradient-to-br from-amber-400 to-amber-500 p-5 sm:p-7 rounded-[2rem] border-t border-white/40 shadow-[0_10px_30px_rgba(180,140,40,0.15)] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/30 group items-start text-left md:items-start md:text-left w-full mx-auto ml-2 -mr-8 sm:mx-0">
                      <div className="flex flex-row items-center justify-start gap-3 mb-3 px-1">
                        <div className="p-3 rounded-2xl bg-black/10 text-[#3d2a1a] group-hover:scale-125 transition-transform">
                          <Flame className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-xl text-[#1a0f02] font-black group-hover:text-black transition-colors">Soul Urge</h4>
                      </div>
                      <div className="text-sm text-[#3d2a1a]/80 leading-relaxed flex-grow space-y-4 w-full px-1">
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            What it means
                          </p>
                          <p className="leading-relaxed text-black font-semibold text-[16px] text-left">Your heart's deepest desires. It shows what truly motivates you and what your soul really wants and needs.</p>
                        </div>
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            How to use
                          </p>
                          <ul className="space-y-1.5 text-black/90 font-medium list-none text-[14px] flex flex-col items-start md:items-start">
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Make choices that fulfill your soul's needs for inner peace.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Create daily habits that satisfy your deepest motivations.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> In relationships, communicate these needs to feel satisfied.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 5. Personality */}
                    <div className="flex flex-col h-full bg-gradient-to-br from-amber-400 to-amber-500 p-5 sm:p-7 rounded-[2rem] border-t border-white/40 shadow-[0_10px_30px_rgba(180,140,40,0.15)] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/30 group items-start text-left md:items-start md:text-left w-full mx-auto ml-2 -mr-8 sm:mx-0">
                      <div className="flex flex-row items-center justify-start gap-3 mb-3 px-1">
                        <div className="p-3 rounded-2xl bg-black/10 text-[#3d2a1a] group-hover:scale-110 transition-transform">
                          <VenetianMask className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-xl text-[#1a0f02] font-black group-hover:text-black transition-colors">Personality</h4>
                      </div>
                      <div className="text-sm text-[#3d2a1a]/80 leading-relaxed flex-grow space-y-4 w-full px-1">
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            What it means
                          </p>
                          <p className="leading-relaxed text-black font-semibold text-[16px] text-left">How others see you when they first meet you. It shows the image you project and your outer character.</p>
                        </div>
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            How to use
                          </p>
                          <ul className="space-y-1.5 text-black/90 font-medium list-none text-[14px] flex flex-col items-start md:items-start">
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Dress and behave in ways that enhance your projected image.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Present yourself according to these strengths in meetings.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Match your personal brand with what this number projects.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 6. Friendly/Growth */}
                    {/* 6. Friendly/Growth */}
                    <div className="flex flex-col h-full bg-gradient-to-br from-amber-400 to-amber-500 p-5 sm:p-7 rounded-[2rem] border-t border-white/40 shadow-[0_10px_30px_rgba(180,140,40,0.15)] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/30 group items-start text-left md:items-start md:text-left w-full mx-auto ml-2 -mr-8 sm:mx-0">
                      <div className="flex flex-row items-center justify-start gap-3 mb-3 px-1">
                        <div className="p-3 rounded-2xl bg-black/10 text-[#3d2a1a] group-hover:-translate-y-1 transition-transform">
                          <HeartHandshake className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-xl text-[#1a0f02] font-black group-hover:text-black transition-colors">Relationship Keys</h4>
                      </div>
                      <div className="text-sm text-[#3d2a1a]/80 leading-relaxed flex-grow space-y-4 w-full px-1">
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            What it means
                          </p>
                          <p className="leading-relaxed text-black font-semibold text-[16px] text-left">Your compatibility with others. It shows which numbers work well and which need extra effort.</p>
                        </div>
                        <div>
                          <p className="text-[#1a0f02] font-black uppercase tracking-[0.15em] text-[13px] mb-2 flex items-center justify-start gap-2">
                            <span className="h-1.5 w-1.5 bg-black/40 rounded-full" />
                            Practical Application
                          </p>
                          <ul className="space-y-1.5 text-black/90 font-medium list-none text-[14px] flex flex-col items-start md:items-start">
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Check partner compatibility for business or personal life.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Adjust communication style based on number synergy levels.</li>
                            <li className="flex gap-2 items-start"><span className="text-amber-800 font-bold mt-0.5">•</span> Use compatible numbers for team harmony and hiring.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- LUCKY MATRIX SECTION --- */}
                <div id="lh-sec-02" className="space-y-10 p-5 sm:p-8 md:p-14 rounded-[2.5rem] sm:rounded-[3rem] bg-amber-50/[0.4] border border-amber-100 relative overflow-hidden backdrop-blur-sm group/section">
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-[100px] -ml-48 -mb-48 group-hover/section:bg-orange-600/10 transition-all duration-700" />
                  <div className="relative z-10 space-y-4 flex flex-col items-center justify-center text-center w-full">
                    <div className="flex flex-col items-center justify-center gap-4 w-full">
                      <div className="h-1.5 md:h-2.5 w-12 md:w-16 bg-amber-600 rounded-full shadow-[0_4px_10px_rgba(217,119,6,0.2)]" />
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-[#1a0f02] uppercase tracking-tight max-w-md">02. The Lucky Matrix Deep Dive</h3>
                    </div>
                    <p className="text-slate-500 text-sm sm:text-base max-w-xl font-medium px-2 mx-auto">Your personal numeric 'cheat codes' to unlock manifestation and opportunity.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-8 relative z-10 w-full px-1 sm:px-0">
                    {/* 1. Description Card */}
                    <div className="p-5 sm:p-7 rounded-[2rem] bg-gradient-to-br from-amber-400 to-amber-500 border-t border-white/40 shadow-xl hover:-translate-y-2 transition-all duration-500 group -ml-1 -mr-5 sm:mx-0">
                      <div className="flex flex-row items-center gap-3 mb-3">
                        <div className="p-3 rounded-2xl bg-black/10 text-[#1a0f02]">
                          <Grid3X3 className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-xl text-[#1a0f02] font-black group-hover:text-black transition-colors">What is the Matrix?</h4>
                      </div>
                      <p className="text-sm text-[#3d2a1a] leading-relaxed font-medium">
                        The Lucky Matrix consists of 4 unique frequencies derived from the intersection of your name and DOB. They act as <strong className="text-black">Vibrational Magnets</strong>. When you align your environment with these numbers, luck increases.
                      </p>
                    </div>

                    {/* 2. Strategy Card */}
                    <div className="p-5 sm:p-7 rounded-[2rem] bg-[#1a0f02] border border-amber-500/20 text-white shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 -ml-1 -mr-5 sm:mx-0">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-all" />
                      <div className="flex flex-row items-center gap-3 mb-3 relative z-10">
                        <div className="p-3 rounded-2xl bg-amber-400/10 text-amber-400">
                          <Target className="h-6 w-6" />
                        </div>
                        <h4 className="font-black text-amber-400 uppercase tracking-widest text-[11px]">Master Strategy</h4>
                      </div>
                      <p className="text-sm font-serif italic mb-3 opacity-90 text-amber-50 italic relative z-10">"Manifestation is the art of aligning intent with frequency."</p>
                      <p className="text-xs text-amber-200/60 leading-snug relative z-10"><strong className="text-amber-400 font-black">PRO TIP:</strong> Sign important documents at times or on dates that match your lucky numbers.</p>
                    </div>

                    {/* 3. Full-Width Pillars Card */}
                    <div className="md:col-span-2 p-5 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-[#3d2a1a] border border-amber-900/50 shadow-2xl mx-auto w-full">
                      <h4 className="font-serif text-xl sm:text-2xl md:text-3xl text-amber-100 font-black mb-8 text-center md:text-left tracking-tight">The 4 Pillars of Luck</h4>
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        {[
                          { id: "1", label: "Financial Luck", desc: "Your 'Wealth Magnet' frequency. Best for bank account endings, business launch dates, and investment timing." },
                          { id: "2", label: "Social Harmony", desc: "The 'Connection Key.' Use this number to schedule important dates, social gatherings, or high-stakes networking events." },
                          { id: "3", label: "Career Momentum", desc: "Your 'Success Signal.' Align this frequency when starting new professional projects, signing contracts, or starting a new job." },
                          { id: "4", label: "Personal Soul-Sync", desc: "A frequency for deep inner peace. Best used for personal passwords, meditation timers, and private rituals." }
                        ].map((item) => (
                          <div key={item.id} className="flex flex-col h-full p-5 sm:p-7 rounded-[2rem] bg-amber-400 border-t border-white/40 hover:bg-amber-300 hover:-translate-y-2 transition-all duration-500 group mx-auto w-full sm:mx-0">
                            <div className="flex flex-row items-center gap-3 mb-3">
                              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black/10 text-[#1a0f02] text-xs font-black flex items-center justify-center border border-black/5 group-hover:bg-black group-hover:text-amber-400 transition-all">{item.id}</span>
                              <span className="font-black text-[#1a0f02] text-lg group-hover:text-black transition-colors uppercase tracking-tight">{item.label}</span>
                            </div>
                            <p className="text-sm text-[#3d2a1a] leading-relaxed flex-grow font-semibold">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- PHASE 03: COLOR ALCHEMY SECTION --- */}
                <div id="lh-sec-03" className="space-y-10 p-5 sm:p-8 md:p-14 rounded-[2.5rem] sm:rounded-[3rem] bg-purple-50/[0.4] border border-purple-100 relative overflow-hidden backdrop-blur-sm group/section">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover/section:bg-purple-600/10 transition-all duration-700" />
                  <div className="relative z-10 space-y-4 flex flex-col items-center justify-center text-center w-full">
                    <div className="flex flex-col items-center justify-center gap-4 w-full">
                      <div className="h-1.5 md:h-2.5 w-12 md:w-16 bg-purple-600 rounded-full shadow-[0_4px_10px_rgba(147,51,234,0.3)]" />
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-slate-900 uppercase tracking-tight max-w-md">03. Color Alchemy & Guidance</h3>
                    </div>
                    <p className="text-slate-500 text-sm sm:text-base max-w-xl font-medium px-2 mx-auto">Harness the power of visible frequencies to shield your aura and project charisma.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-8 relative z-10 w-full px-1 sm:px-0">
                    <div className="flex flex-col h-full bg-gradient-to-br from-amber-400 to-amber-500 p-5 sm:p-7 rounded-[2rem] border-t border-white/40 shadow-xl hover:-translate-y-2 transition-all duration-500 group -ml-1 -mr-5 sm:mx-0">
                      <div className="flex flex-row items-center gap-3 mb-3">
                        <div className="p-3.5 rounded-2xl bg-black/10 text-[#1a0f02] group-hover:bg-black group-hover:text-amber-400 transition-all">
                          <Palette className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-xl text-[#1a0f02] font-black group-hover:text-black transition-colors">Supportive Tones</h4>
                      </div>
                      <p className="text-[11px] font-black text-[#3d2a1a]/60 uppercase tracking-[0.2em] mb-2">The "Auric Shield"</p>
                      <p className="text-sm text-[#3d2a1a]/80 leading-relaxed group-hover:text-black transition-colors flex-grow font-semibold">
                        These are your <strong className="text-black">Power Frequencies.</strong> Wear them when you need to lead, persuade, or stand out. They act as a vibrational battery.
                      </p>
                    </div>

                    <div className="flex flex-col h-full bg-gradient-to-br from-amber-400 to-amber-500 p-5 sm:p-7 rounded-[2rem] border-t border-white/40 shadow-xl hover:-translate-y-2 transition-all duration-500 group -ml-1 -mr-5 sm:mx-0">
                      <div className="flex flex-row items-center gap-3 mb-3">
                        <div className="p-3.5 rounded-2xl bg-black/10 text-[#1a0f02] group-hover:bg-black group-hover:text-amber-400 transition-all">
                          <Zap className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-xl text-[#1a0f02] font-black group-hover:text-black transition-colors">Challenging Tones</h4>
                      </div>
                      <p className="text-[11px] font-black text-[#3d2a1a]/60 uppercase tracking-[0.2em] mb-2">The "Energy Leak"</p>
                      <p className="text-sm text-[#3d2a1a]/80 leading-relaxed group-hover:text-black transition-colors flex-grow font-semibold">
                        These vibrations clash with your frequency. Avoid them when feeling low, as they can "drain" your aura's battery.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#1a0f02] text-white flex flex-col md:flex-row items-center gap-5 relative z-10 border border-amber-900/40 shadow-lg">
                    <div className="h-10 w-10 shrink-0 bg-amber-500/20 rounded-full flex items-center justify-center font-bold text-amber-500 border border-amber-500/30">?</div>
                    <p className="text-xs text-amber-100/70 italic text-center md:text-left">
                      <strong className="text-white underline decoration-amber-500/30">Practical Tip:</strong> If you love a Challenging color, use it in small accessories rather than main garments to maintain vibrational integrity.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center pb-12">
                  <Button
                    onClick={() => setIsLearningHubOpen(false)}
                    className="group relative inline-flex items-center gap-3 px-12 py-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-black text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10">I Understand My Path</span>
                    <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- Magic Share Modal --- */}
        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogContent className="max-w-[500px] w-[92vw] p-0 overflow-hidden border border-white/10 bg-[#0a0518] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] !duration-500 [&>button:last-child]:hidden">
            {/* Custom Premium Close Button */}
            <div className="absolute top-4 right-4 z-[100]">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 active:scale-95 group"
              >
                <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

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
        {/* --- Mobile Menu Overlay --- */}
        <div className={`fixed inset-0 z-[100] transition-all duration-700 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
          {/* Solid Mystical Purple Background */}
          <div className="absolute inset-0 bg-[#050005] overflow-hidden">
            {/* Rich Cosmic Glows */}
            <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] bg-[#D100D1]/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-[20%] -right-[10%] w-[70%] h-[70%] bg-secondary/15 rounded-full blur-[140px]" />
            <div className="absolute -bottom-[10%] left-[10%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[110px]" />

            {/* Texture Layer */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          </div>

          <div className="relative z-10 w-full h-full flex flex-col p-6 overflow-y-auto">
            {/* Header / Close button */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Orbit className="h-6 w-6 text-secondary" />
                <span className="font-serif font-black text-xl text-white">NumGuru</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-full bg-secondary/10 border border-secondary/30 text-secondary shadow-[0_0_20px_rgba(234,179,8,0.2)] active:scale-90 transition-all"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            {/* Premium Mobile Controls - Top of Menu */}
            <div className="flex flex-col gap-5 mb-10">
              <div className="flex justify-center w-full">
                <LanguageTranslator id="google_translate_element_mobile_menu" isLarge={true} />
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsShareModalOpen(true);
                }}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-[#1a0f02] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_25px_rgba(234,179,8,0.3)] border border-amber-300/30"
              >
                <Share2 className="h-5 w-5 text-amber-900" />
                Share Profile
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col gap-4 mb-12">
              {[
                { id: "core", icon: Activity, label: "Core Blueprint" },
                { id: "soul", icon: VenetianMask, label: "Soul Analysis" },
                { id: "color", icon: Palette, label: "Color Alchemy" },
                { id: "blueprint", icon: LayoutGrid, label: "Strategic Roadmap" },
                { id: "remedies", icon: Gem, label: "Sacred Remedies" },
                { id: "blog", icon: BookOpen, label: "Wisdom Blog", isLink: true }
              ].map((item, i) => (
                item.isLink ? (
                  <Link
                    key={item.id}
                    to="/blog"
                    className={`flex items-center gap-5 p-5 rounded-2xl bg-[#0d000d] border border-white/5 transition-all active:scale-[0.98] active:bg-secondary/10 group`}
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/20 text-secondary shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-black text-white uppercase tracking-[0.2em]">{item.label}</span>
                    <ChevronRight className="h-5 w-5 ml-auto text-secondary/30" />
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-5 p-5 rounded-2xl bg-[#0d000d] border border-white/5 transition-all active:scale-[0.98] active:bg-secondary/10 group`}
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/20 text-secondary shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-black text-white uppercase tracking-[0.2em]">{item.label}</span>
                    <ChevronRight className="h-5 w-5 ml-auto text-secondary/30" />
                  </button>
                )
              ))}
            </div>

            {/* Learning Hub Button at Bottom */}
            <div className="mt-auto pb-6">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLearningHubOpen(true);
                }}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-[#1a0f02] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(234,179,8,0.3)] active:scale-95 transition-all"
              >
                <Star className="h-5 w-5 fill-red-600" />
                Learning Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
