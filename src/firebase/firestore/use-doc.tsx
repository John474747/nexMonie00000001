'use client';

import { useEffect, useState } from 'react';
import { getFirebaseDb } from '@/firebase';
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';

/**
 * useDoc - Real-time Cloud Firestore Document Subscriber.
 */
export function useDoc<T = DocumentData>(config: { table: string; id: string } | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!config || !config.id || !db) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, config.table, config.id);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        setData(null);
      }
      setLoading(false);
    }, (err) => {
      console.error(`[Firestore Error] Fetching document from ${config.table}:`, err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [config?.table, config?.id]);

  return { data, loading, error };
}
