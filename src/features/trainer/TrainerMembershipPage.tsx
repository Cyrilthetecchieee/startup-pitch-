import React, { useState, useEffect } from 'react';
import { subscribeMembership, updateMembershipDoc } from '@/lib/repositories';
import { MembershipDoc } from '@/types';
import { MembershipCard } from '@/features/membership/MembershipCard';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { CreditCard, ShieldCheck, Info } from 'lucide-react';

export const TrainerMembershipPage: React.FC = () => {
  const athleteUid = 'user_demo_uid';
  const [membership, setMembership] = useState<MembershipDoc | null>(null);

  useEffect(() => {
    return subscribeMembership(athleteUid, setMembership);
  }, [athleteUid]);

  const handleUpdate = async (updates: Partial<MembershipDoc>) => {
    await updateMembershipDoc(athleteUid, { ...updates, updatedBy: 'trainer' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-lime-400" />
          Athlete Membership Administration
        </h2>
        <p className="text-xs text-gray-400">
          Modify membership plan tiers, start/expiry terms, and verify client live-sync.
        </p>
      </div>

      <MembershipCard membership={membership} isTrainer={true} onUpdate={handleUpdate} />

      <SpotlightCard className="p-6">
        <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-lime-400" />
          Engine Specifications & Calendar Clamping
        </h3>

        <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
          <p>
            • <strong className="text-white">Deterministic Calendar Math:</strong> Expirations are computed with <code className="text-lime-400">date-fns addMonths</code>, ensuring month-end clamping (e.g. Jan 31 + 1 month correctly clamps to Feb 28 or Feb 29 in leap years).
          </p>
          <p>
            • <strong className="text-white">Day Granularity:</strong> All statuses and countdown days are compared with day-level boundaries in local time, completely eliminating fractional millisecond or timezone jitter.
          </p>
          <p>
            • <strong className="text-white">Zero Trust Architecture:</strong> Membership status is always computed dynamically on the client at render time from canonical ISO dates, never blindly read as a static string.
          </p>
        </div>
      </SpotlightCard>
    </div>
  );
};
