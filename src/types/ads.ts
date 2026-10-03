export type AdTriggerReason = 'add_site' | 'install_pwa';

export interface AdCreative {
  id: string;
  sponsor: string;
  tagline: string;
  ctaText: string;
  category: string;
  badge: string;
  color: string;
  accentGradient: string;
  bgGradient: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
  zip: string;
}
