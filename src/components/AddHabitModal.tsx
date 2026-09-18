import { useState, useEffect } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { Habit, HabitCategory } from '../types';
import { HabitIcon, AVAILABLE_ICONS, COLOR_MAP } from './HabitIcon';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt'>, existingId?: string) => void;
  habitToEdit?: Habit | null;
}

const CATEGORIES: { key: HabitCategory; label: string }[] = [
  { key: 'health', label: 'Health' },
  { key: 'fitness', label: 'Fitness' },
  { key: 'mind', label: 'Mind' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'diet', label: 'Diet' },
  { key: 'lifestyle', label: 'Lifestyle' },
];

const COLORS = ['emerald', 'sky', 'indigo', 'teal', 'amber', 'rose', 'violet'];

export function AddHabitModal({
  isOpen,
  onClose,
  onSave,
  habitToEdit,
}: AddHabitModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [color, setColor] = useState('emerald');
  const [icon, setIcon] = useState('Sparkles');
  const [type, setType] = useState<'boolean' | 'numeric'>('boolean');
  const [targetValue, setTargetValue] = useState<number>(10);
  const [unit, setUnit] = useState<string>('mins');

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category);
      setColor(habitToEdit.color);
      setIcon(habitToEdit.icon);
      setType(habitToEdit.type);
      setTargetValue(habitToEdit.targetValue || 10);
      setUnit(habitToEdit.unit || 'mins');
    } else {
      setTitle('');
      setDescription('');
      setCategory('health');
      setColor('emerald');
      setIcon('Sparkles');
      setType('boolean');
      setTargetValue(10);
      setUnit('mins');
    }
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        color,
        icon,
        frequency: 'daily',
        type,
        targetValue: type === 'numeric' ? Number(targetValue) : undefined,
        unit: type === 'numeric' ? unit.trim() : undefined,
      },
      habitToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
            </h3>
          </div>
          <button
            id="btn-close-habit-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Habit Name *
            </label>
            <input
              id="input-habit-title"
              type="text"
              required
              placeholder="e.g. Read 20 pages, 30-min walk, No sugar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Intention (Optional)
            </label>
            <input
              id="input-habit-desc"
              type="text"
              placeholder="Why this habit matters or specific rules"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                id="select-habit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tracking Style</label>
              <select
                id="select-habit-type"
                value={type}
                onChange={(e) => setType(e.target.value as 'boolean' | 'numeric')}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              >
                <option value="boolean">Simple Checkmark</option>
                <option value="numeric">Numeric Target (pages, mins, ml)</option>
              </select>
            </div>
          </div>

          {/* If numeric, target value & unit */}
          {type === 'numeric' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Target Value
                </label>
                <input
                  id="input-habit-target-val"
                  type="number"
                  min="1"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Unit</label>
                <input
                  id="input-habit-unit"
                  type="text"
                  placeholder="e.g. pages, mins, ml"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>
            </div>
          )}

          {/* Color & Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Color</label>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  id={`color-picker-${c}`}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all ${
                    COLOR_MAP[c]?.bg || 'bg-slate-100'
                  } ${color === c ? 'border-slate-900 scale-105' : 'border-transparent'}`}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-slate-900" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Icon</label>
            <div className="grid grid-cols-8 gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200/60">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  id={`icon-choice-${ic}`}
                  onClick={() => setIcon(ic)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                    icon === ic
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                  title={ic}
                >
                  <HabitIcon name={ic} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              id="btn-cancel-habit"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-habit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-xs"
            >
              {habitToEdit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
