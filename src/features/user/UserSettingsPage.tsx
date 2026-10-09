import React, { useState, useEffect } from 'react';
import { subscribeUserProfile, updateUserProfileDoc } from '@/lib/repositories';
import { UserProfile } from '@/types';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Settings, Save, Check, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export const UserSettingsPage: React.FC = () => {
  const { user, role } = useAuth();
  const userId = user?.uid || 'user_demo_uid';

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState<number>(28);
  const [heightCm, setHeightCm] = useState<number>(182);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(75);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    return subscribeUserProfile(userId, (p) => {
      if (p) {
        setProfile(p);
        setDisplayName(p.displayName || 'Alex Mercer');
        setAge(p.age || 28);
        setHeightCm(p.heightCm || 182);
        setTargetWeightKg(p.targetWeightKg || 75);
      }
    });
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfileDoc(userId, {
        displayName,
        age: Number(age),
        heightCm: Number(heightCm),
        targetWeightKg: Number(targetWeightKg),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to update profile settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-lime-400" />
          Account & Biometric Settings
        </h2>
        <p className="text-xs text-gray-400">
          Configure your personal metrics and account profile details.
        </p>
      </div>

      <SpotlightCard className="p-6">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-dark-border">
          <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 font-bold text-lg">
            {displayName ? displayName.charAt(0) : 'U'}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{displayName || 'Athlete'}</h3>
            <span className="text-xs text-gray-400">{user?.email || 'user@fitsphere.demo'}</span>
            <div className="mt-1">
              <Badge variant="cyan" size="sm">
                Role: {role}
              </Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Age (Years)"
              type="number"
              min={14}
              max={110}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />

            <Input
              label="Height (cm)"
              type="number"
              min={100}
              max={250}
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              required
            />

            <Input
              label="Target Weight (kg)"
              type="number"
              step="0.5"
              min={30}
              max={250}
              value={targetWeightKg}
              onChange={(e) => setTargetWeightKg(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            {saved ? (
              <span className="text-xs text-lime-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Settings updated successfully!
              </span>
            ) : (
              <span className="text-xs text-gray-500">Changes reflect instantly across platform.</span>
            )}

            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
};
