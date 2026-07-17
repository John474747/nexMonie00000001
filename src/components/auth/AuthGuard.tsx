"use client"

import React from 'react'
import { isFirebaseConfigured } from '@/firebase/config'
import { NexLogo } from '@/components/ui/NexLogo'
import { ShieldCheck } from 'lucide-react'

/**
 * AuthGuard - Modified to remove sign-in requirements.
 * Now acts only as a configuration check for the Firebase SDK.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Handle Unconfigured Firebase
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9] p-8">
        <div className="max-w-md w-full text-center">
          <NexLogo className="mb-8 justify-center" />
          <div className="bg-white p-8 rounded-[32px] shadow-nex-soft border border-gray-100">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-nex-h3 font-bold text-[#1A1A1A] mb-2">Configuration Required</h1>
            <p className="text-nex-caption text-gray-500 mb-6 leading-relaxed">
              To launch the Elite Command Center, please provide your Firebase API keys in the environment settings.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // All routes are now public by default
  return <>{children}</>
}
