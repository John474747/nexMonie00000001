"use client"

import React from 'react'
import { useUtilityLauncher } from '@/hooks/use-utility-launcher'
import { cn } from '@/lib/utils'

interface UtilityLauncherProps {
  serviceId: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const UtilityLauncher = ({ serviceId, children, className, onClick }: UtilityLauncherProps) => {
  const { launchUtility } = useUtilityLauncher()

  const handleClick = () => {
    if (onClick) {
        onClick()
    } else {
        launchUtility(serviceId)
    }
  }

  return (
    <div 
      onClick={handleClick}
      className={cn("cursor-pointer transition-transform active:scale-90", className)}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  )
}
