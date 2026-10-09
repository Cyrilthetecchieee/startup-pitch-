import React, { useState, useEffect } from 'react';
import { subscribeUserProfile, updateUserProfileDoc } from '@/lib/repositories';
import { UserProfile } from '@/types';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { User, Activity, Target, Save, FileText, Check } from 'lucide-react';

export const TrainerUserManagement: React.FC = () => {
  const athleteUid = 'user_demo_uid';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState('');
  const [calorieTarget, setCalorieTarget] = useState<number>(2400);
  const [waterTargetMl, setWaterTargetMl] = useState<number>(3000);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    return subscribeUserProfile(athleteUid, (p) => {
      if (p) {
        setProfile(p);
        setNotes(p.notes || '');
        setCalorieTarget(p.calorieTarget || 2400);
        setWaterTargetMl(p.waterTargetMl || 3000);
      }
    });
  }, [athleteUid]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfileDoc(athleteUid, {
        notes,
        calorieTarget: Number(calorieTarget),
        waterTargetMl: Number(waterTargetMl),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update athlete profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-lime-400" />
          Athlete Management: {profile?.displayName || 'Alex Mercer'}
        </h2>
        <p className="text-xs text-gray-400">
          Supervise physical biometric profile, nutritional targets, and clinical coaching notes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Biometrics Card */}
        <SpotlightCard className="p-6">
          <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-4">
            Biometrics & Fitness Tier
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-dark-border text-xs">
              <span className="text-gray-400">Age</span>
              <span className="font-bold text-white">{profile?.age || 28} years</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dark-border text-xs">
              <span className="text-gray-400">Height</span>
              <span className="font-bold text-white">{profile?.heightCm || 182} cm</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dark-border text-xs">
              <span className="text-gray-400">Current Weight</span>
              <span className="font-bold text-lime-400">{profile?.currentWeightKg || 80.5} kg</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dark-border text-xs">
              <span className="text-gray-400">Target Goal</span>
              <span className="font-bold text-cyan-400">{profile?.targetWeightKg || 75.0} kg</span>
            </div>
            <div className="flex justify-between items-center py-2 text-xs">
              <span className="text-gray-400">Fitness Level</span>
              <Badge variant="lime" size="sm" className="capitalize">
                {profile?.fitnessLevel || 'intermediate'}
              </Badge>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-dark-border">
            <span className="text-[11px] font-semibold uppercase text-gray-400 block mb-2">
              Primary Objectives
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile?.goals?.map((g, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-dark-base border border-dark-border text-gray-200"
                >
                  🎯 {g}
                </span>
              ))}
            </div>
          </div>
        </SpotlightCard>

        {/* Prescription and Coaching Notes */}
        <SpotlightCard className="p-6 md:col-span-2">
          <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-4">
            Coaching Prescription & Physiological Targets
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Daily Caloric Ceiling (kcal)"
                type="number"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(Number(e.target.value))}
                required
              />

              <Input
                label="Daily Hydration Target (mL)"
                type="number"
                value={waterTargetMl}
                onChange={(e) => setWaterTargetMl(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                Trainer Fitness Notes & Directives
              </label>
              <textarea
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter biomechanical cues, injury prehab recommendations, or focus for the upcoming training block..."
                className="w-full bg-dark-base border border-dark-border rounded-xl p-3.5 text-sm text-gray-100 placeholder-gray-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-xs text-lime-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Notes and targets successfully synchronized!
                </span>
              ) : (
                <span className="text-xs text-gray-500">
                  Visible to athlete on their profile and overview screens.
                </span>
              )}

              <Button
                variant="primary"
                size="md"
                type="submit"
                isLoading={saving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Directives
              </Button>
            </div>
          </form>
        </SpotlightCard>
      </div>
    </div>
  );
};
