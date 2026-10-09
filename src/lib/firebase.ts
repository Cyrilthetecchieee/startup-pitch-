import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-fitsphere-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-fitsphere.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-fitsphere',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-fitsphere.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators if flag is set (default true for local development)
const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR !== 'false';
const authPort = Number(import.meta.env.VITE_EMULATOR_AUTH_PORT) || 9099;
const firestorePort = Number(import.meta.env.VITE_EMULATOR_FIRESTORE_PORT) || 8080;

// Emulator connection state tracking to avoid duplicate connect calls
let emulatorsConnected = false;

export function initEmulators() {
  if (useEmulator && !emulatorsConnected && typeof window !== 'undefined') {
    try {
      connectAuthEmulator(auth, `http://127.0.0.1:${authPort}`, { disableWarnings: true });
      connectFirestoreEmulator(db, '127.0.0.1', firestorePort);
      emulatorsConnected = true;
      console.log(`[FitSphere Firebase] Connected to local emulators: Auth on ${authPort}, Firestore on ${firestorePort}`);
    } catch (e) {
      console.warn('[FitSphere Firebase] Emulator connection notice:', e);
    }
  }
}

// Auto-run emulator connection in dev mode
if (useEmulator) {
  initEmulators();
}

export { app, auth, db };
