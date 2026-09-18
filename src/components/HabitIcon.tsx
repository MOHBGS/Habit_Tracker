import React from 'react';
import {
  Droplets,
  Activity,
  BookOpen,
  Sparkles,
  Apple,
  Moon,
  Dumbbell,
  Coffee,
  Heart,
  Smile,
  Zap,
  Brain,
  Sun,
  Flame,
  Check,
  Target,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Droplets,
  Activity,
  BookOpen,
  Sparkles,
  Apple,
  Moon,
  Dumbbell,
  Coffee,
  Heart,
  Smile,
  Zap,
  Brain,
  Sun,
  Flame,
  Target,
  Check,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export const COLOR_MAP: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', ring: 'ring-sky-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'ring-emerald-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', ring: 'ring-indigo-500' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', ring: 'ring-teal-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', ring: 'ring-amber-500' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', ring: 'ring-rose-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', ring: 'ring-violet-500' },
};

export function HabitIcon({
  name,
  className = 'w-5 h-5',
}: {
  name?: string;
  className?: string;
}) {
  const Component = (name && ICON_MAP[name]) || Target;
  return <Component className={className} />;
}
