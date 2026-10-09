import React, { useState, useEffect } from 'react';
import { subscribeSessions, subscribeProgress } from '@/lib/repositories';
import { WorkoutSession, ProgressEntry } from '@/types';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { ProgressTracker } from '@/features/progress/ProgressTracker';
import { Badge } from '@/components/ui/Badge';
import { formatFriendlyDate } from '@/lib/dates';
import { LineChart as ChartIcon, Dumbbell, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export const TrainerProgressReview: React.FC = () => {
  const athleteUid = 'user_demo_uid';
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  useEffect(() => {
    const unsubSessions = subscribeSessions(athleteUid, setSessions);
    const unsubProgress = subscribeProgress(athleteUid, setProgress);
    return () => {
      unsubSessions();
      unsubProgress();
    };
  }, [athleteUid]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ChartIcon className="w-5 h-5 text-lime-400" />
          Athlete Progress & Session Performance Review
        </h2>
        <p className="text-xs text-gray-400">
          Audit weigh-in trajectories, workout sets completed, and volume overload.
        </p>
      </div>

      <ProgressTracker userId={athleteUid} progressEntries={progress} sessions={sessions} />

      {/* Detailed Session Logs */}
      <SpotlightCard className="p-6">
        <h3 className="text-base font-bold text-white mb-4">
          Session Performance Audits ({sessions.length} recorded)
        </h3>

        {sessions.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">
            No completed workouts to review yet.
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map((sess) => {
              const isExpanded = expandedSessionId === sess.id;
              const completedSets = sess.sets.filter((s) => s.completed);

              return (
                <div
                  key={sess.id}
                  className="rounded-xl border border-dark-border bg-dark-base overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedSessionId(isExpanded ? null : sess.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-card/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 font-bold">
                        <Dumbbell className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{sess.planTitle}</h4>
                        <span className="text-xs text-gray-400 font-mono">
                          {formatFriendlyDate(sess.startedAt)} • {Math.floor(sess.activeDurationSec / 60)}m {sess.activeDurationSec % 60}s
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={sess.status === 'completed' ? 'lime' : 'amber'}>
                        {sess.status}
                      </Badge>
                      <span className="text-xs font-mono text-lime-400">
                        {completedSets.length}/{sess.sets.length} sets
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-dark-border bg-dark-card/40">
                      <h5 className="text-xs font-semibold uppercase text-gray-400 mb-2">
                        Set-by-Set Records
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sess.sets.map((s, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg border text-xs flex justify-between items-center ${
                              s.completed
                                ? 'border-lime-500/30 bg-lime-500/5 text-gray-200'
                                : 'border-dark-border bg-dark-base text-gray-400'
                            }`}
                          >
                            <span className="font-medium truncate mr-2">
                              {s.exerciseName} (Set #{s.setNumber})
                            </span>
                            <span className="font-mono text-lime-400 font-bold whitespace-nowrap">
                              {s.weightKg}kg × {s.reps} reps {s.completed ? '✓' : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
