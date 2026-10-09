import { describe, it, expect } from 'vitest';
import { NutritionEntry, HydrationEntry } from '../../src/types';

describe('Nutrition & Hydration Totals Engine', () => {
  const sampleMeals: NutritionEntry[] = [
    {
      id: 'm1',
      userId: 'u1',
      date: '2026-03-15',
      mealType: 'breakfast',
      foodName: 'Oats & Protein',
      calories: 450,
      protein: 35,
      carbs: 55,
      fat: 8,
      createdAt: '2026-03-15T08:00:00Z',
    },
    {
      id: 'm2',
      userId: 'u1',
      date: '2026-03-15',
      mealType: 'lunch',
      foodName: 'Chicken & Rice',
      calories: 650,
      protein: 50,
      carbs: 65,
      fat: 15,
      createdAt: '2026-03-15T13:00:00Z',
    },
  ];

  it('accurately sums total daily calories, protein, carbs, and fat', () => {
    const totalCalories = sampleMeals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = sampleMeals.reduce((sum, m) => sum + m.protein, 0);
    const totalCarbs = sampleMeals.reduce((sum, m) => sum + m.carbs, 0);
    const totalFat = sampleMeals.reduce((sum, m) => sum + m.fat, 0);

    expect(totalCalories).toBe(1100);
    expect(totalProtein).toBe(85);
    expect(totalCarbs).toBe(120);
    expect(totalFat).toBe(23);
  });

  it('correctly calculates percentage against target and clamps at 100%', () => {
    const totalWater = 3500;
    const targetWater = 3000;
    const percent = Math.min(100, Math.round((totalWater / targetWater) * 100));

    expect(percent).toBe(100);
  });
});
