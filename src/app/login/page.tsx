"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Login Page - Modified to bypass sign-in.
 * Automatically redirects to the home dashboard.
 */
export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center">
      <div className="animate-pulse font-bold text-gray-400 uppercase tracking-widest text-xs">
        Redirecting to Command Center...
      </div>
    </div>
  )
}
