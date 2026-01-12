import React from "react";
import {
  NumerologyReading,
  getCoreAlignmentUseCase,
  getFriendlyGrowthAdvice
} from "@/lib/numerology";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
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
  LogOut
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
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
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

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPDF(true);

    try {
      const element = reportRef.current;

      // Force desktop-style layout for capture to avoid mobile layout shifts in PDF
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#fafaff",
        width: element.offsetWidth,
        height: element.offsetHeight,
        windowWidth: 1280, // Force desktop width for rendering
        onclone: (clonedDoc) => {
          // Fix: html2canvas struggles with background-clip: text
          // We find all gradient text elements in the clone and replace them with solid colors for the PDF
          const gradientTexts = clonedDoc.querySelectorAll('.text-gradient-gold');
          gradientTexts.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.background = 'none';
            htmlEl.style.webkitBackgroundClip = 'initial';
            htmlEl.style.backgroundClip = 'initial';
            htmlEl.style.webkitTextFillColor = 'initial';
            htmlEl.style.color = '#EAB308'; // Solid Amber/Gold
          });

          // Ensure all interactive elements are in a state suitable for printing
          const glassFilters = clonedDoc.querySelectorAll('.glass-morphism, .backdrop-blur-xl');
          glassFilters.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.backdropFilter = 'none';
            htmlEl.style.webkitBackdropFilter = 'none';
            htmlEl.style.background = 'rgba(255, 255, 255, 0.05)';
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Better multi-page logic
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Numerology_Premium_Report_${reading.name}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
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
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <div className={`p-2 w-fit rounded-md bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
              <Icon className={`h-5 w-5 ${colorClass}`} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider mt-2 ${colorClass}`}>
              {label}
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {label === "Expression Number" ? "Your Destiny & Talents" :
                label === "Soul Urge Number" ? "Your Heart's Desire" : "How Others See You"}
            </span>
          </div>
          <span className="text-4xl font-serif text-slate-200 font-bold">{number}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
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
    <AccordionItem value={id} className="border border-white/5 mb-4 bg-[#1a1b2e] rounded-[1.25rem] shadow-lg px-2 hover:shadow-2xl transition-all duration-500 group overflow-hidden hover:border-indigo-500/30 hover:scale-[1.01]">
      <AccordionTrigger className="hover:no-underline py-5 px-4 [&>svg]:text-amber-500 [&>svg]:h-5 [&>svg]:w-5">
        <div className="flex items-center gap-4 text-left">
          <div className={`p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="font-serif text-[17px] md:text-lg text-amber-400 group-hover:text-white transition-colors font-semibold tracking-tight">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 md:px-14 pb-6">
        <div className="space-y-4">
          <p className="text-slate-200 leading-relaxed font-medium opacity-90">{content.para}</p>
          <ul className="grid sm:grid-cols-1 gap-3">
            {content.points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[14px] text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{point}</span>
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
      <AccordionItem value={id} className="border border-white/5 mb-4 bg-[#1a1b2e] rounded-[1.5rem] shadow-xl px-4 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group overflow-hidden hover:-translate-y-1 hover:border-indigo-500/30 relative">
        <AccordionTrigger className="hover:no-underline py-5 group-data-[state=open]:pb-3 [&>svg]:text-amber-400 [&>svg]:h-5 [&>svg]:w-5 transition-colors">
          <div className="flex items-center gap-4 text-left relative z-10">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-500">
              <Icon className="h-5 w-5" />
            </div>
            <span className="font-serif text-[17px] md:text-lg text-amber-400 group-hover:text-white transition-colors font-bold tracking-tight leading-relaxed">{question}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6">
          <div className="pl-1 space-y-6 text-white">
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 to-transparent rounded-full" />
              <p className="pl-5 text-slate-200 leading-relaxed text-[15px] font-medium opacity-90">
                {description}
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 pl-5">
              {subPoints.map((point, idx) => (
                <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-start gap-2.5 group/point hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0 group-hover/point:scale-110 transition-transform" />
                  <span className="text-[10px] leading-tight font-black text-amber-200/90 uppercase tracking-tight">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className="min-h-screen relative font-sans animate-fade-in pb-20 bg-[#fafaff]">
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
      `}</style>

      {/* --- Celestial Frost: Premium Blue & Purple Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-[#f8faff] via-[#f5f3ff] to-[#f6faff]">
        {/* Soft Periwinkle Luminous Veil */}
        <div className="absolute -top-[15%] -left-[10%] w-[70%] h-[70%] bg-[#e0e7ff]/60 rounded-[100%] blur-[130px] mix-blend-multiply animate-flow-1" />

        {/* Ethereal Lavender Luminous Veil */}
        <div className="absolute top-[20%] -right-[10%] w-[65%] h-[65%] bg-[#ede9fe]/70 rounded-[100%] blur-[140px] mix-blend-multiply animate-flow-2" />

        {/* Icy Blue Cosmic Breath */}
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#eef2ff]/50 rounded-[100%] blur-[120px] mix-blend-screen animate-flow-3" />

        {/* Deep Violet Core Glow (Subtle) */}
        <div className="absolute top-[40%] left-[35%] w-[40%] h-[40%] bg-[#c7d2fe]/20 rounded-full blur-[110px] mix-blend-multiply opacity-50" />

        {/* High-End Texture Layers */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/40 opacity-70" />
      </div>

      <div className="relative z-10">

        {/* --- Top Navigation Bar --- */}
        <div className={`sticky top-0 z-50 transition-all duration-500 border-b ${scrolled
          ? "bg-gradient-to-r from-amber-100/40 via-white/60 to-amber-100/40 backdrop-blur-2xl border-white/30 shadow-xl py-2"
          : "bg-gradient-to-r from-amber-50/90 via-white/95 to-amber-50/90 backdrop-blur-xl border-slate-200/50 py-0"
          }`}>
          <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <button
              onClick={onReset}
              className="flex flex-col -space-y-1 hover:opacity-70 transition-opacity text-left active:scale-95 duration-200"
            >
              <span className="font-serif font-black text-lg md:text-xl text-slate-900 tracking-tight">Numerological</span>
              <span className="text-primary font-sans text-[10px] font-black uppercase tracking-[0.3em] drop-shadow-sm">Premium Insight</span>
            </button>

            <div className="hidden md:flex items-center gap-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">

              <a href="#core" className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2">
                <Activity className="h-3 w-3 opacity-60" />
                <span className="tracking-[0.2em] font-black">Core</span>
              </a>
              <a href="#soul" className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-indigo-600 transition-all flex items-center gap-2">
                <VenetianMask className="h-3 w-3 opacity-60" />
                <span className="tracking-[0.2em] font-black">Soul</span>
              </a>
              <a href="#color" className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-600 transition-all flex items-center gap-2">
                <Palette className="h-3 w-3 opacity-60" />
                <span className="tracking-[0.2em] font-black">Color</span>
              </a>
              <a href="#blueprint" className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-600 transition-all flex items-center gap-2">
                <LayoutGrid className="h-3 w-3 opacity-60" />
                <span className="tracking-[0.2em] font-black">Blueprint</span>
              </a>
              <a href="#remedies" className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-600 transition-all flex items-center gap-2">
                <Gem className="h-3 w-3 opacity-60" />
                <span className="tracking-[0.2em] font-black">Remedies</span>
              </a>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              <button
                onClick={() => setIsLearningHubOpen(true)}
                className="relative group px-5 py-2 rounded-full overflow-hidden transition-all duration-300 active:scale-95 animate-shake-glow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-amber-400 blur-md opacity-50 group-hover:opacity-80 group-hover:blur-lg transition-all animate-pulse" />
                <span className="relative z-10 text-white flex items-center gap-2 px-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="tracking-[0.12em] font-black pointer-events-none whitespace-nowrap">Learning Hub</span>
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsShareModalOpen(true)}
                className="hidden sm:flex gap-2 rounded-full bg-slate-900 border-none text-white hover:bg-slate-800 transition-all font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200/50"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>

              <Button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="hidden sm:flex gap-2 rounded-full bg-slate-900 border-none text-white hover:bg-slate-800 transition-all font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200/50 disabled:opacity-50"
              >
                <Download className={`h-3.5 w-3.5 ${isGeneratingPDF ? 'animate-bounce' : ''}`} />
                {isGeneratingPDF ? 'Processing...' : 'PDF'}
              </Button>
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

                      <div className="flex items-center justify-between gap-3">
                        {reading.luckyNumbers.slice(0, 4).map((num, idx) => (
                          <div key={idx} className="group flex-1 relative h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center transition-all duration-500 hover:bg-white/[0.08] hover:border-secondary/40 hover:-translate-y-1">
                            <span className="text-2xl md:text-3xl font-serif font-black text-gradient-gold group-hover:drop-shadow-[0_0_12px_rgba(234,179,8,0.5)] transition-all">
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
              <div className="relative">
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-48 h-48 bg-purple-200/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center gap-5 relative z-10">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-purple-200/40">
                    <Atom className="h-7 w-7 animate-spin-slow" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 leading-tight tracking-tight">
                      Core Alignment <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">& Frequencies</span>
                    </h2>
                    <div className="flex flex-col gap-2">
                      <p className="text-[11px] font-black text-purple-600 uppercase tracking-[0.4em] font-sans">The structural numbers of your ethereal existence</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Psychic Number (Mulank) Rectangle */}
                <div className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] p-6 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <Activity className="h-5 w-5 text-purple-400" />
                    </div>
                    <h4 className="font-serif text-lg text-white">Psychic <span className="text-purple-400/80 font-sans text-xs uppercase ml-1 tracking-widest">Number (Mulank)</span></h4>
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed mb-6">
                    <p className="mb-2 text-purple-300 font-semibold italic">
                      This number means <strong>{getCoreAlignmentUseCase(reading.driverNumber, 'psychic').theme}.</strong>
                    </p>
                    <p className="opacity-90">
                      It means that {getCoreAlignmentUseCase(reading.driverNumber, 'psychic').significance}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-xl font-serif font-black text-purple-900 shadow-lg shadow-purple-500/20">
                      {reading.driverNumber}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400/60">Action Fuel</span>
                  </div>
                </div>

                {/* Expression Number Rectangle */}
                <div className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] p-6 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <Palette className="h-5 w-5 text-blue-400" />
                    </div>
                    <h4 className="font-serif text-lg text-white">Expression <span className="text-blue-400/80 font-sans text-xs uppercase ml-1 tracking-widest">Number</span></h4>
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed mb-6">
                    <p className="mb-2 text-blue-300 font-semibold italic">
                      This number means <strong>{getCoreAlignmentUseCase(reading.expressionNumber, 'expression').theme}.</strong>
                    </p>
                    <p className="opacity-90">
                      It means that {getCoreAlignmentUseCase(reading.expressionNumber, 'expression').significance}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-xl font-serif font-black text-blue-900 shadow-lg shadow-blue-500/20">
                      {reading.expressionNumber}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/60">Vibrational Talent</span>
                  </div>
                </div>

                {/* Soul Urge Rectangle */}
                <div className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] p-6 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <Flame className="h-5 w-5 text-rose-400" />
                    </div>
                    <h4 className="font-serif text-lg text-white">Soul Urge <span className="text-rose-400/80 font-sans text-xs uppercase ml-1 tracking-widest">Number</span></h4>
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed mb-6">
                    <p className="mb-2 text-rose-300 font-semibold italic">
                      This number means <strong>{getCoreAlignmentUseCase(reading.soulUrgeNumber, 'soulUrge').theme}.</strong>
                    </p>
                    <p className="opacity-90">
                      It means that {getCoreAlignmentUseCase(reading.soulUrgeNumber, 'soulUrge').significance}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-xl font-serif font-black text-rose-900 shadow-lg shadow-rose-500/20">
                      {reading.soulUrgeNumber}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400/60">Heart Desire</span>
                  </div>
                </div>

                {/* Personality Rectangle */}
                <div className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] p-6 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <VenetianMask className="h-5 w-5 text-amber-400" />
                    </div>
                    <h4 className="font-serif text-lg text-white">Personality <span className="text-amber-400/80 font-sans text-xs uppercase ml-1 tracking-widest">Number</span></h4>
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed mb-6">
                    <p className="mb-2 text-amber-300 font-semibold italic">
                      This number means <strong>{getCoreAlignmentUseCase(reading.personalityNumber, 'personality').theme}.</strong>
                    </p>
                    <p className="opacity-90">
                      It means that {getCoreAlignmentUseCase(reading.personalityNumber, 'personality').significance}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-xl font-serif font-black text-amber-900 shadow-lg shadow-amber-500/20">
                      {reading.personalityNumber}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/60">Outer Persona</span>
                  </div>
                </div>

                {/* Friendly Numbers Rectangle */}
                <div className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] p-6 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <HeartHandshake className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h4 className="font-serif text-lg text-white">Friendly <span className="text-emerald-400/80 font-sans text-xs uppercase ml-1 tracking-widest">Numbers</span></h4>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed mb-6 font-medium">
                    {getFriendlyGrowthAdvice('friendly', reading.friendlyNumbers)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {reading.friendlyNumbers.slice(0, 4).map((n, i) => (
                      <div key={i} className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-sm font-black text-emerald-900 shadow-md">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Numbers Rectangle */}
                <div className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] p-6 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-slate-500/30 hover:shadow-2xl hover:shadow-slate-500/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20">
                      <Sprout className="h-5 w-5 text-slate-400" />
                    </div>
                    <h4 className="font-serif text-lg text-white">Growth <span className="text-slate-400/80 font-sans text-xs uppercase ml-1 tracking-widest">Numbers</span></h4>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed mb-6 font-medium">
                    {getFriendlyGrowthAdvice('growth', reading.enemyNumbers)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {reading.enemyNumbers.slice(0, 5).map((n, i) => (
                      <div key={i} className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-sm font-black text-slate-900 shadow-md">
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
            <div id="soul" className="space-y-8">
              {/* Deep Insights Title */}
              <div className="space-y-4 relative">
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-200/20 blur-3xl rounded-full pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200/50 hover:scale-110 transition-transform duration-500">
                    <Moon className="h-7 w-7" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-serif font-black text-slate-900 tracking-tight drop-shadow-sm">Deep Soul Analysis</h2>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 relative z-10">
                  <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] font-sans">Personalized Psycho-Numeric Breakdown</p>
                  <div className="hidden md:block h-px w-32 bg-gradient-to-r from-indigo-400/30 to-transparent" />
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
            <div id="color" className="space-y-12 py-12">
              <div className="relative">
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-200/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center gap-5 relative z-10">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200/40">
                    <Palette className="h-7 w-7" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-4xl md:text-6xl font-serif font-black text-slate-900 leading-tight tracking-tight">
                      Color Alchemy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-600">& Vibrational Guidance</span>
                    </h2>
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] font-sans">Harnessing the Frequencies of your Aura</p>
                      <div className="hidden md:block h-px w-24 bg-gradient-to-r from-emerald-400/30 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                {/* Supportive Tones */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-emerald-500/10 pb-6">
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                      <h3 className="text-xl font-serif font-black text-emerald-600 tracking-tight uppercase">Supportive Tones</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 uppercase tracking-tighter font-bold">{reading.colorGuidance.luckyColors.length} Frequencies</Badge>
                  </div>

                  <div className="grid gap-4">
                    {reading.colorGuidance.luckyColors.map((color, idx) => (
                      <Card key={idx} className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10">
                        {/* Dynamic Background Glow */}
                        <div
                          className="absolute -right-10 -top-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                          style={{ backgroundColor: color.hex }}
                        />

                        <div className="h-1.5 w-full" style={{ backgroundColor: color.hex }} />

                        <CardContent className="p-6 flex items-start gap-5">
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" style={{ backgroundColor: color.hex }} />
                            <div className="absolute inset-0 rounded-2xl shadow-inner border border-white/20" />
                          </div>

                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-serif text-lg text-white tracking-tight uppercase">
                                {color.name}
                              </h4>
                            </div>
                            <Badge variant="outline" className="mb-3 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border-emerald-500/20 uppercase tracking-wider">Vibrational Harmony</Badge>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium opacity-90">{color.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Challenging Tones */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-rose-500/10 pb-6">
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                      <h3 className="text-xl font-serif font-black text-rose-600 tracking-tight uppercase">Challenging Tones</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-100 uppercase tracking-tighter font-bold">{reading.colorGuidance.challengingColors.length} Frequencies</Badge>
                  </div>

                  <div className="grid gap-4">
                    {reading.colorGuidance.challengingColors.map((color, idx) => (
                      <Card key={idx} className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-500/10 grayscale-[0.3] hover:grayscale-0">
                        <div className="h-1.5 w-full opacity-60" style={{ backgroundColor: color.hex }} />

                        <CardContent className="p-6 flex items-start gap-5">
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500 saturate-[0.8]" style={{ backgroundColor: color.hex }} />
                            <div className="absolute inset-0 rounded-2xl shadow-inner border border-white/10 ring-1 ring-black/5" />
                          </div>

                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-serif text-lg text-white tracking-tight uppercase opacity-80">
                                {color.name}
                              </h4>
                            </div>
                            <Badge variant="outline" className="mb-3 text-[9px] font-bold text-red-400 bg-red-500/10 border-red-500/20 uppercase tracking-wider">Energy Drain</Badge>
                            <p className="text-sm text-slate-400 leading-relaxed italic opacity-80">{color.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-[#1a1b2e] rounded-[2rem] p-8 border border-white/5 text-white overflow-hidden relative group">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500 blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Compass className="h-8 w-8 animate-spin-slow" />
                    </div>
                    <div className="text-center md:text-left space-y-2">
                      <h4 className="text-2xl font-serif italic text-emerald-400">Atmospheric Strategy</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Use your <strong className="text-white">Supportive Tones</strong> in your direct workspace or as accent pieces in your wardrobe to maintain high-frequency alignment. <strong className="text-white">Challenging Tones</strong> should be minimized in environments where you need to make critical decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Main Content Split --- */}
            <div className="space-y-12" id="blueprint">

              {/* Left Column: Full Report (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="relative mb-8">
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-200/20 blur-3xl rounded-full pointer-events-none" />
                  <div className="flex flex-col md:flex-row md:items-center gap-5 relative z-10">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200/40">
                      <Gem className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 tracking-tight">Your Full Report</h2>
                      <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] font-sans">Comprehensive Analysis Modules</p>
                    </div>
                  </div>
                </div>

                {/* Locked State Overlay Logic */}
                <div className="relative">
                  {!isUnlocked && (
                    <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-start pt-20 text-center rounded-xl border-2 border-dashed border-slate-200">
                      <div className="bg-[#1a1b2e] p-8 rounded-2xl shadow-2xl max-w-md mx-auto text-white space-y-6">
                        <Lock className="h-12 w-12 text-[#d4af37] mx-auto" />
                        <div>
                          <h3 className="text-2xl font-serif mb-2">Save Your Report</h3>
                          <p className="text-slate-300 text-sm">
                            Unlock the detailed analysis of your Growth Blueprint, Career, and Relationships.
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
                        title="Personal Growth Blueprint"
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
                <div className="relative">
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-32 h-32 bg-amber-200/20 blur-3xl rounded-full pointer-events-none" />
                  <div className="flex flex-col md:flex-row md:items-center gap-5 relative z-10">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-200/40">
                      <Flame className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 tracking-tight">Sacred Remedies</h2>
                      <p className="text-[11px] font-black text-amber-600 uppercase tracking-[0.4em] font-sans">Harmonize Your Vibration</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* 1. Daily Habit */}
                  <div className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] p-8 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-amber-500/30">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <h4 className="font-serif text-lg text-amber-400">Daily Habit</h4>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                      {reading.remedies.habit}
                    </p>
                  </div>

                  {/* 2. Power Color */}
                  <div className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] p-8 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-indigo-500/30">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Palette className="h-5 w-5" />
                      </div>
                      <h4 className="font-serif text-lg text-indigo-400">Power Color</h4>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                      Wear <span style={{ color: reading.remedies.color }} className="font-bold border-b border-white/10">{reading.remedies.color}</span> on {reading.remedies.bestDay}s to amplify your aura and attract supportive frequencies.
                    </p>
                  </div>

                  {/* 3. Cosmic Frequency */}
                  <div className="group relative overflow-hidden rounded-[1.5rem] bg-[#1a1b2e] p-8 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-emerald-500/30">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                        <Zap className="h-5 w-5" />
                      </div>
                      <h4 className="font-serif text-lg text-emerald-400">Cosmic Frequency</h4>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                      <span className="font-bold text-emerald-300">"{reading.cosmicFrequency.mantra}"</span> — {reading.cosmicFrequency.instruction}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Footer Actions --- */}
            <div className="pt-20 border-t border-slate-200/50 flex flex-col items-center gap-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-serif text-slate-900 italic">EndOf This Journey?</h4>
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
                <DialogTitle className="text-4xl md:text-5xl font-serif text-slate-900 w-full text-center">The Learning Hub</DialogTitle>
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
              <div className="space-y-6 p-1 md:p-8 rounded-[2.5rem] bg-amber-50 border border-amber-200/50 text-slate-900 relative overflow-hidden shadow-xl">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/40 rounded-full blur-[100px] -ml-32 -mb-32" />
                <div className="relative z-10 space-y-1 text-center md:text-left">
                  <h3 className="text-3xl font-serif text-amber-900 italic">02. The Lucky Matrix Deep Dive</h3>
                  <p className="text-amber-800/70 text-sm max-w-xl">Your personal numeric 'cheat codes' to unlock manifestation.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                  {/* 1. Description Card */}
                  <div className="p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-amber-200/60 shadow-sm">
                    <h4 className="font-serif text-lg text-amber-900 mb-2">What is the Matrix?</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      The Lucky Matrix consists of 4 unique frequencies derived from the intersection of your name and DOB. They act as <strong>Vibrational Magnets</strong>. When you align your environment with these numbers, luck increases.
                    </p>
                  </div>

                  {/* 2. Strategy Card */}
                  <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
                    <h4 className="font-bold text-amber-400 uppercase tracking-widest text-[10px] mb-2">Master Strategy</h4>
                    <p className="text-xs font-serif italic mb-2">"Manifestation is the art of aligning intent with frequency."</p>
                    <p className="text-[10px] text-slate-400"><strong>PRO TIP:</strong> Sign important documents at times or on dates that match your lucky numbers.</p>
                  </div>

                  {/* 3. Full-Width Pillars Card */}
                  <div className="md:col-span-2 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-amber-200/60 shadow-sm">
                    <h4 className="font-serif text-lg text-amber-900 mb-4 text-center md:text-left">The 4 Pillars of Luck</h4>
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
                        <div key={item.id} className="p-4 rounded-xl bg-amber-50/30 border border-amber-100 flex flex-col gap-2 group hover:bg-white hover:shadow-md transition-all duration-300">
                          <div className="flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors">{item.id}</span>
                            <span className="font-bold text-amber-900 text-sm">{item.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-tight">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- PHASE 03: COLOR ALCHEMY SECTION --- */}
              <div className="space-y-8 p-1 md:p-10 rounded-[2.5rem] bg-indigo-50 border border-indigo-200/50 text-slate-900 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 space-y-2 text-center md:text-left">
                  <h3 className="text-3xl font-serif text-indigo-900 italic">03. Color Alchemy & Vibrational Guidance</h3>
                  <p className="text-indigo-800/70 text-sm max-w-xl">Harness the power of visible frequencies to shield your aura and project charisma.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-indigo-200/60 shadow-sm flex flex-col gap-4 group hover:bg-white transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Palette className="h-6 w-6" />
                      </div>
                      <h4 className="font-serif text-lg text-indigo-950">Supportive Tones</h4>
                    </div>
                    <p className="text-sm font-bold text-emerald-700 uppercase tracking-tighter">The "Auric Shield"</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      These are your <strong>Power Frequencies.</strong> Wear them when you need to lead, persuade, or stand out. They act as a vibrational battery that keeps your energy field charged.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-indigo-200/60 shadow-sm flex flex-col gap-4 group hover:bg-white transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <Zap className="h-6 w-6" />
                      </div>
                      <h4 className="font-serif text-lg text-indigo-950">Challenging Tones</h4>
                    </div>
                    <p className="text-sm font-bold text-rose-700 uppercase tracking-tighter">The "Energy Leak"</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      These vibrations clash with your frequency. Avoid them when feeling tired or low, as they can "drain" your aura and make you feel tired.
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
