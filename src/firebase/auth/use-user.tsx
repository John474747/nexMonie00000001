'use client';

import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '@/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

/**
 * useUser - Hook to track the current Firebase auth session.
 * Modified for Zero-Auth: Always returns a default guest identity to keep the UI functional.
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Return a consistent mock user if no real user is signed in
  // This allows Firestore hooks to fetch data based on a fixed 'demo-user' ID
  const activeUser = user || ({
    uid: 'demo-user-elite',
    displayName: 'Elite Member',
    email: 'guest@nexmonie.com',
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    providerId: 'firebase',
  } as unknown as User);

  return { user: activeUser, loading: false };
}
