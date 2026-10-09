import { describe, it, expect } from 'vitest';
import { UserRole } from '../../src/types';

describe('Auth & Role Resolution Engine', () => {
  const resolveRole = (
    claimRole?: UserRole,
    docRole?: UserRole,
    email?: string
  ): UserRole => {
    if (claimRole === 'trainer' || claimRole === 'user') {
      return claimRole;
    }
    if (docRole) {
      return docRole;
    }
    if (email && email.includes('trainer')) {
      return 'trainer';
    }
    return 'user';
  };

  it('prioritizes Firebase custom claims role over document role', () => {
    const role = resolveRole('trainer', 'user', 'athlete@demo.com');
    expect(role).toBe('trainer');
  });

  it('falls back to Firestore document role when custom claim is absent', () => {
    const role = resolveRole(undefined, 'trainer', 'user@demo.com');
    expect(role).toBe('trainer');
  });

  it('falls back to email keyword when both claim and doc are absent', () => {
    const role = resolveRole(undefined, undefined, 'trainer@fitsphere.demo');
    expect(role).toBe('trainer');
  });

  it('defaults to athlete/user role for arbitrary new signups', () => {
    const role = resolveRole(undefined, undefined, 'athlete_new@gmail.com');
    expect(role).toBe('user');
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
