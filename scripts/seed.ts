import * as admin from 'firebase-admin';
import { format, subDays, addDays, addMonths } from 'date-fns';
import {
  SEEDED_QUOTES,
  SEEDED_HEALTH_FACTS,
  SEEDED_ARTICLES,
  SEEDED_CHALLENGES,
} from '../src/features/health-hub/contentData';

// Ensure emulator hosts are configured
process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';

const PROJECT_ID = 'demo-fitsphere';

if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: PROJECT_ID,
  });
}

const auth = admin.auth();
const db = admin.firestore();

// Deterministic UIDs
export const TRAINER_UID = 'trainer_demo_uid';
export const ATHLETE_UID = 'user_demo_uid';

export async function seedDatabase() {
  console.log('🌱 [FitSphere Seed] Starting idempotent seed process...');

  // 1. Create or Update Auth Users with Custom Claims
  console.log('🔐 Setting up Auth accounts and custom claims...');

  // Trainer Account
  try {
    await auth.getUser(TRAINER_UID);
    console.log('  Trainer user exists, updating password and claims...');
    await auth.updateUser(TRAINER_UID, {
      email: 'trainer@fitsphere.demo',
      password: 'Trainer@123',
      displayName: 'Coach Marcus',
    });
  } catch {
    console.log('  Creating trainer user...');
    await auth.createUser({
      uid: TRAINER_UID,
      email: 'trainer@fitsphere.demo',
      password: 'Trainer@123',
      displayName: 'Coach Marcus',
    });
  }
  await auth.setCustomUserClaims(TRAINER_UID, { role: 'trainer' });

  // Athlete (User) Account
  try {
    await auth.getUser(ATHLETE_UID);
    console.log('  Athlete user exists, updating password and claims...');
    await auth.updateUser(ATHLETE_UID, {
      email: 'user@fitsphere.demo',
      password: 'User@123',
      displayName: 'Alex Mercer',
    });
  } catch {
    console.log('  Creating athlete user...');
    await auth.createUser({
      uid: ATHLETE_UID,
      email: 'user@fitsphere.demo',
      password: 'User@123',
      displayName: 'Alex Mercer',
    });
  }
  await auth.setCustomUserClaims(ATHLETE_UID, { role: 'user' });

  // 2. Users Collection
  console.log('👤 Writing users/{uid} documents...');
  await db.collection('users').doc(TRAINER_UID).set(
    {
      uid: TRAINER_UID,
      email: 'trainer@fitsphere.demo',
      displayName: 'Coach Marcus',
      role: 'trainer',
      createdAt: new Date('2026-01-01').toISOString(),
    },
    { merge: true }
  );

  await db.collection('users').doc(ATHLETE_UID).set(
    {
      uid: ATHLETE_UID,
      email: 'user@fitsphere.demo',
      displayName: 'Alex Mercer',
      role: 'user',
      createdAt: new Date('2026-01-01').toISOString(),
    },
    { merge: true }
  );

  // 3. Profiles Collection
  console.log('📋 Writing profiles/{uid} documents...');
  await db.collection('profiles').doc(ATHLETE_UID).set(
    {
      uid: ATHLETE_UID,
      displayName: 'Alex Mercer',
      email: 'user@fitsphere.demo',
      age: 28,
      heightCm: 182,
      currentWeightKg: 80.2,
      targetWeightKg: 75.0,
      goals: ['Hypertrophy & Strength', 'Drop Bodyfat to 12%', 'Sub-20min 5K'],
      fitnessLevel: 'intermediate',
      notes:
        'Focus on controlled eccentric phase during squat and hinge patterns. Foam roll thoracic spine prior to overhead pressing. Target 3,000 mL hydration daily.',
      waterTargetMl: 3000,
      calorieTarget: 2400,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // 4. Membership: 3-month plan with ~65 days remaining
  console.log('💳 Writing memberships/{uid} document with dynamic calendar dates...');
  const today = new Date();
  const membershipStartDate = subDays(today, 25);
  // Add 3 calendar months using addMonths
  const membershipExpiryDate = addMonths(membershipStartDate, 3);

  await db.collection('memberships').doc(ATHLETE_UID).set(
    {
      uid: ATHLETE_UID,
      planType: '3m',
      startDate: format(membershipStartDate, 'yyyy-MM-dd'),
      expiryDate: format(membershipExpiryDate, 'yyyy-MM-dd'),
      updatedBy: 'trainer',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // 5. Workout Plans
  console.log('🏋️ Writing workoutPlans documents...');
  const workoutPlans = [
    {
      id: 'plan_upper_hypertrophy',
      title: 'Upper Body Power & Hypertrophy',
      description: 'Heavy compound horizontal and vertical pressing paired with back volume.',
      category: 'Hypertrophy',
      difficulty: 'Intermediate',
      durationMin: 55,
      createdBy: TRAINER_UID,
      createdAt: new Date('2026-01-10').toISOString(),
      exercises: [
        { exerciseId: 'ex_bench', name: 'Barbell Bench Press', sets: 4, reps: '6-8', restSec: 90, notes: 'Retract scapulae and drive through feet' },
        { exerciseId: 'ex_row', name: 'Barbell Bent-Over Row', sets: 4, reps: '8-10', restSec: 90, notes: 'Pull bar to sternum' },
        { exerciseId: 'ex_ohp', name: 'Overhead Standing Press', sets: 3, reps: '8-10', restSec: 75, notes: 'Lock out fully at top' },
        { exerciseId: 'ex_pullup', name: 'Weighted Pull-Ups', sets: 3, reps: '6-8', restSec: 90, notes: 'Full dead-hang stretch' },
        { exerciseId: 'ex_curls', name: 'Incline Dumbbell Bicep Curls', sets: 3, reps: '10-12', restSec: 60, notes: 'Strict form, no swinging' },
      ],
    },
    {
      id: 'plan_lower_strength',
      title: 'Lower Body Posterior Chain & Squat',
      description: 'High mechanical tension on quads, glutes, and posterior chain.',
      category: 'Strength',
      difficulty: 'Advanced',
      durationMin: 60,
      createdBy: TRAINER_UID,
      createdAt: new Date('2026-01-12').toISOString(),
      exercises: [
        { exerciseId: 'ex_squat', name: 'Barbell Back Squat', sets: 4, reps: '5-6', restSec: 120, notes: 'Hit parallel or below' },
        { exerciseId: 'ex_rdl', name: 'Romanian Deadlift', sets: 4, reps: '8-10', restSec: 90, notes: 'Hinge deeply at hips' },
        { exerciseId: 'ex_lunge', name: 'Bulgarian Split Squats', sets: 3, reps: '10-12', restSec: 75, notes: 'Slight torso forward lean' },
        { exerciseId: 'ex_calf', name: 'Standing Calf Raises', sets: 4, reps: '12-15', restSec: 45, notes: '2 second pause at bottom' },
      ],
    },
    {
      id: 'plan_hiit_conditioning',
      title: 'Full Body HIIT & Engine Protocol',
      description: 'Metabolic conditioning to elevate VO2 max and accelerate calorie expenditure.',
      category: 'HIIT',
      difficulty: 'Intermediate',
      durationMin: 35,
      createdBy: TRAINER_UID,
      createdAt: new Date('2026-01-15').toISOString(),
      exercises: [
        { exerciseId: 'ex_kbs', name: 'Kettlebell Swings', sets: 4, reps: '20', restSec: 45, notes: 'Explosive hip extension' },
        { exerciseId: 'ex_burpee', name: 'Chest-to-Floor Burpees', sets: 4, reps: '15', restSec: 45, notes: 'Rhythmic pacing' },
        { exerciseId: 'ex_plank', name: 'RKC Hollow Body Plank', sets: 4, reps: '45s', restSec: 30, notes: 'Maximal tension recruitment' },
      ],
    },
  ];

  for (const plan of workoutPlans) {
    await db.collection('workoutPlans').doc(plan.id).set(plan, { merge: true });
  }

  // 6. Assignments for this week & today
  console.log('📅 Writing assignments...');
  const assignments = [
    {
      id: 'asgn_today',
      planId: 'plan_upper_hypertrophy',
      userId: ATHLETE_UID,
      scheduledDate: format(today, 'yyyy-MM-dd'),
      status: 'scheduled',
      assignedBy: TRAINER_UID,
      createdAt: new Date().toISOString(),
      planTitle: 'Upper Body Power & Hypertrophy',
      category: 'Hypertrophy',
      durationMin: 55,
    },
    {
      id: 'asgn_plus2',
      planId: 'plan_lower_strength',
      userId: ATHLETE_UID,
      scheduledDate: format(addDays(today, 2), 'yyyy-MM-dd'),
      status: 'scheduled',
      assignedBy: TRAINER_UID,
      createdAt: new Date().toISOString(),
      planTitle: 'Lower Body Posterior Chain & Squat',
      category: 'Strength',
      durationMin: 60,
    },
    {
      id: 'asgn_plus4',
      planId: 'plan_hiit_conditioning',
      userId: ATHLETE_UID,
      scheduledDate: format(addDays(today, 4), 'yyyy-MM-dd'),
      status: 'scheduled',
      assignedBy: TRAINER_UID,
      createdAt: new Date().toISOString(),
      planTitle: 'Full Body HIIT & Engine Protocol',
      category: 'HIIT',
      durationMin: 35,
    },
  ];

  for (const asgn of assignments) {
    await db.collection('assignments').doc(asgn.id).set(asgn, { merge: true });
  }

  // 7. 4–6 Weeks of Historical Sessions
  console.log('📊 Writing 4-6 weeks of completed sessions...');
  for (let i = 28; i >= 1; i -= 3) {
    const sessionDate = subDays(today, i);
    const sessId = `sess_hist_${i}`;
    const plan = i % 2 === 0 ? workoutPlans[0] : workoutPlans[1];

    await db.collection('sessions').doc(sessId).set(
      {
        id: sessId,
        userId: ATHLETE_UID,
        planId: plan.id,
        planTitle: plan.title,
        startedAt: sessionDate.toISOString(),
        endedAt: new Date(sessionDate.getTime() + 52 * 60 * 1000).toISOString(),
        activeDurationSec: 52 * 60,
        status: 'completed',
        sets: plan.exercises.flatMap((ex) => [
          { exerciseId: ex.exerciseId, exerciseName: ex.name, setNumber: 1, reps: 10, weightKg: 70, completed: true },
          { exerciseId: ex.exerciseId, exerciseName: ex.name, setNumber: 2, reps: 10, weightKg: 75, completed: true },
          { exerciseId: ex.exerciseId, exerciseName: ex.name, setNumber: 3, reps: 8, weightKg: 80, completed: true },
        ]),
      },
      { merge: true }
    );
  }

  // 8. 4–6 Weeks of Progress (Bodyweight logs)
  console.log('⚖️ Writing weight history progression...');
  let startWeight = 83.5;
  for (let i = 35; i >= 0; i -= 2) {
    const logDate = subDays(today, i);
    const dateStr = format(logDate, 'yyyy-MM-dd');
    const progId = `prog_${dateStr}`;
    // Steady downward trend from 83.5 to 80.2 kg
    const weight = +(startWeight - ((35 - i) / 35) * 3.3).toFixed(1);

    await db.collection('progress').doc(progId).set(
      {
        id: progId,
        userId: ATHLETE_UID,
        date: dateStr,
        weightKg: weight,
        bodyFat: +(16.5 - ((35 - i) / 35) * 1.5).toFixed(1),
        notes: i === 0 ? 'Current morning weigh-in' : 'Consistent progress',
        createdAt: logDate.toISOString(),
      },
      { merge: true }
    );
  }

  // 9. Today's Meals & Hydration
  console.log('🥗 Writing today nutrition & hydration logs...');
  const todayStr = format(today, 'yyyy-MM-dd');

  const todayMeals = [
    { id: `nutr_${todayStr}_1`, userId: ATHLETE_UID, date: todayStr, mealType: 'breakfast', foodName: 'Oatmeal with Whey Protein & Blueberries', calories: 520, protein: 42, carbs: 65, fat: 8, createdAt: new Date().toISOString() },
    { id: `nutr_${todayStr}_2`, userId: ATHLETE_UID, date: todayStr, mealType: 'lunch', foodName: 'Grilled Chicken Bowl with Brown Rice & Avocado', calories: 680, protein: 55, carbs: 70, fat: 18, createdAt: new Date().toISOString() },
    { id: `nutr_${todayStr}_3`, userId: ATHLETE_UID, date: todayStr, mealType: 'snack', foodName: 'Greek Yogurt with Almonds & Honey', calories: 280, protein: 24, carbs: 20, fat: 10, createdAt: new Date().toISOString() },
  ];

  for (const m of todayMeals) {
    await db.collection('nutrition').doc(m.id).set(m, { merge: true });
  }

  const todayWaterLogs = [
    { id: `hyd_${todayStr}_1`, userId: ATHLETE_UID, date: todayStr, amountMl: 500, loggedAt: new Date(today.getTime() - 4 * 3600000).toISOString() },
    { id: `hyd_${todayStr}_2`, userId: ATHLETE_UID, date: todayStr, amountMl: 750, loggedAt: new Date(today.getTime() - 2 * 3600000).toISOString() },
    { id: `hyd_${todayStr}_3`, userId: ATHLETE_UID, date: todayStr, amountMl: 500, loggedAt: new Date().toISOString() },
  ];

  for (const w of todayWaterLogs) {
    await db.collection('hydration').doc(w.id).set(w, { merge: true });
  }

  // 10. Quotes & Health Facts (50+ each)
  console.log(`💡 Seeding ${SEEDED_QUOTES.length} quotes and ${SEEDED_HEALTH_FACTS.length} verified health facts...`);
  for (const q of SEEDED_QUOTES) {
    await db.collection('quotes').doc(q.id).set(q, { merge: true });
  }

  for (const f of SEEDED_HEALTH_FACTS) {
    await db.collection('healthFacts').doc(f.id).set(f, { merge: true });
  }

  // 11. Articles & Challenges
  console.log('📚 Writing articles & challenges...');
  for (const art of SEEDED_ARTICLES) {
    await db.collection('articles').doc(art.id).set(art, { merge: true });
  }

  for (const ch of SEEDED_CHALLENGES) {
    await db.collection('challenges').doc(ch.id).set(ch, { merge: true });
  }

  // 12. Starter Notifications & Starter Favorites
  console.log('🔔 Writing starter notifications...');
  await db.collection(`notifications/${ATHLETE_UID}/items`).doc('notif_welcome').set(
    {
      id: 'notif_welcome',
      title: 'Welcome to FitSphere',
      body: 'Coach Marcus has reviewed your profile and assigned your introductory mesocycle.',
      read: false,
      createdAt: new Date().toISOString(),
      type: 'system',
    },
    { merge: true }
  );

  console.log('✅ [FitSphere Seed] Idempotent seeding completed successfully!');
}

// Execute if run directly from CLI
if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ [FitSphere Seed] Error during seed:', err);
      process.exit(1);
    });
}
