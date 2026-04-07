export interface OpeningHours {
  day: number // 0 = Sunday, 1 = Monday, etc.
  start: string
  end: string
}

export const OPENING_HOURS: OpeningHours[] = [
  // Sunday (0) — weekend
  { day: 0, start: "10:00", end: "22:45" },
  // Monday (1)
  { day: 1, start: "12:00", end: "21:45" },
  // Tuesday (2)
  { day: 2, start: "12:00", end: "21:45" },
  // Wednesday (3)
  { day: 3, start: "12:00", end: "21:45" },
  // Thursday (4)
  { day: 4, start: "12:00", end: "21:45" },
  // Friday (5)
  { day: 5, start: "12:00", end: "21:45" },
  // Saturday (6) — weekend
  { day: 6, start: "10:00", end: "22:45" },
]

function timeToMinutes(time: string): number {
  if (time === "24:00" || time === "00:00") return 24 * 60
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

/**
 * Returns a bulletproof state object for the exact current time in Europe/Warsaw.
 */
export function getWarsawTimeState(date?: Date) {
    const now = date || new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Warsaw',
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });

    const parts = formatter.formatToParts(now);
    
    let wDay = '';
    let wHour = 0;
    let wMinute = 0;
    let wYear = '';
    let wMonth = '';
    let wDayOfMonth = '';

    for (const part of parts) {
        if (part.type === 'weekday') wDay = part.value;
        if (part.type === 'hour') wHour = parseInt(part.value, 10);
        if (part.type === 'minute') wMinute = parseInt(part.value, 10);
        if (part.type === 'year') wYear = part.value;
        if (part.type === 'month') wMonth = part.value;
        if (part.type === 'day') wDayOfMonth = part.value;
    }

    // Correct edge case where some browsers/node versions report midnight as '24' instead of '0' when hour12 is false
    if (wHour === 24) wHour = 0;

    const dayMap: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    const currentDay = dayMap[wDay] ?? 0;

    return {
        currentDay,
        minutesSinceMidnight: wHour * 60 + wMinute,
        dateString: `${wYear}-${wMonth}-${wDayOfMonth}`,
    };
}

/**
 * Checks if the restaurant is currently open for orders.
 * Orders are allowed from opening time until 21:45 on weekdays, 22:45 on weekends (Sat/Sun).
 */
export function isRestaurantOpenForOrders() {
    const { currentDay, minutesSinceMidnight, dateString } = getWarsawTimeState();
    
    // Holiday Override (April 5-6, 2026 - Easter)
    if (dateString === "2026-04-05" || dateString === "2026-04-06") {
        return { isOpen: false };
    }

    const todayHours = OPENING_HOURS.find((h) => h.day === currentDay);
    if (!todayHours) return { isOpen: false };

    const startMinutes = timeToMinutes(todayHours.start);
    const endMinutes = timeToMinutes(todayHours.end);

    const isOpen = minutesSinceMidnight >= startMinutes && minutesSinceMidnight < endMinutes;
    return { isOpen };
}

export function formatNextOpening() {
    const { currentDay, minutesSinceMidnight, dateString } = getWarsawTimeState();
    
    // Holiday Override (April 5-6, 2026 - Easter)
    if (dateString === "2026-04-05" || dateString === "2026-04-06") {
        return `we wtorek o 12:00`;
    }

    // Check if opens later today
    const todayHours = OPENING_HOURS.find((h) => h.day === currentDay);
    if (todayHours && minutesSinceMidnight < timeToMinutes(todayHours.start)) {
        return `Dziś o ${todayHours.start}`;
    }

    // Find next day
    const tomorrow = (currentDay + 1) % 7;
    const tomorrowHours = OPENING_HOURS.find((h) => h.day === tomorrow);
    const dayNames = ["niedzielę", "poniedziałek", "wtorek", "środę", "czwartek", "piątek", "sobotę"];
    return `w ${dayNames[tomorrow]} o ${tomorrowHours?.start || "12:00"}`;
}
