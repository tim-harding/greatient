/**
 * Equivalent to `n % m`, except that negative numbers are turned positive.
 * @param {number} n - Number to take the modulus of
 * @param {number} m - Modulus
 * @returns {number}
 */
export function fmod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * Constrains a value to the given range
 * @param {number} n - Value to constrain
 * @param {number} min - Lower bound
 * @param {number} max - Upper bound
 * @returns {number}
 */
export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Constrains a value within the range 0..1
 * @param {number} n
 * @returns {number}
 */
export function clamp01(n) {
  return clamp(n, 0, 1);
}

/**
 * The sign of the given number
 * @param {number} n
 * @return {number}
 */
export function sign(n) {
  return n < 0 ? -1 : 1;
}
