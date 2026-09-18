import React from 'react';
import {
  CheckCircle2,
  Circle,
  Flame,
  Plus,
  ArrowUpRight,
  Droplets,
  Moon,
  Sparkles,
  Utensils,
  Clock,
  Smile,
  Meh,
  Frown,
  Heart,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  Habit,
  RoutineItem,
  DietMeal,
  DailyWellnessLog,
  UserGoals,
  MoodType,
  SleepQuality,
} from '../types';
import { HabitIcon, COLOR_MAP } from './HabitIcon';
import { formatDisplayDate } from '../utils/dateUtils';

interface TodayOverviewProps {
  selectedDate: string;
  habits: Habit[];
  isHabitCompleted: (id: string, date: string) => boolean;
  getHabitValue: (id: string, date: string) => number;
  toggleHabit: (id: string, date: string) => void;
  setHabitValue: (id: string, value: number, date: string) => void;
  getHabitStreak: (id: string) => { currentStreak: number; longestStreak: number };
  routines: RoutineItem[];
  isRoutineCompleted: (id: string, date: string) => boolean;
  toggleRoutineItem: (id: string, date: string) => void;
  getRoutineProgress: (date: string) => { completed: number; total: number; percentage: number };
  meals: DietMeal[];
  nutritionSummary: { calories: number; protein: number; carbs: number; fat: number };
  waterIntake: number;
  addWater: (delta: number, date: string) => void;
  wellness: DailyWellnessLog;
  updateWellness: (partial: Partial<DailyWellnessLog>, date: string) => void;
  goals: UserGoals;
  onNavigateTab: (tab: 'habits' | 'routine' | 'diet' | 'analytics') => void;
  onOpenAddHabit: () => void;
  onOpenAddRoutine: () => void;
  onOpenAddMeal: () => void;
}

export function TodayOverview({
  selectedDate,
  habits,
  isHabitCompleted,
  getHabitValue,
  toggleHabit,
  setHabitValue,
  getHabitStreak,
  routines,
  isRoutineCompleted,
  toggleRoutineItem,
  getRoutineProgress,
  meals,
  nutritionSummary,
  waterIntake,
  addWater,
  wellness,
  updateWellness,
  goals,
  onNavigateTab,
  onOpenAddHabit,
  onOpenAddRoutine,
  onOpenAddMeal,
}: TodayOverviewProps) {
  const routineProgress = getRoutineProgress(selectedDate);
  const completedHabitsCount = habits.filter((h) => isHabitCompleted(h.id, selectedDate)).length;
  const habitPercentage = habits.length > 0 ? Math.round((completedHabitsCount / habits.length) * 100) : 0;
  const waterPercentage = Math.min(100, Math.round((waterIntake / goals.waterTargetMl) * 100));
  const caloriePercentage = Math.min(100, Math.round((nutritionSummary.calories / goals.calorieTarget) * 100));

  // Overall Daily Consistency Score (composite of habits, routine, water, nutrition)
  const compositeScore = Math.round(
    habitPercentage * 0.35 +
      routineProgress.percentage * 0.35 +
      waterPercentage * 0.15 +
      (caloriePercentage > 0 ? Math.min(100, caloriePercentage) : 0) * 0.15
  );

  const moods: { type: MoodType; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'great', label: 'Great', icon: <Sparkles className="w-4 h-4" />, color: 'text-amber-500 hover:bg-amber-50 border-amber-200' },
    { type: 'good', label: 'Good', icon: <Smile className="w-4 h-4" />, color: 'text-emerald-500 hover:bg-emerald-50 border-emerald-200' },
    { type: 'neutral', label: 'Neutral', icon: <Meh className="w-4 h-4" />, color: 'text-slate-500 hover:bg-slate-50 border-slate-200' },
    { type: 'low', label: 'Low', icon: <Frown className="w-4 h-4" />, color: 'text-blue-500 hover:bg-blue-50 border-blue-200' },
    { type: 'bad', label: 'Tired', icon: <Moon className="w-4 h-4" />, color: 'text-rose-500 hover:bg-rose-50 border-rose-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Day Progress Metrics */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" />
                {compositeScore}% Daily Consistency
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {formatDisplayDate(selectedDate)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Daily Rhythm & Habits
            </h2>
          </div>

          {/* Quick Progress Pills */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-center">
              <div className="text-xs font-medium text-slate-500">Habits</div>
              <div className="text-base sm:text-lg font-bold text-slate-900">
                {completedHabitsCount}/{habits.length}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">{habitPercentage}%</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-center">
              <div className="text-xs font-medium text-slate-500">Routine</div>
              <div className="text-base sm:text-lg font-bold text-slate-900">
                {routineProgress.completed}/{routineProgress.total}
              </div>
              <div className="text-[10px] text-indigo-600 font-semibold">{routineProgress.percentage}%</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-center">
              <div className="text-xs font-medium text-slate-500">Water</div>
              <div className="text-base sm:text-lg font-bold text-slate-900">
                {(waterIntake / 1000).toFixed(1)}L
              </div>
              <div className="text-[10px] text-sky-600 font-semibold">{waterPercentage}%</div>
            </div>
          </div>
        </div>

        {/* Global Progress Line */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>Overall Completion Status</span>
            <span className="font-semibold text-slate-800">{compositeScore}% Complete</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${compositeScore}%` }}
            />
          </div>
        </div>
      </section>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Habits & Daily Routine Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Habits Section */}
          <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Today's Habits</h3>
                  <p className="text-xs text-slate-500">
                    {completedHabitsCount} of {habits.length} completed
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-overview-add-habit"
                  onClick={onOpenAddHabit}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors border border-emerald-200/60 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
                <button
                  id="btn-view-all-habits"
                  onClick={() => onNavigateTab('habits')}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-0.5 hover:underline"
                >
                  All
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Habits List */}
            <div className="divide-y divide-slate-100 mt-2">
              {habits.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No habits set yet. Click "Add" above to start your streak!
                </div>
              ) : (
                habits.map((habit) => {
                  const completed = isHabitCompleted(habit.id, selectedDate);
                  const streak = getHabitStreak(habit.id);
                  const val = getHabitValue(habit.id, selectedDate);
                  const colorConfig = COLOR_MAP[habit.color] || COLOR_MAP.emerald;

                  return (
                    <div
                      key={habit.id}
                      className="py-3 flex items-center justify-between gap-3 group transition-colors hover:bg-slate-50/50 rounded-xl px-2 -mx-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          id={`btn-toggle-habit-${habit.id}`}
                          onClick={() => toggleHabit(habit.id, selectedDate)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            completed
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'border-2 border-slate-300 text-transparent hover:border-emerald-500 hover:text-emerald-500'
                          }`}
                          title={completed ? 'Mark incomplete' : 'Mark completed'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold truncate ${
                                completed ? 'text-slate-400 line-through' : 'text-slate-900'
                              }`}
                            >
                              {habit.title}
                            </span>
                            {streak.currentStreak > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                <Flame className="w-3 h-3 text-amber-500" />
                                {streak.currentStreak}d
                              </span>
                            )}
                          </div>
                          {habit.description && (
                            <p className="text-xs text-slate-400 truncate max-w-xs">
                              {habit.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Numeric incrementer or Category Pill */}
                      <div className="flex items-center gap-2 shrink-0">
                        {habit.type === 'numeric' && habit.targetValue ? (
                          <div className="flex items-center gap-1 bg-slate-100/90 rounded-lg p-1 border border-slate-200/80">
                            <button
                              id={`btn-habit-dec-${habit.id}`}
                              onClick={() => {
                                const step = habit.unit === 'ml' ? 100 : habit.unit === 'pages' ? 5 : 5;
                                setHabitValue(habit.id, Math.max(0, val - step), selectedDate);
                              }}
                              className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-white rounded"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-slate-800 px-1">
                              {val} / {habit.targetValue}
                              <span className="text-[10px] font-normal text-slate-500 ml-0.5">
                                {habit.unit}
                              </span>
                            </span>
                            <button
                              id={`btn-habit-inc-${habit.id}`}
                              onClick={() => {
                                const step = habit.unit === 'ml' ? 100 : habit.unit === 'pages' ? 5 : 5;
                                setHabitValue(habit.id, val + step, selectedDate);
                              }}
                              className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-white rounded"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${colorConfig.bg} ${colorConfig.text} border ${colorConfig.border}`}
                          >
                            {habit.category}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Daily Routine Checklist Section */}
          <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Daily Routine</h3>
                  <p className="text-xs text-slate-500">
                    {routineProgress.completed} of {routineProgress.total} completed ({routineProgress.percentage}%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-overview-add-routine"
                  onClick={onOpenAddRoutine}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors border border-indigo-200/60 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
                <button
                  id="btn-view-all-routine"
                  onClick={() => onNavigateTab('routine')}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-0.5 hover:underline"
                >
                  Timeline
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Routine Checklist */}
            <div className="space-y-2 mt-3">
              {routines.slice(0, 6).map((item) => {
                const done = isRoutineCompleted(item.id, selectedDate);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleRoutineItem(item.id, selectedDate)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      done
                        ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
                        : 'bg-white border-slate-200/90 hover:border-indigo-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          done
                            ? 'bg-indigo-600 text-white'
                            : 'border-2 border-slate-300 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${
                              done ? 'text-slate-400 line-through' : 'text-slate-900'
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {item.time}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="text-xs text-slate-400">{item.notes}</div>
                        )}
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 font-medium">
                      {item.durationMinutes}m
                    </span>
                  </div>
                );
              })}

              {routines.length > 6 && (
                <button
                  id="btn-more-routines"
                  onClick={() => onNavigateTab('routine')}
                  className="w-full py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 text-center hover:bg-indigo-50/50 rounded-lg transition-colors"
                >
                  View all {routines.length} routine items →
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Diet & Nutrition + Wellness & Mood (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Diet & Nutrition Summary */}
          <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Diet & Nutrition</h3>
                  <p className="text-xs text-slate-500">
                    {nutritionSummary.calories} / {goals.calorieTarget} kcal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-overview-add-meal"
                  onClick={onOpenAddMeal}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg transition-colors border border-amber-200/60 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Meal</span>
                </button>
                <button
                  id="btn-view-all-diet"
                  onClick={() => onNavigateTab('diet')}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-0.5 hover:underline"
                >
                  Diet
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Calorie Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                <span>Calories Consumed</span>
                <span className="font-bold text-slate-900">
                  {nutritionSummary.calories} kcal ({caloriePercentage}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    nutritionSummary.calories > goals.calorieTarget
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${caloriePercentage}%` }}
                />
              </div>
            </div>

            {/* Macro Breakdown Chips */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-center">
                <div className="text-[11px] font-semibold text-rose-600">Protein</div>
                <div className="text-sm font-bold text-slate-900">
                  {nutritionSummary.protein}g
                </div>
                <div className="text-[10px] text-slate-400">of {goals.proteinTarget}g</div>
              </div>
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-center">
                <div className="text-[11px] font-semibold text-blue-600">Carbs</div>
                <div className="text-sm font-bold text-slate-900">
                  {nutritionSummary.carbs}g
                </div>
                <div className="text-[10px] text-slate-400">of {goals.carbsTarget}g</div>
              </div>
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-center">
                <div className="text-[11px] font-semibold text-amber-600">Fat</div>
                <div className="text-sm font-bold text-slate-900">
                  {nutritionSummary.fat}g
                </div>
                <div className="text-[10px] text-slate-400">of {goals.fatTarget}g</div>
              </div>
            </div>

            {/* Water Hydration Quick Widget */}
            <div className="mt-5 p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-slate-800">Water Hydration</span>
                </div>
                <span className="text-xs font-bold text-sky-700">
                  {waterIntake} / {goals.waterTargetMl} ml
                </span>
              </div>

              <div className="h-2 w-full bg-sky-200/60 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-sky-500 h-full transition-all duration-300"
                  style={{ width: `${waterPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  id="btn-quick-water-250"
                  onClick={() => addWater(250, selectedDate)}
                  className="flex-1 py-1.5 text-xs font-semibold bg-white text-sky-700 hover:bg-sky-100/80 rounded-lg border border-sky-200 transition-colors shadow-2xs"
                >
                  +250 ml (Glass)
                </button>
                <button
                  id="btn-quick-water-500"
                  onClick={() => addWater(500, selectedDate)}
                  className="flex-1 py-1.5 text-xs font-semibold bg-white text-sky-700 hover:bg-sky-100/80 rounded-lg border border-sky-200 transition-colors shadow-2xs"
                >
                  +500 ml (Bottle)
                </button>
              </div>
            </div>

            {/* Recent Meals for the day */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700 mb-2">Logged Today ({meals.length}):</div>
              {meals.length === 0 ? (
                <div className="text-xs text-slate-400 py-1">No meals logged for this date yet.</div>
              ) : (
                <div className="space-y-1.5">
                  {meals.slice(0, 3).map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-100/60 last:border-none"
                    >
                      <span className="text-slate-700 font-medium truncate max-w-[200px]">
                        {m.name}
                      </span>
                      <span className="text-slate-500 font-semibold shrink-0">
                        {m.calories} kcal
                      </span>
                    </div>
                  ))}
                  {meals.length > 3 && (
                    <button
                      onClick={() => onNavigateTab('diet')}
                      className="text-[11px] text-amber-700 font-semibold hover:underline"
                    >
                      +{meals.length - 3} more meals...
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Wellness, Mood & Energy Rating */}
          <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Daily State & Reflection</h3>
                <p className="text-xs text-slate-500">Track mood, sleep, and physical energy</p>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              {/* Mood Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  How are you feeling today?
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {moods.map((m) => {
                    const selected = wellness.mood === m.type;
                    return (
                      <button
                        key={m.type}
                        id={`btn-mood-${m.type}`}
                        onClick={() => updateWellness({ mood: m.type }, selectedDate)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all text-xs font-medium cursor-pointer ${
                          selected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="mb-1">{m.icon}</span>
                        <span className="text-[10px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Energy Level & Sleep */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Energy
                    </span>
                    <span className="font-bold text-slate-900">{wellness.energyLevel}/5</span>
                  </div>
                  <input
                    id="slider-energy-level"
                    type="range"
                    min="1"
                    max="5"
                    value={wellness.energyLevel}
                    onChange={(e) =>
                      updateWellness({ energyLevel: parseInt(e.target.value, 10) }, selectedDate)
                    }
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      Sleep
                    </span>
                    <span className="font-bold text-slate-900">{wellness.sleepHours} hrs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      id="input-sleep-hours"
                      type="number"
                      step="0.5"
                      min="0"
                      max="16"
                      value={wellness.sleepHours}
                      onChange={(e) =>
                        updateWellness({ sleepHours: parseFloat(e.target.value) || 0 }, selectedDate)
                      }
                      className="w-full text-xs font-bold bg-white border border-slate-200 rounded px-2 py-1 text-slate-800"
                    />
                    <span className="text-[11px] text-slate-400">hrs</span>
                  </div>
                </div>
              </div>

              {/* Quick Reflection Note */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Daily Reflection / Wins
                </label>
                <textarea
                  id="textarea-daily-reflection"
                  rows={2}
                  placeholder="What went well today? Any key takeaways or thoughts..."
                  value={wellness.journalNote || ''}
                  onChange={(e) => updateWellness({ journalNote: e.target.value }, selectedDate)}
                  className="w-full text-xs text-slate-800 placeholder-slate-400 bg-slate-50/60 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
