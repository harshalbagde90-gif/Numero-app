import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Star, Users } from "lucide-react";

interface LandingFormProps {
  onSubmit: (name: string, dob: Date) => void;
}

export function LandingForm({ onSubmit }: LandingFormProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && dob) {
      onSubmit(name.trim(), new Date(dob));
    }
  };

  return (
    <div className="min-h-screen gradient-mystic flex flex-col items-center justify-center px-4 py-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-cosmic-gold rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-cosmic-gold rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-cosmic-gold rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </div>

      {/* Logo/Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-cosmic-gold" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            NumeroInsight
          </h1>
        </div>
        <p className="text-primary-foreground/80 text-lg max-w-md">
          Discover your personality, lucky numbers & colors through the ancient science of numerology
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md glass-card rounded-2xl p-6 md:p-8 shadow-2xl relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              Your Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 text-lg bg-background/50 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob" className="text-foreground font-medium">
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              max={new Date().toISOString().split("T")[0]}
              className="h-12 text-lg bg-background/50 border-border focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-semibold gradient-gold text-secondary-foreground hover:opacity-90 transition-opacity"
          >
            <Star className="mr-2 h-5 w-5" />
            Discover Your Numbers
          </Button>
        </form>

        {/* Trust indicators */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-cosmic-gold" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-cosmic-gold">₹49</span>
              <span>Only</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-cosmic-gold" />
              <span>10K+ Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-primary-foreground/60 text-sm text-center max-w-sm relative z-10">
        Based on Pythagorean numerology system. Your data is not stored.
      </p>
    </div>
  );
}
