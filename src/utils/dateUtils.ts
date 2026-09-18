export function getTodayDateString(): string {
  const now = new Date();
  return formatDate(now);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseDate(dateStr);
  const today = getTodayDateString();
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);

  if (dateStr === today) {
    return `Today, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }
  if (dateStr === yesterday) {
    return `Yesterday, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }
  if (dateStr === tomorrow) {
    return `Tomorrow, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getPastNDays(endDateStr: string, n: number): string[] {
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    result.push(addDays(endDateStr, -i));
  }
  return result;
}

export function getWeekDaysForDate(dateStr: string): { date: string; dayName: string; dayNumber: number; isToday: boolean }[] {
  const current = parseDate(dateStr);
  // Start week on Monday (0 is Sunday, 1 is Monday)
  const dayOfWeek = current.getDay(); // 0 is Sun, 1 is Mon...
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(current);
  monday.setDate(current.getDate() - distanceToMonday);

  const todayStr = getTodayDateString();
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dStr = formatDate(d);
    days.push({
      date: dStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dayNumber: d.getDate(),
      isToday: dStr === todayStr,
    });
  }
  return days;
}

/**
 * Calculates current streak and longest streak for a habit given its completion logs
 */
export function calculateHabitStreak(
  habitId: string,
  logs: Record<string, boolean>, // key: `${date}_${habitId}`
  referenceDateStr: string = getTodayDateString()
): { currentStreak: number; longestStreak: number; totalCompleted: number } {
  let totalCompleted = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Count total completed
  Object.keys(logs).forEach((key) => {
    if (key.endsWith(`_${habitId}`) && logs[key]) {
      totalCompleted++;
    }
  });

  // Check backwards from today/yesterday for current streak
  let checkDate = referenceDateStr;
  const todayKey = `${checkDate}_${habitId}`;
  
  // If not completed today, check if yesterday was completed
  if (!logs[todayKey]) {
    checkDate = addDays(checkDate, -1);
  }

  while (logs[`${checkDate}_${habitId}`]) {
    currentStreak++;
    checkDate = addDays(checkDate, -1);
  }

  // Calculate longest streak over the past 365 days
  const pastYearDates = getPastNDays(referenceDateStr, 120);
  for (const date of pastYearDates) {
    if (logs[`${date}_${habitId}`]) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak, totalCompleted };
}
