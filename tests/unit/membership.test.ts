import { describe, it, expect } from 'vitest';
import { calculateExpiryDate, computeMembership } from '../../src/lib/dates';

describe('Membership Calculation Engine', () => {
  describe('calculateExpiryDate (Calendar Month Clamping)', () => {
    it('correctly clamps Jan 31 + 1 month to Feb 28 in non-leap year', () => {
      const expiry = calculateExpiryDate('2025-01-31', '1m');
      expect(expiry).toBe('2025-02-28');
    });

    it('correctly clamps Jan 31 + 1 month to Feb 29 in leap year (2024)', () => {
      const expiry = calculateExpiryDate('2024-01-31', '1m');
      expect(expiry).toBe('2024-02-29');
    });

    it('correctly calculates 3 months duration with month-end clamping', () => {
      const expiry = calculateExpiryDate('2026-01-31', '3m');
      expect(expiry).toBe('2026-04-30');
    });

    it('correctly calculates 6 months duration', () => {
      const expiry = calculateExpiryDate('2026-01-31', '6m');
      expect(expiry).toBe('2026-07-31');
    });

    it('correctly calculates 12 months duration', () => {
      const expiry = calculateExpiryDate('2026-01-31', '12m');
      expect(expiry).toBe('2027-01-31');
    });

    it('correctly calculates custom days duration', () => {
      const expiry = calculateExpiryDate('2026-01-01', 'custom', 45);
      expect(expiry).toBe('2026-02-15');
    });
  });

  describe('computeMembership Status & Countdown Boundaries', () => {
    const membership = {
      planType: '3m' as const,
      startDate: '2026-01-01',
      expiryDate: '2026-04-01',
    };

    it('marks status as not_yet_active when current date is before start date', () => {
      const result = computeMembership(membership, '2025-12-25');
      expect(result.status).toBe('not_yet_active');
      expect(result.statusLabel).toBe('Not Yet Active');
      expect(result.isUrgent).toBe(false);
    });

    it('marks status as active when more than 30 days remain', () => {
      const result = computeMembership(membership, '2026-02-01');
      expect(result.status).toBe('active');
      expect(result.statusLabel).toBe('Active');
      expect(result.isUrgent).toBe(false);
      expect(result.daysRemaining).toBe(59);
    });

    it('marks status as active on boundary when exactly 31 days remain', () => {
      const result = computeMembership(membership, '2026-03-01');
      expect(result.daysRemaining).toBe(31);
      expect(result.status).toBe('active');
    });

    it('marks status as expiring_soon on boundary when exactly 30 days remain', () => {
      const result = computeMembership(membership, '2026-03-02');
      expect(result.daysRemaining).toBe(30);
      expect(result.status).toBe('expiring_soon');
      expect(result.isUrgent).toBe(false);
    });

    it('marks status as expiring_soon when 8 days remain', () => {
      const result = computeMembership(membership, '2026-03-24');
      expect(result.daysRemaining).toBe(8);
      expect(result.status).toBe('expiring_soon');
      expect(result.isUrgent).toBe(false);
    });

    it('marks status as urgent on boundary when exactly 7 days remain', () => {
      const result = computeMembership(membership, '2026-03-25');
      expect(result.daysRemaining).toBe(7);
      expect(result.status).toBe('urgent');
      expect(result.isUrgent).toBe(true);
    });

    it('marks status as urgent on the final day of expiry (0 days remaining)', () => {
      const result = computeMembership(membership, '2026-04-01');
      expect(result.daysRemaining).toBe(0);
      expect(result.status).toBe('urgent');
      expect(result.isUrgent).toBe(true);
    });

    it('marks status as expired on the day immediately after expiry', () => {
      const result = computeMembership(membership, '2026-04-02');
      expect(result.status).toBe('expired');
      expect(result.statusLabel).toBe('Expired');
      expect(result.isUrgent).toBe(false);
    });

    it('accurately computes percent elapsed and clamps between 0 and 100', () => {
      const midwayResult = computeMembership(membership, '2026-02-15');
      expect(midwayResult.percentElapsed).toBeGreaterThan(0);
      expect(midwayResult.percentElapsed).toBeLessThan(100);

      const beforeResult = computeMembership(membership, '2025-12-01');
      expect(beforeResult.percentElapsed).toBe(0);

      const afterResult = computeMembership(membership, '2026-05-01');
      expect(afterResult.percentElapsed).toBe(100);
    });
  });
});
