import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MembershipDoc, PlanType } from '@/types';
import { calculateExpiryDate, getTodayDateString } from '@/lib/dates';
import { ShieldCheck, Calendar, Clock } from 'lucide-react';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMembership: MembershipDoc | null;
  onSave: (updates: Partial<MembershipDoc>) => Promise<void>;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  initialMembership,
  onSave,
}) => {
  const [planType, setPlanType] = useState<PlanType>(initialMembership?.planType || '3m');
  const [startDate, setStartDate] = useState<string>(
    initialMembership?.startDate || getTodayDateString()
  );
  const [customDays, setCustomDays] = useState<number>(30);
  const [expiryDate, setExpiryDate] = useState<string>(
    initialMembership?.expiryDate || calculateExpiryDate(getTodayDateString(), '3m')
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const calculated = calculateExpiryDate(
        startDate,
        planType,
        planType === 'custom' ? customDays : undefined
      );
      setExpiryDate(calculated);
    } catch {
      // ignore transient invalid date input
    }
  }, [planType, startDate, customDays]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        planType,
        startDate,
        expiryDate,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const planOptions: { type: PlanType; label: string; desc: string }[] = [
    { type: '1m', label: '1 Month', desc: 'Standard Monthly' },
    { type: '3m', label: '3 Months', desc: 'Quarterly Transformation' },
    { type: '6m', label: '6 Months', desc: 'Half-Year Commitment' },
    { type: '12m', label: '12 Months', desc: 'Annual Peak Mastery' },
    { type: 'custom', label: 'Custom', desc: 'Custom Days' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Athlete Membership" maxWidth="md">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
            Select Plan Duration
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {planOptions.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setPlanType(opt.type)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  planType === opt.type
                    ? 'border-lime-500 bg-lime-500/10 text-white shadow-lime-sm'
                    : 'border-dark-border bg-dark-base text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="text-xs font-bold text-gray-100">{opt.label}</div>
                <div className="text-[10px] text-gray-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {planType === 'custom' && (
          <Input
            label="Duration in Days"
            type="number"
            min={1}
            max={730}
            value={customDays}
            onChange={(e) => setCustomDays(Number(e.target.value))}
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4 text-gray-400" />}
          />

          <Input
            label="Computed Expiry Date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            leftIcon={<Clock className="w-4 h-4 text-lime-400" />}
          />
        </div>

        <div className="p-3 rounded-lg bg-dark-base border border-dark-border text-xs text-gray-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
          <span>Calculated with calendar-month clamping (via date-fns). Updates user dashboard in real time.</span>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" isLoading={loading}>
            Save Membership
          </Button>
        </div>
      </form>
    </Modal>
  );
};
