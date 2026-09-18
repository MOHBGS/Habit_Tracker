import { useState } from 'react';
import {
  X,
  Settings,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { UserGoals } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: UserGoals;
  onUpdateGoals: (goals: Partial<UserGoals>) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onResetData: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  goals,
  onUpdateGoals,
  onExportData,
  onImportData,
  onResetData,
}: SettingsModalProps) {
  const [calorieTarget, setCalorieTarget] = useState(goals.calorieTarget);
  const [proteinTarget, setProteinTarget] = useState(goals.proteinTarget);
  const [carbsTarget, setCarbsTarget] = useState(goals.carbsTarget);
  const [fatTarget, setFatTarget] = useState(goals.fatTarget);
  const [waterTargetMl, setWaterTargetMl] = useState(goals.waterTargetMl);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoals({
      calorieTarget: Number(calorieTarget) || 2000,
      proteinTarget: Number(proteinTarget) || 120,
      carbsTarget: Number(carbsTarget) || 200,
      fatTarget: Number(fatTarget) || 60,
      waterTargetMl: Number(waterTargetMl) || 2500,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImportData(content);
      if (success) {
        setImportStatus('Data imported successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Settings & Targets</h3>
          </div>
          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nutritional & Hydration Targets Form */}
        <form onSubmit={handleSaveGoals} className="space-y-4 mt-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daily Nutrition & Water Targets
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Calorie Target (kcal)
              </label>
              <input
                id="setting-calorie-target"
                type="number"
                min="500"
                max="10000"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(Number(e.target.value))}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Water Target (ml)
              </label>
              <input
                id="setting-water-target"
                type="number"
                min="500"
                max="10000"
                step="100"
                value={waterTargetMl}
                onChange={(e) => setWaterTargetMl(Number(e.target.value))}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-rose-700 mb-1">
                Protein (g)
              </label>
              <input
                id="setting-protein-target"
                type="number"
                min="10"
                max="500"
                value={proteinTarget}
                onChange={(e) => setProteinTarget(Number(e.target.value))}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-sky-700 mb-1">
                Carbs (g)
              </label>
              <input
                id="setting-carbs-target"
                type="number"
                min="10"
                max="800"
                value={carbsTarget}
                onChange={(e) => setCarbsTarget(Number(e.target.value))}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-amber-700 mb-1">
                Fat (g)
              </label>
              <input
                id="setting-fat-target"
                type="number"
                min="5"
                max="300"
                value={fatTarget}
                onChange={(e) => setFatTarget(Number(e.target.value))}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {savedSuccess ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Targets updated!
              </span>
            ) : <span />}

            <button
              type="submit"
              id="btn-save-targets"
              className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors shadow-xs"
            >
              Update Targets
            </button>
          </div>
        </form>

        {/* Data Management & Backup */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Data Backup & Storage
          </h4>

          {importStatus && (
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800">
              {importStatus}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Export */}
            <button
              type="button"
              id="btn-export-backup"
              onClick={onExportData}
              className="flex items-center justify-center gap-2 p-3 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Backup</span>
            </button>

            {/* Import */}
            <label
              htmlFor="input-import-file"
              className="flex items-center justify-center gap-2 p-3 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Import JSON Backup</span>
              <input
                id="input-import-file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset button */}
          <div className="pt-2">
            <button
              type="button"
              id="btn-reset-sample-data"
              onClick={() => {
                if (
                  window.confirm(
                    'Reset all tracker data to original sample habits, routines, and seed logs?'
                  )
                ) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 p-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Starter Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
