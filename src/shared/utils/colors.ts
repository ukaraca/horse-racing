export function generateUniqueColors(count: number): string[] {
  const colors: string[] = [];
  const step = 360 / count;
  for (let i = 0; i < count; i++) {
    const hue = (i * step + Math.random() * 15) % 360;
    const saturation = 60 + Math.random() * 20; // 60–80%
    const lightness = 45 + Math.random() * 15; // 45–60%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}
