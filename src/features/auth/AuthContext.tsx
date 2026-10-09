import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
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
  loginWithGoogle: (intendedRole?: UserRole) => Promise<UserRole>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // 1. First check custom claims
          const tokenResult = await firebaseUser.getIdTokenResult(true);
          const claimRole = tokenResult.claims.role as UserRole | undefined;

          // 2. Fetch users/{uid} document
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);

          let resolvedRole: UserRole = 'user';
          if (claimRole === 'trainer' || claimRole === 'user') {
            resolvedRole = claimRole;
          } else if (snap.exists()) {
            const data = snap.data() as UserDoc;
            resolvedRole = data.role || (data.email.includes('trainer') ? 'trainer' : 'user');
          } else if (firebaseUser.email?.includes('trainer')) {
            resolvedRole = 'trainer';
          }

          setRole(resolvedRole);

          if (snap.exists()) {
            setUserDoc(snap.data() as UserDoc);
          } else {
            const defaultDoc: UserDoc = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || (resolvedRole === 'trainer' ? 'Coach' : 'Athlete'),
              role: resolvedRole,
              createdAt: new Date().toISOString(),
              photoURL: firebaseUser.photoURL || undefined,
            };
            setUserDoc(defaultDoc);
            // Ensure doc is created in Firestore
            try {
              await setDoc(userDocRef, defaultDoc, { merge: true });
            } catch (err) {
              console.warn('[FitSphere Auth] Non-critical user doc write notice:', err);
            }
          }
        } catch (err) {
          console.error('[FitSphere Auth] Error fetching role/user doc:', err);
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

  const loginWithGoogle = async (intendedRole: UserRole = 'user'): Promise<UserRole> => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(auth, provider);
      const firebaseUser = credential.user;

      // Check if user doc exists
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userDocRef);

      let effectiveRole = intendedRole;
      if (snap.exists()) {
        const data = snap.data() as UserDoc;
        effectiveRole = data.role || intendedRole;
      } else {
        // Create initial user doc
        const newUserDoc: UserDoc = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || (intendedRole === 'trainer' ? 'Coach' : 'Athlete'),
          photoURL: firebaseUser.photoURL || undefined,
          role: intendedRole,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newUserDoc, { merge: true });
        setUserDoc(newUserDoc);

        // If athlete, initialize starter profile and membership
        if (intendedRole === 'user') {
          const profileRef = doc(db, 'profiles', firebaseUser.uid);
          await setDoc(
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
          );

          const membershipRef = doc(db, 'memberships', firebaseUser.uid);
          const today = new Date();
          await setDoc(
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
          );
        }
      }

      setRole(effectiveRole);
      return effectiveRole;
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
