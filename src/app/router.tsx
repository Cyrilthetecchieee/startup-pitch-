import React, { useState, useEffect } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { RequireRole } from '@/features/auth/RequireRole';
import { LoginPage } from '@/features/auth/LoginPage';
import { useAuth } from '@/features/auth/AuthContext';

// Trainer Views
import { TrainerDashboard } from '@/features/trainer/TrainerDashboard';
import { TrainerUserManagement } from '@/features/trainer/TrainerUserManagement';
import { TrainerAssignments } from '@/features/trainer/TrainerAssignments';
import { TrainerMembershipPage } from '@/features/trainer/TrainerMembershipPage';
import { TrainerProgressReview } from '@/features/trainer/TrainerProgressReview';
import { TrainerContentManager } from '@/features/trainer/TrainerContentManager';
import { WorkoutBuilder } from '@/features/workouts/WorkoutBuilder';

// User Views
import { UserDashboard } from '@/features/user/UserDashboard';
import { UserWorkoutsPage } from '@/features/user/UserWorkoutsPage';
import { UserPlannerPage } from '@/features/user/UserPlannerPage';
import { UserFavoritesPage } from '@/features/user/UserFavoritesPage';
import { UserSettingsPage } from '@/features/user/UserSettingsPage';
import { ProgressTracker } from '@/features/progress/ProgressTracker';
import { NutritionLogger } from '@/features/nutrition/NutritionLogger';
import { MembershipCard } from '@/features/membership/MembershipCard';
import { HealthHub } from '@/features/health-hub/HealthHub';

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

// Role Root Redirector
const RootRedirect: React.FC = () => {
  const { role, user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'trainer' ? '/trainer' : '/user'} replace />;
};

// Trainer Workout Builder Container
const TrainerWorkoutBuilderPage: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  useEffect(() => {
    return subscribeWorkoutPlans(setPlans);
  }, []);
  return <WorkoutBuilder plans={plans} />;
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
      <NutritionLogger
        userId={userId}
        nutritionEntries={nutrition}
        hydrationEntries={hydration}
        calorieTarget={profile?.calorieTarget || 2400}
        waterTargetMl={profile?.waterTargetMl || 3000}
      />
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
      <ProgressTracker
        userId={userId}
        progressEntries={progress}
        sessions={sessions}
        targetWeightKg={profile?.targetWeightKg || 75}
      />
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
      <MembershipCard membership={membership} isTrainer={false} />
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
    <HealthHub
      articles={articles}
      quotes={quotes}
      healthFacts={healthFacts}
      challenges={challenges}
    />
  );
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
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
      { index: true, element: <TrainerDashboard /> },
      { path: 'user-management', element: <TrainerUserManagement /> },
      { path: 'workouts', element: <TrainerWorkoutBuilderPage /> },
      { path: 'assignments', element: <TrainerAssignments /> },
      { path: 'membership', element: <TrainerMembershipPage /> },
      { path: 'progress', element: <TrainerProgressReview /> },
      { path: 'content', element: <TrainerContentManager /> },
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
      { index: true, element: <UserDashboard /> },
      { path: 'workouts', element: <UserWorkoutsPage /> },
      { path: 'planner', element: <UserPlannerPage /> },
      { path: 'progress', element: <UserProgressPage /> },
      { path: 'nutrition', element: <UserNutritionPage /> },
      { path: 'membership', element: <UserMembershipPage /> },
      { path: 'health-hub', element: <UserHealthHubPage /> },
      { path: 'favorites', element: <UserFavoritesPage /> },
      { path: 'settings', element: <UserSettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
