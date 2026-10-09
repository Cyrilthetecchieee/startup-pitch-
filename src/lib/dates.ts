import { addMonths, parseISO, startOfDay, differenceInCalendarDays, format, isValid } from 'date-fns';
import { ComputedMembership, MembershipDoc, MembershipStatus, PlanType } from '@/types';

/**
 * Calculates the expiration date for a given start date and plan duration.
 * Uses `addMonths` from date-fns which handles month-end clamping:
 * e.g., Jan 31 + 1 month => Feb 28 (or Feb 29 in leap year).
 */
export function calculateExpiryDate(startDateStr: string, planType: PlanType, customDays?: number): string {
  const start = parseISO(startDateStr);
  if (!isValid(start)) {
    throw new Error(`Invalid start date: ${startDateStr}`);
  }

  let expiry: Date;
  switch (planType) {
    case '1m':
      expiry = addMonths(start, 1);
      break;
    case '3m':
      expiry = addMonths(start, 3);
      break;
    case '6m':
      expiry = addMonths(start, 6);
      break;
    case '12m':
      expiry = addMonths(start, 12);
      break;
    case 'custom':
      expiry = new Date(start.getTime() + (customDays || 30) * 24 * 60 * 60 * 1000);
      break;
    default:
      expiry = addMonths(start, 1);
  }

  return format(expiry, 'yyyy-MM-dd');
}

/**
 * Computes membership status, remaining days, elapsed days, and progress percentage.
 * Compared strictly at day granularity to avoid timezone jitter.
 */
export function computeMembership(
  membership: Pick<MembershipDoc, 'planType' | 'startDate' | 'expiryDate'>,
  currentDateInput: Date | string = new Date()
): ComputedMembership {
  const now = typeof currentDateInput === 'string' ? parseISO(currentDateInput) : currentDateInput;
  const today = startOfDay(now);

  const start = startOfDay(parseISO(membership.startDate));
  const expiry = startOfDay(parseISO(membership.expiryDate));

  const totalDays = Math.max(1, differenceInCalendarDays(expiry, start));
  const daysRemaining = differenceInCalendarDays(expiry, today);
  const daysElapsed = differenceInCalendarDays(today, start);

  let status: MembershipStatus;
  let statusLabel: string;
  let isUrgent = false;

  if (today < start) {
    status = 'not_yet_active';
    statusLabel = 'Not Yet Active';
  } else if (today > expiry) {
    status = 'expired';
    statusLabel = 'Expired';
  } else if (daysRemaining <= 7) {
    status = 'urgent';
    statusLabel = 'Urgent (Expiring in ≤7d)';
    isUrgent = true;
  } else if (daysRemaining <= 30) {
    status = 'expiring_soon';
    statusLabel = 'Expiring Soon';
  } else {
    status = 'active';
    statusLabel = 'Active';
  }

  const rawPercent = (daysElapsed / totalDays) * 100;
  const percentElapsed = Math.min(100, Math.max(0, Math.round(rawPercent)));

  return {
    planType: membership.planType,
    startDate: membership.startDate,
    expiryDate: membership.expiryDate,
    totalDays,
    daysRemaining: Math.max(0, daysRemaining),
    daysElapsed: Math.max(0, daysElapsed),
    percentElapsed,
    status,
    statusLabel,
    isUrgent,
  };
}

export function formatFriendlyDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    return format(d, 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function getTodayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
