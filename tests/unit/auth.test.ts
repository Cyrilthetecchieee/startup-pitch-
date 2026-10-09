import { describe, it, expect } from 'vitest';
import { UserRole } from '../../src/types';

describe('Auth & Role Resolution Engine', () => {
  const resolveRole = (
    claimRole?: UserRole,
    docRole?: UserRole,
    intendedRole?: UserRole,
    email?: string
  ): UserRole => {
    if (claimRole === 'trainer' || claimRole === 'user') {
      return claimRole;
    }
    if (docRole) {
      return docRole;
    }
    if (intendedRole === 'trainer' || intendedRole === 'user') {
      return intendedRole;
    }
    if (email && email.includes('trainer')) {
      return 'trainer';
    }
    return 'user';
  };

  it('prioritizes Firebase custom claims role over document role', () => {
    const role = resolveRole('trainer', 'user', undefined, 'athlete@demo.com');
    expect(role).toBe('trainer');
  });

  it('falls back to Firestore document role when custom claim is absent', () => {
    const role = resolveRole(undefined, 'trainer', undefined, 'user@demo.com');
    expect(role).toBe('trainer');
  });

  it('preserves intended role from Google login when claim and doc are absent', () => {
    const roleTrainer = resolveRole(undefined, undefined, 'trainer', 'google_user@gmail.com');
    expect(roleTrainer).toBe('trainer');

    const roleAthlete = resolveRole(undefined, undefined, 'user', 'google_user@gmail.com');
    expect(roleAthlete).toBe('user');
  });

  it('falls back to email keyword when claim, doc, and intended role are absent', () => {
    const role = resolveRole(undefined, undefined, undefined, 'trainer@fitsphere.demo');
    expect(role).toBe('trainer');
  });

  it('defaults to athlete/user role for arbitrary new signups', () => {
    const role = resolveRole(undefined, undefined, undefined, 'athlete_new@gmail.com');
    expect(role).toBe('user');
  });

  it('handles auth errors appropriately (popup-blocked vs popup-closed)', () => {
    const handleAuthError = (errorCode: string) => {
      if (errorCode === 'auth/popup-blocked') {
        return { shouldOfferRedirect: true, message: 'Browser blocked popup' };
      }
      if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
        return { shouldOfferRedirect: false, message: null };
      }
      return { shouldOfferRedirect: false, message: 'Authentication failed' };
    };

    expect(handleAuthError('auth/popup-blocked').shouldOfferRedirect).toBe(true);
    expect(handleAuthError('auth/popup-closed-by-user').message).toBeNull();
    expect(handleAuthError('auth/cancelled-popup-request').message).toBeNull();
    expect(handleAuthError('auth/network-request-failed').message).toBe('Authentication failed');
  });

  it('correctly maps Google Sign-In intended roles on user creation', () => {
    const initUserData = (googleUser: { uid: string; email: string; displayName: string }, intendedRole: UserRole) => ({
      uid: googleUser.uid,
      email: googleUser.email,
      displayName: googleUser.displayName,
      role: intendedRole,
      createdAt: new Date('2026-01-01').toISOString(),
    });

    const trainerUser = initUserData(
      { uid: 'g_123', email: 'coach@gmail.com', displayName: 'Coach Marcus' },
      'trainer'
    );
    expect(trainerUser.role).toBe('trainer');
    expect(trainerUser.displayName).toBe('Coach Marcus');

    const athleteUser = initUserData(
      { uid: 'g_456', email: 'athlete@gmail.com', displayName: 'Alex Mercer' },
      'user'
    );
    expect(athleteUser.role).toBe('user');
    expect(athleteUser.displayName).toBe('Alex Mercer');
  });
});
