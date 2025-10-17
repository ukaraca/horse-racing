export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
export function affinityToMul(x: number, min = 0.9, max = 1.1) {
  const t = clamp(x, 0, 1);
  return lerp(min, max, t);
}
export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)]!;
}

export * from "./position";
