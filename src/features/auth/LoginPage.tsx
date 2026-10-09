import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { BlurText } from '@/components/reactbits/BlurText';
import { Dumbbell, Shield, User, ArrowRight, Sparkles, Info, Database } from 'lucide-react';
import { seedLiveFirebase } from '@/lib/clientSeed';
import { UserRole } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      if (data.email.includes('trainer')) {
        navigate('/trainer');
      } else {
        navigate('/user');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setAuthError(
          'Account not found or password incorrect. If this is a fresh project, click "Initialize Demo Accounts" below.'
        );
      } else {
        setAuthError(err.message || 'Failed to authenticate.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    setSubmitting(true);
    setAuthError(null);
    try {
      await login(email, pass);
      if (email.includes('trainer')) {
        navigate('/trainer');
      } else {
        navigate('/user');
      }
    } catch (err: any) {
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        handleSeedLiveAndLogin(email, pass);
      } else {
        setAuthError(err.message || 'Login error');
        setSubmitting(false);
      }
    }
  };

  // Immediate click handler - prevents browser popup-blocker
  const handleGoogleLogin = async (forceRedirect = false) => {
    setGoogleLoading(true);
    setAuthError(null);
    try {
      const resolvedRole = await loginWithGoogle(selectedRole, forceRedirect);
      navigate(resolvedRole === 'trainer' ? '/trainer' : '/user');
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Google authentication failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSeedLiveAndLogin = async (targetEmail?: string, targetPass?: string) => {
    setSeeding(true);
    setAuthError(null);
    try {
      await seedLiveFirebase((status) => setSeedStatus(status));
      setSeedStatus('Initialized! Logging in...');

      if (targetEmail && targetPass) {
        await login(targetEmail, targetPass);
        if (targetEmail.includes('trainer')) {
          navigate('/trainer');
        } else {
          navigate('/user');
        }
      }
    } catch (e: any) {
      console.error('Seeding error:', e);
      setAuthError(`Seed notice: ${e.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-dark-base flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-dark-card border border-lime-500/30 shadow-lime-sm mb-4">
            <Dumbbell className="w-7 h-7 text-lime-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
              <ShinyText text="FitSphere" speed={3} className="text-3xl font-extrabold tracking-tight" />
            </h1>
            <p className="text-xs uppercase tracking-widest text-lime-400 font-semibold mb-2">
              Performance Fitness Management
            </p>
            <BlurText
              text="Google Auth & Live Firebase Connected"
              className="text-xs text-gray-400 justify-center font-mono"
            />
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-lime-500/20 bg-lime-500/5 p-3 text-xs text-lime-300">
          <Info className="w-4 h-4 shrink-0 text-lime-400 mt-0.5" />
          <div>
            <span className="font-bold">Authentication Ready:</span> Sign in with Google or select a demo account below.
          </div>
        </div>

        {/* Google Sign-In with Pre-Selected Role (Direct Click - No Popup Blocker) */}
        <div className="p-4 rounded-xl border border-dark-border bg-dark-card mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Sign in with Google as:</span>
            <span className="text-lime-400 font-bold capitalize">{selectedRole}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('user')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                selectedRole === 'user'
                  ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 shadow-sm'
                  : 'border-dark-border bg-dark-base text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Athlete (User)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('trainer')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                selectedRole === 'trainer'
                  ? 'border-lime-500 bg-lime-500/15 text-lime-300 shadow-sm'
                  : 'border-dark-border bg-dark-base text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Trainer (Coach)</span>
            </button>
          </div>

          <button
            type="button"
            disabled={googleLoading || submitting}
            onClick={() => handleGoogleLogin(false)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-dark-border bg-dark-base hover:bg-dark-elevated hover:border-gray-500 text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {/* Authentic Google 'G' icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'Signing in with Google...' : `Sign in with Google (${selectedRole})`}</span>
          </button>

          <div className="text-center">
            <button
              type="button"
              disabled={googleLoading}
              onClick={() => handleGoogleLogin(true)}
              className="text-[11px] text-gray-500 hover:text-lime-400 hover:underline transition-colors"
            >
              Popup blocked? Click here to use Google Full-Page Redirect
            </button>
          </div>
        </div>

        {/* Quick Demo Login Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            disabled={submitting || seeding || googleLoading}
            onClick={() => handleQuickLogin('trainer@fitsphere.demo', 'Trainer@123')}
            className="group flex flex-col items-start p-3.5 rounded-xl border border-dark-border bg-dark-card hover:border-lime-500/60 hover:bg-dark-elevated transition-all text-left disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="p-1.5 rounded-lg bg-lime-500/10 text-lime-400 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-lime-400 transition-colors" />
            </div>
            <span className="text-xs font-bold text-gray-200">Coach Marcus</span>
            <span className="text-[10px] text-lime-400 font-medium">Trainer Account</span>
          </button>

          <button
            type="button"
            disabled={submitting || seeding || googleLoading}
            onClick={() => handleQuickLogin('user@fitsphere.demo', 'User@123')}
            className="group flex flex-col items-start p-3.5 rounded-xl border border-dark-border bg-dark-card hover:border-cyan-500/60 hover:bg-dark-elevated transition-all text-left disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-xs font-bold text-gray-200">Alex Mercer</span>
            <span className="text-[10px] text-cyan-400 font-medium">Athlete / User</span>
          </button>
        </div>

        {/* Form Card */}
        <SpotlightCard className="border-dark-border/80 shadow-card-dark">
          {authError && (
            <div className="mb-4 rounded-lg border border-coral-500/30 bg-coral-500/10 p-3 text-xs text-coral-400">
              {authError}
            </div>
          )}

          {seedStatus && (
            <div className="mb-4 rounded-lg border border-lime-500/30 bg-lime-500/10 p-3 text-xs text-lime-400 flex items-center gap-2">
              <Database className="w-4 h-4 animate-spin text-lime-400 shrink-0" />
              <span>{seedStatus}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              placeholder="e.g. trainer@fitsphere.demo"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={submitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Platform
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full text-xs text-gray-400"
              isLoading={seeding}
              onClick={() => handleSeedLiveAndLogin()}
              leftIcon={<Database className="w-3.5 h-3.5 text-lime-400" />}
            >
              Initialize Demo Accounts & Seed Data
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-dark-border text-center text-xs text-gray-500 font-mono">
            Firebase: fitsphere-e74d5
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
