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
import { Dumbbell, Shield, User, ArrowRight, Sparkles, Info, Database, Check } from 'lucide-react';
import { seedLiveFirebase } from '@/lib/clientSeed';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

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
        // Automatically initialize if first time
        handleSeedLiveAndLogin(email, pass);
      } else {
        setAuthError(err.message || 'Login error');
        setSubmitting(false);
      }
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
      setAuthError(`Seed error: ${e.message}`);
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
              text="Connected to fitsphere-e74d5 Firebase Project"
              className="text-xs text-gray-400 justify-center font-mono"
            />
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-lime-500/20 bg-lime-500/5 p-3 text-xs text-lime-300">
          <Info className="w-4 h-4 shrink-0 text-lime-400 mt-0.5" />
          <div>
            <span className="font-bold">Project Connected:</span> Click either account below to sign in or auto-initialize live demo data.
          </div>
        </div>

        {/* Quick Demo Login Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            disabled={submitting || seeding}
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
            disabled={submitting || seeding}
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
