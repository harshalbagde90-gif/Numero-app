import { useState } from "react";
import { LandingForm } from "@/components/LandingForm";
import { ResultPreview } from "@/components/ResultPreview";
import { generateReading, NumerologyReading } from "@/lib/numerology";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useToast } from "@/hooks/use-toast";

type AppState = "landing" | "preview";

const PRICE = 49; // INR

const Index = () => {
  const [state, setState] = useState<AppState>("landing");
  const [reading, setReading] = useState<NumerologyReading | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { initiatePayment } = useRazorpay();
  const { toast } = useToast();

  const handleFormSubmit = (name: string, dob: Date) => {
    const newReading = generateReading(name, dob);
    setReading(newReading);
    setState("preview");
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
          title: "Payment Failed",
          description: error,
          variant: "destructive",
        });
      }
    );
  };

  if (state === "landing" || !reading) {
    return <LandingForm onSubmit={handleFormSubmit} />;
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
