import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Tag, Sparkles, CreditCard, Lock, User, Mail, Phone } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, setIsOpen, onSuccess }: CheckoutModalProps) {
  const [promoCode, setPromoCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // User Data State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const validateForm = () => {
    if (!name || !email || !phone) {
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

  const saveUserData = async (isFree: boolean) => {
    try {
      await supabase.from('users').upsert({
        email,
        name,
        phone,
        status: isFree ? 'premium_free' : 'premium_paid',
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });
    } catch (e) {
      console.log('Error saving user data:', e);
    }
  };

  const handleApplyPromo = async () => {
    if (!validateForm()) return;
    if (!promoCode.trim()) return;
    
    setIsVerifying(true);
    try {
      const code = promoCode.trim().toUpperCase();
      
      // Query the code
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code)
        .single();
        
      // Fallback for hardcoded promo codes if Supabase fails or doesn't have it
      if (error || !data) {
        if (code === 'NUMGURU100' || code === 'NUMGURU50') {
          await saveUserData(true);
          toast.success(`Success! Magic code applied!`);
          setTimeout(() => {
            setIsOpen(false);
            onSuccess();
          }, 1000);
          setIsVerifying(false);
          return;
        }
        
        toast.error('Invalid Promo Code');
        setIsVerifying(false);
        return;
      }
      
      if (data.usage_count >= data.max_uses) {
        toast.error('Sorry, this code has reached its limit of 50 users.');
        setIsVerifying(false);
        return;
      }
      
      // Update usage_count
      const { error: updateError } = await supabase
        .from('promo_codes')
        .update({ usage_count: data.usage_count + 1 })
        .eq('id', data.id);
        
      if (updateError) {
        toast.error('Error applying code. Please try again.');
        setIsVerifying(false);
        return;
      }
      
      await saveUserData(true);
      toast.success(`Success! You are user #${data.usage_count + 1}/${data.max_uses} to claim this!`);
      
      // Mock payment delay
      setTimeout(() => {
        setIsOpen(false);
        onSuccess();
      }, 1000);
      
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;
    setIsProcessingPayment(true);
    
    // Use environment variable for Razorpay Key
    // Fallback test key if missing so UI doesn't break locally
    const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyHere';
    
    if (!RAZORPAY_KEY) {
      toast.error("Payment system configuration missing.");
      setIsProcessingPayment(false);
      return;
    }
    
    const options = {
      key: RAZORPAY_KEY,
      amount: 9900, // 99 INR in paise
      currency: "INR",
      name: "NumGuru",
      description: "Premium Numerology Report",
      image: "/favicon.png",
      handler: async function (response: any) {
        await saveUserData(false);
        toast.success("Payment Successful!");
        setIsOpen(false);
        onSuccess();
        setIsProcessingPayment(false);
      },
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      theme: {
        color: "#F59E0B",
      },
      modal: {
        ondismiss: function() {
          setIsProcessingPayment(false);
        }
      }
    };
    
    try {
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (e) {
      console.error("Razorpay SDK not loaded", e);
      toast.error("Payment system is currently unavailable.");
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
            <p className="text-[13px] text-slate-400">Where should we send your detailed insights?</p>
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
          
          <p className="text-[9px] text-center text-slate-500 uppercase tracking-widest">100% Secure Encrypted Payment</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
