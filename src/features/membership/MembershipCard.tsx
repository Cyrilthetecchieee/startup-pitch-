import React, { useState } from 'react';
import { MembershipDoc } from '@/types';
import { computeMembership, formatFriendlyDate } from '@/lib/dates';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { CountUp } from '@/components/reactbits/CountUp';
import { CreditCard, Calendar, Clock, AlertTriangle, ShieldCheck, Edit3 } from 'lucide-react';
import { MembershipModal } from './MembershipModal';

interface MembershipCardProps {
  membership: MembershipDoc | null;
  isTrainer?: boolean;
  onUpdate?: (updates: Partial<MembershipDoc>) => Promise<void>;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  membership,
  isTrainer = false,
  onUpdate,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!membership) {
    return (
      <SpotlightCard className="p-6 border-dashed border-dark-border text-center">
        <CreditCard className="w-8 h-8 text-gray-500 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No active membership assigned yet.</p>
        {isTrainer && onUpdate && (
          <Button
            size="sm"
            className="mt-3"
            onClick={() => setModalOpen(true)}
          >
            Create Membership Plan
          </Button>
        )}
        {isTrainer && onUpdate && (
          <MembershipModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            initialMembership={null}
            onSave={async (data) => {
              await onUpdate(data);
              setModalOpen(false);
            }}
          />
        )}
      </SpotlightCard>
    );
  }

  const computed = computeMembership(membership);

  return (
    <>
      <SpotlightCard
        className={`relative overflow-hidden transition-all ${
          computed.isUrgent
            ? 'border-coral-500/50 shadow-[0_0_25px_-5px_rgba(255,77,77,0.25)]'
            : 'border-dark-border hover:border-lime-500/40'
        }`}
      >
        {/* Glow corner for urgent status */}
        {computed.isUrgent && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-coral-500/10 rounded-full blur-2xl pointer-events-none" />
        )}

        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                computed.isUrgent
                  ? 'bg-coral-500/10 text-coral-400 border-coral-500/30'
                  : 'bg-lime-500/10 text-lime-400 border-lime-500/30'
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white uppercase tracking-wider">
                  {membership.planType === 'custom'
                    ? 'Custom Term'
                    : `${membership.planType.replace('m', ' Month')} Access`}
                </h4>
                <Badge status={computed.status}>{computed.statusLabel}</Badge>
              </div>
              <p className="text-xs text-gray-400">
                Managed membership • Continuous fitness oversight
              </p>
            </div>
          </div>

          {isTrainer && onUpdate && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={() => setModalOpen(true)}
            >
              Adjust Plan
            </Button>
          )}
        </div>

        {/* Days countdown highlight */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-dark-base border border-dark-border/80 mb-5">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">
              Days Left
            </span>
            <div
              className={`text-2xl font-extrabold ${
                computed.isUrgent
                  ? 'text-coral-400 animate-pulse'
                  : computed.status === 'expiring_soon'
                  ? 'text-amber-400'
                  : 'text-lime-400'
              }`}
            >
              <CountUp to={computed.daysRemaining} duration={0.8} />
              <span className="text-xs text-gray-400 ml-1 font-normal">days</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">
              Start Date
            </span>
            <div className="text-sm font-semibold text-gray-200">
              {formatFriendlyDate(computed.startDate)}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">
              Expiry Date
            </span>
            <div className="text-sm font-semibold text-gray-200">
              {formatFriendlyDate(computed.expiryDate)}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">
              Elapsed
            </span>
            <div className="text-sm font-semibold text-gray-200">
              {computed.percentElapsed}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-gray-400">Membership Timeline Progress</span>
            <span className="text-lime-400">{computed.daysElapsed} / {computed.totalDays} days</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-dark-surface overflow-hidden border border-dark-border">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                computed.isUrgent
                  ? 'bg-coral-500'
                  : computed.status === 'expiring_soon'
                  ? 'bg-amber-400'
                  : 'bg-lime-400'
              }`}
              style={{ width: `${computed.percentElapsed}%` }}
            />
          </div>
        </div>

        {computed.isUrgent && (
          <div className="mt-4 flex items-center gap-2 p-2.5 rounded-lg bg-coral-500/10 border border-coral-500/30 text-xs text-coral-400 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Urgent: Membership expires in {computed.daysRemaining} days. Contact your trainer to renew.</span>
          </div>
        )}
      </SpotlightCard>

      {isTrainer && onUpdate && (
        <MembershipModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialMembership={membership}
          onSave={async (data) => {
            await onUpdate(data);
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
};
