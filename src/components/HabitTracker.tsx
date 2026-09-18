import { useState } from 'react';
import {
  CheckCircle2,
  Plus,
  Flame,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  Trophy,
  Check,
} from 'lucide-react';
import { Habit, HabitCategory } from '../types';
import { HabitIcon, COLOR_MAP } from './HabitIcon';
import {
  getWeekDaysForDate,
  formatDisplayDate,
  getTodayDateString,
  getPastNDays,
} from '../utils/dateUtils';

interface HabitTrackerProps {
  selectedDate: string;
  habits: Habit[];
  isHabitCompleted: (id: string, date: string) => boolean;
  toggleHabit: (id: string, date: string) => void;
  getHabitValue: (id: string, date: string) => number;
  setHabitValue: (id: string, value: number, date: string) => void;
  getHabitStreak: (id: string) => { currentStreak: number; longestStreak: number; totalCompleted: number };
  onOpenAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
}

export function HabitTracker({
  selectedDate,
  habits,
  isHabitCompleted,
  toggleHabit,
  getHabitValue,
  setHabitValue,
  getHabitStreak,
  onOpenAddHabit,
  onEditHabit,
  onDeleteHabit,
}: HabitTrackerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const weekDays = getWeekDaysForDate(selectedDate);
  const todayStr = getTodayDateString();

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Habits' },
    { key: 'health', label: 'Health' },
    { key: 'fitness', label: 'Fitness' },
    { key: 'mind', label: 'Mind' },
    { key: 'productivity', label: 'Productivity' },
    { key: 'diet', label: 'Diet' },
    { key: 'lifestyle', label: 'Lifestyle' },
  ];

  const filteredHabits = habits.filter(
    (h) => selectedCategory === 'all' || h.category === selectedCategory
  );

  // Overall Habit Statistics
  const totalHabits = habits.length;
  const todayCompleted = habits.filter((h) => isHabitCompleted(h.id, selectedDate)).length;
  const topStreak = habits.reduce((max, h) => Math.max(max, getHabitStreak(h.id).currentStreak), 0);

  return (
    <div className="space-y-6">
      {/* Header Stat Strip */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Habit Formation Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Consistency & Habit Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track consistency across the week and build enduring compound routines.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[11px] font-medium text-slate-500">Active Habits</div>
              <div className="text-base sm:text-lg font-bold text-slate-900">{totalHabits}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[11px] font-medium text-slate-500">Done Today</div>
              <div className="text-base sm:text-lg font-bold text-emerald-600">
                {todayCompleted}/{totalHabits}
              </div>
            </div>
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[11px] font-medium text-amber-700 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Best Streak
              </div>
              <div className="text-base sm:text-lg font-bold text-amber-900">{topStreak} days</div>
            </div>

            <button
              id="btn-habit-tracker-add"
              onClick={onOpenAddHabit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Habit</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-slate-100 no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-0.5" />
          {categories.map((cat) => (
            <button
              key={cat.key}
              id={`filter-cat-${cat.key}`}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Habit Matrix Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header: Habit details on left, 7 Days of the Week on right */}
        <div className="grid grid-cols-12 items-center px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-12 sm:col-span-6 md:col-span-5">Habit Details</div>
          <div className="hidden md:flex md:col-span-2 justify-center">Streaks</div>
          <div className="col-span-12 sm:col-span-6 md:col-span-5 flex justify-end sm:justify-between items-center mt-2 sm:mt-0">
            <span className="hidden sm:inline text-slate-400 font-normal normal-case text-[11px]">
              Click any day to toggle
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              {weekDays.map((d) => (
                <div
                  key={d.date}
                  className={`w-7 sm:w-8 text-center flex flex-col items-center py-0.5 rounded-md ${
                    d.date === selectedDate ? 'bg-slate-900 text-white font-bold' : ''
                  }`}
                >
                  <span className="text-[10px]">{d.dayName}</span>
                  <span className="text-xs font-mono">{d.dayNumber}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Habit Rows */}
        <div className="divide-y divide-slate-100">
          {filteredHabits.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No habits found in this category. Click "New Habit" to create one.
            </div>
          ) : (
            filteredHabits.map((habit) => {
              const streak = getHabitStreak(habit.id);
              const colorConfig = COLOR_MAP[habit.color] || COLOR_MAP.emerald;
              const isTodayDone = isHabitCompleted(habit.id, selectedDate);
              const val = getHabitValue(habit.id, selectedDate);

              return (
                <div
                  key={habit.id}
                  className="grid grid-cols-12 items-center px-4 sm:px-5 py-3.5 hover:bg-slate-50/60 transition-colors gap-y-3 sm:gap-y-0"
                >
                  {/* Left: Icon, Title, Description, Type */}
                  <div className="col-span-12 sm:col-span-6 md:col-span-5 flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorConfig.bg} ${colorConfig.text} border ${colorConfig.border}`}
                    >
                      <HabitIcon name={habit.icon} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {habit.title}
                        </span>
                        <span
                          className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${colorConfig.bg} ${colorConfig.text} border ${colorConfig.border} shrink-0`}
                        >
                          {habit.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        {habit.description && (
                          <p className="text-xs text-slate-400 truncate max-w-xs">
                            {habit.description}
                          </p>
                        )}
                        {habit.type === 'numeric' && habit.targetValue && (
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                            Target: {habit.targetValue} {habit.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Center: Streak stats */}
                  <div className="hidden md:flex md:col-span-2 items-center justify-center gap-3">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{streak.currentStreak}d</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Best: <span className="font-semibold text-slate-700">{streak.longestStreak}d</span>
                    </div>
                  </div>

                  {/* Right: 7-Day interactive check dots & Action buttons */}
                  <div className="col-span-12 sm:col-span-6 md:col-span-5 flex items-center justify-between sm:justify-end gap-3">
                    {/* Day circles */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {weekDays.map((day) => {
                        const done = isHabitCompleted(habit.id, day.date);
                        const isCurrentSelected = day.date === selectedDate;

                        return (
                          <button
                            key={day.date}
                            id={`btn-habit-${habit.id}-day-${day.date}`}
                            onClick={() => toggleHabit(habit.id, day.date)}
                            className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              done
                                ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                                : 'bg-slate-100 text-slate-300 hover:bg-slate-200 border border-slate-200/60'
                            } ${isCurrentSelected ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
                            title={`${habit.title} on ${day.date}: ${done ? 'Completed' : 'Pending'}`}
                          >
                            <CheckCircle2
                              className={`w-4 h-4 ${done ? 'opacity-100' : 'opacity-30'}`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Manage row actions */}
                    <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                      <button
                        id={`btn-edit-habit-${habit.id}`}
                        onClick={() => onEditHabit(habit)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit Habit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`btn-delete-habit-${habit.id}`}
                        onClick={() => {
                          if (window.confirm(`Delete habit "${habit.title}"?`)) {
                            onDeleteHabit(habit.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
