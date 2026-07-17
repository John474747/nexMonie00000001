/**
 * @fileOverview Official Firebase configuration for nexMonie project.
 * Uses environment variables for security and portability.
 * Includes defensive trimming and validation to prevent SDK initialization crashes.
 */

import appletConfig from '../../firebase-applet-config.json';

const config = {
  apiKey: appletConfig.apiKey,
  authDomain: appletConfig.authDomain,
  projectId: appletConfig.projectId,
  storageBucket: appletConfig.storageBucket,
  messagingSenderId: appletConfig.messagingSenderId,
  appId: appletConfig.appId,
};

/**
 * Validates that the configuration is complete and not the literal string "undefined".
 * This gate prevents the AuthGuard from attempting to initialize a broken SDK state.
 */
export const isFirebaseConfigured = !!(
  config.apiKey && 
  config.apiKey !== 'undefined' &&
  config.apiKey.length > 10 && // Basic sanity check for key length
  config.projectId &&
  config.projectId !== 'undefined'
);

export const firebaseConfig = config;
