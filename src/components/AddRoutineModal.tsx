import { useState, useEffect } from 'react';
import { X, Clock, Sparkles } from 'lucide-react';
import { RoutineItem, RoutinePhase } from '../types';

interface AddRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<RoutineItem, 'id'>, existingId?: string) => void;
  routineToEdit?: RoutineItem | null;
}

const PHASES: { key: RoutinePhase; label: string }[] = [
  { key: 'morning', label: 'Morning (05:00 - 11:59)' },
  { key: 'afternoon', label: 'Afternoon (12:00 - 17:59)' },
  { key: 'evening', label: 'Evening (18:00 - 21:59)' },
  { key: 'night', label: 'Night (22:00 - 04:59)' },
];

const ROUTINE_CATEGORIES = [
  'Health',
  'Fitness',
  'Diet',
  'Productivity',
  'Mind',
  'Lifestyle',
  'Learning',
];

export function AddRoutineModal({
  isOpen,
  onClose,
  onSave,
  routineToEdit,
}: AddRoutineModalProps) {
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState<RoutinePhase>('morning');
  const [time, setTime] = useState('07:30');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [category, setCategory] = useState('Health');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (routineToEdit) {
      setTitle(routineToEdit.title);
      setPhase(routineToEdit.phase);
      setTime(routineToEdit.time);
      setDurationMinutes(routineToEdit.durationMinutes || 20);
      setCategory(routineToEdit.category || 'Health');
      setNotes(routineToEdit.notes || '');
    } else {
      setTitle('');
      setPhase('morning');
      setTime('07:30');
      setDurationMinutes(20);
      setCategory('Health');
      setNotes('');
    }
  }, [routineToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(
      {
        title: title.trim(),
        phase,
        time,
        durationMinutes: Number(durationMinutes) || 15,
        category,
        notes: notes.trim() || undefined,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
      routineToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {routineToEdit ? 'Edit Routine Item' : 'New Routine Item'}
            </h3>
          </div>
          <button
            id="btn-close-routine-modal"
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
              Routine Action *
            </label>
            <input
              id="input-routine-title"
              type="text"
              required
              placeholder="e.g. Morning stretch & mobility, Review daily goals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Phase & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Day Phase</label>
              <select
                id="select-routine-phase"
                value={phase}
                onChange={(e) => setPhase(e.target.value as RoutinePhase)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              >
                {PHASES.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                id="select-routine-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              >
                {ROUTINE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scheduled Time & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Time</label>
              <input
                id="input-routine-time"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration (minutes)
              </label>
              <input
                id="input-routine-duration"
                type="number"
                min="1"
                max="360"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instructions or Context
            </label>
            <textarea
              id="textarea-routine-notes"
              rows={2}
              placeholder="e.g. Keep room dark, sip 500ml water, do 3 sets of cat-cow"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              id="btn-cancel-routine"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-routine"
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-xs"
            >
              {routineToEdit ? 'Save Changes' : 'Add to Routine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
