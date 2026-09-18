import { useMemo } from 'react';
import {
  BarChart3,
  Flame,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Utensils,
  Moon,
  Zap,
} from 'lucide-react';
import { Habit, RoutineItem, UserGoals } from '../types';
import { HabitIcon, COLOR_MAP } from './HabitIcon';
import { getPastNDays, getTodayDateString, formatDisplayDate } from '../utils/dateUtils';

interface AnalyticsViewProps {
  habits: Habit[];
  isHabitCompleted: (id: string, date: string) => boolean;
  getHabitStreak: (id: string) => { currentStreak: number; longestStreak: number; totalCompleted: number };
  routines: RoutineItem[];
  getRoutineProgress: (date: string) => { completed: number; total: number; percentage: number };
  getNutritionSummary: (date: string) => { calories: number; protein: number; carbs: number; fat: number };
  getWaterIntake: (date: string) => number;
  goals: UserGoals;
}

export function AnalyticsView({
  habits,
  isHabitCompleted,
  getHabitStreak,
  routines,
  getRoutineProgress,
  getNutritionSummary,
  getWaterIntake,
  goals,
}: AnalyticsViewProps) {
  const today = getTodayDateString();
  const past14Days = useMemo(() => getPastNDays(today, 14), [today]);

  // Calculate stats for each of the past 14 days
  const dailyMetrics = useMemo(() => {
    return past14Days.map((date) => {
      const habitsDone = habits.filter((h) => isHabitCompleted(h.id, date)).length;
      const habitPct = habits.length > 0 ? Math.round((habitsDone / habits.length) * 100) : 0;
      const routineProg = getRoutineProgress(date);
      const nut = getNutritionSummary(date);
      const water = getWaterIntake(date);

      return {
        date,
        habitsDone,
        habitPct,
        routinePct: routineProg.percentage,
        calories: nut.calories,
        protein: nut.protein,
        water,
      };
    });
  }, [past14Days, habits, isHabitCompleted, getRoutineProgress, getNutritionSummary, getWaterIntake]);

  // Averages over past 14 days
  const avgHabitPct = Math.round(
    dailyMetrics.reduce((s, m) => s + m.habitPct, 0) / dailyMetrics.length
  );
  const avgRoutinePct = Math.round(
    dailyMetrics.reduce((s, m) => s + m.routinePct, 0) / dailyMetrics.length
  );
  const avgCalories = Math.round(
    dailyMetrics.reduce((s, m) => s + m.calories, 0) / dailyMetrics.length
  );
  const avgWater = Math.round(
    dailyMetrics.reduce((s, m) => s + m.water, 0) / dailyMetrics.length
  );

  // Habit rankings sorted by current streak & total completions
  const habitRankings = useMemo(() => {
    return habits
      .map((h) => {
        const streak = getHabitStreak(h.id);
        // Completion rate over last 14 days
        const last14Completed = past14Days.filter((d) => isHabitCompleted(h.id, d)).length;
        const rate = Math.round((last14Completed / 14) * 100);
        return {
          ...h,
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          completionRate: rate,
        };
      })
      .sort((a, b) => b.currentStreak - a.currentStreak);
  }, [habits, getHabitStreak, past14Days, isHabitCompleted]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5" />
                Performance & Analytics
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Consistency Trends & Insights
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              14-day rolling averages and habit momentum analysis.
            </p>
          </div>

          {/* Quick High-Level Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Habit Adherence</div>
              <div className="text-lg font-bold text-emerald-600 mt-0.5">{avgHabitPct}%</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Routine Pace</div>
              <div className="text-lg font-bold text-indigo-600 mt-0.5">{avgRoutinePct}%</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Avg Calories</div>
              <div className="text-lg font-bold text-amber-600 mt-0.5">{avgCalories} kcal</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Avg Hydration</div>
              <div className="text-lg font-bold text-sky-600 mt-0.5">{(avgWater / 1000).toFixed(1)}L</div>
            </div>
          </div>
        </div>
      </section>

      {/* 14-Day Consistency Matrix Heatmap */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          14-Day Daily Habit Completion Trend
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Daily percentage of all habits marked complete over the past two weeks.
        </p>

        {/* Visual Bar Chart */}
        <div className="flex items-end justify-between gap-1.5 sm:gap-3 h-40 pt-4 px-2 border-b border-slate-100">
          {dailyMetrics.map((day) => {
            const isCurrentToday = day.date === today;
            const barHeight = Math.max(8, day.habitPct);

            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-10 bg-slate-900 text-white text-[10px] font-semibold py-1 px-2 rounded whitespace-nowrap transition-opacity z-10">
                  {day.date}: {day.habitPct}% ({day.habitsDone} habits)
                </div>

                <div className="w-full bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isCurrentToday ? 'bg-emerald-600' : 'bg-emerald-400 hover:bg-emerald-500'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                </div>

                <span
                  className={`text-[9px] font-mono font-medium truncate ${
                    isCurrentToday ? 'text-emerald-700 font-bold' : 'text-slate-400'
                  }`}
                >
                  {day.date.slice(8)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 px-2">
          <span>14 days ago</span>
          <span>Today</span>
        </div>
      </section>

      {/* Habit Streak Leaderboard */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Award className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Habit Streaks & Reliability</h3>
            <p className="text-xs text-slate-500">Ranking by current momentum and 14-day completion rate</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {habitRankings.map((h, index) => {
            const colorConfig = COLOR_MAP[h.color] || COLOR_MAP.emerald;

            return (
              <div
                key={h.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold text-slate-400 w-4">
                    #{index + 1}
                  </span>

                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorConfig.bg} ${colorConfig.text} border ${colorConfig.border}`}
                  >
                    <HabitIcon name={h.icon} className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{h.title}</div>
                    <div className="text-xs text-slate-400">{h.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Streak Badge */}
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/70 px-2.5 py-1 rounded-lg text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{h.currentStreak}d Streak</span>
                  </div>

                  {/* 14-day Completion bar */}
                  <div className="hidden sm:flex flex-col items-end w-28">
                    <div className="text-[11px] font-semibold text-slate-700">
                      {h.completionRate}% (14d)
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${h.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
