/**
 * A 3D vector
 * @typedef {[number, number, number]} Vector
 */

/**
 * A column-major 3×3 matrix
 * @typedef {[
 *     number, number, number,
 *     number, number, number,
 *     number, number, number,
 * ]} Matrix
 */

/**
 * Multiply two column-major 3×3 matrices
 * @param {Matrix} a
 * @param {Matrix} b
 * @returns {Matrix}
 */
export function mulmat(a, b) {
  const o = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const i = y * 3 + x;
      for (let z = 0; z < 3; z++) {
        o[i] += a[y * 3 + z] * b[z * 3 + x];
      }
    }
  }
  return o;
}

/**
 * Multiply a column-major 3×3 matrix with a 3D vector
 * @param {Matrix} m
 * @param {Vector} v
 * @returns {Vector}
 */
export function mulvec(m, v) {
  const o = [0, 0, 0];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      o[y] += v[x] * m[y * 3 + x];
    }
  }
  return o;
}
