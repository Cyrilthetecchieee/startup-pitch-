import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAhjcitmu_ol31SZJsvyfC2X_BDWEfl2wE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'fitsphere-e74d5.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'fitsphere-e74d5',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'fitsphere-e74d5.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '852373956334',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:852373956334:web:896c492cc19cd9386175ff',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-G4PLWXW06J',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // analytics not supported in this environment
    });
}

// Connect to emulators only if explicit flag is true
const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';
const authPort = Number(import.meta.env.VITE_EMULATOR_AUTH_PORT) || 9099;
const firestorePort = Number(import.meta.env.VITE_EMULATOR_FIRESTORE_PORT) || 8080;

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

if (useEmulator) {
  initEmulators();
} else {
  console.log(`[FitSphere Firebase] Connected to Live Project: ${firebaseConfig.projectId}`);
}

export { app, auth, db, analytics };
