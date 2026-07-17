'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseConfig, isFirebaseConfigured } from "./config";

/**
 * Singleton pattern for Firebase Initialization
 * Prevents "Firebase App already exists" errors and initialization crashes.
 */
let app: FirebaseApp | undefined;

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured) return null;
  try {
    if (!app) {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    }
    return app;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return null;
  }
};

// Required for client-provider.tsx compatibility
export const initializeFirebase = getFirebaseApp;

/**
 * Dynamic Getters
 * Always call these inside functions or hooks to ensure you get a live instance.
 */
export const getFirebaseAuth = (): Auth | null => {
  const appInstance = getFirebaseApp();
  if (!appInstance) return null;
  return getAuth(appInstance);
};

export const getFirebaseDb = (): Firestore | null => {
  const appInstance = getFirebaseApp();
  if (!appInstance) return null;
  return getFirestore(appInstance);
};

export const getFirebaseStorage = (): FirebaseStorage | null => {
  const appInstance = getFirebaseApp();
  if (!appInstance) return null;
  return getStorage(appInstance);
};

// Backwards compatibility for existing imports while migrating to getters
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : null;
export const db = typeof window !== 'undefined' ? getFirebaseDb() : null;
export const storage = typeof window !== 'undefined' ? getFirebaseStorage() : null;

export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';

export default app;
