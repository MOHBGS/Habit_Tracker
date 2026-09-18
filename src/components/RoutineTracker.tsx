import { useState } from 'react';
import {
  Clock,
  Plus,
  CheckCircle2,
  Sun,
  Sunset,
  Moon,
  CloudSun,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { RoutineItem, RoutinePhase } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';

interface RoutineTrackerProps {
  selectedDate: string;
  routines: RoutineItem[];
  isRoutineCompleted: (id: string, date: string) => boolean;
  toggleRoutineItem: (id: string, date: string) => void;
  getRoutineProgress: (date: string) => { completed: number; total: number; percentage: number };
  onOpenAddRoutine: () => void;
  onEditRoutine: (item: RoutineItem) => void;
  onDeleteRoutine: (id: string) => void;
}

const PHASE_CONFIG: Record<
  RoutinePhase,
  { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
> = {
  morning: {
    label: 'Morning Routine',
    icon: <Sun className="w-4 h-4 text-amber-500" />,
    bg: 'bg-amber-50/50',
    text: 'text-amber-800',
    border: 'border-amber-200/70',
  },
  afternoon: {
    label: 'Afternoon Focus & Recharge',
    icon: <CloudSun className="w-4 h-4 text-sky-500" />,
    bg: 'bg-sky-50/50',
    text: 'text-sky-800',
    border: 'border-sky-200/70',
  },
  evening: {
    label: 'Evening Wind-Down',
    icon: <Sunset className="w-4 h-4 text-indigo-500" />,
    bg: 'bg-indigo-50/50',
    text: 'text-indigo-800',
    border: 'border-indigo-200/70',
  },
  night: {
    label: 'Night & Sleep Preparation',
    icon: <Moon className="w-4 h-4 text-purple-500" />,
    bg: 'bg-purple-50/50',
    text: 'text-purple-800',
    border: 'border-purple-200/70',
  },
};

export function RoutineTracker({
  selectedDate,
  routines,
  isRoutineCompleted,
  toggleRoutineItem,
  getRoutineProgress,
  onOpenAddRoutine,
  onEditRoutine,
  onDeleteRoutine,
}: RoutineTrackerProps) {
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const progress = getRoutineProgress(selectedDate);

  // Total scheduled duration
  const totalMinutes = routines.reduce((sum, r) => sum + (r.durationMinutes || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const formattedDuration = `${hours > 0 ? `${hours}h ` : ''}${remainingMins}m`;

  const phases: RoutinePhase[] = ['morning', 'afternoon', 'evening', 'night'];

  // Sort routines chronologically by time
  const sortedRoutines = [...routines].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Structured Rhythm
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {formatDisplayDate(selectedDate)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Daily Routine Timeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Flow through intentional time blocks from sunrise to slumber.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[11px] font-medium text-slate-500">Scheduled Time</div>
              <div className="text-base sm:text-lg font-bold text-slate-900">
                {formattedDuration}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[11px] font-medium text-slate-500">Completed</div>
              <div className="text-base sm:text-lg font-bold text-indigo-600">
                {progress.completed}/{progress.total} ({progress.percentage}%)
              </div>
            </div>

            <button
              id="btn-routine-add-item"
              onClick={onOpenAddRoutine}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Routine Item</span>
            </button>
          </div>
        </div>

        {/* Routine completion progress bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Daily Routine Execution</span>
            <span>{progress.percentage}% Finished</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </section>

      {/* Routine Sections by Phase */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const phaseItems = sortedRoutines.filter((r) => r.phase === phase);
          if (phaseItems.length === 0) return null;

          const phaseConfig = PHASE_CONFIG[phase];
          const phaseCompleted = phaseItems.filter((r) => isRoutineCompleted(r.id, selectedDate)).length;

          return (
            <div
              key={phase}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
            >
              {/* Phase Header */}
              <div
                className={`flex items-center justify-between px-5 py-3.5 ${phaseConfig.bg} border-b ${phaseConfig.border}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center">
                    {phaseConfig.icon}
                  </div>
                  <h3 className={`text-sm font-bold ${phaseConfig.text}`}>
                    {phaseConfig.label}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    ({phaseItems.length} items)
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-600">
                  {phaseCompleted}/{phaseItems.length} Done
                </div>
              </div>

              {/* Phase Items List */}
              <div className="divide-y divide-slate-100 p-2">
                {phaseItems.map((item) => {
                  const done = isRoutineCompleted(item.id, selectedDate);

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl transition-all ${
                        done ? 'bg-slate-50/70 opacity-75' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Checkbox */}
                        <button
                          id={`btn-toggle-routine-${item.id}`}
                          onClick={() => toggleRoutineItem(item.id, selectedDate)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                            done
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'border-2 border-slate-300 text-transparent hover:border-indigo-500'
                          }`}
                          title={done ? 'Mark pending' : 'Mark done'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold ${
                                done ? 'text-slate-400 line-through' : 'text-slate-900'
                              }`}
                            >
                              {item.title}
                            </span>
                            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {item.time}
                            </span>
                            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {item.category}
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>
                          )}
                        </div>
                      </div>

                      {/* Right: duration and actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100/80 px-2 py-1 rounded-md">
                          {item.durationMinutes} min
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            id={`btn-edit-routine-${item.id}`}
                            onClick={() => onEditRoutine(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-delete-routine-${item.id}`}
                            onClick={() => {
                              if (window.confirm(`Remove routine item "${item.title}"?`)) {
                                onDeleteRoutine(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
