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
        // Create order via edge function
        const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
          body: { amount, currency },
        });

        if (error || !data?.order_id) {
          throw new Error(error?.message || "Failed to create order");
        }

        const options: RazorpayOptions = {
          key: data.key_id,
          amount: Math.round(amount * 100),
          currency: currency,
          name: "NumGuru",
          description: "Numerology Reading - Full Report",
          order_id: data.order_id,
          handler: async (response) => {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              }
            );

            if (verifyError) {
              onError("Payment verification failed. Please contact support.");
              return;
            }

            onSuccess();
          },
          prefill: {
            name: customerName,
          },
          theme: {
            color: "#6b21a8",
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
