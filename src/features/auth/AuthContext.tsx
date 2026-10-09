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
  login: (email: string, pass: string) => Promise<UserRole>;
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
  const [userDoc, setUserDoc] = useState<UserDoc | null>(() => {
    try {
      const cached = localStorage.getItem('fitsphere_active_userdoc');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState<UserRole | null>(() => {
    try {
      return (localStorage.getItem('fitsphere_active_role') as UserRole) || null;
    } catch {
      return null;
    }
  });
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
    setUser(firebaseUser);
    setUserDoc(defaultDoc);
    setRole(intendedRole);
    localStorage.setItem('fitsphere_active_role', intendedRole);
    localStorage.setItem('fitsphere_active_userdoc', JSON.stringify(defaultDoc));
    localStorage.setItem('fitsphere_role_' + firebaseUser.uid, intendedRole);
    localStorage.setItem('fitsphere_userdoc_' + firebaseUser.uid, JSON.stringify(defaultDoc));
    setLoading(false);

    // Non-blocking firestore sync with timeout in background
    (async () => {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const snap = await withTimeout(getDoc(userDocRef), 2000).catch(() => null);

        if (snap && snap.exists()) {
          const data = snap.data() as UserDoc;
          effectiveRole = data.role || intendedRole;
          setUserDoc(data);
          setRole(effectiveRole);
          localStorage.setItem('fitsphere_active_role', effectiveRole);
          localStorage.setItem('fitsphere_active_userdoc', JSON.stringify(data));
          localStorage.setItem('fitsphere_role_' + firebaseUser.uid, effectiveRole);
          localStorage.setItem('fitsphere_userdoc_' + firebaseUser.uid, JSON.stringify(data));
        } else {
          await withTimeout(setDoc(userDocRef, defaultDoc, { merge: true }), 2000).catch(() => null);

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
            ).catch(() => null);

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
            ).catch(() => null);
          }
        }
      } catch (err) {
        console.warn('[FitSphere Auth] Background Firestore sync notice:', err);
      }
    })();

    return effectiveRole;
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Resolve role immediately from fast caches and heuristics
        const cachedRole = (localStorage.getItem('fitsphere_role_' + firebaseUser.uid) as UserRole) || null;
        const storedIntended = (localStorage.getItem('fitsphere_intended_role') as UserRole) || null;

        let resolvedRole: UserRole = 'user';
        if (cachedRole === 'trainer' || cachedRole === 'user') {
          resolvedRole = cachedRole;
        } else if (storedIntended === 'trainer' || storedIntended === 'user') {
          resolvedRole = storedIntended;
        } else if (firebaseUser.email?.includes('trainer')) {
          resolvedRole = 'trainer';
        }

        // Retrieve cached doc if available
        let initialDoc: UserDoc | null = null;
        try {
          const cachedDocStr = localStorage.getItem('fitsphere_userdoc_' + firebaseUser.uid);
          if (cachedDocStr) initialDoc = JSON.parse(cachedDocStr);
        } catch {
          // ignore
        }

        if (!initialDoc) {
          initialDoc = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || (resolvedRole === 'trainer' ? 'Coach Marcus' : 'Alex Mercer'),
            role: resolvedRole,
            createdAt: new Date().toISOString(),
            photoURL: firebaseUser.photoURL || undefined,
          };
        }

        // Set immediate role, doc, and unblock the UI instantly with 0 delay
        setUserDoc(initialDoc);
        setRole(resolvedRole);
        localStorage.setItem('fitsphere_active_role', resolvedRole);
        localStorage.setItem('fitsphere_active_userdoc', JSON.stringify(initialDoc));
        localStorage.setItem('fitsphere_role_' + firebaseUser.uid, resolvedRole);
        localStorage.setItem('fitsphere_userdoc_' + firebaseUser.uid, JSON.stringify(initialDoc));
        setLoading(false);

        // Perform background check to ensure custom claims and firestore are in sync
        (async () => {
          try {
            const tokenResult = await withTimeout(firebaseUser.getIdTokenResult(), 2000).catch(() => null);
            const claimRole = tokenResult?.claims?.role as UserRole | undefined;

            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const snap = await withTimeout(getDoc(userDocRef), 2000).catch(() => null);

            let latestRole = resolvedRole;
            if (claimRole === 'trainer' || claimRole === 'user') {
              latestRole = claimRole;
            }

            if (snap && snap.exists()) {
              const data = snap.data() as UserDoc;
              latestRole = data.role || latestRole;
              setUserDoc(data);
              setRole(latestRole);
              localStorage.setItem('fitsphere_active_role', latestRole);
              localStorage.setItem('fitsphere_active_userdoc', JSON.stringify(data));
              localStorage.setItem('fitsphere_role_' + firebaseUser.uid, latestRole);
              localStorage.setItem('fitsphere_userdoc_' + firebaseUser.uid, JSON.stringify(data));
            } else if (snap && !snap.exists()) {
              await withTimeout(setDoc(userDocRef, initialDoc, { merge: true }), 2000).catch(() => null);
            }
          } catch (err) {
            console.warn('[FitSphere Auth] Background verification notice:', err);
          }
        })();
      } else {
        setUserDoc(null);
        setRole(null);
        localStorage.removeItem('fitsphere_active_role');
        localStorage.removeItem('fitsphere_active_userdoc');
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<UserRole> => {
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = credential.user;
      const resolvedRole: UserRole = email.includes('trainer') ? 'trainer' : 'user';

      const initialDoc: UserDoc = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: firebaseUser.displayName || (resolvedRole === 'trainer' ? 'Coach Marcus' : 'Alex Mercer'),
        role: resolvedRole,
        createdAt: new Date().toISOString(),
        photoURL: firebaseUser.photoURL || undefined,
      };

      setUser(firebaseUser);
      setUserDoc(initialDoc);
      setRole(resolvedRole);
      localStorage.setItem('fitsphere_active_role', resolvedRole);
      localStorage.setItem('fitsphere_active_userdoc', JSON.stringify(initialDoc));
      localStorage.setItem('fitsphere_role_' + firebaseUser.uid, resolvedRole);
      localStorage.setItem('fitsphere_userdoc_' + firebaseUser.uid, JSON.stringify(initialDoc));

      return resolvedRole;
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
    if (user) {
      localStorage.removeItem('fitsphere_role_' + user.uid);
      localStorage.removeItem('fitsphere_userdoc_' + user.uid);
    }
    localStorage.removeItem('fitsphere_active_role');
    localStorage.removeItem('fitsphere_active_userdoc');
    localStorage.removeItem('fitsphere_intended_role');
    await signOut(auth);
    setUser(null);
    setUserDoc(null);
    setRole(null);
    setLoading(false);
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
