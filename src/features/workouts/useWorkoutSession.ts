import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkoutPlan, WorkoutSession, SessionSet } from '@/types';
import { saveSession } from '@/lib/repositories';
import confetti from 'canvas-confetti';

interface UseWorkoutSessionOptions {
  plan: WorkoutPlan;
  userId: string;
  assignmentId?: string;
  existingSession?: WorkoutSession | null;
  onFinish?: (session: WorkoutSession) => void;
}

export function useWorkoutSession({
  plan,
  userId,
  assignmentId,
  existingSession,
  onFinish,
}: UseWorkoutSessionOptions) {
  // Session initialization
  const [session, setSession] = useState<WorkoutSession>(() => {
    if (existingSession) return existingSession;

    // Build initial sets list from plan exercises
    const initialSets: SessionSet[] = [];
    plan.exercises.forEach((ex) => {
      const repCount = parseInt(ex.reps.split('-')[0]) || 10;
      for (let s = 1; s <= ex.sets; s++) {
        initialSets.push({
          exerciseId: ex.exerciseId,
          exerciseName: ex.name,
          setNumber: s,
          reps: repCount,
          weightKg: 0,
          completed: false,
        });
      }
    });

    const newSession: WorkoutSession = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      assignmentId,
      planId: plan.id,
      planTitle: plan.title,
      startedAt: new Date().toISOString(),
      activeDurationSec: 0,
      status: 'in_progress',
      sets: initialSets,
    };
    return newSession;
  });

  const [isPaused, setIsPaused] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restTimerSec, setRestTimerSec] = useState<number | null>(null);

  // Accurate timestamp math:
  // startTime, accumulatedPausedMs, lastPauseTimestamp
  const startTimestampRef = useRef<number>(Date.now() - (existingSession?.activeDurationSec || 0) * 1000);
  const accumulatedPausedMsRef = useRef<number>(0);
  const pauseTimestampRef = useRef<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState<number>(existingSession?.activeDurationSec || 0);

  // Save session to Firestore on mount if new
  useEffect(() => {
    if (!existingSession) {
      saveSession(session).catch((err) => console.error('Error starting session:', err));
    }
  }, []);

  // Timer ticker
  useEffect(() => {
    if (session.status !== 'in_progress') return;

    const timer = window.setInterval(() => {
      if (isPaused) return;

      const now = Date.now();
      const totalElapsedMs = now - startTimestampRef.current - accumulatedPausedMsRef.current;
      const seconds = Math.max(0, Math.floor(totalElapsedMs / 1000));
      setElapsedSec(seconds);
    }, 500);

    return () => clearInterval(timer);
  }, [isPaused, session.status]);

  // Rest Timer ticker
  useEffect(() => {
    if (restTimerSec === null || restTimerSec <= 0) return;

    const timer = window.setInterval(() => {
      setRestTimerSec((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [restTimerSec]);

  const pauseSession = useCallback(() => {
    if (isPaused) return;
    setIsPaused(true);
    pauseTimestampRef.current = Date.now();
  }, [isPaused]);

  const resumeSession = useCallback(() => {
    if (!isPaused || !pauseTimestampRef.current) return;
    accumulatedPausedMsRef.current += Date.now() - pauseTimestampRef.current;
    pauseTimestampRef.current = null;
    setIsPaused(false);
  }, [isPaused]);

  const updateSet = useCallback(
    async (index: number, updates: Partial<SessionSet>) => {
      setSession((prev) => {
        const nextSets = [...prev.sets];
        nextSets[index] = { ...nextSets[index], ...updates };
        const updatedSession: WorkoutSession = {
          ...prev,
          sets: nextSets,
          activeDurationSec: elapsedSec,
        };

        // Persist to firestore asynchronously
        saveSession(updatedSession).catch((err) =>
          console.error('Error persisting set update:', err)
        );

        // If marked completed, trigger rest timer from current exercise restSec
        if (updates.completed === true) {
          const currentEx = plan.exercises[currentExerciseIndex];
          if (currentEx && currentEx.restSec > 0) {
            setRestTimerSec(currentEx.restSec);
          }
        }

        return updatedSession;
      });
    },
    [elapsedSec, plan.exercises, currentExerciseIndex]
  );

  const skipRest = useCallback(() => {
    setRestTimerSec(null);
  }, []);

  const finishSession = useCallback(async () => {
    const finalSession: WorkoutSession = {
      ...session,
      activeDurationSec: elapsedSec,
      endedAt: new Date().toISOString(),
      status: 'completed',
    };

    setSession(finalSession);
    await saveSession(finalSession);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#CCFF00', '#00E5FF', '#FFFFFF'],
      });
    } catch {
      // non-critical
    }

    if (onFinish) {
      onFinish(finalSession);
    }
  }, [session, elapsedSec, onFinish]);

  const formatElapsed = () => {
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return {
    session,
    elapsedSec,
    formattedElapsed: formatElapsed(),
    isPaused,
    pauseSession,
    resumeSession,
    updateSet,
    restTimerSec,
    skipRest,
    finishSession,
    currentExerciseIndex,
    setCurrentExerciseIndex,
  };
}
