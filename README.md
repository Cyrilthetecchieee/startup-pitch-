# FitSphere: Performance Fitness & Workout Platform

FitSphere is a production-grade fitness and workout management platform built with **React 18 + TypeScript + Vite**, **Tailwind CSS**, and **Firebase (Authentication & Cloud Firestore)**. It delivers a dark charcoal and electric lime UI experience powered by custom **React Bits** components.

---

## 1. Key Features

### Role-Based Access Control
- **Trainer (`trainer@fitsphere.demo` / `Trainer@123`)**:
  - **Overview Dashboard**: Unified view of athlete biometrics, active subscription status, weekly schedule, and recent workout logs.
  - **Workout Builder**: Create and edit routines with target sets, reps, rest intervals, and movement notes.
  - **Assignments & Scheduler**: Schedule workout routines for specific calendar dates.
  - **Membership Engine**: Adjust plan duration (1, 3, 6, 12 months, or custom days) and start dates with real-time `onSnapshot` reflection on the user dashboard.
  - **Progress Review**: Audit athlete weigh-in trajectories, sets logged, and volume load.
  - **Content Manager**: Publish and manage motivational quotes and peer-reviewed scientific health facts.

- **Athlete / User (`user@fitsphere.demo` / `User@123`)**:
  - **Athlete Dashboard**: Today's prescribed workout, daily calorie/water rings, 14-day streak, dynamic membership countdown, and the **Five-Minute Fitness Boost**.
  - **Live Workout Player**: Accurate elapsed timer (timestamp + paused accumulator without drift), set-by-set weight and rep logger, skippable rest timer, and completion summary with confetti.
  - **Nutrition & Hydration Diary**: Log breakfast, lunch, dinner, snacks, and water intake with dynamic macro and hydration ring visualizations.
  - **Progress & Weigh-Ins**: Bodyweight tracking with interactive Recharts line charts and metric cards.
  - **Health Education Hub**: Searchable guides, 50+ motivational quotes, 50+ verified scientific health facts (WHO, ACSM, Harvard Health, NIH), and challenges.
  - **Favorites & Bookmarks**: Save quotes, facts, and articles to personal Firestore favorites.

---

## 2. Core Architecture & Immersive UI

- **Design Language**: Dark charcoal (`#0B0D0F`, `#121518`, `#181C22`) and electric lime (`#CCFF00`, `#D4FF00`) with glassmorphism and subtle glow shadows.
- **React Bits Immersive Layer** (located in `src/components/reactbits/`):
  - `SpotlightCard`: Mouse-tracking radial gradient glow.
  - `CountUp`: Smooth number counter.
  - `GradientText`: Animated metallic gradient shimmer.
  - `StarBorder`: Moving border light for high-impact cards.
  - `BlurText`: Smooth blur-to-focus typography.
  - `ShinyText`: Text shimmer on hero headings.
  - `AnimatedList`: Staggered list animations.
  - `TiltedCard`: 3D perspective tilt on hover.
- **Membership Engine**:
  - Implements calendar-month clamping using `date-fns` `addMonths` (e.g., Jan 31 + 1m → Feb 28/29).
  - Status is strictly computed at render time: **Not Yet Active**, **Active**, **Expiring Soon** (≤30d), **Urgent** (≤7d), or **Expired**.
- **Five-Minute Fitness Boost**:
  - Auto-rotates quote and verified fact every 300,000 ms.
  - Managed custom hook `useFiveMinuteBoost` with single target-timestamp derived timer to eliminate drift and React StrictMode double-mounting issues.
  - Non-repeating selection algorithm.

---

## 3. Project Structure

```
fitsphere/
├── public/                     # Static assets & SVG icons
├── src/
│   ├── app/
│   │   └── router.tsx          # Data router, role guards, and route configuration
│   ├── components/
│   │   ├── layout/             # AppLayout, responsive sidebar & topbar
│   │   ├── reactbits/          # SpotlightCard, CountUp, GradientText, StarBorder, etc.
│   │   └── ui/                 # Button, Input, Modal, Badge, RingProgress
│   ├── features/
│   │   ├── auth/               # AuthContext, RequireAuth, RequireRole, LoginPage
│   │   ├── boost/              # useFiveMinuteBoost hook & FiveMinuteBoostCard
│   │   ├── health-hub/         # HealthHub UI & 50+ quotes, facts, articles
│   │   ├── membership/         # MembershipCard & MembershipModal
│   │   ├── nutrition/          # NutritionLogger & macro tracking
│   │   ├── progress/           # ProgressTracker & Recharts
│   │   ├── trainer/            # TrainerDashboard, Assignments, ContentManager, etc.
│   │   ├── user/               # UserDashboard, Workouts, Planner, Favorites, Settings
│   │   └── workouts/           # WorkoutPlayer, useWorkoutSession, WorkoutBuilder
│   ├── lib/
│   │   ├── dates.ts            # Calendar month math & membership computation
│   │   ├── firebase.ts         # Firebase client SDK & emulator bridge
│   │   └── repositories.ts     # Typed Firestore access & onSnapshot hooks
│   ├── types/
│   │   └── index.ts            # Domain TypeScript models
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Design tokens & custom scrollbars
├── scripts/
│   ├── seed.ts                 # Idempotent Firebase Admin seeding script
│   └── reset.ts                # Clear and reseed script
├── tests/
│   ├── setup.ts                # Vitest DOM environment setup
│   ├── unit/                   # Membership, Boost, WorkoutTimer, Nutrition tests
│   └── integration/            # Firestore security rules tests
├── firestore.rules             # Role-enforced Firestore security rules
├── firestore.indexes.json      # Composite query index definitions
├── firebase.json               # Emulator suite ports (Auth: 9099, Firestore: 8080)
├── .env.example                # Emulator environment variable configuration
└── package.json
```

---

## 4. Getting Started & Commands

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm or pnpm

### 1. Installation
```bash
npm install
```

### 2. Start Firebase Local Emulators
```bash
npm run emulators
```
This boots the Firebase Local Emulator Suite with automatic export/import to persist state across sessions:
- **Authentication**: `http://127.0.0.1:9099`
- **Firestore**: `http://127.0.0.1:8080`
- **Emulator UI**: `http://127.0.0.1:4000`

### 3. Seed Database (Idempotent)
In a separate terminal:
```bash
npm run seed
```
To wipe and reseed:
```bash
npm run seed:reset
```

### 4. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

### 5. Running Tests & Building
```bash
# Run unit tests
npm test

# Build production bundle with TypeScript validation
npm run build
```

---

## 5. Demo Accounts

| Role | Email | Password | Custom Claim |
|---|---|---|---|
| **Trainer** | `trainer@fitsphere.demo` | `Trainer@123` | `{ role: 'trainer' }` |
| **Athlete (User)** | `user@fitsphere.demo` | `User@123` | `{ role: 'user' }` |

*Note: The login page includes quick 1-click login buttons for both accounts for instant demonstration.*

---

## 6. Test Results

- **Unit Tests (`tests/unit/`)**: 23/23 passed (100%)
  - `tests/unit/membership.test.ts`: 15 passed (clamping Jan 31 + 1m → Feb 28, not_yet_active, active, expiring_soon, urgent ≤7d, expired, boundary days).
  - `tests/unit/workoutTimer.test.ts`: 3 passed (elapsed time, pause/resume without double-counting, accumulated pause time).
  - `tests/unit/boost.test.ts`: 3 passed (MM:SS formatting, non-repeat selection, target-timestamp drift prevention).
  - `tests/unit/nutritionTotals.test.ts`: 2 passed (calorie, protein, carb, fat sums and hydration % clamp).
- **TypeScript & Production Build**: Passed with zero errors (`tsc && vite build`).
