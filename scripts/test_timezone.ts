import { getWarsawTimeState, isRestaurantOpenForOrders, formatNextOpening } from '../lib/hours';

// Helper to test a specific date
function testDate(description: string, isoDateString: string) {
  const date = new Date(isoDateString);
  console.log(`\n--- ${description} ---`);
  console.log(`UTC Input:  ${date.toISOString()}`);
  
  const state = getWarsawTimeState(date);
  console.log(`Warsaw Time: ${state.dateString} ${Math.floor(state.minutesSinceMidnight / 60)}:${state.minutesSinceMidnight % 60}`);
  
  // Note: we'd need to mock 'new Date()' inside the functions if we didn't pass date, 
  // but let's test only getWarsawTimeState natively.
}

console.log("TESTING getWarsawTimeState:");
testDate("Before Midnight (Warsaw)", "2026-04-07T21:45:00.000Z"); // Should be 23:45 in Warsaw (DST)
testDate("Exactly Midnight (Warsaw)", "2026-04-07T22:00:00.000Z"); // Should be 24:00/00:00 in Warsaw
testDate("After Midnight (Warsaw)", "2026-04-07T22:15:00.000Z"); // Should be 00:15 in Warsaw next day

