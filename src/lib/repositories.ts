import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  MembershipDoc,
  UserProfile,
  WorkoutPlan,
  WorkoutAssignment,
  WorkoutSession,
  ProgressEntry,
  NutritionEntry,
  HydrationEntry,
  QuoteItem,
  HealthFactItem,
  ArticleItem,
  FavoriteItem,
  ChallengeItem,
  AchievementItem,
  NotificationItem,
} from '@/types';

// ======================== MEMBERSHIP ========================

export const subscribeMembership = (
  uid: string,
  onUpdate: (membership: MembershipDoc | null) => void
) => {
  const docRef = doc(db, 'memberships', uid);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as MembershipDoc);
      } else {
        onUpdate(null);
      }
    },
    (err) => console.warn('[FitSphere] subscribeMembership notice:', err.message)
  );
};

export const updateMembershipDoc = async (
  uid: string,
  data: Partial<MembershipDoc>
) => {
  const docRef = doc(db, 'memberships', uid);
  await setDoc(
    docRef,
    {
      ...data,
      uid,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

// ======================== USER PROFILE ========================

export const subscribeUserProfile = (
  uid: string,
  onUpdate: (profile: UserProfile | null) => void
) => {
  const docRef = doc(db, 'profiles', uid);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as UserProfile);
      } else {
        onUpdate(null);
      }
    },
    (err) => console.warn('[FitSphere] subscribeUserProfile notice:', err.message)
  );
};

export const updateUserProfileDoc = async (
  uid: string,
  data: Partial<UserProfile>
) => {
  const docRef = doc(db, 'profiles', uid);
  await setDoc(docRef, { ...data, uid, updatedAt: new Date().toISOString() }, { merge: true });
};

// ======================== WORKOUT PLANS ========================

export const subscribeWorkoutPlans = (
  onUpdate: (plans: WorkoutPlan[]) => void
) => {
  const colRef = collection(db, 'workoutPlans');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const plans: WorkoutPlan[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as WorkoutPlan[];
      onUpdate(plans);
    },
    (err) => console.warn('[FitSphere] subscribeWorkoutPlans notice:', err.message)
  );
};

export const saveWorkoutPlan = async (plan: WorkoutPlan) => {
  const docRef = doc(db, 'workoutPlans', plan.id);
  await setDoc(docRef, plan);
};

export const deleteWorkoutPlan = async (planId: string) => {
  await deleteDoc(doc(db, 'workoutPlans', planId));
};

// ======================== ASSIGNMENTS ========================

export const subscribeAssignments = (
  userId: string,
  onUpdate: (assignments: WorkoutAssignment[]) => void
) => {
  const colRef = collection(db, 'assignments');
  const q = query(colRef, where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: WorkoutAssignment[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as WorkoutAssignment[];
      onUpdate(list.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)));
    },
    (err) => console.warn('[FitSphere] subscribeAssignments notice:', err.message)
  );
};

export const saveAssignment = async (assignment: WorkoutAssignment) => {
  const docRef = doc(db, 'assignments', assignment.id);
  await setDoc(docRef, assignment);
};

export const updateAssignmentStatus = async (
  assignmentId: string,
  status: 'scheduled' | 'completed' | 'missed'
) => {
  const docRef = doc(db, 'assignments', assignmentId);
  await updateDoc(docRef, { status });
};

// ======================== SESSIONS ========================

export const subscribeSessions = (
  userId: string,
  onUpdate: (sessions: WorkoutSession[]) => void
) => {
  const colRef = collection(db, 'sessions');
  const q = query(colRef, where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: WorkoutSession[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as WorkoutSession[];
      onUpdate(list.sort((a, b) => b.startedAt.localeCompare(a.startedAt)));
    },
    (err) => console.warn('[FitSphere] subscribeSessions notice:', err.message)
  );
};

export const saveSession = async (session: WorkoutSession) => {
  const docRef = doc(db, 'sessions', session.id);
  await setDoc(docRef, session, { merge: true });
};

// ======================== PROGRESS (WEIGHT & METRICS) ========================

export const subscribeProgress = (
  userId: string,
  onUpdate: (entries: ProgressEntry[]) => void
) => {
  const colRef = collection(db, 'progress');
  const q = query(colRef, where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ProgressEntry[];
      onUpdate(list.sort((a, b) => a.date.localeCompare(b.date)));
    },
    (err) => console.warn('[FitSphere] subscribeProgress notice:', err.message)
  );
};

export const addProgress = async (entry: ProgressEntry) => {
  const docRef = doc(db, 'progress', entry.id);
  await setDoc(docRef, entry);
};

// ======================== NUTRITION ========================

export const subscribeNutrition = (
  userId: string,
  date: string,
  onUpdate: (entries: NutritionEntry[]) => void
) => {
  const colRef = collection(db, 'nutrition');
  const q = query(colRef, where('userId', '==', userId), where('date', '==', date));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as NutritionEntry[];
      onUpdate(list);
    },
    (err) => console.warn('[FitSphere] subscribeNutrition notice:', err.message)
  );
};

export const addNutrition = async (entry: NutritionEntry) => {
  const docRef = doc(db, 'nutrition', entry.id);
  await setDoc(docRef, entry);
};

export const deleteNutrition = async (id: string) => {
  await deleteDoc(doc(db, 'nutrition', id));
};

// ======================== HYDRATION ========================

export const subscribeHydration = (
  userId: string,
  date: string,
  onUpdate: (entries: HydrationEntry[]) => void
) => {
  const colRef = collection(db, 'hydration');
  const q = query(colRef, where('userId', '==', userId), where('date', '==', date));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as HydrationEntry[];
      onUpdate(list);
    },
    (err) => console.warn('[FitSphere] subscribeHydration notice:', err.message)
  );
};

export const addHydration = async (entry: HydrationEntry) => {
  const docRef = doc(db, 'hydration', entry.id);
  await setDoc(docRef, entry);
};

// ======================== QUOTES & HEALTH FACTS ========================

export const subscribeQuotes = (onUpdate: (quotes: QuoteItem[]) => void) => {
  const colRef = collection(db, 'quotes');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as QuoteItem[];
      onUpdate(list);
    },
    (err) => console.warn('[FitSphere] subscribeQuotes notice:', err.message)
  );
};

export const saveQuote = async (quote: QuoteItem) => {
  const docRef = doc(db, 'quotes', quote.id);
  await setDoc(docRef, quote);
};

export const deleteQuote = async (id: string) => {
  await deleteDoc(doc(db, 'quotes', id));
};

export const subscribeHealthFacts = (onUpdate: (facts: HealthFactItem[]) => void) => {
  const colRef = collection(db, 'healthFacts');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as HealthFactItem[];
      onUpdate(list);
    },
    (err) => console.warn('[FitSphere] subscribeHealthFacts notice:', err.message)
  );
};

export const saveHealthFact = async (fact: HealthFactItem) => {
  const docRef = doc(db, 'healthFacts', fact.id);
  await setDoc(docRef, fact);
};

export const deleteHealthFact = async (id: string) => {
  await deleteDoc(doc(db, 'healthFacts', id));
};

// ======================== ARTICLES & CHALLENGES ========================

export const subscribeArticles = (onUpdate: (articles: ArticleItem[]) => void) => {
  const colRef = collection(db, 'articles');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as ArticleItem[];
      onUpdate(list);
    },
    (err) => console.warn('[FitSphere] subscribeArticles notice:', err.message)
  );
};

export const subscribeChallenges = (onUpdate: (challenges: ChallengeItem[]) => void) => {
  const colRef = collection(db, 'challenges');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as ChallengeItem[];
      onUpdate(list);
    },
    (err) => console.warn('[FitSphere] subscribeChallenges notice:', err.message)
  );
};

// ======================== FAVORITES ========================

export const subscribeFavorites = (
  uid: string,
  onUpdate: (favorites: FavoriteItem[]) => void
) => {
  const colRef = collection(db, `favorites/${uid}/items`);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as FavoriteItem[];
      onUpdate(list.sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
    },
    (err) => console.warn('[FitSphere] subscribeFavorites notice:', err.message)
  );
};

export const addFavorite = async (uid: string, item: FavoriteItem) => {
  const docRef = doc(db, `favorites/${uid}/items`, item.id);
  await setDoc(docRef, item);
};

export const removeFavorite = async (uid: string, id: string) => {
  await deleteDoc(doc(db, `favorites/${uid}/items`, id));
};
