import { useState } from 'react';
import {
  Utensils,
  Plus,
  Droplets,
  Trash2,
  PieChart,
  Flame,
  Search,
  Check,
  Sparkles,
  Coffee,
  Sun,
  Sunset,
  Cookie,
} from 'lucide-react';
import { DietMeal, MealType, UserGoals, FoodPreset } from '../types';
import { FOOD_PRESETS } from '../data/initialData';
import { formatDisplayDate } from '../utils/dateUtils';

interface DietTrackerProps {
  selectedDate: string;
  meals: DietMeal[];
  nutritionSummary: { calories: number; protein: number; carbs: number; fat: number };
  waterIntake: number;
  addWater: (delta: number, date: string) => void;
  setWaterIntake: (val: number, date: string) => void;
  addMeal: (meal: Omit<DietMeal, 'id'>, date: string) => void;
  deleteMeal: (id: string, date: string) => void;
  goals: UserGoals;
  onOpenAddMealModal: (defaultType?: MealType) => void;
}

const MEAL_TYPES: { type: MealType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'breakfast', label: 'Breakfast', icon: <Coffee className="w-4 h-4 text-amber-600" />, color: 'border-amber-200 bg-amber-50/40' },
  { type: 'lunch', label: 'Lunch', icon: <Sun className="w-4 h-4 text-orange-600" />, color: 'border-orange-200 bg-orange-50/40' },
  { type: 'dinner', label: 'Dinner', icon: <Sunset className="w-4 h-4 text-indigo-600" />, color: 'border-indigo-200 bg-indigo-50/40' },
  { type: 'snack', label: 'Snacks & Supplements', icon: <Cookie className="w-4 h-4 text-emerald-600" />, color: 'border-emerald-200 bg-emerald-50/40' },
];

export function DietTracker({
  selectedDate,
  meals,
  nutritionSummary,
  waterIntake,
  addWater,
  setWaterIntake,
  addMeal,
  deleteMeal,
  goals,
  onOpenAddMealModal,
}: DietTrackerProps) {
  const [presetSearch, setPresetSearch] = useState('');
  const [quickMealType, setQuickMealType] = useState<MealType>('breakfast');
  const [addedPresetNotification, setAddedPresetNotification] = useState<string | null>(null);

  const calorieRemaining = goals.calorieTarget - nutritionSummary.calories;
  const caloriePct = Math.min(100, Math.round((nutritionSummary.calories / goals.calorieTarget) * 100));
  const proteinPct = Math.min(100, Math.round((nutritionSummary.protein / goals.proteinTarget) * 100));
  const carbsPct = Math.min(100, Math.round((nutritionSummary.carbs / goals.carbsTarget) * 100));
  const fatPct = Math.min(100, Math.round((nutritionSummary.fat / goals.fatTarget) * 100));
  const waterPct = Math.min(100, Math.round((waterIntake / goals.waterTargetMl) * 100));

  const filteredPresets = FOOD_PRESETS.filter((p) =>
    p.name.toLowerCase().includes(presetSearch.toLowerCase())
  );

  const handleQuickAddPreset = (preset: FoodPreset) => {
    addMeal(
      {
        mealType: quickMealType,
        name: preset.name,
        calories: preset.calories,
        protein: preset.protein,
        carbs: preset.carbs,
        fat: preset.fat,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      },
      selectedDate
    );
    setAddedPresetNotification(`Added "${preset.name}" to ${quickMealType}!`);
    setTimeout(() => setAddedPresetNotification(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Macronutrient & Calorie Summary */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5" />
                Diet & Nutrition
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {formatDisplayDate(selectedDate)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Macronutrients & Hydration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fuel your body with intention and track your energetic intake.
            </p>
          </div>

          {/* Calorie Pill status */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-center">
              <div className="text-[11px] font-medium text-slate-500">Consumed</div>
              <div className="text-xl font-bold text-slate-900">{nutritionSummary.calories}</div>
              <div className="text-[10px] text-slate-400">kcal</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-center">
              <div className="text-[11px] font-medium text-slate-500">
                {calorieRemaining >= 0 ? 'Remaining' : 'Over Target'}
              </div>
              <div
                className={`text-xl font-bold ${
                  calorieRemaining >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {Math.abs(calorieRemaining)}
              </div>
              <div className="text-[10px] text-slate-400">kcal</div>
            </div>

            <button
              id="btn-diet-log-meal-main"
              onClick={() => onOpenAddMealModal()}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-3.5 py-3 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Log Meal</span>
            </button>
          </div>
        </div>

        {/* 4-Macro Bars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Calories */}
          <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-slate-700">Calories</span>
              <span className="text-slate-900 font-bold">
                {nutritionSummary.calories} / {goals.calorieTarget} kcal
              </span>
            </div>
            <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${caloriePct}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1 text-right">{caloriePct}% of daily goal</div>
          </div>

          {/* Protein */}
          <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-3.5">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-rose-800">Protein</span>
              <span className="text-slate-900 font-bold">
                {nutritionSummary.protein} / {goals.proteinTarget}g
              </span>
            </div>
            <div className="h-2 w-full bg-rose-200/60 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${proteinPct}%` }}
              />
            </div>
            <div className="text-[11px] text-rose-600 mt-1 text-right font-medium">{proteinPct}% of daily goal</div>
          </div>

          {/* Carbs */}
          <div className="bg-sky-50/40 border border-sky-100 rounded-xl p-3.5">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-sky-800">Carbohydrates</span>
              <span className="text-slate-900 font-bold">
                {nutritionSummary.carbs} / {goals.carbsTarget}g
              </span>
            </div>
            <div className="h-2 w-full bg-sky-200/60 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full transition-all duration-300"
                style={{ width: `${carbsPct}%` }}
              />
            </div>
            <div className="text-[11px] text-sky-600 mt-1 text-right font-medium">{carbsPct}% of daily goal</div>
          </div>

          {/* Fat */}
          <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-3.5">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-amber-800">Fats</span>
              <span className="text-slate-900 font-bold">
                {nutritionSummary.fat} / {goals.fatTarget}g
              </span>
            </div>
            <div className="h-2 w-full bg-amber-200/60 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full transition-all duration-300"
                style={{ width: `${fatPct}%` }}
              />
            </div>
            <div className="text-[11px] text-amber-700 mt-1 text-right font-medium">{fatPct}% of daily goal</div>
          </div>
        </div>

        {/* Water Hydration Sub-banner */}
        <div className="mt-5 p-4 rounded-xl bg-sky-50/80 border border-sky-200/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-900">Hydration Progress</div>
              <div className="text-base font-bold text-slate-900">
                {waterIntake} ml <span className="text-xs font-normal text-slate-500">/ {goals.waterTargetMl} ml target</span>
              </div>
            </div>
          </div>

          {/* Water buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-diet-water-add-250"
              onClick={() => addWater(250, selectedDate)}
              className="px-3 py-1.5 text-xs font-bold bg-white text-sky-700 hover:bg-sky-100/90 rounded-lg border border-sky-300/80 shadow-2xs transition-colors"
            >
              +250ml Glass
            </button>
            <button
              id="btn-diet-water-add-500"
              onClick={() => addWater(500, selectedDate)}
              className="px-3 py-1.5 text-xs font-bold bg-white text-sky-700 hover:bg-sky-100/90 rounded-lg border border-sky-300/80 shadow-2xs transition-colors"
            >
              +500ml Bottle
            </button>
            <button
              id="btn-diet-water-reset"
              onClick={() => setWaterIntake(0, selectedDate)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors"
              title="Reset Water"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Meals breakdown (Left) + Fast Preset Library (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Meals by Type (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {MEAL_TYPES.map((typeObj) => {
            const slotMeals = meals.filter((m) => m.mealType === typeObj.type);
            const slotCalories = slotMeals.reduce((s, m) => s + m.calories, 0);
            const slotProtein = slotMeals.reduce((s, m) => s + m.protein, 0);

            return (
              <div
                key={typeObj.type}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                {/* Meal Slot Header */}
                <div
                  className={`flex items-center justify-between px-5 py-3.5 border-b ${typeObj.color}`}
                >
                  <div className="flex items-center gap-2.5">
                    {typeObj.icon}
                    <h3 className="text-sm font-bold text-slate-900">{typeObj.label}</h3>
                    <span className="text-xs font-medium text-slate-500">
                      ({slotMeals.length} items)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">
                      {slotCalories} kcal · <span className="text-rose-600">{slotProtein}g pro</span>
                    </span>
                    <button
                      id={`btn-add-meal-to-${typeObj.type}`}
                      onClick={() => onOpenAddMealModal(typeObj.type)}
                      className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Items in Slot */}
                <div className="divide-y divide-slate-100 p-2">
                  {slotMeals.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-400">
                      No {typeObj.label.toLowerCase()} logged yet.
                    </div>
                  ) : (
                    slotMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 truncate">
                              {meal.name}
                            </span>
                            {meal.time && (
                              <span className="text-[10px] font-mono text-slate-400">
                                {meal.time}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">
                              {meal.calories} kcal
                            </span>
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbs}g</span>
                            <span>F: {meal.fat}g</span>
                          </div>
                        </div>

                        <button
                          id={`btn-delete-meal-${meal.id}`}
                          onClick={() => deleteMeal(meal.id, selectedDate)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                          title="Delete Food"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Quick Food Presets (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs sticky top-20">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Quick-Log Food Library</h3>
            </div>

            {addedPresetNotification && (
              <div className="my-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                {addedPresetNotification}
              </div>
            )}

            {/* Target meal slot selector */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-500 block mb-1">
                Add Selected Food to:
              </label>
              <select
                id="select-quick-meal-slot"
                value={quickMealType}
                onChange={(e) => setQuickMealType(e.target.value as MealType)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            {/* Search presets */}
            <div className="mt-3 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="input-search-food-presets"
                type="text"
                placeholder="Search food presets..."
                value={presetSearch}
                onChange={(e) => setPresetSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Presets List */}
            <div className="mt-3 space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-2.5 rounded-xl border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/30 transition-all flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {preset.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-amber-700">{preset.calories} kcal</span>
                      <span>P:{preset.protein}g</span>
                      <span>C:{preset.carbs}g</span>
                      <span>F:{preset.fat}g</span>
                    </div>
                  </div>

                  <button
                    id={`btn-quick-log-${preset.id}`}
                    onClick={() => handleQuickAddPreset(preset)}
                    className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors shrink-0"
                    title={`Add to ${quickMealType}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
