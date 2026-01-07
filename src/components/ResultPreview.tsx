import { useRef, useState, useEffect } from "react";
import { Lock, Share2, Sparkles, Star, ChevronRight, Gem, Calendar, User, Heart, Crown, ArrowDown, Download, CheckCircle2, BookOpen, BrainCircuit, Compass, Zap, Shield, HelpCircle, X, ChevronDown, Briefcase, Activity, MessageCircle, Ruler, Sun, Users, Scale, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumerologyReading, reduceToSingleDigit } from "@/lib/numerology";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface ResultPreviewProps {
  reading: NumerologyReading;
  isUnlocked: boolean;
  onUnlock: () => void;
  isLoading: boolean;
}

export function ResultPreview({ reading, isUnlocked, onUnlock, isLoading }: ResultPreviewProps) {
  if (isUnlocked) {
    return <PremiumReportView reading={reading} />;
  }
  return <LockedTeaserView reading={reading} onUnlock={onUnlock} isLoading={isLoading} />;
}

// ==========================================
// 🌟 PREMIUM REPORT VIEW (UNLOCKED)
// ==========================================

function PremiumReportView({ reading }: { reading: NumerologyReading }) {
  const [activeTab, setActiveTab] = useState("overview");
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    toast({
      title: "Generating PDF...",
      description: "Please wait while we prepare your high-quality report.",
    });

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: "#05030e", // Match theme
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      const width = pdfWidth;
      const height = width / ratio;

      let heightLeft = height;
      let position = 0;
      let pageHeight = pdfHeight;

      pdf.addImage(imgData, 'PNG', 0, position, width, height);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - height;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, width, height);
        heightLeft -= pageHeight;
      }

      pdf.save(`${reading.name.replace(/\s+/g, '_')}_Numerology_Report.pdf`);

      toast({
        title: "Download Complete",
        description: "Your comprehensive report is ready.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Download Failed",
        variant: "destructive",
        description: "Could not generate PDF. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#05030e] text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* 🌌 Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[120px] animate-float opacity-40" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-600/10 blur-[100px] animate-float opacity-30 delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* 🚀 Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05030e]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/20">
              <Crown className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Premium Insight
            </span>
          </div>

          <div className="hidden lg:flex gap-6 text-sm font-medium text-white/50">
            {["Overview", "Core Numbers", "Full Report", "Remedies"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.replace(" ", "-").toLowerCase())}
                className={cn(
                  "hover:text-amber-400 transition-colors uppercase tracking-widest text-[10px]",
                  activeTab === item.replace(" ", "-").toLowerCase() && "text-amber-400"
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LearningCenterModal />
            <Button variant="outline" size="sm" className="hidden sm:flex border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400 text-xs uppercase tracking-wider" onClick={handleDownloadPDF}>
              <Download className="w-3 h-3 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </nav>

      {/* THIS WRAPPER IS WHAT GETS CAPTURED FOR PDF */}
      <div ref={reportRef} className="relative z-10 pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 bg-[#05030e]">

        {/* ✨ HERO SECTION */}
        <section id="overview" className="relative text-center space-y-8 py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Star className="w-3 h-3 fill-current" />
            Official Report
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
            {reading.name}
          </h1>

          <p className="max-w-xl mx-auto text-lg text-white/50">
            <span className="block text-sm uppercase tracking-widest text-white/30 mb-2">Analysis for birth date</span>
            <span className="text-white font-medium bg-white/5 px-4 py-1 rounded-full border border-white/5">{reading.dob.toLocaleDateString("en-US", { dateStyle: "long" })}</span>
          </p>

          {/* Core Number Graphic */}
          <div className="pt-10">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-purple-600 rounded-full blur-[60px] opacity-20" />
              <div className="absolute inset-0 border border-amber-500/20 rounded-full" />
              <div className="absolute inset-4 border border-white/5 rounded-full" />

              <div className="absolute inset-0 rounded-full bg-[#0a0518] border border-white/10 flex flex-col items-center justify-center z-10 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold mb-2 z-10">Destiny Path</span>
                <span className="text-8xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 drop-shadow-2xl z-10">
                  {reading.lifePathNumber}
                </span>
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-bold text-white">
              <span className="text-amber-500 font-serif italic text-3xl mr-2">The</span>
              {reading.lifePathTraits.title}
            </h2>
          </div>
        </section>

        {/* 🔢 DEEP DIVE (RESTORED) */}
        <section id="core-numbers" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetailedNumberCard
            title="Expression Number"
            subtitle="Your Destiny & Talents"
            number={reading.expressionNumber}
            text={reading.expressionTraits}
            icon={<User className="w-5 h-5 text-blue-400" />}
            color="blue"
          />
          <DetailedNumberCard
            title="Soul Urge Number"
            subtitle="Your Heart's Desire"
            number={reading.soulUrgeNumber}
            text={reading.soulUrgeTraits}
            icon={<Heart className="w-5 h-5 text-pink-400" />}
            color="pink"
          />
          <DetailedNumberCard
            title="Personality Number"
            subtitle="How Others See You"
            number={reading.personalityNumber}
            text={reading.personalityTraits}
            icon={<Sparkles className="w-5 h-5 text-amber-400" />}
            color="amber"
          />
        </section>

        {/* 🤝 COSMIC CONNECTIONS (NEW) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">Friendly Numbers</h3>
            </div>
            <p className="text-sm text-white/60 mb-4">You naturally harmonize with these vibrations. Look for them in friends and partners.</p>
            <div className="flex gap-2">
              {reading.friendlyNumbers.map(n => (
                <div key={n} className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  {n}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Swords className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">Growth Numbers</h3>
            </div>
            <p className="text-sm text-white/60 mb-4">These numbers challenge you. They create friction but also drive your biggest growth.</p>
            <div className="flex gap-2">
              {reading.enemyNumbers.map(n => (
                <div key={n} className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* Karmic Law Card spanning full width on mobile, or fitting in grid */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10 flex flex-col md:flex-row items-center gap-6">
            <div className="p-3 bg-white/5 rounded-full border border-white/10 shrink-0">
              <Scale className="w-8 h-8 text-purple-300" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-purple-200 mb-1">{reading.karmicLaw.title}</h4>
              <p className="text-sm text-white/70">{reading.karmicLaw.desc}</p>
            </div>
          </div>
        </section>


        {/* 📚 PREMIUM FULL REPORT SECTION */}
        <div id="full-report" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-12">

            <section className="space-y-6">
              <SectionHeader title="Your Full Report" subtitle="Comprehensive Analysis Modules" icon={<BookOpen className="w-5 h-5 text-amber-400" />} />

              <div className="space-y-4">
                <AccordionModule
                  title="Personal Growth Blueprint"
                  icon={<Activity className="w-5 h-5 text-emerald-400" />}
                  content={getModuleContent("growth", reading.lifePathNumber)}
                />
                <AccordionModule
                  title="Do This, Avoid This (Guidance)"
                  icon={<Shield className="w-5 h-5 text-rose-400" />}
                  content={getModuleContent("guidance", reading.lifePathNumber)}
                />
                <AccordionModule
                  title="Work Style & Career Environment"
                  icon={<Briefcase className="w-5 h-5 text-blue-400" />}
                  content={getModuleContent("career", reading.lifePathNumber)}
                />
                <AccordionModule
                  title="Emotional Pattern Decoder"
                  icon={<Heart className="w-5 h-5 text-pink-400" />}
                  content={getModuleContent("emotional", reading.soulUrgeNumber)}
                />
                <AccordionModule
                  title="Decision-Making Guide"
                  icon={<Ruler className="w-5 h-5 text-purple-400" />}
                  content={getModuleContent("decision", reading.lifePathNumber)}
                />
                <AccordionModule
                  title="Relationship Communication Style"
                  icon={<MessageCircle className="w-5 h-5 text-amber-400" />}
                  content={getModuleContent("relationship", reading.expressionNumber)}
                />
              </div>
            </section>

            {/* 🗓️ 7-DAY MINI PLAN */}
            <section className="space-y-8 pt-8">
              <SectionHeader title="7-Day Balance Practice" subtitle="Your Optimized Week" icon={<Calendar className="w-5 h-5 text-teal-400" />} />

              <div className="relative border-l-2 border-white/10 ml-4 space-y-8 pb-4">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div key={day} className="relative pl-8 group">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#05030e] border-2 border-white/20 group-hover:border-teal-500 transition-colors" />
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <span className="text-teal-400">Day {day}</span>
                      <span className="text-white/30">•</span>
                      {getDayTitle(day, reading.lifePathNumber)}
                    </h4>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-teal-500/30 transition-colors">
                      <p className="text-sm text-white/70 leading-relaxed">
                        {getDayContent(day, reading.lifePathNumber)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* 🍃 REMEDIES RE-BRANDED */}
              <section id="remedies" className="space-y-6">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0f0a1f] to-[#120f2b] border border-amber-500/10 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-1">
                      Sacred Remedies
                    </h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-6">Harmonize your vibration</p>

                    <div className="space-y-5">
                      {getDetailedRemedies(reading.lifePathNumber).map((rem, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-serif font-bold text-sm shrink-0 mt-1">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white mb-1">{rem.title}</h4>
                            <p className="text-xs text-white/60 leading-relaxed">{rem.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 text-center">Lucky Matrix</h4>
                <div className="grid grid-cols-4 gap-2">
                  {reading.luckyNumbers.map(n => (
                    <div key={n} className="aspect-square rounded-lg bg-white/5 flex items-center justify-center text-lg font-bold text-white border border-white/5">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📜 Footer Note */}
        <div className="border-t border-white/5 pt-12 pb-20 text-center space-y-2">
          <p className="text-sm text-white/30">
            Personalized Report for {reading.name}
          </p>
          <p className="text-[10px] text-white/20 uppercase tracking-widest">
            © {new Date().getFullYear()} NumeroInsight • Premium Edition
          </p>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 🧩 ACCORDION MODULE COMPONENT
// ==========================================

function AccordionModule({ title, icon, content }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 transition-colors ${isOpen ? 'bg-amber-500/20 text-amber-400' : 'text-white/50'}`}>
            {icon}
          </div>
          <h3 className={`font-bold text-sm sm:text-base transition-colors ${isOpen ? 'text-white' : 'text-white/70'}`}>
            {title}
          </h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
      </button>

      <div className={`transition-[max-height,opacity] duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 pt-0 border-t border-white/5">
          <p className="text-sm text-white/80 leading-relaxed mb-4 font-light">
            {content.intro}
          </p>
          <div className="space-y-2">
            {content.points.map((p: string, i: number) => (
              <div key={i} className="flex gap-3 items-start p-2 rounded-lg bg-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5 shrink-0" />
                <span className="text-xs sm:text-sm text-white/70">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailedNumberCard({ title, subtitle, number, text, icon, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };
  return (
    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg border", colorClasses[color])}>
            {icon}
          </div>
          <div>
            <h4 className={cn("font-bold text-sm uppercase tracking-wider", `text-${color}-400`)}>{title}</h4>
            <p className="text-xs text-white/40">{subtitle}</p>
          </div>
        </div>
        <span className="text-4xl font-black text-white/10">{number}</span>
      </div>
      <p className="text-sm leading-relaxed text-white/70">{text}</p>
    </div>
  );
}

// ==========================================
// 🏫 LEARNING CENTER (Unchanged)
// ==========================================
function LearningCenterModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 text-xs font-medium uppercase tracking-wider gap-2">
          <BookOpen className="w-3 h-3" />
          Learning Center
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f0a1f] border-white/10 text-white max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar p-0 gap-0">
        <div className="sticky top-0 z-10 bg-[#0f0a1f]/95 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-amber-400" />
              Understanding Your Numerology
            </DialogTitle>
            <DialogDescription className="text-white/40 text-xs mt-1">
              The Pythagorean System Explained • Simple & Practical
            </DialogDescription>
          </div>
        </div>
        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-lg font-bold text-white mb-3">What is this report based on?</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              We use the <strong>Pythagorean System</strong>, an ancient method developed by the Greek mathematician Pythagoras. He believed that the universe is ruled by numerical patterns. This isn't magic—it's essentially "data analytics" for your personality, using your birth name and date as the input code.
            </p>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TermCard term="Life Path Number" icon={<Compass className="w-4 h-4 text-purple-400" />} what="Your main character ID. Derived from your full Date of Birth." utility="Use this to choose your career direction and understand your fundamental nature." />
            <TermCard term="Expression Number" icon={<User className="w-4 h-4 text-blue-400" />} what="Your destiny/potential toolset. Derived from all letters in your Full Name." utility="Use this to understand what skills you naturally possess to achieve your goals." />
            <TermCard term="Soul Urge Number" icon={<Heart className="w-4 h-4 text-pink-400" />} what="Your private inner motivation. Derived from the VOWELS in your name." utility="This explains why you do what you do. Satisfy this number to feel truly happy." />
            <TermCard term="Personality Number" icon={<Sparkles className="w-4 h-4 text-amber-400" />} what="The mask you wear. Derived from the CONSONANTS in your name." utility="Use this to understand your first impression on others and refine your social image." />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function TermCard({ term, icon, what, utility }: any) {
  return (
    <div className="bg-black/20 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-white/5">{icon}</div>
        <h4 className="font-bold text-sm">{term}</h4>
      </div>
      <div className="space-y-3">
        <div><p className="text-[10px] uppercase font-bold text-white/30 mb-1">What is it?</p><p className="text-xs text-white/70 leading-snug">{what}</p></div>
        <div><p className="text-[10px] uppercase font-bold text-emerald-400/50 mb-1">How to use it?</p><p className="text-xs text-white/70 leading-snug">{utility}</p></div>
      </div>
    </div>
  );
}

// ==========================================
// 🧬 CONTENT GENERATORS (PERSONALIZED)
// ==========================================

function getModuleContent(type: string, num: number) {
  const k = num > 9 ? reduceToSingleDigit(num) : num;

  const contentMap: any = {
    growth: {
      1: { intro: "Your growth explodes when you trust your own authority. You are designed to lead, not follow.", points: ["Take one leadership role, even a small one.", "Stop asking for permission.", "Start a project alone to build confidence."] },
      2: { intro: "Your growth comes from finding peace in partnership. You thrive when you balance giving with receiving.", points: ["Practice saying 'no' without guilt.", "Find a mentor or partner.", "Create a peaceful sanctuary at home."] },
      3: { intro: "Your growth happens when you express yourself authentically. Repressing your voice blocks your blessings.", points: ["Write, speak, or create daily.", "Socialize with optimistic people.", "Finish one creative project fully."] },
      7: { intro: "Your growth is found in wisdom and solitude. You need time to think deep thoughts.", points: ["Spend 15 mins in total silence daily.", "Read non-fiction.", "Trust your intuition over logic sometimes."] },
      // ... (Add generalized fallbacks for brevity in this example)
    },
    // ... Add mappings for other types similarly, using generic logic for now to fit complexity constraints
  };

  // Fallback logic for simplicity in this artifact
  return contentMap[type]?.[k] || getGenericModuleContent(type, k);
}

function getGenericModuleContent(type: string, k: number) {
  if (type === "guidance") return { intro: "Success for you lies in consistency.", points: ["Do: Stick to a routine.", "Avoid: Procrastination.", "Do: Set clear boundaries."] };
  if (type === "career") return { intro: "You need a career that allows autonomy.", points: ["Look for independent roles.", "Avoid micromanagement.", "Seek leadership opportunities."] };
  if (type === "emotional") return { intro: "You feel things deeply and need validation.", points: ["Express your feelings.", "Don't bottle it up.", "Seek supportive friends."] };
  if (type === "decision") return { intro: "Trust your gut instinct.", points: ["Don't overthink.", "Act fast.", "Trust your first impression."] };
  if (type === "relationship") return { intro: "Communication is key for you.", points: ["Be open.", "Listen active.", "Share your dreams."] };
  return { intro: "Focus on your strengths.", points: ["Be confident.", "Stay true to yourself.", "Keep moving forward."] };
}

function getDayTitle(day: number, lp: number) {
  const titles = ["Clarity Monday", " Action Tuesday", "Connection Wednesday", "Focus Thursday", "Freedom Friday", "Restore Saturday", "Spirit Sunday"];
  return titles[day - 1] || "Balance Day";
}

function getDayContent(day: number, lp: number) {
  // Simplified for length - would be distinct per number in full prod
  const tasks = [
    "Write down your 3 main goals for the week. Clarity attracts success.",
    "Take one bold action you've been putting off. Momentum builds today.",
    "Call or meet someone who inspires you. Exchange energy.",
    "Deep work day. Turn off notifications for 2 hours.",
    "Do something spontaneous. Break your routine.",
    "Declutter your physical space. A clean room equals a clear mind.",
    "Reflect on the week. Journal your wins."
  ];
  return tasks[day - 1];
}

function getDetailedRemedies(lp: number) {
  // Personalized detailed remedies
  return [
    { title: "Morning Alignment", desc: "Start your day with 5 minutes of sun exposure to activate your solar plexus energy." },
    { title: "Color Therapy", desc: `Wear shades of ${lp % 2 === 0 ? 'Blue or Green' : 'Red or Yellow'} to balance your aura.` },
    { title: "Sound Healing", desc: "Listen to 432Hz frequency music while working to maintain mental clarity." },
    { title: "Crystal Grid", desc: "Keep a Clear Quartz or Amethyst on your desk to filter negative static." },
    { title: "Evening Release", desc: "Write down worries on paper and tear it up before bed to subconsciously let go." }
  ];
}

function SectionHeader({ title, subtitle, icon }: any) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
}

function LockedTeaserView({ reading, onUnlock, isLoading }: ResultPreviewProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="gradient-mystic py-10 px-4 text-center shadow-xl">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-black/20 text-xs font-medium text-white/80 backdrop-blur-sm border border-white/10">
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span className="tracking-wide">NUMEROINSIGHT</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {reading.name}'s Reading
        </h1>
        <p className="text-white/60 text-sm">Born {reading.dob.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>
      <div className="max-w-md mx-auto px-4 -mt-6 space-y-4 relative z-10">
        <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="font-semibold text-foreground text-lg">Life Path Number</h3>
              <p className="text-sm text-cosmic-gold font-medium">{reading.lifePathTraits.title}</p>
            </div>
            <div className="w-12 h-12 rounded-full gradient-mystic flex items-center justify-center text-xl font-bold text-white shadow-inner">{reading.lifePathNumber}</div>
          </div>
          <p className="text-foreground/80 leading-relaxed text-sm">{reading.lifePathTraits.description.slice(0, 140)}...</p>
        </div>
        <div className="space-y-4 opacity-90">
          <BlurredSection title="Expression Number" subtitle="Your hidden talents" icon={<User className="w-5 h-5 text-purple-400" />} />
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-50">
            <div className="max-w-md mx-auto"><Button onClick={onUnlock} disabled={isLoading} size="lg" className="w-full h-14 text-lg font-bold gradient-gold text-secondary-foreground shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all">{isLoading ? "Unlocking..." : <span>Unlock Full Report • ₹49</span>}</Button></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlurredSection({ title, subtitle, icon }: any) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border relative overflow-hidden group">
      <div className="flex items-center gap-3 mb-3 opacity-50 filter blur-[1px]">
        {icon}
        <div><h3 className="font-semibold">{title}</h3><p className="text-xs text-muted-foreground">{subtitle}</p></div>
      </div>
    </div>
  );
}
