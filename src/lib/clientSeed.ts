import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { format, subDays, addDays, addMonths } from 'date-fns';
import {
  SEEDED_QUOTES,
  SEEDED_HEALTH_FACTS,
  SEEDED_ARTICLES,
  SEEDED_CHALLENGES,
} from '@/features/health-hub/contentData';

export async function seedLiveFirebase(onProgress?: (status: string) => void) {
  onProgress?.('Setting up Trainer and Athlete accounts...');

  let trainerUid = 'trainer_demo_uid';
  let athleteUid = 'user_demo_uid';

  // 1. Create or login Trainer
  try {
    const cred = await createUserWithEmailAndPassword(auth, 'trainer@fitsphere.demo', 'Trainer@123');
    trainerUid = cred.user.uid;
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      const cred = await signInWithEmailAndPassword(auth, 'trainer@fitsphere.demo', 'Trainer@123');
      trainerUid = cred.user.uid;
    }
  }

  // 2. Set trainer user document
  onProgress?.('Creating Trainer profile...');
  await setDoc(doc(db, 'users', trainerUid), {
    uid: trainerUid,
    email: 'trainer@fitsphere.demo',
    displayName: 'Coach Marcus',
    role: 'trainer',
    createdAt: new Date().toISOString(),
  }, { merge: true });

  // 3. Create or login Athlete User
  onProgress?.('Setting up Athlete account...');
  try {
    const cred = await createUserWithEmailAndPassword(auth, 'user@fitsphere.demo', 'User@123');
    athleteUid = cred.user.uid;
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      const cred = await signInWithEmailAndPassword(auth, 'user@fitsphere.demo', 'User@123');
      athleteUid = cred.user.uid;
    }
  }

  // 4. Set athlete user document
  onProgress?.('Creating Athlete profile & membership...');
  await setDoc(doc(db, 'users', athleteUid), {
    uid: athleteUid,
    email: 'user@fitsphere.demo',
    displayName: 'Alex Mercer',
    role: 'user',
    createdAt: new Date().toISOString(),
  }, { merge: true });

  await setDoc(doc(db, 'profiles', athleteUid), {
    uid: athleteUid,
    displayName: 'Alex Mercer',
    email: 'user@fitsphere.demo',
    age: 28,
    heightCm: 182,
    currentWeightKg: 80.2,
    targetWeightKg: 75.0,
    goals: ['Hypertrophy & Strength', 'Drop Bodyfat to 12%', 'Sub-20min 5K'],
    fitnessLevel: 'intermediate',
    notes: 'Prioritize dynamic hamstring and glute activation prior to heavy hinge movements. Maintain 3,000 mL fluid intake on workout days.',
    waterTargetMl: 3000,
    calorieTarget: 2400,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  const today = new Date();
  const membershipStartDate = subDays(today, 25);
  const membershipExpiryDate = addMonths(membershipStartDate, 3);

  await setDoc(doc(db, 'memberships', athleteUid), {
    uid: athleteUid,
    planType: '3m',
    startDate: format(membershipStartDate, 'yyyy-MM-dd'),
    expiryDate: format(membershipExpiryDate, 'yyyy-MM-dd'),
    updatedBy: trainerUid,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  // 5. Workout Plans
  onProgress?.('Seeding workout plans...');
  const workoutPlans = [
    {
      id: 'plan_upper_hypertrophy',
      title: 'Upper Body Power & Hypertrophy',
      description: 'Heavy compound horizontal and vertical pressing paired with back volume.',
      category: 'Hypertrophy',
      difficulty: 'Intermediate',
      durationMin: 55,
      createdBy: trainerUid,
      createdAt: new Date().toISOString(),
      exercises: [
        { exerciseId: 'ex_bench', name: 'Barbell Bench Press', sets: 4, reps: '6-8', restSec: 90, notes: 'Retract scapulae and drive through feet' },
        { exerciseId: 'ex_row', name: 'Barbell Bent-Over Row', sets: 4, reps: '8-10', restSec: 90, notes: 'Pull bar to sternum' },
        { exerciseId: 'ex_ohp', name: 'Overhead Standing Press', sets: 3, reps: '8-10', restSec: 75, notes: 'Lock out fully at top' },
        { exerciseId: 'ex_pullup', name: 'Weighted Pull-Ups', sets: 3, reps: '6-8', restSec: 90, notes: 'Full dead-hang stretch' },
      ],
    },
    {
      id: 'plan_lower_strength',
      title: 'Lower Body Posterior Chain & Squat',
      description: 'High mechanical tension on quads, glutes, and posterior chain.',
      category: 'Strength',
      difficulty: 'Advanced',
      durationMin: 60,
      createdBy: trainerUid,
      createdAt: new Date().toISOString(),
      exercises: [
        { exerciseId: 'ex_squat', name: 'Barbell Back Squat', sets: 4, reps: '5-6', restSec: 120, notes: 'Hit parallel or below' },
        { exerciseId: 'ex_rdl', name: 'Romanian Deadlift', sets: 4, reps: '8-10', restSec: 90, notes: 'Hinge deeply at hips' },
        { exerciseId: 'ex_lunge', name: 'Bulgarian Split Squats', sets: 3, reps: '10-12', restSec: 75, notes: 'Slight forward lean' },
      ],
    },
  ];

  for (const plan of workoutPlans) {
    await setDoc(doc(db, 'workoutPlans', plan.id), plan, { merge: true });
  }

  // 6. Assignments
  onProgress?.('Scheduling workouts...');
  await setDoc(doc(db, 'assignments', 'asgn_today'), {
    id: 'asgn_today',
    planId: 'plan_upper_hypertrophy',
    userId: athleteUid,
    scheduledDate: format(today, 'yyyy-MM-dd'),
    status: 'scheduled',
    assignedBy: trainerUid,
    createdAt: new Date().toISOString(),
    planTitle: 'Upper Body Power & Hypertrophy',
    category: 'Hypertrophy',
    durationMin: 55,
  }, { merge: true });

  // 7. Seed Quotes, Facts, Articles, Challenges
  onProgress?.('Uploading 50+ quotes and verified facts...');
  for (const q of SEEDED_QUOTES.slice(0, 30)) {
    await setDoc(doc(db, 'quotes', q.id), q, { merge: true });
  }
  for (const f of SEEDED_HEALTH_FACTS.slice(0, 30)) {
    await setDoc(doc(db, 'healthFacts', f.id), f, { merge: true });
  }
  for (const art of SEEDED_ARTICLES) {
    await setDoc(doc(db, 'articles', art.id), art, { merge: true });
  }
  for (const ch of SEEDED_CHALLENGES) {
    await setDoc(doc(db, 'challenges', ch.id), ch, { merge: true });
  }

  // 8. Today's nutrition & water
  const todayStr = format(today, 'yyyy-MM-dd');
  await setDoc(doc(db, 'nutrition', `nutr_${todayStr}_1`), {
    id: `nutr_${todayStr}_1`,
    userId: athleteUid,
    date: todayStr,
    mealType: 'breakfast',
    foodName: 'Oatmeal with Whey Protein & Blueberries',
    calories: 520,
    protein: 42,
    carbs: 65,
    fat: 8,
    createdAt: new Date().toISOString(),
  }, { merge: true });

  await setDoc(doc(db, 'hydration', `hyd_${todayStr}_1`), {
    id: `hyd_${todayStr}_1`,
    userId: athleteUid,
    date: todayStr,
    amountMl: 1250,
    loggedAt: new Date().toISOString(),
  }, { merge: true });

  onProgress?.('Live database seeding completed successfully!');
}
