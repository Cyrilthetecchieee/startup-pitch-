import React, { useState } from 'react';
import { ProgressEntry, WorkoutSession } from '@/types';
import { addProgress } from '@/lib/repositories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { CountUp } from '@/components/reactbits/CountUp';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { LineChart as ChartIcon, Plus, Flame, Award, Dumbbell, TrendingDown } from 'lucide-react';
import { getTodayDateString } from '@/lib/dates';

interface ProgressTrackerProps {
  userId: string;
  progressEntries: ProgressEntry[];
  sessions: WorkoutSession[];
  targetWeightKg?: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  userId,
  progressEntries,
  sessions,
  targetWeightKg = 75,
}) => {
  const [newWeight, setNewWeight] = useState<number | ''>('');
  const [newBodyFat, setNewBodyFat] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Latest weight
  const sortedEntries = [...progressEntries].sort((a, b) => a.date.localeCompare(b.date));
  const latestEntry = sortedEntries[sortedEntries.length - 1];
  const currentWeight = latestEntry?.weightKg || 80;

  // Chart data
  const chartData = sortedEntries.map((entry) => ({
    date: entry.date.slice(5), // MM-DD
    weight: entry.weightKg,
    bodyFat: entry.bodyFat,
  }));

  // Workouts by week chart data
  const sessionChartData = sessions.slice(0, 10).reverse().map((s) => ({
    name: s.planTitle.slice(0, 12),
    duration: Math.round(s.activeDurationSec / 60),
  }));

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight === '') return;

    setSubmitting(true);
    try {
      const entry: ProgressEntry = {
        id: `prog_${Date.now()}`,
        userId,
        date: getTodayDateString(),
        weightKg: Number(newWeight),
        bodyFat: newBodyFat ? Number(newBodyFat) : undefined,
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      await addProgress(entry);
      setNewWeight('');
      setNewBodyFat('');
      setNotes('');
    } catch (err) {
      console.error('Failed to log weight entry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SpotlightCard className="p-5">
          <span className="text-[11px] font-semibold uppercase text-gray-400 block mb-1">
            Current Bodyweight
          </span>
          <div className="text-3xl font-black text-lime-400">
            <CountUp to={currentWeight} decimals={1} />
            <span className="text-sm text-gray-400 ml-1 font-normal">kg</span>
          </div>
          <span className="text-xs text-gray-400 mt-1 block">
            Target Goal: {targetWeightKg} kg
          </span>
        </SpotlightCard>

        <SpotlightCard className="p-5">
          <span className="text-[11px] font-semibold uppercase text-gray-400 block mb-1">
            Completed Sessions
          </span>
          <div className="text-3xl font-black text-cyan-400">
            <CountUp to={sessions.filter((s) => s.status === 'completed').length} />
            <span className="text-sm text-gray-400 ml-1 font-normal">workouts</span>
          </div>
          <span className="text-xs text-gray-400 mt-1 block">
            Consistent physical adaptation
          </span>
        </SpotlightCard>

        <SpotlightCard className="p-5">
          <span className="text-[11px] font-semibold uppercase text-gray-400 block mb-1">
            Active Training Streak
          </span>
          <div className="text-3xl font-black text-amber-400 flex items-center gap-1.5">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
            <CountUp to={14} />
            <span className="text-sm text-gray-400 font-normal">days</span>
          </div>
          <span className="text-xs text-gray-400 mt-1 block">Top 5% consistency tier</span>
        </SpotlightCard>
      </div>

      {/* Bodyweight Trend Chart */}
      <SpotlightCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <ChartIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bodyweight Progression</h3>
              <p className="text-xs text-gray-400">Historical trend across logged weigh-ins</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242B35" />
              <XAxis dataKey="date" stroke="#8E9AA8" fontSize={11} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#8E9AA8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121518',
                  borderColor: '#2A313D',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#CCFF00"
                strokeWidth={2.5}
                dot={{ fill: '#CCFF00', r: 4 }}
                activeDot={{ r: 6, fill: '#FFFFFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SpotlightCard>

      {/* Log Weight Form */}
      <SpotlightCard className="p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-lime-400" />
          Log Today's Bodyweight
        </h3>

        <form onSubmit={handleLogWeight} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            min={30}
            max={300}
            placeholder="78.5"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value === '' ? '' : Number(e.target.value))}
            required
          />

          <Input
            label="Body Fat % (Optional)"
            type="number"
            step="0.1"
            min={3}
            max={60}
            placeholder="15.2"
            value={newBodyFat}
            onChange={(e) => setNewBodyFat(e.target.value === '' ? '' : Number(e.target.value))}
          />

          <Button variant="primary" size="md" type="submit" isLoading={submitting}>
            Record Weigh-In
          </Button>
        </form>
      </SpotlightCard>
    </div>
  );
};
