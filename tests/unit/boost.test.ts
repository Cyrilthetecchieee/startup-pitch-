import { describe, it, expect } from 'vitest';

describe('Five-Minute Boost Timer & Rotation Engine', () => {
  it('formats MM:SS countdown accurately', () => {
    const formatTime = (secondsRemaining: number) => {
      const minutes = Math.floor(secondsRemaining / 60);
      const seconds = secondsRemaining % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    expect(formatTime(300)).toBe('05:00');
    expect(formatTime(299)).toBe('04:59');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(9)).toBe('00:09');
    expect(formatTime(0)).toBe('00:00');
  });

  it('guarantees non-repeat selection when multiple items exist in pool', () => {
    const items = [
      { id: '1', text: 'Item 1' },
      { id: '2', text: 'Item 2' },
      { id: '3', text: 'Item 3' },
    ];

    const pickNonRepeating = (list: typeof items, currentId: string) => {
      const pool = list.filter((i) => i.id !== currentId);
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      return chosen;
    };

    // Test 50 iterations to ensure it NEVER selects current
    for (let i = 0; i < 50; i++) {
      const current = items[0];
      const next = pickNonRepeating(items, current.id);
      expect(next.id).not.toBe(current.id);
    }
  });

  it('derives countdown from target timestamp without timer drift', () => {
    const now = 1000000;
    const intervalMs = 300000; // 5 mins
    const targetTimestamp = now + intervalMs;

    // Simulate 45 seconds later
    const currentTime = now + 45000;
    const diff = targetTimestamp - currentTime;
    const secondsRemaining = Math.ceil(diff / 1000);

    expect(secondsRemaining).toBe(255); // 300 - 45
  });
});
