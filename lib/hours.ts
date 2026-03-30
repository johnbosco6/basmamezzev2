export interface OpeningHours {
  day: number // 0 = Sunday, 1 = Monday, etc.
  start: string
  end: string
}

export const OPENING_HOURS: OpeningHours[] = [
  // Sunday (0)
  { day: 0, start: "10:00", end: "23:00" },
  // Monday (1)
  { day: 1, start: "12:00", end: "23:00" },
  // Tuesday (2)
  { day: 2, start: "12:00", end: "23:00" },
  // Wednesday (3)
  { day: 3, start: "12:00", end: "23:00" },
  // Thursday (4)
  { day: 4, start: "12:00", end: "23:00" },
  // Friday (5)
  { day: 5, start: "12:00", end: "00:00" },
  // Saturday (6)
  { day: 6, start: "10:00", end: "00:00" },
]

function timeToMinutes(time: string): number {
  if (time === "24:00" || time === "00:00") return 24 * 60
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

/**
 * Checks if the restaurant is currently open for orders.
 * Orders are allowed from opening time until 30 minutes before closing.
 * FOR NOW: Orders are always open (user request 2026-03-30)
 */
export function isRestaurantOpenForOrders() {
  return { isOpen: true }
}

export function formatNextOpening() {
    const now = new Date()
    const currentDay = now.getDay()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
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
