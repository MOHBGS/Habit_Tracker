import { useState } from 'react';
import { useTrackerData } from './hooks/useTrackerData';
import { Header, ActiveTab } from './components/Header';
import { TodayOverview } from './components/TodayOverview';
import { HabitTracker } from './components/HabitTracker';
import { RoutineTracker } from './components/RoutineTracker';
import { DietTracker } from './components/DietTracker';
import { AnalyticsView } from './components/AnalyticsView';
import { AddHabitModal } from './components/AddHabitModal';
import { AddRoutineModal } from './components/AddRoutineModal';
import { AddMealModal } from './components/AddMealModal';
import { SettingsModal } from './components/SettingsModal';
import { Habit, RoutineItem, MealType } from './types';

export default function App() {
  const tracker = useTrackerData();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modal states
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false);
  const [routineToEdit, setRoutineToEdit] = useState<RoutineItem | null>(null);

  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [defaultMealSlot, setDefaultMealSlot] = useState<MealType>('breakfast');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Meal and Nutrition for currently selected date
  const mealsForDate = tracker.getMealsForDate(tracker.selectedDate);
  const nutritionSummary = tracker.getNutritionSummary(tracker.selectedDate);
  const waterIntake = tracker.getWaterIntake(tracker.selectedDate);
  const wellness = tracker.getWellness(tracker.selectedDate);

  // Habit Handlers
  const handleOpenAddHabit = () => {
    setHabitToEdit(null);
    setIsAddHabitOpen(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setHabitToEdit(habit);
    setIsAddHabitOpen(true);
  };

  const handleSaveHabit = (
    data: Omit<Habit, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      const existing = tracker.habits.find((h) => h.id === existingId);
      if (existing) {
        tracker.updateHabit({
          ...existing,
          ...data,
        });
      }
    } else {
      tracker.addHabit(data);
    }
  };

  // Routine Handlers
  const handleOpenAddRoutine = () => {
    setRoutineToEdit(null);
    setIsAddRoutineOpen(true);
  };

  const handleEditRoutine = (item: RoutineItem) => {
    setRoutineToEdit(item);
    setIsAddRoutineOpen(true);
  };

  const handleSaveRoutine = (
    data: Omit<RoutineItem, 'id'>,
    existingId?: string
  ) => {
    if (existingId) {
      tracker.updateRoutineItem({
        ...data,
        id: existingId,
      });
    } else {
      tracker.addRoutineItem(data);
    }
  };

  // Meal Handlers
  const handleOpenAddMeal = (slot: MealType = 'breakfast') => {
    setDefaultMealSlot(slot);
    setIsAddMealOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Persistent Header with Tab Bar & Date Switcher */}
      <Header
        selectedDate={tracker.selectedDate}
        onSelectDate={tracker.setSelectedDate}
        onPrevDay={tracker.goToPreviousDay}
        onNextDay={tracker.goToNextDay}
        onGoToToday={tracker.goToToday}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddHabit={handleOpenAddHabit}
        onOpenAddRoutine={handleOpenAddRoutine}
        onOpenAddMeal={() => handleOpenAddMeal('breakfast')}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <TodayOverview
            selectedDate={tracker.selectedDate}
            habits={tracker.habits}
            isHabitCompleted={tracker.isHabitCompleted}
            getHabitValue={tracker.getHabitValue}
            toggleHabit={tracker.toggleHabit}
            setHabitValue={tracker.setHabitValue}
            getHabitStreak={tracker.getHabitStreak}
            routines={tracker.routines}
            isRoutineCompleted={tracker.isRoutineCompleted}
            toggleRoutineItem={tracker.toggleRoutineItem}
            getRoutineProgress={tracker.getRoutineProgress}
            meals={mealsForDate}
            nutritionSummary={nutritionSummary}
            waterIntake={waterIntake}
            addWater={tracker.addWater}
            wellness={wellness}
            updateWellness={tracker.updateWellness}
            goals={tracker.goals}
            onNavigateTab={setActiveTab}
            onOpenAddHabit={handleOpenAddHabit}
            onOpenAddRoutine={handleOpenAddRoutine}
            onOpenAddMeal={() => handleOpenAddMeal('breakfast')}
          />
        )}

        {activeTab === 'habits' && (
          <HabitTracker
            selectedDate={tracker.selectedDate}
            habits={tracker.habits}
            isHabitCompleted={tracker.isHabitCompleted}
            toggleHabit={tracker.toggleHabit}
            getHabitValue={tracker.getHabitValue}
            setHabitValue={tracker.setHabitValue}
            getHabitStreak={tracker.getHabitStreak}
            onOpenAddHabit={handleOpenAddHabit}
            onEditHabit={handleEditHabit}
            onDeleteHabit={tracker.deleteHabit}
          />
        )}

        {activeTab === 'routine' && (
          <RoutineTracker
            selectedDate={tracker.selectedDate}
            routines={tracker.routines}
            isRoutineCompleted={tracker.isRoutineCompleted}
            toggleRoutineItem={tracker.toggleRoutineItem}
            getRoutineProgress={tracker.getRoutineProgress}
            onOpenAddRoutine={handleOpenAddRoutine}
            onEditRoutine={handleEditRoutine}
            onDeleteRoutine={tracker.deleteRoutineItem}
          />
        )}

        {activeTab === 'diet' && (
          <DietTracker
            selectedDate={tracker.selectedDate}
            meals={mealsForDate}
            nutritionSummary={nutritionSummary}
            waterIntake={waterIntake}
            addWater={tracker.addWater}
            setWaterIntake={tracker.setWaterIntake}
            addMeal={tracker.addMeal}
            deleteMeal={tracker.deleteMeal}
            goals={tracker.goals}
            onOpenAddMealModal={handleOpenAddMeal}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            habits={tracker.habits}
            isHabitCompleted={tracker.isHabitCompleted}
            getHabitStreak={tracker.getHabitStreak}
            routines={tracker.routines}
            getRoutineProgress={tracker.getRoutineProgress}
            getNutritionSummary={tracker.getNutritionSummary}
            getWaterIntake={tracker.getWaterIntake}
            goals={tracker.goals}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            Habit & Routine Tracker · Local offline-first data sync
          </div>
          <div className="flex items-center gap-4">
            <button
              id="footer-export-btn"
              onClick={tracker.exportData}
              className="hover:text-slate-600 transition-colors"
            >
              Export JSON Backup
            </button>
            <span>·</span>
            <button
              id="footer-settings-btn"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-600 transition-colors"
            >
              Targets & Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddHabitOpen}
        onClose={() => setIsAddHabitOpen(false)}
        onSave={handleSaveHabit}
        habitToEdit={habitToEdit}
      />

      <AddRoutineModal
        isOpen={isAddRoutineOpen}
        onClose={() => setIsAddRoutineOpen(false)}
        onSave={handleSaveRoutine}
        routineToEdit={routineToEdit}
      />

      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        onSave={(meal) => tracker.addMeal(meal, tracker.selectedDate)}
        defaultMealType={defaultMealSlot}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        goals={tracker.goals}
        onUpdateGoals={tracker.updateGoals}
        onExportData={tracker.exportData}
        onImportData={tracker.importData}
        onResetData={tracker.resetAllData}
      />
    </div>
  );
}
