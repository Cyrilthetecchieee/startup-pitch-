import React, { useState, useEffect } from 'react';
import {
  subscribeMembership,
  updateMembershipDoc,
  subscribeUserProfile,
  updateUserProfileDoc,
  subscribeWorkoutPlans,
  subscribeAssignments,
  subscribeSessions,
  subscribeProgress,
  subscribeNutrition,
  subscribeHydration,
} from '@/lib/repositories';
import {
  MembershipDoc,
  UserProfile,
  WorkoutPlan,
  WorkoutAssignment,
  WorkoutSession,
  ProgressEntry,
  NutritionEntry,
  HydrationEntry,
} from '@/types';
import { MembershipCard } from '@/features/membership/MembershipCard';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { CountUp } from '@/components/reactbits/CountUp';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getTodayDateString, formatFriendlyDate } from '@/lib/dates';
import {
  Users,
  Dumbbell,
  CreditCard,
  Activity,
  Flame,
  CalendarCheck,
  TrendingUp,
  Droplets,
  Utensils,
  Award,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';

export const TrainerDashboard: React.FC = () => {
  // Demo athlete UID
  const athleteUid = 'user_demo_uid';

  const [membership, setMembership] = useState<MembershipDoc | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [assignments, setAssignments] = useState<WorkoutAssignment[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [nutrition, setNutrition] = useState<NutritionEntry[]>([]);
  const [hydration, setHydration] = useState<HydrationEntry[]>([]);

  useEffect(() => {
    const unsubMembership = subscribeMembership(athleteUid, setMembership);
    const unsubProfile = subscribeUserProfile(athleteUid, setProfile);
    const unsubPlans = subscribeWorkoutPlans(setPlans);
    const unsubAssignments = subscribeAssignments(athleteUid, setAssignments);
    const unsubSessions = subscribeSessions(athleteUid, setSessions);
    const unsubProgress = subscribeProgress(athleteUid, setProgress);
    const unsubNutrition = subscribeNutrition(athleteUid, getTodayDateString(), setNutrition);
    const unsubHydration = subscribeHydration(athleteUid, getTodayDateString(), setHydration);

    return () => {
      unsubMembership();
      unsubProfile();
      unsubPlans();
      unsubAssignments();
      unsubSessions();
      unsubProgress();
      unsubNutrition();
      unsubHydration();
    };
  }, [athleteUid]);

  const handleUpdateMembership = async (data: Partial<MembershipDoc>) => {
    await updateMembershipDoc(athleteUid, { ...data, updatedBy: 'trainer' });
  };

  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const todayCalories = nutrition.reduce((sum, n) => sum + n.calories, 0);
  const todayWater = hydration.reduce((sum, h) => sum + h.amountMl, 0);

  // Weight chart data
  const weightChartData = progress.map((p) => ({
    date: p.date.slice(5),
    weight: p.weightKg,
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-dark-card via-dark-elevated to-dark-card border border-dark-border">
        <div>
          <span className="text-xs uppercase font-bold text-lime-400 tracking-wider">
            Head Coach Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Welcome back, Coach Marcus
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Athlete Active: <span className="text-gray-200 font-semibold">{profile?.displayName || 'Alex Mercer'}</span> • Goals: {profile?.goals?.join(', ') || 'Strength & Conditioning'}
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/trainer/workouts">
            <Button variant="primary" size="sm" leftIcon={<Dumbbell className="w-4 h-4" />}>
              Build Workout
            </Button>
          </Link>
          <Link to="/trainer/assignments">
            <Button variant="secondary" size="sm" leftIcon={<CalendarCheck className="w-4 h-4" />}>
              Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Membership Live Card */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm uppercase font-bold tracking-wider text-gray-400 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-lime-400" />
            Athlete Subscription Status (Live Sync)
          </h2>
          <span className="text-xs text-lime-400 font-medium">Real-time onSnapshot sync active</span>
        </div>
        <MembershipCard
          membership={membership}
          isTrainer={true}
          onUpdate={handleUpdateMembership}
        />
      </div>

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SpotlightCard className="p-4">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
            Total Workouts
          </span>
          <div className="text-2xl font-black text-lime-400">
            <CountUp to={completedSessions.length} />
          </div>
          <span className="text-[11px] text-gray-400">Recorded sessions</span>
        </SpotlightCard>

        <SpotlightCard className="p-4">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
            Active Plans
          </span>
          <div className="text-2xl font-black text-cyan-400">
            <CountUp to={plans.length} />
          </div>
          <span className="text-[11px] text-gray-400">In library</span>
        </SpotlightCard>

        <SpotlightCard className="p-4">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
            Today's Nutrition
          </span>
          <div className="text-2xl font-black text-amber-400">
            <CountUp to={todayCalories} />
            <span className="text-xs text-gray-400 font-normal ml-1">kcal</span>
          </div>
          <span className="text-[11px] text-gray-400">Logged by athlete</span>
        </SpotlightCard>

        <SpotlightCard className="p-4">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
            Today's Hydration
          </span>
          <div className="text-2xl font-black text-cyan-400">
            <CountUp to={todayWater} />
            <span className="text-xs text-gray-400 font-normal ml-1">mL</span>
          </div>
          <span className="text-[11px] text-gray-400">Fluid balance</span>
        </SpotlightCard>
      </div>

      {/* Two Column Layout: Weight Progression & Upcoming Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progression Chart */}
        <SpotlightCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Athlete Weight Progression</h3>
              <p className="text-xs text-gray-400">Historical trend from user weigh-in logs</p>
            </div>
            <Link to="/trainer/progress" className="text-xs text-lime-400 hover:underline">
              Full History →
            </Link>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242B35" />
                <XAxis dataKey="date" stroke="#8E9AA8" fontSize={10} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#8E9AA8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121518',
                    borderColor: '#2A313D',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#CCFF00"
                  strokeWidth={2.5}
                  dot={{ fill: '#CCFF00', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SpotlightCard>

        {/* Assigned & Scheduled Workouts */}
        <SpotlightCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Upcoming Athlete Schedule</h3>
              <p className="text-xs text-gray-400">Scheduled workouts for this week</p>
            </div>
            <Link to="/trainer/assignments" className="text-xs text-lime-400 hover:underline">
              Manage Schedule →
            </Link>
          </div>

          {assignments.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              No upcoming assignments. Assign a workout to schedule.
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-base border border-dark-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {item.planTitle || 'Assigned Session'}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        Scheduled: {formatFriendlyDate(item.scheduledDate)}
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
      </div>

      {/* Recent Completed Sessions Feed */}
      <SpotlightCard className="p-6">
        <h3 className="text-base font-bold text-white mb-4">
          Recent Completed Sessions ({completedSessions.length})
        </h3>

        {completedSessions.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">
            No completed sessions recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-dark-border">
            {completedSessions.slice(0, 5).map((sess) => {
              const completedSets = sess.sets.filter((s) => s.completed).length;
              return (
                <div key={sess.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-dark-surface border border-lime-500/30 flex items-center justify-center text-lime-400 font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{sess.planTitle}</h4>
                      <p className="text-xs text-gray-400">
                        {formatFriendlyDate(sess.startedAt)} • Active duration: {Math.floor(sess.activeDurationSec / 60)}m {sess.activeDurationSec % 60}s
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-lime-400">
                    {completedSets} / {sess.sets.length} sets completed
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
