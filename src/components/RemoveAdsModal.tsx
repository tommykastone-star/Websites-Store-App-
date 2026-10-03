import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Ban, 
  Crown,
  AlertCircle
} from 'lucide-react';
import { PaymentInfo } from '../types/ads';

interface RemoveAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RemoveAdsModal: React.FC<RemoveAdsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<PaymentInfo>({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
    zip: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setFormData((prev) => ({ ...prev, cardNumber: parts.join(' ') }));
  };

  // Format MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setFormData((prev) => ({ ...prev, expiry: raw }));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData((prev) => ({ ...prev, cvc: raw }));
  };

  // Detect card brand
  const getCardBrand = (number: string) => {
    const clean = number.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(clean)) return 'MASTERCARD';
    if (/^3[47]/.test(clean)) return 'AMEX';
    if (/^6(?:011|5)/.test(clean)) return 'DISCOVER';
    return 'CARD';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanCard = formData.cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 15) {
      setError('Please enter a valid 16-digit credit card number.');
      return;
    }
    if (!formData.cardName.trim()) {
      setError('Please enter the name on the card.');
      return;
    }
    if (formData.expiry.length < 5) {
      setError('Please enter a valid expiration date (MM/YY).');
      return;
    }
    if (formData.cvc.length < 3) {
      setError('Please enter a valid 3 or 4 digit CVC security code.');
      return;
    }

    setIsProcessing(true);

    // Simulate real credit card processing gateway
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-amber-500/20 via-yellow-500/25 to-amber-500/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/40 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Crown className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Remove Ads Forever
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                  US$ 5.00
                </span>
              </h2>
              <p className="text-xs text-slate-400">One-time payment • Lifetime Ad-Free VIP Pass</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-white">Payment Authorized!</h3>
            <p className="text-xs text-slate-300 max-w-sm">
              Your payment of <strong className="text-amber-400">US$ 5.00</strong> was processed successfully. All ads have been permanently removed from Websites Store App!
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Crown className="w-3.5 h-3.5 fill-amber-300" />
              <span>Lifetime Ad-Free VIP Activated</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs relative z-10">
            {/* Benefit Highlights */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/70 border border-white/5 text-center">
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60">
                <Ban className="w-4 h-4 text-rose-400 mb-1" />
                <span className="text-[10px] font-semibold text-slate-200">No 30s Ads</span>
                <span className="text-[9px] text-slate-400">Instant add sites</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60">
                <Zap className="w-4 h-4 text-cyan-400 mb-1" />
                <span className="text-[10px] font-semibold text-slate-200">No 10s Ads</span>
                <span className="text-[9px] text-slate-400">Instant PWA install</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60">
                <Crown className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-[10px] font-semibold text-slate-200">No Banners</span>
                <span className="text-[9px] text-slate-400">Zero bottom ads</span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Simulated Realistic Credit Card Preview */}
            <div className="p-4 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-white/10 shadow-lg text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold tracking-wider uppercase">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Credit Card</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold tracking-widest">
                  {getCardBrand(formData.cardNumber)}
                </span>
              </div>

              <div className="font-mono text-sm tracking-widest text-slate-200 py-1">
                {formData.cardNumber || '•••• •••• •••• ••••'}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <div>
                  <span className="block uppercase text-[8px] text-slate-500">Cardholder</span>
                  <span className="text-slate-200 font-medium truncate max-w-[150px] block">
                    {formData.cardName || 'YOUR FULL NAME'}
                  </span>
                </div>
                <div>
                  <span className="block uppercase text-[8px] text-slate-500">Expires</span>
                  <span className="text-slate-200 font-medium">
                    {formData.expiry || 'MM/YY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                <span>Card Number</span>
                <span className="text-[10px] text-slate-400">Visa, Mastercard, Amex, Discover</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4000 1234 5678 9010"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs tracking-wider"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Name on Card
              </label>
              <input
                type="text"
                required
                value={formData.cardName}
                onChange={(e) => setFormData((prev) => ({ ...prev, cardName: e.target.value }))}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-1">
                <label className="block text-slate-300 font-medium mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  required
                  value={formData.expiry}
                  onChange={handleExpiryChange}
                  placeholder="12/28"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 font-mono text-center focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-slate-300 font-medium mb-1">
                  CVC / CVV
                </label>
                <input
                  type="password"
                  required
                  value={formData.cvc}
                  onChange={handleCvcChange}
                  placeholder="•••"
                  maxLength={4}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 font-mono text-center focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-slate-300 font-medium mb-1">
                  Postal / ZIP
                </label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData((prev) => ({ ...prev, zip: e.target.value }))}
                  placeholder="90210"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-center focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-400">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <span>One-Time Charge</span>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>Authorizing US$ 5.00 Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pay US$ 5.00 — Remove All Ads</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
