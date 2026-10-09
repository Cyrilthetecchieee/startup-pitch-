import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { subscribeWorkoutPlans, subscribeAssignments } from '@/lib/repositories';
import { WorkoutPlan, WorkoutAssignment } from '@/types';
import { WorkoutPlayer } from '@/features/workouts/WorkoutPlayer';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dumbbell, Play, Clock, Flame, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export const UserWorkoutsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'user_demo_uid';
  const location = useLocation();

  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | undefined>(undefined);

  useEffect(() => {
    return subscribeWorkoutPlans((p) => {
      setPlans(p);
      // If navigated with state, launch that plan immediately
      if (location.state?.startPlanId && !activePlan) {
        const found = p.find((item) => item.id === location.state.startPlanId);
        if (found) {
          setActivePlan(found);
          setActiveAssignmentId(location.state.assignmentId);
        }
      }
    });
  }, [location.state]);

  if (activePlan) {
    return (
      <WorkoutPlayer
        plan={activePlan}
        userId={userId}
        assignmentId={activeAssignmentId}
        onExit={() => {
          setActivePlan(null);
          setActiveAssignmentId(undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-lime-400" />
            Workout Library & Active Routines
          </h2>
          <p className="text-xs text-gray-400">
            Launch interactive workout player with real-time set logging and rest intervals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <SpotlightCard key={plan.id} className="p-5 flex flex-col justify-between hover:border-lime-500/40">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="lime" size="sm">{plan.category}</Badge>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-lime-400" />
                  {plan.durationMin} mins
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1.5">{plan.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                {plan.description || 'Targeted training protocol.'}
              </p>

              <div className="p-3 rounded-lg bg-dark-base border border-dark-border mb-4 space-y-1.5">
                <div className="text-[11px] font-semibold uppercase text-gray-400">
                  Movement Program ({plan.exercises.length} exercises)
                </div>
                {plan.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} className="text-xs text-gray-300 flex justify-between">
                    <span className="truncate">{ex.name}</span>
                    <span className="text-lime-400 font-mono text-[11px]">
                      {ex.sets}×{ex.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-dark-border">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setActivePlan(plan)}
                leftIcon={<Play className="w-4 h-4 fill-black" />}
              >
                Start Workout
              </Button>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};
