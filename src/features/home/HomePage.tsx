import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { BlurText } from '@/components/reactbits/BlurText';
import { GradientText } from '@/components/reactbits/GradientText';
import { StarBorder } from '@/components/reactbits/StarBorder';
import { CountUp } from '@/components/reactbits/CountUp';
import { TiltedCard } from '@/components/reactbits/TiltedCard';
import {
  Dumbbell,
  Shield,
  User,
  ArrowRight,
  Sparkles,
  Flame,
  Droplets,
  Clock,
  TrendingUp,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Zap,
  Award,
  Layers,
  Heart,
  Activity,
  Menu,
  X,
  Database,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SEEDED_QUOTES, SEEDED_HEALTH_FACTS } from '@/features/health-hub/contentData';

export const HomePage: React.FC = () => {
  const { user, role, login } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  const handleQuickDemo = async (email: string, pass: string, targetPath: string) => {
    setDemoLoading(email);
    try {
      await login(email, pass);
      navigate(targetPath);
    } catch (err) {
      console.error('Quick demo error:', err);
      navigate('/login');
    } finally {
      setDemoLoading(null);
    }
  };

  const handleNextWisdom = () => {
    setQuoteIndex((prev) => (prev + 1) % SEEDED_QUOTES.length);
    setFactIndex((prev) => (prev + 1) % SEEDED_HEALTH_FACTS.length);
  };

  const currentQuote = SEEDED_QUOTES[quoteIndex] || SEEDED_QUOTES[0];
  const currentFact = SEEDED_HEALTH_FACTS[factIndex] || SEEDED_HEALTH_FACTS[0];

  return (
    <div className="min-h-screen bg-dark-base text-gray-100 selection:bg-lime-500 selection:text-black">
      {/* Background Ambient Glow Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-150px] left-1/4 w-[550px] h-[450px] bg-lime-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[100px] right-1/4 w-[500px] h-[450px] bg-cyan-500/10 rounded-full blur-[160px]" />
      </div>

      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-dark-base/80 border-b border-dark-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-dark-card border border-lime-500/30 flex items-center justify-center shadow-lime-sm group-hover:border-lime-400 group-hover:scale-105 transition-all">
              <Dumbbell className="w-5 h-5 text-lime-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <ShinyText text="FitSphere" speed={3} className="text-xl font-extrabold" />
              </span>
              <span className="text-[10px] tracking-wider uppercase text-lime-400/90 font-mono font-semibold">
                Performance OS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-lime-400 transition-colors">
              Platform Features
            </a>
            <a href="#athletes-coaches" className="hover:text-lime-400 transition-colors">
              Athletes & Coaches
            </a>
            <a href="#wisdom-boost" className="hover:text-lime-400 transition-colors">
              5-Min Boost
            </a>
            <a href="#plans" className="hover:text-lime-400 transition-colors">
              Memberships
            </a>
            <a href="#demo" className="hover:text-lime-400 transition-colors">
              Demo Suite
            </a>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(role === 'trainer' ? '/trainer' : '/user')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Go to Dashboard ({role === 'trainer' ? 'Coach' : 'Athlete'})
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-gray-300 hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Launch App
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-dark-border bg-dark-card px-4 pt-3 pb-6 space-y-4">
            <div className="flex flex-col space-y-3 text-sm font-medium">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-lime-400"
              >
                Platform Features
              </a>
              <a
                href="#athletes-coaches"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-lime-400"
              >
                Athletes & Coaches
              </a>
              <a
                href="#wisdom-boost"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-lime-400"
              >
                5-Min Boost
              </a>
              <a
                href="#plans"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-lime-400"
              >
                Memberships
              </a>
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-lime-400"
              >
                Demo Suite
              </a>
            </div>
            <div className="pt-3 border-t border-dark-border flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                {user ? 'Open Dashboard' : 'Sign In / Demo Access'}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-dark-elevated border border-lime-500/30 text-xs font-medium text-gray-300 shadow-lime-sm">
            <span className="flex h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-gray-400">Powered by</span>
            <span className="text-lime-400 font-bold">Google Firebase & Cloud Firestore</span>
            <span className="text-gray-600">|</span>
            <span className="text-cyan-400 font-semibold">Zero-Drift Timers</span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Next-Generation <br />
            <GradientText
              colors={['#CCFF00', '#A8D900', '#22D3EE', '#CCFF00']}
              animationSpeed={3.5}
              className="text-4xl sm:text-6xl md:text-7xl"
            >
              Performance Fitness
            </GradientText>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl font-normal leading-relaxed">
            Unite precision athlete execution with elite coach orchestration. Real-time set logging,
            caloric and hydration balance, verifiable progression curves, and peer-reviewed health intelligence.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              className="shadow-lime-glow text-base px-8 py-3.5"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started Free
            </Button>

            <a href="#demo">
              <Button
                variant="secondary"
                size="lg"
                className="text-base px-6 py-3.5 border-dark-border"
                leftIcon={<Play className="w-4 h-4 text-lime-400" />}
              >
                Try Instant Demo
              </Button>
            </a>
          </div>

          {/* Key Metric Highlights with CountUp */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full pt-12 max-w-4xl">
            <div className="p-4 rounded-xl border border-dark-border/80 bg-dark-card/60 backdrop-blur-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime-400 font-mono">
                <CountUp to={50} suffix="+" duration={1.5} />
              </span>
              <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">
                Verified Facts
              </span>
            </div>

            <div className="p-4 rounded-xl border border-dark-border/80 bg-dark-card/60 backdrop-blur-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                <CountUp to={100} suffix="%" duration={1.2} />
              </span>
              <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">
                Realtime Sync
              </span>
            </div>

            <div className="p-4 rounded-xl border border-dark-border/80 bg-dark-card/60 backdrop-blur-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                <CountUp to={0} prefix="< " suffix="ms" duration={0.8} />
              </span>
              <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">
                Timer Drift
              </span>
            </div>

            <div className="p-4 rounded-xl border border-dark-border/80 bg-dark-card/60 backdrop-blur-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime-400 font-mono">
                <CountUp to={14} suffix="-Day" duration={1.4} />
              </span>
              <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">
                Active Streaks
              </span>
            </div>
          </div>
        </div>

        {/* 3. Hero Visual Showcase / Interactive App Teaser */}
        <div className="mt-16 max-w-5xl mx-auto">
          <TiltedCard maxAngle={4} className="w-full">
            <div className="rounded-2xl border border-dark-border bg-dark-card/90 shadow-2xl p-4 sm:p-6 backdrop-blur-xl relative overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-dark-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-mono text-gray-400">
                    fitsphere.app • Athlete Execution Engine
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="lime" size="sm">
                    Live Session
                  </Badge>
                </div>
              </div>

              {/* Showcase Inner Mock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Workout Card */}
                <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Today's Mesocycle
                    </span>
                    <Flame className="w-4 h-4 text-lime-400" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Upper Body Power & Hypertrophy</h4>
                  <p className="text-xs text-gray-400">Barbell Bench Press, Bent Rows, OHP</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono">
                    <span className="text-lime-400 font-bold">4 Sets × 8 Reps</span>
                    <span className="text-gray-400">Rest: 90s</span>
                  </div>
                </div>

                {/* Nutrition Ring Mock */}
                <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Daily Fuel & Water
                    </span>
                    <Droplets className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-extrabold text-white font-mono">1,480 / 2,400</span>
                    <span className="text-xs text-lime-400 font-bold">62% Cal</span>
                  </div>
                  <div className="w-full bg-dark-surface rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-lime-500 to-cyan-400 h-2 rounded-full w-[62%]" />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>Hydration: 1,750 mL</span>
                    <span className="text-cyan-400">Target: 3,000 mL</span>
                  </div>
                </div>

                {/* Membership Engine Mock */}
                <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Subscription Engine
                    </span>
                    <Shield className="w-4 h-4 text-lime-400" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">3-Month Transformation</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="lime" size="sm">
                      Active
                    </Badge>
                    <span className="text-xs font-mono text-gray-400">65 days remaining</span>
                  </div>
                  <div className="pt-1 text-[11px] text-gray-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Clamped calendar date math</span>
                  </div>
                </div>
              </div>
            </div>
          </TiltedCard>
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section id="features" className="py-20 border-t border-dark-border/60 bg-dark-base/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-lime-400">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for Athletes Who Demand Precision
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Every detail is engineered with zero bloat. Instant Firestore synchronization, calibrated rest
              timers, and clean ergonomics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <SpotlightCard className="hover:border-lime-500/50">
              <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400 mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero-Drift Workout Player</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Elapsed timers calculated from true timestamps with accurate paused accumulators.
                Log sets, loads, and reps in real time with skippable rest timers and celebration feedback.
              </p>
            </SpotlightCard>

            {/* Feature 2 */}
            <SpotlightCard className="hover:border-cyan-500/50">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Precision Macro & Hydration</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Log breakfast, lunch, dinner, snacks, and water entries seamlessly. Real-time calorie and
                macronutrient rings keep your nutritional targets aligned with training load.
              </p>
            </SpotlightCard>

            {/* Feature 3 */}
            <SpotlightCard className="hover:border-lime-500/50">
              <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400 mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Biometrics & Progress Curves</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Continuous weigh-in telemetry charted over weeks. Track body composition shifts, total
                volume loads, and visual trends backed by real Firestore historical documents.
              </p>
            </SpotlightCard>

            {/* Feature 4 */}
            <SpotlightCard className="hover:border-lime-500/50">
              <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Five-Minute Fitness Boost</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Auto-rotating motivational wisdom and verified scientific fitness facts every 300 seconds.
                Derives countdown from fixed target timestamps to eliminate timer jitter.
              </p>
            </SpotlightCard>

            {/* Feature 5 */}
            <SpotlightCard className="hover:border-cyan-500/50">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Peer-Reviewed Health Hub</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Access over 50+ curated citations from ACSM, WHO, NIH, and Harvard Health. Bookmark
                favorites directly to your personal Firestore profile.
              </p>
            </SpotlightCard>

            {/* Feature 6 */}
            <SpotlightCard className="hover:border-lime-500/50">
              <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400 mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dynamic Membership Engine</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Calendar-month clamping for exact monthly renewals. Real-time active, expiring, and urgent
                countdown calculations mirrored between coach and athlete screens.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* 5. Dual Roles: Athlete vs Coach */}
      <section id="athletes-coaches" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400">
            Unified Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tailored Experiences For Athletes & Coaches
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            FitSphere uses role-based access control with secure claims to provide athletes and trainers with
            dedicated control centres.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Athlete View Card */}
          <div className="p-8 rounded-2xl border border-cyan-500/30 bg-dark-card relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <User className="w-6 h-6" />
                </div>
                <Badge variant="cyan" size="sm">
                  Athlete Suite
                </Badge>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">For Athletes</h3>
                <p className="text-sm text-gray-400">
                  Execute training routines prescribed by your coach, monitor your daily wellness metrics,
                  and build consistency.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Today's assigned workout with one-tap start</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Set logging with poundage, reps, and rest alerts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Daily food macro and water logging rings</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Interactive weight loss / hypertrophy charts</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleQuickDemo('user@fitsphere.demo', 'User@123', '/user')}
                isLoading={demoLoading === 'user@fitsphere.demo'}
                className="w-full border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Experience Athlete Dashboard
              </Button>
            </div>
          </div>

          {/* Trainer View Card */}
          <div className="p-8 rounded-2xl border border-lime-500/30 bg-dark-card relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400">
                  <Shield className="w-6 h-6" />
                </div>
                <Badge variant="lime" size="sm">
                  Trainer Suite
                </Badge>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">For Coaches & Trainers</h3>
                <p className="text-sm text-gray-400">
                  Architect progressive routines, schedule calendar assignments, manage memberships, and
                  audit athlete compliance.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Workout Builder with customizable movements and rest timers</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Multi-athlete scheduling calendar with instant assignments</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Real-time subscription & membership term management</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Science article curation & motivational quote publisher</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleQuickDemo('trainer@fitsphere.demo', 'Trainer@123', '/trainer')}
                isLoading={demoLoading === 'trainer@fitsphere.demo'}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Experience Coach Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Live "Five-Minute Boost" Interactive Showcase */}
      <section id="wisdom-boost" className="py-20 border-t border-dark-border/60 bg-dark-card/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-lime-400">
              Micro-Habit Psychology
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              The Five-Minute Fitness Boost
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              A hallmark FitSphere feature: every 5 minutes, our algorithm surfaces non-repeating
              motivational quotes and verified physiological health evidence.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-lime-500/30 bg-dark-card shadow-card-dark relative space-y-6">
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-lime-400" />
                <span className="text-sm font-bold text-white">Live Wisdom Preview</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextWisdom}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Shuffle Tip
              </Button>
            </div>

            <div className="space-y-4">
              {/* Quote */}
              <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
                <span className="text-[11px] font-mono text-lime-400 uppercase tracking-wider block mb-1">
                  Daily Mindset • {currentQuote.category}
                </span>
                <blockquote className="text-base sm:text-lg text-white font-medium italic">
                  "{currentQuote.text}"
                </blockquote>
                <p className="text-xs text-gray-400 mt-2 font-semibold">— {currentQuote.author}</p>
              </div>

              {/* Fact */}
              <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  Peer-Reviewed Science • {currentFact.category}
                </span>
                <p className="text-sm sm:text-base text-gray-200">{currentFact.text}</p>
                <p className="text-xs text-gray-400 mt-2 font-mono">Source: {currentFact.sourceName}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Membership & Subscription Plans */}
      <section id="plans" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-lime-400">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Flexible Membership Architecture
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Equipped with calendar-month clamping math. Active memberships update instantaneously in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 1 Month */}
          <div className="p-6 rounded-xl border border-dark-border bg-dark-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-gray-400 uppercase">Short Term</span>
              <h3 className="text-lg font-bold text-white mt-1">1-Month Sprint</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-white font-mono">$29</span>
                <span className="text-xs text-gray-400"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Full Workout Player access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Daily food & water logging</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Coach messaging</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/login')}
                className="w-full text-xs"
              >
                Select 1 Month
              </Button>
            </div>
          </div>

          {/* 3 Months (Highlighted with StarBorder) */}
          <StarBorder color="#CCFF00" speed="3s" className="w-full">
            <div className="p-6 flex flex-col justify-between h-full bg-dark-card rounded-[11px]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-lime-400 font-bold uppercase">Most Popular</span>
                  <Badge variant="lime" size="sm">
                    Recommended
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">3-Month Transformation</h3>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-lime-400 font-mono">$24</span>
                  <span className="text-xs text-gray-400"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-gray-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>All 1-Month features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Personalized workout builder</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Biometric trend analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Health Hub bookmarking</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="w-full text-xs"
                >
                  Start 3 Months
                </Button>
              </div>
            </div>
          </StarBorder>

          {/* 6 Months */}
          <div className="p-6 rounded-xl border border-dark-border bg-dark-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-gray-400 uppercase">Committed</span>
              <h3 className="text-lg font-bold text-white mt-1">6-Month Season</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-white font-mono">$19</span>
                <span className="text-xs text-gray-400"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>All Transformation perks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Coach workout assignments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Priority Firestore sync</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/login')}
                className="w-full text-xs"
              >
                Select 6 Months
              </Button>
            </div>
          </div>

          {/* 12 Months */}
          <div className="p-6 rounded-xl border border-dark-border bg-dark-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-gray-400 uppercase">Annual Pro</span>
              <h3 className="text-lg font-bold text-white mt-1">12-Month Pro Athlete</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-white font-mono">$15</span>
                <span className="text-xs text-gray-400"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Unlimited routine generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Lifetime biometrics export</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Direct trainer support line</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/login')}
                className="w-full text-xs"
              >
                Select 12 Months
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Instant Demo Suite Access */}
      <section id="demo" className="py-20 border-t border-dark-border/60 bg-dark-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-lime-400">
              Immediate Evaluation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Explore FitSphere in 1-Click
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto mt-2">
              No registration or credit card needed. Jump directly into pre-populated accounts seeded with
              historical workouts, macros, and calendar plans.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Trainer Demo Button */}
            <button
              onClick={() => handleQuickDemo('trainer@fitsphere.demo', 'Trainer@123', '/trainer')}
              disabled={!!demoLoading}
              className="p-5 rounded-xl border border-dark-border bg-dark-elevated hover:border-lime-500 hover:bg-dark-surface transition-all text-left flex items-center justify-between group disabled:opacity-50"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-lime-500/10 text-lime-400 group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Coach Marcus</h4>
                  <p className="text-xs text-lime-400 font-medium">Trainer / Coach View</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-lime-400 transition-colors" />
            </button>

            {/* Athlete Demo Button */}
            <button
              onClick={() => handleQuickDemo('user@fitsphere.demo', 'User@123', '/user')}
              disabled={!!demoLoading}
              className="p-5 rounded-xl border border-dark-border bg-dark-elevated hover:border-cyan-500 hover:bg-dark-surface transition-all text-left flex items-center justify-between group disabled:opacity-50"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Alex Mercer</h4>
                  <p className="text-xs text-cyan-400 font-medium">Athlete / User View</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
            </button>
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <span>Or sign in with custom credentials / Google Auth</span>
              <ChevronRight className="w-3.5 h-3.5 text-lime-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-dark-border bg-dark-base py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-dark-card border border-lime-500/30 flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base">FitSphere</span>
              <p className="text-[11px] text-gray-500">© 2026 FitSphere. Performance Fitness Architecture.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-400">
            <a href="#features" className="hover:text-lime-400 transition-colors">
              Features
            </a>
            <a href="#plans" className="hover:text-lime-400 transition-colors">
              Pricing
            </a>
            <Link to="/login" className="hover:text-lime-400 transition-colors">
              Sign In
            </Link>
            <span className="inline-flex items-center gap-1.5 text-lime-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              Firebase Connected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
