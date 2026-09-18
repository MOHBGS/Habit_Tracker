import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Habit,
  RoutineItem,
  DietMeal,
  DailyWellnessLog,
  UserGoals,
} from '../types';
import {
  INITIAL_HABITS,
  INITIAL_ROUTINE,
  DEFAULT_USER_GOALS,
  generateSeedData,
} from '../data/initialData';
import {
  getTodayDateString,
  addDays,
  calculateHabitStreak,
} from '../utils/dateUtils';

const STORAGE_KEYS = {
  HABITS: 'habit_tracker_habits_v1',
  HABIT_LOGS: 'habit_tracker_habit_logs_v1',
  HABIT_VALUES: 'habit_tracker_habit_values_v1',
  ROUTINES: 'habit_tracker_routines_v1',
  ROUTINE_LOGS: 'habit_tracker_routine_logs_v1',
  DIET_MEALS: 'habit_tracker_diet_meals_v1',
  WATER: 'habit_tracker_water_v1',
  WELLNESS: 'habit_tracker_wellness_v1',
  GOALS: 'habit_tracker_goals_v1',
};

function safeGetJSON<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSetJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Could not save key ${key} to localStorage:`, err);
  }
}

export function useTrackerData() {
  const seed = useMemo(() => generateSeedData(), []);
  const todayStr = getTodayDateString();

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [habits, setHabits] = useState<Habit[]>(() =>
    safeGetJSON(STORAGE_KEYS.HABITS, INITIAL_HABITS)
  );

  const [habitLogs, setHabitLogs] = useState<Record<string, boolean>>(() =>
    safeGetJSON(STORAGE_KEYS.HABIT_LOGS, seed.habitLogs)
  );

  const [habitValues, setHabitValues] = useState<Record<string, number>>(() =>
    safeGetJSON(STORAGE_KEYS.HABIT_VALUES, seed.habitValues)
  );

  const [routines, setRoutines] = useState<RoutineItem[]>(() =>
    safeGetJSON(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINE)
  );

  const [routineLogs, setRoutineLogs] = useState<Record<string, string[]>>(() =>
    safeGetJSON(STORAGE_KEYS.ROUTINE_LOGS, seed.routineLogs)
  );

  const [dietMeals, setDietMeals] = useState<Record<string, DietMeal[]>>(() =>
    safeGetJSON(STORAGE_KEYS.DIET_MEALS, seed.dietMeals)
  );

  const [waterIntakes, setWaterIntakes] = useState<Record<string, number>>(() =>
    safeGetJSON(STORAGE_KEYS.WATER, seed.waterIntakes)
  );

  const [wellnessLogs, setWellnessLogs] = useState<Record<string, DailyWellnessLog>>(() =>
    safeGetJSON(STORAGE_KEYS.WELLNESS, seed.wellnessLogs)
  );

  const [goals, setGoals] = useState<UserGoals>(() =>
    safeGetJSON(STORAGE_KEYS.GOALS, DEFAULT_USER_GOALS)
  );

  // Sync state to local storage
  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.HABITS, habits);
  }, [habits]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.HABIT_LOGS, habitLogs);
  }, [habitLogs]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.HABIT_VALUES, habitValues);
  }, [habitValues]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.ROUTINES, routines);
  }, [routines]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.ROUTINE_LOGS, routineLogs);
  }, [routineLogs]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.DIET_MEALS, dietMeals);
  }, [dietMeals]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.WATER, waterIntakes);
  }, [waterIntakes]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.WELLNESS, wellnessLogs);
  }, [wellnessLogs]);

  useEffect(() => {
    safeSetJSON(STORAGE_KEYS.GOALS, goals);
  }, [goals]);

  // Date Navigation
  const goToToday = useCallback(() => setSelectedDate(getTodayDateString()), []);
  const goToPreviousDay = useCallback(() => setSelectedDate((d) => addDays(d, -1)), []);
  const goToNextDay = useCallback(() => setSelectedDate((d) => addDays(d, 1)), []);

  // Habit Actions
  const toggleHabit = useCallback(
    (habitId: string, date: string = selectedDate) => {
      const key = `${date}_${habitId}`;
      setHabitLogs((prev) => {
        const nextState = !prev[key];
        return { ...prev, [key]: nextState };
      });
    },
    [selectedDate]
  );

  const setHabitValue = useCallback(
    (habitId: string, value: number, date: string = selectedDate) => {
      const key = `${date}_${habitId}`;
      setHabitValues((prev) => ({ ...prev, [key]: value }));
      // If value is >= target, also mark completed
      const habit = habits.find((h) => h.id === habitId);
      if (habit && habit.targetValue) {
        setHabitLogs((prev) => ({
          ...prev,
          [key]: value >= (habit.targetValue || 0),
        }));
      }
    },
    [habits, selectedDate]
  );

  const isHabitCompleted = useCallback(
    (habitId: string, date: string = selectedDate): boolean => {
      return !!habitLogs[`${date}_${habitId}`];
    },
    [habitLogs, selectedDate]
  );

  const getHabitValue = useCallback(
    (habitId: string, date: string = selectedDate): number => {
      return habitValues[`${date}_${habitId}`] || 0;
    },
    [habitValues, selectedDate]
  );

  const getHabitStreak = useCallback(
    (habitId: string) => {
      return calculateHabitStreak(habitId, habitLogs, selectedDate);
    },
    [habitLogs, selectedDate]
  );

  const addHabit = useCallback((newHabit: Omit<Habit, 'id' | 'createdAt'>) => {
    const id = `habit-${Date.now()}`;
    const habit: Habit = {
      ...newHabit,
      id,
      createdAt: getTodayDateString(),
    };
    setHabits((prev) => [...prev, habit]);
    return habit;
  }, []);

  const updateHabit = useCallback((updated: Habit) => {
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  // Routine Actions
  const toggleRoutineItem = useCallback(
    (routineId: string, date: string = selectedDate) => {
      setRoutineLogs((prev) => {
        const currentList = prev[date] || [];
        const isDone = currentList.includes(routineId);
        const updated = isDone
          ? currentList.filter((id) => id !== routineId)
          : [...currentList, routineId];
        return { ...prev, [date]: updated };
      });
    },
    [selectedDate]
  );

  const isRoutineCompleted = useCallback(
    (routineId: string, date: string = selectedDate): boolean => {
      const list = routineLogs[date] || [];
      return list.includes(routineId);
    },
    [routineLogs, selectedDate]
  );

  const addRoutineItem = useCallback((item: Omit<RoutineItem, 'id'>) => {
    const id = `routine-${Date.now()}`;
    const newRoutine: RoutineItem = { ...item, id };
    setRoutines((prev) => [...prev, newRoutine]);
    return newRoutine;
  }, []);

  const updateRoutineItem = useCallback((updated: RoutineItem) => {
    setRoutines((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }, []);

  const deleteRoutineItem = useCallback((id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getRoutineProgress = useCallback(
    (date: string = selectedDate) => {
      const completedList = routineLogs[date] || [];
      const total = routines.length;
      const completed = routines.filter((r) => completedList.includes(r.id)).length;
      const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { completed, total, percentage };
    },
    [routineLogs, routines, selectedDate]
  );

  // Diet & Nutrition Actions
  const getMealsForDate = useCallback(
    (date: string = selectedDate): DietMeal[] => {
      return dietMeals[date] || [];
    },
    [dietMeals, selectedDate]
  );

  const addMeal = useCallback(
    (meal: Omit<DietMeal, 'id'>, date: string = selectedDate) => {
      const id = `meal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newMeal: DietMeal = { ...meal, id };
      setDietMeals((prev) => {
        const currentMeals = prev[date] || [];
        return { ...prev, [date]: [...currentMeals, newMeal] };
      });
      return newMeal;
    },
    [selectedDate]
  );

  const deleteMeal = useCallback(
    (mealId: string, date: string = selectedDate) => {
      setDietMeals((prev) => {
        const currentMeals = prev[date] || [];
        return { ...prev, [date]: currentMeals.filter((m) => m.id !== mealId) };
      });
    },
    [selectedDate]
  );

  const getWaterIntake = useCallback(
    (date: string = selectedDate): number => {
      return waterIntakes[date] || 0;
    },
    [waterIntakes, selectedDate]
  );

  const setWaterIntake = useCallback(
    (amount: number, date: string = selectedDate) => {
      const clamped = Math.max(0, amount);
      setWaterIntakes((prev) => ({ ...prev, [date]: clamped }));
    },
    [selectedDate]
  );

  const addWater = useCallback(
    (delta: number, date: string = selectedDate) => {
      setWaterIntakes((prev) => {
        const current = prev[date] || 0;
        const updated = Math.max(0, current + delta);
        return { ...prev, [date]: updated };
      });
    },
    [selectedDate]
  );

  const getNutritionSummary = useCallback(
    (date: string = selectedDate) => {
      const meals = dietMeals[date] || [];
      return meals.reduce(
        (acc, meal) => {
          acc.calories += meal.calories || 0;
          acc.protein += meal.protein || 0;
          acc.carbs += meal.carbs || 0;
          acc.fat += meal.fat || 0;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
    },
    [dietMeals, selectedDate]
  );

  // Wellness Actions
  const getWellness = useCallback(
    (date: string = selectedDate): DailyWellnessLog => {
      return (
        wellnessLogs[date] || {
          date,
          mood: null,
          energyLevel: 3,
          sleepHours: 7.5,
          sleepQuality: null,
          journalNote: '',
        }
      );
    },
    [wellnessLogs, selectedDate]
  );

  const updateWellness = useCallback(
    (partial: Partial<DailyWellnessLog>, date: string = selectedDate) => {
      setWellnessLogs((prev) => {
        const current = prev[date] || {
          date,
          mood: null,
          energyLevel: 3,
          sleepHours: 7.5,
          sleepQuality: null,
          journalNote: '',
        };
        return {
          ...prev,
          [date]: { ...current, ...partial, date },
        };
      });
    },
    [selectedDate]
  );

  // Goals
  const updateGoals = useCallback((newGoals: Partial<UserGoals>) => {
    setGoals((prev) => ({ ...prev, ...newGoals }));
  }, []);

  // Backup and Export / Import
  const exportData = useCallback(() => {
    const data = {
      habits,
      habitLogs,
      habitValues,
      routines,
      routineLogs,
      dietMeals,
      waterIntakes,
      wellnessLogs,
      goals,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-routine-backup-${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [habits, habitLogs, habitValues, routines, routineLogs, dietMeals, waterIntakes, wellnessLogs, goals]);

  const importData = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.habits && Array.isArray(parsed.habits)) setHabits(parsed.habits);
      if (parsed.habitLogs) setHabitLogs(parsed.habitLogs);
      if (parsed.habitValues) setHabitValues(parsed.habitValues);
      if (parsed.routines && Array.isArray(parsed.routines)) setRoutines(parsed.routines);
      if (parsed.routineLogs) setRoutineLogs(parsed.routineLogs);
      if (parsed.dietMeals) setDietMeals(parsed.dietMeals);
      if (parsed.waterIntakes) setWaterIntakes(parsed.waterIntakes);
      if (parsed.wellnessLogs) setWellnessLogs(parsed.wellnessLogs);
      if (parsed.goals) setGoals(parsed.goals);
      return true;
    } catch (err) {
      console.error('Failed to import JSON data:', err);
      return false;
    }
  }, []);

  const resetAllData = useCallback(() => {
    const freshSeed = generateSeedData();
    setHabits(INITIAL_HABITS);
    setHabitLogs(freshSeed.habitLogs);
    setHabitValues(freshSeed.habitValues);
    setRoutines(INITIAL_ROUTINE);
    setRoutineLogs(freshSeed.routineLogs);
    setDietMeals(freshSeed.dietMeals);
    setWaterIntakes(freshSeed.waterIntakes);
    setWellnessLogs(freshSeed.wellnessLogs);
    setGoals(DEFAULT_USER_GOALS);
    setSelectedDate(getTodayDateString());
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    goToToday,
    goToPreviousDay,
    goToNextDay,

    // Habits
    habits,
    toggleHabit,
    setHabitValue,
    isHabitCompleted,
    getHabitValue,
    getHabitStreak,
    addHabit,
    updateHabit,
    deleteHabit,

    // Routines
    routines,
    toggleRoutineItem,
    isRoutineCompleted,
    addRoutineItem,
    updateRoutineItem,
    deleteRoutineItem,
    getRoutineProgress,

    // Diet
    getMealsForDate,
    addMeal,
    deleteMeal,
    getWaterIntake,
    setWaterIntake,
    addWater,
    getNutritionSummary,

    // Wellness
    getWellness,
    updateWellness,

    // Goals
    goals,
    updateGoals,

    // Storage Management
    exportData,
    importData,
    resetAllData,
  };
}
