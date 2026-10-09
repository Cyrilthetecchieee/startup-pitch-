import React, { useState } from 'react';
import { NutritionEntry, HydrationEntry, MealType } from '@/types';
import { addNutrition, deleteNutrition, addHydration } from '@/lib/repositories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { RingProgress } from '@/components/ui/RingProgress';
import { Badge } from '@/components/ui/Badge';
import { Utensils, Droplets, Plus, Trash2, PieChart, Sparkles, Calendar } from 'lucide-react';
import { getTodayDateString } from '@/lib/dates';

interface NutritionLoggerProps {
  userId: string;
  nutritionEntries: NutritionEntry[];
  hydrationEntries: HydrationEntry[];
  calorieTarget?: number;
  waterTargetMl?: number;
}

export const NutritionLogger: React.FC<NutritionLoggerProps> = ({
  userId,
  nutritionEntries,
  hydrationEntries,
  calorieTarget = 2400,
  waterTargetMl = 3000,
}) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  // Meal form state
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [calories, setCalories] = useState<number | ''>('');
  const [protein, setProtein] = useState<number | ''>('');
  const [carbs, setCarbs] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);

  // Totals calculations
  const totalCalories = nutritionEntries.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = nutritionEntries.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = nutritionEntries.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFat = nutritionEntries.reduce((sum, item) => sum + (item.fat || 0), 0);

  const totalWaterMl = hydrationEntries.reduce((sum, item) => sum + (item.amountMl || 0), 0);
  const waterPercent = Math.min(100, Math.round((totalWaterMl / (waterTargetMl || 3000)) * 100));
  const caloriePercent = Math.min(100, Math.round((totalCalories / (calorieTarget || 2400)) * 100));

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || calories === '') return;

    setSubmitting(true);
    try {
      const newEntry: NutritionEntry = {
        id: `nutr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        date: selectedDate,
        mealType,
        foodName: foodName.trim(),
        calories: Number(calories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        createdAt: new Date().toISOString(),
      };

      await addNutrition(newEntry);
      setFoodName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
    } catch (err) {
      console.error('Failed to log meal:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddWater = async (amount: number) => {
    try {
      const newEntry: HydrationEntry = {
        id: `hyd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        date: selectedDate,
        amountMl: amount,
        loggedAt: new Date().toISOString(),
      };
      await addHydration(newEntry);
    } catch (err) {
      console.error('Failed to log water:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calories & Macros Card */}
        <SpotlightCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Daily Calorie Target</h3>
                <span className="text-xs text-gray-400">Target: {calorieTarget} kcal</span>
              </div>
            </div>
            <RingProgress percentage={caloriePercent} size={70} strokeWidth={6} color="#CCFF00">
              <span className="text-xs font-bold text-lime-400">{caloriePercent}%</span>
            </RingProgress>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-dark-base border border-dark-border text-center">
            <div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase block mb-0.5">
                Protein
              </span>
              <span className="text-sm font-bold text-lime-400">{totalProtein}g</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase block mb-0.5">
                Carbs
              </span>
              <span className="text-sm font-bold text-cyan-400">{totalCarbs}g</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase block mb-0.5">
                Fat
              </span>
              <span className="text-sm font-bold text-amber-400">{totalFat}g</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Hydration Card */}
        <SpotlightCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Hydration Tracker</h3>
                <span className="text-xs text-gray-400">
                  {totalWaterMl} / {waterTargetMl} mL
                </span>
              </div>
            </div>
            <RingProgress percentage={waterPercent} size={70} strokeWidth={6} color="#00E5FF">
              <span className="text-xs font-bold text-cyan-400">{waterPercent}%</span>
            </RingProgress>
          </div>

          {/* Quick Water Log Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              onClick={() => handleAddWater(250)}
            >
              +250 ml (Glass)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              onClick={() => handleAddWater(500)}
            >
              +500 ml (Bottle)
            </Button>
          </div>
        </SpotlightCard>
      </div>

      {/* Meal Entry Form */}
      <SpotlightCard className="p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-lime-400" />
          Log Meal or Snack
        </h3>

        <form onSubmit={handleAddMeal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                Meal Category
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2.5 text-sm text-gray-100 focus:border-lime-500 focus:outline-none"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <Input
                label="Food / Meal Description"
                placeholder="e.g. Grilled Chicken Breast with Quinoa"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="Calories (kcal)"
              type="number"
              min={0}
              placeholder="450"
              value={calories}
              onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
              required
            />
            <Input
              label="Protein (g)"
              type="number"
              min={0}
              placeholder="38"
              value={protein}
              onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <Input
              label="Carbs (g)"
              type="number"
              min={0}
              placeholder="45"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <Input
              label="Fat (g)"
              type="number"
              min={0}
              placeholder="12"
              value={fat}
              onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="md" type="submit" isLoading={submitting} leftIcon={<Plus className="w-4 h-4" />}>
              Record Meal Entry
            </Button>
          </div>
        </form>
      </SpotlightCard>

      {/* Logged Meals List */}
      <SpotlightCard className="p-6">
        <h3 className="text-base font-bold text-white mb-4">
          Today's Food Diary ({nutritionEntries.length} items)
        </h3>

        {nutritionEntries.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">
            No meal logs recorded for today yet. Use the form above to log meals.
          </p>
        ) : (
          <div className="divide-y divide-dark-border">
            {nutritionEntries.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge variant="lime" size="sm" className="capitalize">
                    {item.mealType}
                  </Badge>
                  <div>
                    <span className="text-sm font-semibold text-white block">{item.foodName}</span>
                    <span className="text-xs text-gray-400 font-mono">
                      P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-lime-400 font-mono">
                    {item.calories} kcal
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteNutrition(item.id)}
                    className="text-gray-500 hover:text-coral-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
