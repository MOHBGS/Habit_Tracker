export type HabitCategory = 'health' | 'fitness' | 'mind' | 'productivity' | 'diet' | 'lifestyle';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom_days';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  color: string; // e.g. 'emerald', 'sky', 'indigo', 'amber', 'rose', 'teal'
  icon: string;
  frequency: HabitFrequency;
  targetDays?: number[]; // 0 for Sun, 1 for Mon, etc.
  type: 'boolean' | 'numeric';
  targetValue?: number; // e.g., 8 glasses or 30 mins
  unit?: string; // e.g., 'glasses', 'pages', 'mins'
  createdAt: string;
  archived?: boolean;
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  habitId: string;
  completed: boolean;
  value?: number;
}

export type RoutinePhase = 'morning' | 'afternoon' | 'evening' | 'night';

export interface RoutineItem {
  id: string;
  title: string;
  phase: RoutinePhase;
  time: string; // e.g. '07:30'
  durationMinutes: number;
  category: string;
  notes?: string;
  daysOfWeek: number[]; // [0,1,2,3,4,5,6]
}

export interface RoutineLog {
  date: string; // YYYY-MM-DD
  completedIds: string[];
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DietMeal {
  id: string;
  mealType: MealType;
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  time?: string;
  notes?: string;
}

export interface DailyDietLog {
  date: string; // YYYY-MM-DD
  meals: DietMeal[];
  waterIntakeMl: number;
}

export type MoodType = 'great' | 'good' | 'neutral' | 'low' | 'bad';
export type SleepQuality = 'restful' | 'average' | 'poor';

export interface DailyWellnessLog {
  date: string; // YYYY-MM-DD
  mood: MoodType | null;
  energyLevel: number; // 1-5
  sleepHours: number;
  sleepQuality: SleepQuality | null;
  journalNote?: string;
}

export interface UserGoals {
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterTargetMl: number;
  dailySleepTargetHours: number;
}

export interface FoodPreset {
  id: string;
  name: string;
  defaultMealType: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
}
