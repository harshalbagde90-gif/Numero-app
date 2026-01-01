import { Lock, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumerologyReading } from "@/lib/numerology";

interface ResultPreviewProps {
  reading: NumerologyReading;
  isUnlocked: boolean;
  onUnlock: () => void;
  isLoading: boolean;
}

export function ResultPreview({ reading, isUnlocked, onUnlock, isLoading }: ResultPreviewProps) {
  const handleShare = async () => {
    const shareText = `🔮 My Numerology Reading from NumeroInsight

✨ Life Path Number: ${reading.lifePathNumber} - ${reading.lifePathTraits.title}
🎯 Lucky Numbers: ${reading.luckyNumbers.join(", ")}
🎨 Lucky Color: ${reading.luckyColor.name}

Discover yours at: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Numerology Reading",
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-mystic py-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-cosmic-gold" />
            <span className="text-primary-foreground/80 text-sm">NumeroInsight</span>
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground mb-1">
            {reading.name}'s Reading
          </h1>
          <p className="text-primary-foreground/70 text-sm">
            Born {reading.dob.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Life Path Number - Always visible */}
        <Section
          title="Life Path Number"
          number={reading.lifePathNumber}
          subtitle={reading.lifePathTraits.title}
        >
          <p className="text-foreground">{reading.lifePathTraits.description.slice(0, 100)}...</p>
          <div className={!isUnlocked ? "blur-content" : ""}>
            <p className="text-foreground mt-2">{reading.lifePathTraits.description.slice(100)}</p>
            <div className="mt-4">
              <h4 className="font-semibold text-foreground mb-2">Your Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {reading.lifePathTraits.strengths.map((s) => (
                  <span key={s} className="px-3 py-1 bg-accent rounded-full text-sm text-accent-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-foreground mb-2">Natural Tendencies</h4>
              <ul className="space-y-1">
                {reading.lifePathTraits.tendencies.map((t) => (
                  <li key={t} className="text-muted-foreground text-sm">• {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Expression Number */}
        <Section
          title="Expression Number"
          number={reading.expressionNumber}
          locked={!isUnlocked}
        >
          <p className="text-foreground">{reading.expressionTraits.slice(0, 60)}...</p>
          <div className={!isUnlocked ? "blur-content" : ""}>
            <p className="text-foreground mt-2">{reading.expressionTraits.slice(60)}</p>
          </div>
        </Section>

        {/* Soul Urge Number */}
        <Section
          title="Soul Urge Number"
          number={reading.soulUrgeNumber}
          locked={!isUnlocked}
        >
          <p className="text-foreground">{reading.soulUrgeTraits.slice(0, 50)}...</p>
          <div className={!isUnlocked ? "blur-content" : ""}>
            <p className="text-foreground mt-2">{reading.soulUrgeTraits.slice(50)}</p>
          </div>
        </Section>

        {/* Personality Number */}
        <Section
          title="Personality Number"
          number={reading.personalityNumber}
          locked={!isUnlocked}
        >
          <p className="text-foreground">{reading.personalityTraits.slice(0, 40)}...</p>
          <div className={!isUnlocked ? "blur-content" : ""}>
            <p className="text-foreground mt-2">{reading.personalityTraits.slice(40)}</p>
          </div>
        </Section>

        {/* Lucky Numbers */}
        <Section title="Lucky Numbers" locked={!isUnlocked}>
          <div className="flex gap-3">
            {reading.luckyNumbers.slice(0, 1).map((n) => (
              <div key={n} className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-xl font-bold text-secondary-foreground">
                {n}
              </div>
            ))}
            <div className={!isUnlocked ? "blur-content flex gap-3" : "flex gap-3"}>
              {reading.luckyNumbers.slice(1).map((n) => (
                <div key={n} className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-xl font-bold text-secondary-foreground">
                  {n}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Lucky Color */}
        <Section title="Lucky Color" locked={!isUnlocked}>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full border-2 border-border"
              style={{ backgroundColor: reading.luckyColor.hex }}
            />
            <span className={`text-lg font-medium ${!isUnlocked ? "blur-content" : ""}`}>
              {reading.luckyColor.name}
            </span>
          </div>
        </Section>

        {/* Unlock CTA or Share Button */}
        {!isUnlocked ? (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border">
            <div className="max-w-md mx-auto">
              <Button
                onClick={onUnlock}
                disabled={isLoading}
                size="lg"
                className="w-full h-14 text-lg font-semibold gradient-gold text-secondary-foreground hover:opacity-90"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Unlock Full Report - ₹49
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-2">
                One-time payment • Instant access • Digital product - no refunds
              </p>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-8">
            <Button
              onClick={handleShare}
              size="lg"
              className="w-full h-14 text-lg font-semibold"
              variant="outline"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share Your Reading
            </Button>
          </div>
        )}

        {/* Bottom padding for fixed button */}
        {!isUnlocked && <div className="h-32" />}
      </div>
    </div>
  );
}

function Section({
  title,
  number,
  subtitle,
  locked,
  children,
}: {
  title: string;
  number?: number;
  subtitle?: string;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border relative">
      {locked && (
        <div className="absolute top-4 right-4">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className="flex items-start gap-4 mb-3">
        {number !== undefined && (
          <div className="w-14 h-14 rounded-xl gradient-mystic flex items-center justify-center text-2xl font-bold text-primary-foreground shrink-0">
            {number}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-cosmic-gold font-medium">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
