import React, { useState, useEffect } from 'react';
import {
  subscribeWorkoutPlans,
  subscribeAssignments,
  saveAssignment,
  updateAssignmentStatus,
} from '@/lib/repositories';
import { WorkoutPlan, WorkoutAssignment } from '@/types';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { CalendarCheck, Plus, Dumbbell, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import { getTodayDateString, formatFriendlyDate } from '@/lib/dates';

export const TrainerAssignments: React.FC = () => {
  const athleteUid = 'user_demo_uid';
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [assignments, setAssignments] = useState<WorkoutAssignment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(getTodayDateString());
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const unsubPlans = subscribeWorkoutPlans(setPlans);
    const unsubAssignments = subscribeAssignments(athleteUid, setAssignments);
    return () => {
      unsubPlans();
      unsubAssignments();
    };
  }, [athleteUid]);

  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans, selectedPlanId]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !scheduledDate) return;

    setAssigning(true);
    try {
      const plan = plans.find((p) => p.id === selectedPlanId);
      const newAssignment: WorkoutAssignment = {
        id: `asgn_${Date.now()}`,
        planId: selectedPlanId,
        userId: athleteUid,
        scheduledDate,
        status: 'scheduled',
        assignedBy: 'trainer',
        createdAt: new Date().toISOString(),
        planTitle: plan?.title || 'Workout Session',
        category: plan?.category || 'Strength',
        durationMin: plan?.durationMin || 45,
      };

      await saveAssignment(newAssignment);
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to assign workout:', err);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-lime-400" />
            Workout Assignments & Schedule
          </h2>
          <p className="text-xs text-gray-400">
            Assign training routines to the athlete calendar with immediate sync.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Assign Workout
        </Button>
      </div>

      {/* Assignments List */}
      <SpotlightCard className="p-6">
        <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-4">
          All Scheduled & Historical Assignments ({assignments.length})
        </h3>

        {assignments.length === 0 ? (
          <p className="text-xs text-gray-500 py-8 text-center">
            No assignments recorded. Click "Assign Workout" above to schedule a routine.
          </p>
        ) : (
          <div className="divide-y divide-dark-border">
            {assignments.map((item) => (
              <div key={item.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.planTitle || 'Workout'}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span className="font-mono text-lime-400">
                        {formatFriendlyDate(item.scheduledDate)}
                      </span>
                      <span>•</span>
                      <span>{item.category || 'General'}</span>
                      <span>•</span>
                      <span>{item.durationMin || 45} mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={item.status === 'completed' ? 'lime' : 'cyan'}>
                    {item.status}
                  </Badge>

                  {item.status === 'scheduled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateAssignmentStatus(item.id, 'completed')}
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SpotlightCard>

      {/* Assign Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Assign Workout to Athlete"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
              Select Workout Plan
            </label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-lime-500 focus:outline-none"
              required
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.category} • {p.durationMin}m)
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Scheduled Date"
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={assigning}>
              Schedule Workout
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
