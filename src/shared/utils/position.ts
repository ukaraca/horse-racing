/**
 * Utility functions for position-related operations
 */

/**
 * Get the suffix for a position number (1st, 2nd, 3rd, 4th, etc.)
 * @param position - The position number
 * @returns The appropriate suffix string
 */
export function getPositionSuffix(position: number): string {
  if (position === 1) return "st";
  if (position === 2) return "nd";
  if (position === 3) return "rd";
  return "th";
}

/**
 * Get the full position string with suffix (1st, 2nd, 3rd, 4th, etc.)
 * @param position - The position number
 * @returns The full position string
 */
export function getFullPosition(position: number): string {
  return `${position}${getPositionSuffix(position)}`;
}

/**
 * Get position color based on ranking
 * @param position - The position number (1-based)
 * @returns CSS color value
 */
export function getPositionColor(position: number): string {
  switch (position) {
    case 1:
      return "var(--color-gold, #ffd700)";
    case 2:
      return "var(--color-silver, #c0c0c0)";
    case 3:
      return "var(--color-bronze, #cd7f32)";
    default:
      return "var(--color-text-secondary)";
  }
}

/**
 * Check if position is on podium (top 3)
 * @param position - The position number
 * @returns True if position is 1st, 2nd, or 3rd
 */
export function isPodiumPosition(position: number): boolean {
  return position >= 1 && position <= 3;
}

/**
 * Get medal emoji for position
 * @param position - The position number
 * @returns Medal emoji string
 */
export function getMedalEmoji(position: number): string {
  switch (position) {
    case 1:
      return "🏆";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return "";
  }
}
