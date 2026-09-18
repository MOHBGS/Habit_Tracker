import { useState, useEffect } from 'react';
import { X, Utensils, Sparkles, Plus } from 'lucide-react';
import { DietMeal, MealType } from '../types';
import { FOOD_PRESETS } from '../data/initialData';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: Omit<DietMeal, 'id'>) => void;
  defaultMealType?: MealType;
}

export function AddMealModal({
  isOpen,
  onClose,
  onSave,
  defaultMealType = 'breakfast',
}: AddMealModalProps) {
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number>(350);
  const [protein, setProtein] = useState<number>(25);
  const [carbs, setCarbs] = useState<number>(35);
  const [fat, setFat] = useState<number>(10);
  const [time, setTime] = useState('12:00');

  useEffect(() => {
    setMealType(defaultMealType);
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setTime(`${hh}:${mm}`);
    setName('');
    setCalories(350);
    setProtein(25);
    setCarbs(35);
    setFat(10);
  }, [defaultMealType, isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: string) => {
    const found = FOOD_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setName(found.name);
      setCalories(found.calories);
      setProtein(found.protein);
      setCarbs(found.carbs);
      setFat(found.fat);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      mealType,
      name: name.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      time,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Log Food or Meal</h3>
          </div>
          <button
            id="btn-close-meal-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Meal Type & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meal Slot</label>
              <select
                id="select-meal-type-slot"
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Eaten</label>
              <input
                id="input-meal-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          {/* Quick presets picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Choose from Common Foods (Auto-fills macros)
            </label>
            <select
              id="select-food-preset-autofill"
              onChange={(e) => handleSelectPreset(e.target.value)}
              defaultValue=""
              className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2 text-slate-800"
            >
              <option value="" disabled>
                -- Select a healthy preset or type custom below --
              </option>
              {FOOD_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.calories} kcal · {p.protein}g P · {p.carbs}g C)
                </option>
              ))}
            </select>
          </div>

          {/* Food Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Food / Dish Name *</label>
            <input
              id="input-meal-name"
              type="text"
              required
              placeholder="e.g. Grilled Chicken Rice Bowl, Greek Yogurt & Honey"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Calories & Macros (4 inputs) */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="text-xs font-bold text-slate-700">Nutritional Information</div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-amber-700 mb-1">
                  Calories (kcal)
                </label>
                <input
                  id="input-meal-calories"
                  type="number"
                  min="0"
                  max="5000"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-rose-700 mb-1">
                  Protein (g)
                </label>
                <input
                  id="input-meal-protein"
                  type="number"
                  min="0"
                  max="500"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-sky-700 mb-1">
                  Carbs (g)
                </label>
                <input
                  id="input-meal-carbs"
                  type="number"
                  min="0"
                  max="500"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-700 mb-1">
                  Fat (g)
                </label>
                <input
                  id="input-meal-fat"
                  type="number"
                  min="0"
                  max="500"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              id="btn-cancel-meal"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-meal"
              className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors shadow-xs"
            >
              Log Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
