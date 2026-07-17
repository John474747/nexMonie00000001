/**
 * @fileOverview Centralized configuration for nexMonie Utilities.
 * Future-proofed for Founder Dashboard control.
 */

export interface UtilityService {
  id: string;
  name: string;
  category: 'Music' | 'Social' | 'Food' | 'Shop' | 'Travel' | 'Other';
  url: string;
  enabled: boolean;
  requiresExternalBrowser: boolean; // For sites that block iframes/WebViews
}

export const UTILITIES_CONFIG: UtilityService[] = [
  // Music
  { id: 'spotify', name: 'Spotify', category: 'Music', url: 'https://open.spotify.com', enabled: true, requiresExternalBrowser: true },
  { id: 'apple-music', name: 'Apple Music', category: 'Music', url: 'https://music.apple.com', enabled: true, requiresExternalBrowser: true },
  { id: 'audiomack', name: 'Audiomack', category: 'Music', url: 'https://audiomack.com', enabled: true, requiresExternalBrowser: true },
  { id: 'boomplay', name: 'Boomplay', category: 'Music', url: 'https://www.boomplay.com', enabled: true, requiresExternalBrowser: true },

  // Social
  { id: 'x', name: 'X (Twitter)', category: 'Social', url: 'https://x.com', enabled: true, requiresExternalBrowser: true },
  { id: 'telegram', name: 'Telegram', category: 'Social', url: 'https://web.telegram.org', enabled: true, requiresExternalBrowser: true },

  // Food & Transport
  { id: 'chowdeck', name: 'Chowdeck', category: 'Food', url: 'https://chowdeck.com', enabled: true, requiresExternalBrowser: false },
  { id: 'bolt', name: 'Bolt', category: 'Food', url: 'https://bolt.eu', enabled: true, requiresExternalBrowser: false },
  { id: 'indrive', name: 'inDrive', category: 'Food', url: 'https://indrive.com', enabled: true, requiresExternalBrowser: false },
  { id: 'rida', name: 'Rida', category: 'Food', url: 'https://rida.taxi', enabled: true, requiresExternalBrowser: false },

  // Shopping
  { id: 'aliexpress', name: 'AliExpress', category: 'Shop', url: 'https://www.aliexpress.com', enabled: true, requiresExternalBrowser: false },
  { id: 'temu', name: 'Temu', category: 'Shop', url: 'https://www.temu.com', enabled: true, requiresExternalBrowser: false },
  { id: 'amazon', name: 'Amazon', category: 'Shop', url: 'https://www.amazon.com', enabled: true, requiresExternalBrowser: false },
  { id: 'uber', name: 'Uber', category: 'Shop', url: 'https://www.uber.com', enabled: true, requiresExternalBrowser: false },

  // Travel & Productivity
  { id: 'booking', name: 'Booking.com', category: 'Travel', url: 'https://www.booking.com', enabled: true, requiresExternalBrowser: false },
  { id: 'canva', name: 'Canva', category: 'Travel', url: 'https://www.canva.com', enabled: true, requiresExternalBrowser: false },
  { id: 'zoom', name: 'Zoom', category: 'Travel', url: 'https://zoom.us', enabled: true, requiresExternalBrowser: false },
  { id: 'gmail', name: 'Gmail', category: 'Travel', url: 'https://mail.google.com', enabled: true, requiresExternalBrowser: true },
  { id: 'm365', name: 'Microsoft 365', category: 'Travel', url: 'https://www.microsoft.com/microsoft-365', enabled: true, requiresExternalBrowser: false },
];
