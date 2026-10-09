import React, { useState } from 'react';
import { WorkoutPlan, WorkoutSession, SessionSet } from '@/types';
import { useWorkoutSession } from './useWorkoutSession';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import {
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Timer,
  SkipForward,
  Trophy,
  Dumbbell,
  ArrowLeft,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';

interface WorkoutPlayerProps {
  plan: WorkoutPlan;
  userId: string;
  assignmentId?: string;
  onExit: () => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  plan,
  userId,
  assignmentId,
  onExit,
}) => {
  const [completedSummary, setCompletedSummary] = useState<WorkoutSession | null>(null);

  const {
    session,
    formattedElapsed,
    isPaused,
    pauseSession,
    resumeSession,
    updateSet,
    restTimerSec,
    skipRest,
    finishSession,
    currentExerciseIndex,
    setCurrentExerciseIndex,
  } = useWorkoutSession({
    plan,
    userId,
    assignmentId,
    onFinish: (finished) => setCompletedSummary(finished),
  });

  const currentExercise = plan.exercises[currentExerciseIndex] || plan.exercises[0];
  const currentExerciseSets = session.sets.filter(
    (s) => s.exerciseId === currentExercise?.exerciseId
  );

  const totalSets = session.sets.length;
  const completedSetsCount = session.sets.filter((s) => s.completed).length;
  const percentComplete = Math.round((completedSetsCount / (totalSets || 1)) * 100);

  if (completedSummary) {
    const totalVolume = completedSummary.sets
      .filter((s) => s.completed)
      .reduce((acc, s) => acc + s.reps * s.weightKg, 0);

    return (
      <SpotlightCard className="max-w-xl mx-auto p-8 text-center border-lime-500/40 shadow-lime-glow animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-lime-500/20 border border-lime-500 flex items-center justify-center text-lime-400 mx-auto mb-4 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
          Workout Complete!
        </h2>
        <p className="text-xs text-lime-400 font-semibold uppercase tracking-wider mb-6">
          {completedSummary.planTitle}
        </p>

        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-dark-base border border-dark-border mb-6">
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1">
              Active Time
            </span>
            <div className="text-lg font-bold text-white">
              {Math.floor(completedSummary.activeDurationSec / 60)}m {completedSummary.activeDurationSec % 60}s
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1">
              Sets Finished
            </span>
            <div className="text-lg font-bold text-lime-400">
              {completedSetsCount} / {totalSets}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1">
              Total Volume
            </span>
            <div className="text-lg font-bold text-cyan-400">{totalVolume} kg</div>
          </div>
        </div>

        <Button variant="primary" size="lg" className="w-full" onClick={onExit}>
          Return to Dashboard
        </Button>
      </SpotlightCard>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-card border border-dark-border">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-surface"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-white">{plan.title}</h2>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Badge variant="lime" size="sm">{plan.category}</Badge>
              <span>•</span>
              <span>{plan.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Live Timer and Pause Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-base border border-dark-border text-lime-400 font-mono text-base font-bold">
            <Timer className="w-4 h-4 text-lime-400" />
            <span>{formattedElapsed}</span>
          </div>

          <Button
            variant={isPaused ? 'primary' : 'secondary'}
            size="sm"
            onClick={isPaused ? resumeSession : pauseSession}
            leftIcon={isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={finishSession}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Finish
          </Button>
        </div>
      </div>

      {/* Rest Timer Banner (Floating / Embedded) */}
      {restTimerSec !== null && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/40 shadow-sm animate-pulse-subtle">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-cyan-300 block">
                Rest Interval
              </span>
              <span className="text-xl font-black font-mono text-white">
                {restTimerSec}s remaining
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={skipRest}
            leftIcon={<SkipForward className="w-4 h-4" />}
          >
            Skip Rest
          </Button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-dark-card border border-dark-border rounded-xl p-3">
        <div className="flex justify-between items-center text-xs text-gray-400 mb-1.5">
          <span>Overall Workout Progress</span>
          <span className="text-lime-400 font-bold">{percentComplete}% ({completedSetsCount}/{totalSets} sets)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-dark-base overflow-hidden">
          <div
            className="h-full bg-lime-400 transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Exercise Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {plan.exercises.map((ex, index) => {
          const exSets = session.sets.filter((s) => s.exerciseId === ex.exerciseId);
          const allCompleted = exSets.every((s) => s.completed);

          return (
            <button
              key={ex.exerciseId}
              onClick={() => setCurrentExerciseIndex(index)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                currentExerciseIndex === index
                  ? 'bg-lime-500/15 border-lime-500 text-lime-400 shadow-lime-sm'
                  : allCompleted
                  ? 'bg-dark-card border-lime-500/30 text-gray-300'
                  : 'bg-dark-card border-dark-border text-gray-400 hover:border-gray-600'
              }`}
            >
              <span>{index + 1}. {ex.name}</span>
              {allCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />}
            </button>
          );
        })}
      </div>

      {/* Current Exercise Detail & Set Logger */}
      <SpotlightCard className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6 pb-4 border-b border-dark-border">
          <div>
            <span className="text-xs uppercase font-bold text-lime-400 tracking-wider">
              Exercise {currentExerciseIndex + 1} of {plan.exercises.length}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{currentExercise?.name}</h3>
            {currentExercise?.notes && (
              <p className="text-xs text-gray-400 mt-1 italic">{currentExercise.notes}</p>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
            <span className="px-2 py-1 rounded bg-dark-base border border-dark-border">
              Target: {currentExercise?.sets} sets × {currentExercise?.reps} reps
            </span>
            <span className="px-2 py-1 rounded bg-dark-base border border-dark-border">
              Rest: {currentExercise?.restSec}s
            </span>
          </div>
        </div>

        {/* Set Rows */}
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase text-gray-400 px-3">
            <div className="col-span-2">Set</div>
            <div className="col-span-4">Weight (kg)</div>
            <div className="col-span-4">Reps Done</div>
            <div className="col-span-2 text-right">Done</div>
          </div>

          {currentExerciseSets.map((set) => {
            const globalIndex = session.sets.findIndex(
              (s) => s.exerciseId === set.exerciseId && s.setNumber === set.setNumber
            );

            return (
              <div
                key={set.setNumber}
                className={`grid grid-cols-12 gap-2 items-center p-3 rounded-xl border transition-all ${
                  set.completed
                    ? 'bg-lime-500/5 border-lime-500/40 text-gray-200'
                    : 'bg-dark-base border-dark-border text-gray-300'
                }`}
              >
                <div className="col-span-2 font-bold text-sm font-mono text-gray-400">
                  #{set.setNumber}
                </div>

                <div className="col-span-4">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={set.weightKg === 0 ? '' : set.weightKg}
                    placeholder="0"
                    onChange={(e) =>
                      updateSet(globalIndex, { weightKg: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-2.5 py-1.5 text-sm font-semibold text-white focus:border-lime-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-4">
                  <input
                    type="number"
                    min="1"
                    value={set.reps}
                    onChange={(e) =>
                      updateSet(globalIndex, { reps: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-2.5 py-1.5 text-sm font-semibold text-white focus:border-lime-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => updateSet(globalIndex, { completed: !set.completed })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      set.completed
                        ? 'bg-lime-500 text-black shadow-lime-sm'
                        : 'bg-dark-card border border-dark-border text-gray-500 hover:border-lime-500/50 hover:text-lime-400'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom exercise navigation */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-border">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentExerciseIndex === 0}
            onClick={() => setCurrentExerciseIndex((prev) => Math.max(0, prev - 1))}
          >
            Previous Exercise
          </Button>

          {currentExerciseIndex < plan.exercises.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentExerciseIndex((prev) => prev + 1)}
            >
              Next Exercise
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={finishSession}
              leftIcon={<Trophy className="w-4 h-4" />}
            >
              Complete Workout
            </Button>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
};
