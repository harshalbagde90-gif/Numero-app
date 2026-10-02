import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { postNumGuru } from '@/lib/numguruApi';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Tag, Sparkles, CreditCard, Lock, User, Mail, Phone } from 'lucide-react';

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayWindow = Window & {
  Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
};

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

interface CheckoutModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: (reportToken: string, reportName: string) => void;
  readingName: string;
  readingDob: Date | null;
  leadId?: string | null;
}

export function CheckoutModal({ isOpen, setIsOpen, onSuccess, readingName, readingDob, leadId }: CheckoutModalProps) {
  const [promoCode, setPromoCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // User Data State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isOpen && readingName) setName(readingName);
  }, [isOpen, readingName]);

  const validateForm = () => {
    if (!name || !email || !phone || !readingDob) {
      toast.error('Please enter Name, Email, and WhatsApp Number.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number.');
      return false;
    }
    return true;
  };

  const checkoutDetails = () => ({
    name: name.trim(), email: email.trim(), phone: phone.trim(),
    dob: format(readingDob!, 'yyyy-MM-dd'), leadId,
  });

  const handleApplyPromo = async () => {
    if (!validateForm()) return;
    if (!promoCode.trim()) return;
    setIsVerifying(true);
    try {
      const result = await postNumGuru<{ reportToken: string }>('/api/redeem-promo', {
        ...checkoutDetails(), code: promoCode.trim().toUpperCase(),
      });
      toast.success('Promo code applied!');
      setIsOpen(false);
      onSuccess(result.reportToken, name.trim());
    } catch (error: unknown) {
      toast.error(errorMessage(error, 'Could not apply promo code.'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;
    setIsProcessingPayment(true);
    
    try {
      const order = await postNumGuru<{ orderId: string; amount: number; currency: string; keyId: string }>(
        '/api/create-order', checkoutDetails(),
      );
      const options = {
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'NumGuru',
        description: 'Premium Numerology Report',
        image: '/favicon.png',
        handler: async (response: RazorpayResponse) => {
          localStorage.setItem('numguru_pending_payment', JSON.stringify(response));
          try {
            let verified: { reportToken: string } | undefined;
            for (let attempt = 0; attempt < 4; attempt++) {
              try {
                verified = await postNumGuru<{ reportToken: string }>('/api/verify-payment', { ...response });
                break;
              } catch (error) {
                if (attempt === 3 || !errorMessage(error, '').includes('not captured yet')) throw error;
                await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
              }
            }
            if (!verified) throw new Error('Payment could not be verified.');
            localStorage.removeItem('numguru_pending_payment');
            toast.success('Payment verified!');
            setIsOpen(false);
            onSuccess(verified.reportToken, name.trim());
          } catch (error: unknown) {
            toast.error(`${errorMessage(error, 'Payment verification is pending.')} We will retry when you reopen the site. Payment ID: ${response.razorpay_payment_id}`);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: { name, email, contact: phone },
        theme: { color: '#F59E0B' },
        modal: { ondismiss: () => setIsProcessingPayment(false) },
      };
      const Razorpay = (window as RazorpayWindow).Razorpay;
      if (!Razorpay) throw new Error('Payment window could not load. Please refresh and try again.');
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error: unknown) {
      toast.error(errorMessage(error, 'Payment system is currently unavailable.'));
      setIsProcessingPayment(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[400px] w-[95vw] p-0 overflow-hidden border border-amber-500/20 bg-[#0a0518] shadow-[0_0_50px_rgba(234,179,8,0.15)] rounded-[2rem]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
        </div>
        
        <div className="p-8 relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2">
              <Lock className="h-5 w-5 text-amber-500" />
            </div>
            <DialogTitle className="text-xl font-serif font-black text-white tracking-tight">Unlock Premium</DialogTitle>
            <p className="text-[13px] text-slate-400">Enter your details to access your report after payment.</p>
          </div>

          {/* User Details Form */}
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/50" />
              <input 
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/50" />
              <input 
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/50" />
              <input 
                type="tel"
                placeholder="WhatsApp Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-amber-500/50 uppercase tracking-widest">Select Payment Method</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Promo Code Section */}
          <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="h-3 w-3 text-amber-500" />
              <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Have a Magic Code?</label>
            </div>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="e.g. NUMGURU100"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 uppercase font-mono tracking-wider transition-colors"
              />
              <Button 
                onClick={handleApplyPromo}
                disabled={isVerifying || !promoCode}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg px-4 h-auto text-[13px]"
              >
                {isVerifying ? <Sparkles className="h-4 w-4 animate-spin" /> : 'Apply'}
              </Button>
            </div>
          </div>

          {/* Razorpay Section */}
          <Button
            onClick={handleRazorpayPayment}
            disabled={isProcessingPayment}
            className="w-full h-12 bg-white text-black hover:bg-slate-200 rounded-xl font-black tracking-wide shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            {isProcessingPayment ? "Processing..." : (
              <span className="flex items-center gap-2">
                Pay ₹99 Securely <span className="line-through text-slate-500 font-medium text-sm">₹999</span>
              </span>
            )}
          </Button>
          
          <p className="text-[10px] text-center text-slate-400">
            Details are saved for your order and report. <a href="/privacy-policy" className="underline hover:text-white">Privacy Policy</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
