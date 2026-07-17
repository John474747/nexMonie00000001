'use client';

import React, { useMemo } from 'react';
import { initializeFirebase, auth, db } from './index';
import { FirebaseProvider } from './provider';

/**
 * @fileOverview High-level Firebase Provider for Next.js App Router.
 * Wraps the application with initialized instances.
 */

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const app = useMemo(() => initializeFirebase(), []);

  if (!app || !auth || !db) {
    return <>{children}</>;
  }

  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      {children}
    </FirebaseProvider>
  );
}
