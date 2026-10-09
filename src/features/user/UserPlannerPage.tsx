import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeAssignments } from '@/lib/repositories';
import { WorkoutAssignment } from '@/types';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatFriendlyDate } from '@/lib/dates';
import { CalendarCheck, Play, Dumbbell, Clock } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export const UserPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'user_demo_uid';
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<WorkoutAssignment[]>([]);

  useEffect(() => {
    return subscribeAssignments(userId, setAssignments);
  }, [userId]);

  const handleLaunch = (item: WorkoutAssignment) => {
    navigate('/user/workouts', {
      state: { startPlanId: item.planId, assignmentId: item.id },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-lime-400" />
          Training Schedule & Weekly Planner
        </h2>
        <p className="text-xs text-gray-400">
          Workouts scheduled by Coach Marcus specifically for your adaptation cycle.
        </p>
      </div>

      <SpotlightCard className="p-6">
        <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-4">
          Assigned Sessions ({assignments.length})
        </h3>

        {assignments.length === 0 ? (
          <p className="text-xs text-gray-500 py-8 text-center">
            No workouts scheduled yet. Reach out to Coach Marcus or pick a workout from the library.
          </p>
        ) : (
          <div className="divide-y divide-dark-border">
            {assignments.map((item) => (
              <div key={item.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.planTitle || 'Workout'}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 font-mono">
                      <span className="text-lime-400">{formatFriendlyDate(item.scheduledDate)}</span>
                      <span>•</span>
                      <span>{item.category || 'General'}</span>
                      <span>•</span>
                      <span>{item.durationMin || 45} mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={item.status === 'completed' ? 'lime' : 'cyan'}>
                    {item.status}
                  </Badge>

                  {item.status !== 'completed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleLaunch(item)}
                      leftIcon={<Play className="w-3.5 h-3.5 fill-black" />}
                    >
                      Start Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
