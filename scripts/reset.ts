import * as admin from 'firebase-admin';
import { seedDatabase } from './seed';

process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';

const PROJECT_ID = 'demo-fitsphere';

if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: PROJECT_ID,
  });
}

const db = admin.firestore();

async function deleteCollection(collectionPath: string, batchSize = 100) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(query: FirebaseFirestore.Query, resolve: (val?: any) => void) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}

async function resetAndReseed() {
  console.log('🧹 [FitSphere Reset] Clearing emulator collections...');

  const collections = [
    'users',
    'profiles',
    'memberships',
    'workoutPlans',
    'exerciseLibrary',
    'assignments',
    'sessions',
    'progress',
    'nutrition',
    'hydration',
    'quotes',
    'healthFacts',
    'articles',
    'challenges',
  ];

  for (const col of collections) {
    try {
      await deleteCollection(col);
      console.log(`  Cleared /${col}`);
    } catch (e) {
      console.warn(`  Notice clearing ${col}:`, e);
    }
  }

  console.log('🔄 Collections wiped. Running fresh idempotent seed...');
  await seedDatabase();
  console.log('✨ [FitSphere Reset] Database reset & reseed complete!');
}

resetAndReseed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Reset error:', err);
    process.exit(1);
  });
