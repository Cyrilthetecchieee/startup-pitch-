import React, { useState } from 'react';
import { WorkoutPlan, ExerciseItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2, Dumbbell, Clock, Layers, Flame, Save, Edit3 } from 'lucide-react';
import { saveWorkoutPlan, deleteWorkoutPlan } from '@/lib/repositories';
import { useAuth } from '@/features/auth/AuthContext';

interface WorkoutBuilderProps {
  plans: WorkoutPlan[];
  onPlanSelected?: (plan: WorkoutPlan) => void;
}

export const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ plans, onPlanSelected }) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkoutPlan['category']>('Strength');
  const [difficulty, setDifficulty] = useState<WorkoutPlan['difficulty']>('Intermediate');
  const [durationMin, setDurationMin] = useState(45);
  const [exercises, setExercises] = useState<ExerciseItem[]>([
    {
      exerciseId: 'ex_squat',
      name: 'Barbell Back Squat',
      sets: 4,
      reps: '8-10',
      restSec: 90,
      notes: 'Focus on depth and bracing core',
    },
  ]);
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingPlan(null);
    setTitle('');
    setDescription('');
    setCategory('Strength');
    setDifficulty('Intermediate');
    setDurationMin(45);
    setExercises([
      {
        exerciseId: `ex_${Date.now()}`,
        name: 'Barbell Back Squat',
        sets: 4,
        reps: '8-10',
        restSec: 90,
      },
    ]);
    setModalOpen(true);
  };

  const openEditModal = (plan: WorkoutPlan) => {
    setEditingPlan(plan);
    setTitle(plan.title);
    setDescription(plan.description);
    setCategory(plan.category);
    setDifficulty(plan.difficulty);
    setDurationMin(plan.durationMin);
    setExercises(plan.exercises);
    setModalOpen(true);
  };

  const addExerciseRow = () => {
    setExercises([
      ...exercises,
      {
        exerciseId: `ex_${Date.now()}_${exercises.length}`,
        name: 'New Exercise',
        sets: 3,
        reps: '10-12',
        restSec: 60,
      },
    ]);
  };

  const removeExerciseRow = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExerciseField = (index: number, field: keyof ExerciseItem, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || exercises.length === 0) return;

    setSaving(true);
    try {
      const planToSave: WorkoutPlan = {
        id: editingPlan?.id || `plan_${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        durationMin: Number(durationMin),
        createdBy: user?.uid || 'trainer',
        exercises,
        createdAt: editingPlan?.createdAt || new Date().toISOString(),
      };

      await saveWorkoutPlan(planToSave);
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save workout plan:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (confirm('Are you sure you want to delete this workout plan?')) {
      await deleteWorkoutPlan(planId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Workout Plan Builder</h2>
          <p className="text-xs text-gray-400">
            Design targeted routines with sets, reps, and custom rest protocols.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Create New Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <SpotlightCard key={plan.id} className="p-5 flex flex-col justify-between hover:border-lime-500/40">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="lime" size="sm">{plan.category}</Badge>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-lime-400" />
                  {plan.durationMin} mins
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{plan.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 mb-4">
                {plan.description || 'Targeted training protocol.'}
              </p>

              <div className="p-3 rounded-lg bg-dark-base border border-dark-border mb-4 space-y-1.5">
                <div className="text-[11px] font-semibold uppercase text-gray-400">
                  Exercises ({plan.exercises.length})
                </div>
                {plan.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} className="text-xs text-gray-300 flex justify-between">
                    <span className="truncate">{ex.name}</span>
                    <span className="text-lime-400 font-mono text-[11px]">
                      {ex.sets}×{ex.reps}
                    </span>
                  </div>
                ))}
                {plan.exercises.length > 3 && (
                  <div className="text-[10px] text-gray-500 italic">
                    +{plan.exercises.length - 3} more movements
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-dark-border gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => openEditModal(plan)}
              >
                Edit
              </Button>
              <button
                type="button"
                onClick={() => handleDelete(plan.id)}
                className="p-2 rounded-lg text-gray-500 hover:text-coral-400 hover:bg-coral-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Plan Builder Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlan ? 'Edit Workout Plan' : 'Create Workout Plan'}
        maxWidth="lg"
      >
        <form onSubmit={handleSavePlan} className="space-y-4">
          <Input
            label="Plan Title"
            value={title}
            placeholder="e.g. Upper Body Hypertrophy Focus"
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Description"
            value={description}
            placeholder="Focuses on progressive overload across horizontal and vertical pressing."
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-lime-500 focus:outline-none"
              >
                <option value="Strength">Strength</option>
                <option value="Hypertrophy">Hypertrophy</option>
                <option value="Cardio">Cardio</option>
                <option value="HIIT">HIIT</option>
                <option value="Mobility">Mobility</option>
                <option value="Core">Core</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-lime-500 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <Input
              label="Duration (Mins)"
              type="number"
              min={10}
              max={180}
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
            />
          </div>

          {/* Exercise items list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Exercises & Prescription ({exercises.length})
              </label>
              <button
                type="button"
                onClick={addExerciseRow}
                className="text-xs text-lime-400 hover:text-lime-300 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Movement</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {exercises.map((ex, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-dark-base border border-dark-border grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Exercise Name"
                      value={ex.name}
                      onChange={(e) => updateExerciseField(index, 'name', e.target.value)}
                      className="w-full bg-dark-card border border-dark-border rounded px-2.5 py-1 text-xs text-white focus:border-lime-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Sets"
                      min={1}
                      max={20}
                      value={ex.sets}
                      onChange={(e) => updateExerciseField(index, 'sets', Number(e.target.value))}
                      className="w-full bg-dark-card border border-dark-border rounded px-2 py-1 text-xs text-white focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Reps (e.g. 10-12)"
                      value={ex.reps}
                      onChange={(e) => updateExerciseField(index, 'reps', e.target.value)}
                      className="w-full bg-dark-card border border-dark-border rounded px-2 py-1 text-xs text-white focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Rest(s)"
                      min={0}
                      max={600}
                      value={ex.restSec}
                      onChange={(e) => updateExerciseField(index, 'restSec', Number(e.target.value))}
                      className="w-full bg-dark-card border border-dark-border rounded px-2 py-1 text-xs text-white focus:border-lime-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      disabled={exercises.length <= 1}
                      onClick={() => removeExerciseRow(index)}
                      className="text-gray-500 hover:text-coral-400 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-dark-border">
            <Button variant="secondary" size="md" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
              Save Plan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
