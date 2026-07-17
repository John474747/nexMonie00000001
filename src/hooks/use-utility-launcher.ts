"use client"

import React from 'react'
import { UTILITIES_CONFIG, UtilityService } from '@/config/utilities-config'

export const useUtilityLauncher = () => {
  const launchUtility = (serviceId: string) => {
    const service = UTILITIES_CONFIG.find(s => s.id === serviceId);
    if (!service || !service.enabled) return;

    // Detect environment (Web vs Capacitor/APK)
    const isCapacitor = (window as any).Capacitor !== undefined;

    if (isCapacitor) {
      // In Capacitor, use the Browser plugin if available, or fall back to window.open
      if (service.requiresExternalBrowser) {
        window.open(service.url, '_system');
      } else {
        // Here we could implement the WebView bridge if needed, 
        // but for now, we use external system browser for simplicity and robustness
        window.open(service.url, '_system');
      }
    } else {
      // Standard Web behavior: open in new tab
      window.open(service.url, '_blank', 'noopener,noreferrer');
    }
  };

  return { launchUtility };
};
