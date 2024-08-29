export function fmod(n, m) {
  return ((n % m) + m) % m;
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function clamp01(n) {
  return clamp(n, 0, 1);
}
