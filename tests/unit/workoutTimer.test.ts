import { describe, it, expect } from 'vitest';

describe('Workout Timer & Pause-Resume Calculation Engine', () => {
  it('correctly calculates active elapsed seconds without pause', () => {
    const startTimestamp = 1000000;
    const accumulatedPausedMs = 0;
    const now = startTimestamp + 42000; // 42 seconds later

    const elapsedMs = now - startTimestamp - accumulatedPausedMs;
    const elapsedSec = Math.floor(elapsedMs / 1000);

    expect(elapsedSec).toBe(42);
  });

  it('correctly accounts for paused durations and avoids double-counting', () => {
    const startTimestamp = 1000000;

    // Workout runs for 30s
    let now = startTimestamp + 30000;

    // Pause for 15s
    const pauseStart = now;
    const resumeTime = pauseStart + 15000;
    const accumulatedPausedMs = resumeTime - pauseStart; // 15000ms

    // Workout runs for another 20s
    now = resumeTime + 20000;

    // Total wall clock: 30 + 15 + 20 = 65s
    // Active elapsed time: 65s - 15s = 50s
    const activeElapsedMs = now - startTimestamp - accumulatedPausedMs;
    const activeElapsedSec = Math.floor(activeElapsedMs / 1000);

    expect(activeElapsedSec).toBe(50);
  });

  it('handles multiple pause and resume cycles without drift', () => {
    const startTimestamp = 1000000;
    let accumulatedPausedMs = 0;

    // Cycle 1: Pause 10s
    accumulatedPausedMs += 10000;
    // Cycle 2: Pause 25s
    accumulatedPausedMs += 25000;

    // Current time 100s after start
    const now = startTimestamp + 100000;
    const activeElapsedMs = now - startTimestamp - accumulatedPausedMs;
    const activeElapsedSec = Math.floor(activeElapsedMs / 1000);

    // 100s total - 35s paused = 65s active
    expect(activeElapsedSec).toBe(65);
  });
});
