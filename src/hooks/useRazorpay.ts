import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = useCallback(
    async (
      amount: number,
      currency: string,
      customerName: string,
      onSuccess: () => void,
      onError: (error: string) => void
    ) => {
      if (!isLoaded) {
        onError("Payment system is loading. Please try again.");
        return;
      }

      try {
        // Create order via Vercel API
        const response = await fetch("/api/create-razorpay-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency }),
        });

        const data = await response.json();

        if (!response.ok || !data?.order_id) {
          throw new Error(data?.error || "Failed to create order");
        }

        const options: RazorpayOptions = {
          key: data.key_id,
          amount: Math.round(amount * 100),
          currency: currency,
          name: "NumGuru",
          description: "Numerology Reading - Full Report",
          order_id: data.order_id,
          handler: async (response) => {
            // Verify payment via Vercel API
            const verifyRes = await fetch("/api/verify-razorpay-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.verified) {
              onError("Payment verification failed. Please contact support.");
              return;
            }

            onSuccess();
          },
          prefill: {
            name: customerName,
          },
          theme: {
            color: "#EAB308",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", () => {
          onError("Payment failed. Please try again.");
        });
        razorpay.open();
      } catch (err) {
        onError(err instanceof Error ? err.message : "Payment initialization failed");
      }
    },
    [isLoaded]
  );

  return { initiatePayment, isLoaded };
}
