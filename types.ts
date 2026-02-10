export enum ActivityCategory {
  TRANSPORTATION = 'Transportation',
  FOOD = 'Food',
  ELECTRICITY = 'Electricity',
  COOKING_FUEL = 'Cooking Fuel',
  WATER = 'Water',
  DIGITAL = 'Digital',
  WASTE = 'Waste',
  OTHER = 'Other'
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  description: string;
  emissionKg: number;
  category: ActivityCategory;
  aiExplanation: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  potentialSavingKg: number;
  priority: 'low' | 'medium' | 'high';
  category: ActivityCategory;
  costImpact: string;
  feasibilityScore: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: number;
}

export interface Goal {
  targetKgPerDay: number;
  startDate: number;
}

export interface UserStats {
  totalEmissionKg: number;
  categoryBreakdown: Record<ActivityCategory, number>;
  dailyAverageKg: number;
  streak: number;
  activeGoal: Goal | null;
  badges: Badge[];
}