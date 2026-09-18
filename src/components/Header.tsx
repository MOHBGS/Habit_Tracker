import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plus,
  Settings,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Utensils,
  BarChart3,
} from 'lucide-react';
import { formatDisplayDate, getTodayDateString } from '../utils/dateUtils';

export type ActiveTab = 'overview' | 'habits' | 'routine' | 'diet' | 'analytics';

interface HeaderProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAddHabit: () => void;
  onOpenAddRoutine: () => void;
  onOpenAddMeal: () => void;
  onOpenSettings: () => void;
}

export function Header({
  selectedDate,
  onSelectDate,
  onPrevDay,
  onNextDay,
  onGoToToday,
  activeTab,
  onTabChange,
  onOpenAddHabit,
  onOpenAddRoutine,
  onOpenAddMeal,
  onOpenSettings,
}: HeaderProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const isToday = selectedDate === getTodayDateString();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand + Date Navigation + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-800">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                  Habit & Routine Tracker
                </h1>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  Daily rituals, habits, and nutrition in sync
                </p>
              </div>
            </div>

            {/* Mobile Actions: Settings */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                id="btn-mobile-settings"
                onClick={onOpenSettings}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Settings & Data"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center justify-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            <button
              id="btn-prev-day"
              onClick={onPrevDay}
              aria-label="Previous Day"
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer shadow-none hover:shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="relative flex items-center px-2">
              <label htmlFor="date-picker-input" className="sr-only">Choose Date</label>
              <input
                id="date-picker-input"
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && onSelectDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 pointer-events-none select-none">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                {formatDisplayDate(selectedDate)}
              </span>
            </div>

            <button
              id="btn-next-day"
              onClick={onNextDay}
              aria-label="Next Day"
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer shadow-none hover:shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isToday && (
              <button
                id="btn-jump-today"
                onClick={onGoToToday}
                className="ml-1 text-xs font-semibold px-2.5 py-1 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                Today
              </button>
            )}
          </div>

          {/* Actions: Add Menu & Settings */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <button
                id="btn-quick-add-menu"
                onClick={() => setShowAddMenu((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Log / Add</span>
              </button>

              {showAddMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40"
                  onMouseLeave={() => setShowAddMenu(false)}
                >
                  <button
                    id="btn-menu-add-habit"
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenAddHabit();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    New Habit
                  </button>
                  <button
                    id="btn-menu-add-routine"
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenAddRoutine();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                  >
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    New Routine Item
                  </button>
                  <button
                    id="btn-menu-add-meal"
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenAddMeal();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                  >
                    <Utensils className="w-3.5 h-3.5 text-amber-600" />
                    Log Meal / Food
                  </button>
                </div>
              )}
            </div>

            <button
              id="btn-desktop-settings"
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              title="Settings, Targets & Backup"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1 border-t border-slate-100 no-scrollbar">
          <button
            id="tab-overview"
            onClick={() => onTabChange('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Today Overview</span>
          </button>

          <button
            id="tab-habits"
            onClick={() => onTabChange('habits')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'habits'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Habits</span>
          </button>

          <button
            id="tab-routine"
            onClick={() => onTabChange('routine')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'routine'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Daily Routine</span>
          </button>

          <button
            id="tab-diet"
            onClick={() => onTabChange('diet')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'diet'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Diet & Nutrition</span>
          </button>

          <button
            id="tab-analytics"
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'analytics'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
