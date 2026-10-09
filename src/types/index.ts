export type UserRole = 'trainer' | 'user';

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  photoURL?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  goals: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  notes: string;
  waterTargetMl: number;
  calorieTarget: number;
  updatedAt?: string;
}

export type PlanType = '1m' | '3m' | '6m' | '12m' | 'custom';

export type MembershipStatus =
  | 'not_yet_active'
  | 'active'
  | 'expiring_soon' // <= 30 days
  | 'urgent'        // <= 7 days
  | 'expired';

export interface MembershipDoc {
  uid: string;
  planType: PlanType;
  startDate: string; // ISO string YYYY-MM-DD
  expiryDate: string; // ISO string YYYY-MM-DD
  updatedBy: string;
  updatedAt: string;
}

export interface ComputedMembership {
  planType: PlanType;
  startDate: string;
  expiryDate: string;
  totalDays: number;
  daysRemaining: number;
  daysElapsed: number;
  percentElapsed: number;
  status: MembershipStatus;
  statusLabel: string;
  isUrgent: boolean;
}

export interface ExerciseItem {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  category: 'Strength' | 'Hypertrophy' | 'Cardio' | 'HIIT' | 'Mobility' | 'Core';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMin: number;
  createdBy: string;
  exercises: ExerciseItem[];
  createdAt: string;
}

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  muscleGroup: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
  instructions: string[];
  safetyTips: string[];
  media?: string;
  equipment?: string;
}

export interface WorkoutAssignment {
  id: string;
  planId: string;
  userId: string;
  scheduledDate: string; // YYYY-MM-DD
  status: 'scheduled' | 'completed' | 'missed';
  assignedBy: string;
  createdAt: string;
  planTitle?: string;
  category?: string;
  durationMin?: number;
}

export interface SessionSet {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  assignmentId?: string;
  planId: string;
  planTitle: string;
  startedAt: string;
  endedAt?: string;
  activeDurationSec: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  sets: SessionSet[];
  notes?: string;
}

export interface ProgressEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFat?: number;
  notes?: string;
  createdAt: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface NutritionEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
}

export interface HydrationEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  loggedAt: string;
}

export interface QuoteItem {
  id: string;
  text: string;
  category: 'Mindset' | 'Discipline' | 'Resilience' | 'Consistency' | 'Focus';
  author: string;
  isMotivationOnly: true;
}

export interface HealthFactItem {
  id: string;
  text: string;
  category: 'Cardiovascular' | 'Metabolism' | 'Strength' | 'Sleep & Recovery' | 'Nutrition' | 'Longevity' | 'Recovery';
  sourceName: string;
  sourceUrl: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  body: string;
  category: 'Training' | 'Nutrition' | 'Recovery' | 'Injury Prevention';
  tags: string[];
  readTimeMin: number;
  sourceName: string;
  sourceUrl: string;
}

export interface FavoriteItem {
  id: string;
  type: 'quote' | 'fact' | 'workout' | 'article';
  refId: string;
  title?: string;
  snippet?: string;
  savedAt: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  target: number;
  metric: 'workouts' | 'water_ml' | 'calories' | 'active_minutes';
  points: number;
  deadline?: string;
}

export interface AchievementItem {
  id: string;
  badgeId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type?: 'membership' | 'workout' | 'achievement' | 'system';
}
