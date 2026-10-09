import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserDoc, UserRole } from '@/types';
import { format, addMonths } from 'date-fns';

interface AuthContextValue {
  user: User | null;
  userDoc: UserDoc | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: (intendedRole?: UserRole, forceRedirect?: boolean) => Promise<UserRole>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Operation timeout')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for redirect result on initial load
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const intendedRole = (localStorage.getItem('fitsphere_intended_role') as UserRole) || 'user';
          localStorage.removeItem('fitsphere_intended_role');
          await syncGoogleUser(result.user, intendedRole);
        }
      })
      .catch((err) => {
        console.warn('[FitSphere Auth] Redirect result notice:', err);
      });
  }, []);

  const syncGoogleUser = async (firebaseUser: User, intendedRole: UserRole): Promise<UserRole> => {
    let effectiveRole = intendedRole;

    // Immediately create local representation so UI renders with zero lag
    const defaultDoc: UserDoc = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || (intendedRole === 'trainer' ? 'Coach' : 'Athlete'),
      photoURL: firebaseUser.photoURL || undefined,
      role: intendedRole,
      createdAt: new Date().toISOString(),
    };
    setUserDoc(defaultDoc);
    setRole(intendedRole);

    // Non-blocking firestore sync with timeout
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const snap = await withTimeout(getDoc(userDocRef), 2000);

      if (snap.exists()) {
        const data = snap.data() as UserDoc;
        effectiveRole = data.role || intendedRole;
        setUserDoc(data);
        setRole(effectiveRole);
      } else {
        await withTimeout(setDoc(userDocRef, defaultDoc, { merge: true }), 2000);

        if (intendedRole === 'user') {
          const profileRef = doc(db, 'profiles', firebaseUser.uid);
          await withTimeout(
            setDoc(
              profileRef,
              {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || 'Athlete',
                email: firebaseUser.email || '',
                age: 28,
                heightCm: 180,
                currentWeightKg: 78,
                targetWeightKg: 75,
                goals: ['Strength & Fitness', 'Consistency'],
                fitnessLevel: 'intermediate',
                notes: 'Welcome to FitSphere! Track your workouts and nutrition daily.',
                waterTargetMl: 3000,
                calorieTarget: 2400,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            ),
            2000
          );

          const membershipRef = doc(db, 'memberships', firebaseUser.uid);
          const today = new Date();
          await withTimeout(
            setDoc(
              membershipRef,
              {
                uid: firebaseUser.uid,
                planType: '3m',
                startDate: format(today, 'yyyy-MM-dd'),
                expiryDate: format(addMonths(today, 3), 'yyyy-MM-dd'),
                updatedBy: firebaseUser.uid,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            ),
            2000
          );
        }
      }
    } catch (err) {
      console.warn('[FitSphere Auth] Firestore sync timed out or offline, continuing with local state:', err);
    }

    return effectiveRole;
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const tokenResult = await withTimeout(firebaseUser.getIdTokenResult(), 2000).catch(() => null);
          const claimRole = tokenResult?.claims?.role as UserRole | undefined;
          const storedIntended = (localStorage.getItem('fitsphere_intended_role') as UserRole) || null;

          let resolvedRole: UserRole = 'user';
          if (claimRole === 'trainer' || claimRole === 'user') {
            resolvedRole = claimRole;
          } else if (storedIntended === 'trainer' || storedIntended === 'user') {
            resolvedRole = storedIntended;
          } else if (firebaseUser.email?.includes('trainer')) {
            resolvedRole = 'trainer';
          }

          // Set immediate role and doc so UI unblocks instantly
          const fallbackDoc: UserDoc = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || (resolvedRole === 'trainer' ? 'Coach Marcus' : 'Alex Mercer'),
            role: resolvedRole,
            createdAt: new Date().toISOString(),
            photoURL: firebaseUser.photoURL || undefined,
          };
          setUserDoc(fallbackDoc);
          setRole(resolvedRole);

          // Asynchronously try fetching or ensuring Firestore doc
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const snap = await withTimeout(getDoc(userDocRef), 2000);
            if (snap.exists()) {
              const data = snap.data() as UserDoc;
              resolvedRole = data.role || resolvedRole;
              setUserDoc(data);
              setRole(resolvedRole);
            } else {
              await withTimeout(setDoc(userDocRef, fallbackDoc, { merge: true }), 2000);
            }
          } catch {
            // Firestore offline or not yet initialized
          }
        } catch (err) {
          console.error('[FitSphere Auth] Error in auth state:', err);
          const email = firebaseUser.email || '';
          const fallbackRole: UserRole = email.includes('trainer') ? 'trainer' : 'user';
          setRole(fallbackRole);
        }
      } else {
        setUserDoc(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (intendedRole: UserRole = 'user', forceRedirect = false): Promise<UserRole> => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      localStorage.setItem('fitsphere_intended_role', intendedRole);

      if (forceRedirect) {
        await signInWithRedirect(auth, provider);
        return intendedRole;
      }

      const credential = await signInWithPopup(auth, provider);
      const resolvedRole = await syncGoogleUser(credential.user, intendedRole);
      return resolvedRole;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserDoc(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, userDoc, role, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
