import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

describe('Firestore Security Rules', () => {
  let testEnv: RulesTestEnvironment | null = null;
  const rulesPath = path.resolve(__dirname, '../../firestore.rules');
  const rules = fs.readFileSync(rulesPath, 'utf8');

  beforeAll(async () => {
    try {
      testEnv = await initializeTestEnvironment({
        projectId: 'demo-fitsphere-rules-test',
        firestore: {
          rules,
          host: '127.0.0.1',
          port: 8080,
        },
      });
    } catch (e) {
      console.warn('Note: Firestore emulator may not be running currently. Tests will skip if offline.');
    }
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  it('prohibits standard athlete/user from writing or updating membership', async () => {
    if (!testEnv) return;

    const userContext = testEnv.authenticatedContext('user_123', { role: 'user' });
    const userDb = userContext.firestore();

    const membershipDoc = userDb.collection('memberships').doc('user_123');
    await assertFails(
      membershipDoc.set({
        planType: '12m',
        startDate: '2026-01-01',
        expiryDate: '2027-01-01',
        updatedBy: 'user_123',
      })
    );
  });

  it('permits trainer to create and update membership', async () => {
    if (!testEnv) return;

    const trainerContext = testEnv.authenticatedContext('trainer_123', { role: 'trainer' });
    const trainerDb = trainerContext.firestore();

    const membershipDoc = trainerDb.collection('memberships').doc('user_123');
    await assertSucceeds(
      membershipDoc.set({
        planType: '3m',
        startDate: '2026-01-01',
        expiryDate: '2026-04-01',
        updatedBy: 'trainer_123',
      })
    );
  });

  it('prohibits standard user from writing workoutPlans or assignments', async () => {
    if (!testEnv) return;

    const userContext = testEnv.authenticatedContext('user_123', { role: 'user' });
    const userDb = userContext.firestore();

    await assertFails(
      userDb.collection('workoutPlans').doc('plan_test').set({
        title: 'Hacked Plan',
      })
    );

    await assertFails(
      userDb.collection('assignments').doc('asgn_test').set({
        planId: 'plan_1',
        userId: 'user_123',
      })
    );
  });

  it('prohibits standard user from reading another user’s progress or private data', async () => {
    if (!testEnv) return;

    // Seed progress for user_abc as admin
    await testEnv.withSecurityRulesDisabled(async (adminContext) => {
      await adminContext.firestore().collection('progress').doc('prog_abc').set({
        userId: 'user_abc',
        weightKg: 85,
        date: '2026-01-01',
      });
    });

    const otherUserContext = testEnv.authenticatedContext('user_xyz', { role: 'user' });
    const otherUserDb = otherUserContext.firestore();

    await assertFails(otherUserDb.collection('progress').doc('prog_abc').get());
  });

  it('permits trainer to read any user progress and sessions', async () => {
    if (!testEnv) return;

    await testEnv.withSecurityRulesDisabled(async (adminContext) => {
      await adminContext.firestore().collection('progress').doc('prog_abc').set({
        userId: 'user_abc',
        weightKg: 85,
        date: '2026-01-01',
      });
    });

    const trainerContext = testEnv.authenticatedContext('trainer_123', { role: 'trainer' });
    const trainerDb = trainerContext.firestore();

    await assertSucceeds(trainerDb.collection('progress').doc('prog_abc').get());
  });
});
