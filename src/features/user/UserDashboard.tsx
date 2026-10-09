import React, { useState, useEffect } from 'react';
import {
  subscribeMembership,
  subscribeUserProfile,
  subscribeAssignments,
  subscribeSessions,
  subscribeProgress,
  subscribeNutrition,
  subscribeHydration,
  subscribeQuotes,
  subscribeHealthFacts,
  subscribeWorkoutPlans,
} from '@/lib/repositories';
import {
  MembershipDoc,
  UserProfile,
  WorkoutAssignment,
  WorkoutSession,
  ProgressEntry,
  NutritionEntry,
  HydrationEntry,
  QuoteItem,
  HealthFactItem,
  WorkoutPlan,
} from '@/types';
import { FiveMinuteBoostCard } from '@/features/boost/FiveMinuteBoostCard';
import { MembershipCard } from '@/features/membership/MembershipCard';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { CountUp } from '@/components/reactbits/CountUp';
import { RingProgress } from '@/components/ui/RingProgress';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getTodayDateString, formatFriendlyDate } from '@/lib/dates';
import { useAuth } from '@/features/auth/AuthContext';
import {
  Dumbbell,
  Play,
  Flame,
  Droplets,
  Utensils,
  CalendarCheck,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserDashboardProps {
  onStartWorkout?: (plan: WorkoutPlan, assignmentId?: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onStartWorkout }) => {
  const { user } = useAuth();
  const userId = user?.uid || 'user_demo_uid';

  const [membership, setMembership] = useState<MembershipDoc | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [assignments, setAssignments] = useState<WorkoutAssignment[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [nutrition, setNutrition] = useState<NutritionEntry[]>([]);
  const [hydration, setHydration] = useState<HydrationEntry[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [healthFacts, setHealthFacts] = useState<HealthFactItem[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);

  useEffect(() => {
    const unsubMembership = subscribeMembership(userId, setMembership);
    const unsubProfile = subscribeUserProfile(userId, setProfile);
    const unsubAssignments = subscribeAssignments(userId, setAssignments);
    const unsubSessions = subscribeSessions(userId, setSessions);
    const unsubProgress = subscribeProgress(userId, setProgress);
    const unsubNutrition = subscribeNutrition(userId, getTodayDateString(), setNutrition);
    const unsubHydration = subscribeHydration(userId, getTodayDateString(), setHydration);
    const unsubQuotes = subscribeQuotes(setQuotes);
    const unsubFacts = subscribeHealthFacts(setHealthFacts);
    const unsubPlans = subscribeWorkoutPlans(setPlans);

    return () => {
      unsubMembership();
      unsubProfile();
      unsubAssignments();
      unsubSessions();
      unsubProgress();
      unsubNutrition();
      unsubHydration();
      unsubQuotes();
      unsubFacts();
      unsubPlans();
    };
  }, [userId]);

  const todayStr = getTodayDateString();
  const todayAssignment = assignments.find((a) => a.scheduledDate === todayStr);
  const matchedPlan = plans.find((p) => p.id === todayAssignment?.planId) || plans[0];

  const totalCalories = nutrition.reduce((sum, n) => sum + n.calories, 0);
  const calorieTarget = profile?.calorieTarget || 2400;
  const caloriePercent = Math.min(100, Math.round((totalCalories / calorieTarget) * 100));

  const totalWater = hydration.reduce((sum, h) => sum + h.amountMl, 0);
  const waterTarget = profile?.waterTargetMl || 3000;
  const waterPercent = Math.min(100, Math.round((totalWater / waterTarget) * 100));

  const completedCount = sessions.filter((s) => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Five-Minute Fitness Boost Feature (Top prominent placement) */}
      <FiveMinuteBoostCard quotes={quotes} healthFacts={healthFacts} />

      {/* Hero Welcome / Today's Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout Hero */}
        <SpotlightCard className="lg:col-span-2 p-6 flex flex-col justify-between border-lime-500/30">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold text-lime-400 tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4" />
                Today's Prescribed Training
              </span>
              <Badge variant={todayAssignment ? 'lime' : 'gray'}>
                {todayAssignment ? 'Scheduled Today' : 'Active Library'}
              </Badge>
            </div>

            <h2 className="text-2xl font-black text-white mb-2">
              {matchedPlan ? matchedPlan.title : 'Full Body Conditioning'}
            </h2>
            <p className="text-xs text-gray-400 mb-6 max-w-lg leading-relaxed">
              {matchedPlan?.description ||
                'Targeted resistance training program curated by Coach Marcus to maximize strength and athletic performance.'}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-300">
              <div className="px-3 py-1.5 rounded-lg bg-dark-base border border-dark-border">
                Category: <span className="text-lime-400 font-bold">{matchedPlan?.category || 'Strength'}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-dark-base border border-dark-border">
                Est. Duration: <span className="text-lime-400 font-bold">{matchedPlan?.durationMin || 45} mins</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-dark-base border border-dark-border">
                Exercises: <span className="text-lime-400 font-bold">{matchedPlan?.exercises.length || 4} movements</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-dark-border flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-gray-400">
              Set-by-set logging with automated rest timer
            </span>

            <Link
              to="/user/workouts"
              state={{ startPlanId: matchedPlan?.id, assignmentId: todayAssignment?.id }}
            >
              <Button
                variant="primary"
                size="md"
                leftIcon={<Play className="w-4 h-4 fill-black" />}
              >
                Launch Workout Player
              </Button>
            </Link>
          </div>
        </SpotlightCard>

        {/* Daily Rings Card (Nutrition & Water) */}
        <SpotlightCard className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-4 flex items-center justify-between">
              <span>Daily Target Rings</span>
              <Link to="/user/nutrition" className="text-xs text-lime-400 hover:underline font-normal lowercase">
                log entry →
              </Link>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-center my-2">
              <div>
                <RingProgress percentage={caloriePercent} size={90} strokeWidth={8} color="#CCFF00">
                  <span className="text-xs font-bold text-lime-400">{caloriePercent}%</span>
                </RingProgress>
                <span className="text-[11px] font-bold text-gray-200 block mt-2">Calories</span>
                <span className="text-[10px] text-gray-400">
                  {totalCalories} / {calorieTarget} kcal
                </span>
              </div>

              <div>
                <RingProgress percentage={waterPercent} size={90} strokeWidth={8} color="#00E5FF">
                  <span className="text-xs font-bold text-cyan-400">{waterPercent}%</span>
                </RingProgress>
                <span className="text-[11px] font-bold text-gray-200 block mt-2">Hydration</span>
                <span className="text-[10px] text-gray-400">
                  {totalWater} / {waterTarget} mL
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-dark-border flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              14-Day Streak
            </span>
            <span className="font-mono text-lime-400 font-bold">
              {completedCount} workouts done
            </span>
          </div>
        </SpotlightCard>
      </div>

      {/* Membership Card with Dynamic Countdown */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm uppercase font-bold tracking-wider text-gray-400 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-lime-400" />
            My Active Membership
          </h2>
          <span className="text-xs text-gray-500">Managed by Coach Marcus</span>
        </div>
        <MembershipCard membership={membership} isTrainer={false} />
      </div>

      {/* Upcoming Workouts & Coach Directives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpotlightCard className="p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-lime-400" />
            Upcoming Scheduled Sessions
          </h3>

          {assignments.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">
              No upcoming scheduled workouts. Check the library for open workouts.
            </p>
          ) : (
            <div className="space-y-3">
              {assignments.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-base border border-dark-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-400 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {item.planTitle || 'Workout'}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {formatFriendlyDate(item.scheduledDate)}
                      </span>
                    </div>
                  </div>

                  <Badge variant={item.status === 'completed' ? 'lime' : 'cyan'} size="sm">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </SpotlightCard>

        {/* Coach Directives Card */}
        <SpotlightCard className="p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            Coach Directives & Fitness Notes
          </h3>

          <div className="p-4 rounded-xl bg-dark-base border border-dark-border text-xs text-gray-300 leading-relaxed space-y-2">
            <div className="text-lime-400 font-bold uppercase tracking-wider text-[10px]">
              Active Coaching Focus
            </div>
            <p>
              {profile?.notes ||
                'Prioritize dynamic hamstring and glute activation prior to heavy hinge movements. Maintain 3,000 mL fluid intake on workout days.'}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {profile?.goals?.map((goal, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-dark-surface border border-dark-border text-gray-300"
              >
                🎯 {goal}
              </span>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
