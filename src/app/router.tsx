import React, { useState, useEffect, Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { RequireRole } from '@/features/auth/RequireRole';
import { LoginPage } from '@/features/auth/LoginPage';
import { useAuth } from '@/features/auth/AuthContext';
import { Loader2 } from 'lucide-react';

const PageFallback: React.FC = () => (
  <div className="flex h-64 w-full items-center justify-center text-lime-400">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

// Lazy Loaded Trainer Views
const TrainerDashboard = lazy(() =>
  import('@/features/trainer/TrainerDashboard').then((m) => ({ default: m.TrainerDashboard }))
);
const TrainerUserManagement = lazy(() =>
  import('@/features/trainer/TrainerUserManagement').then((m) => ({ default: m.TrainerUserManagement }))
);
const TrainerAssignments = lazy(() =>
  import('@/features/trainer/TrainerAssignments').then((m) => ({ default: m.TrainerAssignments }))
);
const TrainerMembershipPage = lazy(() =>
  import('@/features/trainer/TrainerMembershipPage').then((m) => ({ default: m.TrainerMembershipPage }))
);
const TrainerProgressReview = lazy(() =>
  import('@/features/trainer/TrainerProgressReview').then((m) => ({ default: m.TrainerProgressReview }))
);
const TrainerContentManager = lazy(() =>
  import('@/features/trainer/TrainerContentManager').then((m) => ({ default: m.TrainerContentManager }))
);
const WorkoutBuilder = lazy(() =>
  import('@/features/workouts/WorkoutBuilder').then((m) => ({ default: m.WorkoutBuilder }))
);

// Lazy Loaded User Views
const UserDashboard = lazy(() =>
  import('@/features/user/UserDashboard').then((m) => ({ default: m.UserDashboard }))
);
const UserWorkoutsPage = lazy(() =>
  import('@/features/user/UserWorkoutsPage').then((m) => ({ default: m.UserWorkoutsPage }))
);
const UserPlannerPage = lazy(() =>
  import('@/features/user/UserPlannerPage').then((m) => ({ default: m.UserPlannerPage }))
);
const UserFavoritesPage = lazy(() =>
  import('@/features/user/UserFavoritesPage').then((m) => ({ default: m.UserFavoritesPage }))
);
const UserSettingsPage = lazy(() =>
  import('@/features/user/UserSettingsPage').then((m) => ({ default: m.UserSettingsPage }))
);
const ProgressTracker = lazy(() =>
  import('@/features/progress/ProgressTracker').then((m) => ({ default: m.ProgressTracker }))
);
const NutritionLogger = lazy(() =>
  import('@/features/nutrition/NutritionLogger').then((m) => ({ default: m.NutritionLogger }))
);
const MembershipCard = lazy(() =>
  import('@/features/membership/MembershipCard').then((m) => ({ default: m.MembershipCard }))
);
const HealthHub = lazy(() =>
  import('@/features/health-hub/HealthHub').then((m) => ({ default: m.HealthHub }))
);

import {
  subscribeWorkoutPlans,
  subscribeMembership,
  subscribeProgress,
  subscribeSessions,
  subscribeNutrition,
  subscribeHydration,
  subscribeArticles,
  subscribeQuotes,
  subscribeHealthFacts,
  subscribeChallenges,
  subscribeUserProfile,
} from '@/lib/repositories';
import {
  WorkoutPlan,
  MembershipDoc,
  ProgressEntry,
  WorkoutSession,
  NutritionEntry,
  HydrationEntry,
  ArticleItem,
  QuoteItem,
  HealthFactItem,
  ChallengeItem,
  UserProfile,
} from '@/types';
import { getTodayDateString } from '@/lib/dates';
import { SEEDED_ARTICLES, SEEDED_QUOTES, SEEDED_HEALTH_FACTS, SEEDED_CHALLENGES } from '@/features/health-hub/contentData';

import { HomePage } from '@/features/home/HomePage';

// Role Root Redirector (used when navigating to /app or protected redirect)
const RootRedirect: React.FC = () => {
  const { role, user, loading } = useAuth();
  if (loading || (user && !role)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-dark-base text-lime-400">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'trainer' ? '/trainer' : '/user'} replace />;
};

// Trainer Workout Builder Container
const TrainerWorkoutBuilderPage: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  useEffect(() => {
    return subscribeWorkoutPlans(setPlans);
  }, []);
  return (
    <Suspense fallback={<PageFallback />}>
      <WorkoutBuilder plans={plans} />
    </Suspense>
  );
};

// User Nutrition Container
const UserNutritionPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'user_demo_uid';
  const [nutrition, setNutrition] = useState<NutritionEntry[]>([]);
  const [hydration, setHydration] = useState<HydrationEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubN = subscribeNutrition(userId, getTodayDateString(), setNutrition);
    const unsubH = subscribeHydration(userId, getTodayDateString(), setHydration);
    const unsubP = subscribeUserProfile(userId, setProfile);
    return () => {
      unsubN();
      unsubH();
      unsubP();
    };
  }, [userId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-white tracking-tight">
        Daily Nutrition & Hydration Logging
      </h2>
      <Suspense fallback={<PageFallback />}>
        <NutritionLogger
          userId={userId}
          nutritionEntries={nutrition}
          hydrationEntries={hydration}
          calorieTarget={profile?.calorieTarget || 2400}
          waterTargetMl={profile?.waterTargetMl || 3000}
        />
      </Suspense>
    </div>
  );
};

// User Progress Container
const UserProgressPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'user_demo_uid';
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubP = subscribeProgress(userId, setProgress);
    const unsubS = subscribeSessions(userId, setSessions);
    const unsubProf = subscribeUserProfile(userId, setProfile);
    return () => {
      unsubP();
      unsubS();
      unsubProf();
    };
  }, [userId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-white tracking-tight">
        Personal Metrics & Progress Trajectory
      </h2>
      <Suspense fallback={<PageFallback />}>
        <ProgressTracker
          userId={userId}
          progressEntries={progress}
          sessions={sessions}
          targetWeightKg={profile?.targetWeightKg || 75}
        />
      </Suspense>
    </div>
  );
};

// User Membership Page
const UserMembershipPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'user_demo_uid';
  const [membership, setMembership] = useState<MembershipDoc | null>(null);

  useEffect(() => {
    return subscribeMembership(userId, setMembership);
  }, [userId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-white tracking-tight">
        My Subscription & Membership Status
      </h2>
      <Suspense fallback={<PageFallback />}>
        <MembershipCard membership={membership} isTrainer={false} />
      </Suspense>
    </div>
  );
};

// User Health Hub Page
const UserHealthHubPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>(SEEDED_ARTICLES);
  const [quotes, setQuotes] = useState<QuoteItem[]>(SEEDED_QUOTES);
  const [healthFacts, setHealthFacts] = useState<HealthFactItem[]>(SEEDED_HEALTH_FACTS);
  const [challenges, setChallenges] = useState<ChallengeItem[]>(SEEDED_CHALLENGES);

  useEffect(() => {
    const unsubA = subscribeArticles((a) => a.length > 0 && setArticles(a));
    const unsubQ = subscribeQuotes((q) => q.length > 0 && setQuotes(q));
    const unsubF = subscribeHealthFacts((f) => f.length > 0 && setHealthFacts(f));
    const unsubC = subscribeChallenges((c) => c.length > 0 && setChallenges(c));
    return () => {
      unsubA();
      unsubQ();
      unsubF();
      unsubC();
    };
  }, []);

  return (
    <Suspense fallback={<PageFallback />}>
      <HealthHub
        articles={articles}
        quotes={quotes}
        healthFacts={healthFacts}
        challenges={challenges}
      />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/app',
    element: <RootRedirect />,
  },
  // Trainer routes
  {
    path: '/trainer',
    element: (
      <RequireAuth>
        <RequireRole role="trainer">
          <AppLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <TrainerDashboard />
          </Suspense>
        ),
      },
      {
        path: 'user-management',
        element: (
          <Suspense fallback={<PageFallback />}>
            <TrainerUserManagement />
          </Suspense>
        ),
      },
      { path: 'workouts', element: <TrainerWorkoutBuilderPage /> },
      {
        path: 'assignments',
        element: (
          <Suspense fallback={<PageFallback />}>
            <TrainerAssignments />
          </Suspense>
        ),
      },
      {
        path: 'membership',
        element: (
          <Suspense fallback={<PageFallback />}>
            <TrainerMembershipPage />
          </Suspense>
        ),
      },
      {
        path: 'progress',
        element: (
          <Suspense fallback={<PageFallback />}>
            <TrainerProgressReview />
          </Suspense>
        ),
      },
      {
        path: 'content',
        element: (
          <Suspense fallback={<PageFallback />}>
            <TrainerContentManager />
          </Suspense>
        ),
      },
    ],
  },
  // User routes
  {
    path: '/user',
    element: (
      <RequireAuth>
        <RequireRole role="user">
          <AppLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <UserDashboard />
          </Suspense>
        ),
      },
      {
        path: 'workouts',
        element: (
          <Suspense fallback={<PageFallback />}>
            <UserWorkoutsPage />
          </Suspense>
        ),
      },
      {
        path: 'planner',
        element: (
          <Suspense fallback={<PageFallback />}>
            <UserPlannerPage />
          </Suspense>
        ),
      },
      { path: 'progress', element: <UserProgressPage /> },
      { path: 'nutrition', element: <UserNutritionPage /> },
      { path: 'membership', element: <UserMembershipPage /> },
      { path: 'health-hub', element: <UserHealthHubPage /> },
      {
        path: 'favorites',
        element: (
          <Suspense fallback={<PageFallback />}>
            <UserFavoritesPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageFallback />}>
            <UserSettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});
