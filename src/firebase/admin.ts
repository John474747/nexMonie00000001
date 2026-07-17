import admin from 'firebase-admin';

/**
 * @fileOverview Firebase Admin SDK Singleton for Server-Side Operations.
 * Used for wallet approvals, balance updates, and identity verification.
 * Employs lazy initialization to prevent crashes on startup/build.
 */

let isInitialized = false;

function getAdminApp() {
  if (isInitialized) {
    return admin;
  }

  if (admin.apps.length > 0) {
    isInitialized = true;
    return admin;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin SDK credentials (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing or incomplete.');
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    isInitialized = true;
    return admin;
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw error;
  }
}

export function getAdminDb() {
  try {
    const app = getAdminApp();
    return app.firestore();
  } catch (e) {
    console.error('Failed to get Firestore Admin instance:', e);
    return null;
  }
}

export function getAdminAuth() {
  try {
    const app = getAdminApp();
    return app.auth();
  } catch (e) {
    console.error('Failed to get Auth Admin instance:', e);
    return null;
  }
}

export function getAdminStorage() {
  try {
    const app = getAdminApp();
    return app.storage();
  } catch (e) {
    console.error('Failed to get Storage Admin instance:', e);
    return null;
  }
}

// Proxied getters for backward compatibility without crashing at module load
export const adminDb = {
  collection: (path: string) => {
    const db = getAdminDb();
    if (!db) {
      throw new Error('Firebase Admin Db is not initialized');
    }
    return db.collection(path);
  }
} as unknown as ReturnType<typeof admin.firestore>;

export const adminAuth = {
  verifyIdToken: (token: string, checkRevoked?: boolean) => {
    const auth = getAdminAuth();
    if (!auth) {
      throw new Error('Firebase Admin Auth is not initialized');
    }
    return auth.verifyIdToken(token, checkRevoked);
  }
} as unknown as ReturnType<typeof admin.auth>;

export const adminStorage = {
  bucket: (name?: string) => {
    const storage = getAdminStorage();
    if (!storage) {
      throw new Error('Firebase Admin Storage is not initialized');
    }
    return storage.bucket(name);
  }
} as unknown as ReturnType<typeof admin.storage>;

export default admin;
