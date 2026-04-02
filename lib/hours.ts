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
 * Checks if the restaurant is currently open for orders.
 * Orders are allowed from opening time until 21:45 on weekdays, 22:45 on weekends (Sat/Sun).
 */
export function isRestaurantOpenForOrders() {
    const now = new Date()
    /*
     * We need to convert UTC to Poland time (Europe/Warsaw)
     * because the server might be running in a different timezone.
     */
    const warsawFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Warsaw',
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'short'
    });

    const options = { timeZone: 'Europe/Warsaw', hour12: false };
    const warsawHours = parseInt(new Intl.DateTimeFormat('en-US', { ...options, hour: 'numeric' }).format(now));
    const warsawMinutes = parseInt(new Intl.DateTimeFormat('en-US', { ...options, minute: 'numeric' }).format(now));
    
    // To get the Warsaw day of week, we format the date to a localized string and parse the weekday. 0=Sunday
    const warsawWeekdayStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Warsaw', weekday: 'short' }).format(now);
    const dayMap: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    const currentDay = dayMap[warsawWeekdayStr as string] || 0;

    const currentMinutes = warsawHours * 60 + warsawMinutes;

    const todayHours = OPENING_HOURS.find((h) => h.day === currentDay);
    if (!todayHours) return { isOpen: false };

    const startMinutes = timeToMinutes(todayHours.start);
    const endMinutes = timeToMinutes(todayHours.end);

    const isOpen = currentMinutes >= startMinutes && currentMinutes < endMinutes;
    return { isOpen };
}

export function formatNextOpening() {
    const now = new Date();
    
    // Warsaw timezone configuration
    const options = { timeZone: 'Europe/Warsaw', hour12: false };
    const warsawHours = parseInt(new Intl.DateTimeFormat('en-US', { ...options, hour: 'numeric' }).format(now));
    const warsawMinutes = parseInt(new Intl.DateTimeFormat('en-US', { ...options, minute: 'numeric' }).format(now));
    
    // Warsaw weekday
    const warsawWeekdayStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Warsaw', weekday: 'short' }).format(now);
    const dayMap: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    const currentDay = dayMap[warsawWeekdayStr as string] || 0;

    const currentTime = warsawHours * 60 + warsawMinutes;
    
    // Check if opens later today
    const todayHours = OPENING_HOURS.find((h) => h.day === currentDay)
    if (todayHours && currentTime < timeToMinutes(todayHours.start)) {
        return `Dziś o ${todayHours.start}`
    }

    // Find next day
    const tomorrow = (currentDay + 1) % 7
    const tomorrowHours = OPENING_HOURS.find((h) => h.day === tomorrow)
    const dayNames = ["niedzielę", "poniedziałek", "wtorek", "środę", "czwartek", "piątek", "sobotę"]
    return `w ${dayNames[tomorrow]} o ${tomorrowHours?.start || "12:00"}`
}
