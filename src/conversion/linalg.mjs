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
 * Create a new {@link Vector}
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {Vector}
 */
export function Vector(x, y, z) {
  return [x, y, z];
}

/**
 * Create a new {@link Matrix}
 * @param {number} m00
 * @param {number} m01
 * @param {number} m02
 * @param {number} m10
 * @param {number} m11
 * @param {number} m12
 * @param {number} m20
 * @param {number} m21
 * @param {number} m22
 * @return {Matrix}
 */
// prettier-ignore
export function Matrix(
  m00, m01, m02, 
  m10, m11, m12, 
  m20, m21, m22,
) {
  return [
    m00, m01, m02, 
    m10, m11, m12, 
    m20, m21, m22
  ];
}

/**
 * Multiply two {@link Matrix matrices}
 * @param {Matrix} a
 * @param {Matrix} b
 * @returns {Matrix}
 */
export function mulmat(a, b) {
  const o = Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0);
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
 * Multiply a {@link Matrix} with a {@link Vector}
 * @param {Matrix} m
 * @param {Vector} v
 * @returns {Vector}
 */
export function mulvec(m, v) {
  const o = Vector(0, 0, 0);
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      o[y] += v[x] * m[y * 3 + x];
    }
  }
  return o;
}
