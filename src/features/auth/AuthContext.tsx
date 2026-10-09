import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserDoc, UserRole } from '@/types';

interface AuthContextValue {
  user: User | null;
  userDoc: UserDoc | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
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
            setUserDoc({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || (resolvedRole === 'trainer' ? 'Coach Marcus' : 'Alex Mercer'),
              role: resolvedRole,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error('[FitSphere Auth] Error fetching role/user doc:', err);
          // Fallback based on email if offline/error
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

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserDoc(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, userDoc, role, loading, login, logout }}>
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
