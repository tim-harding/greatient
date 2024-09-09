/**
 * A CIE XYZ color
 * @typedef {Object} Xyz
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * Create a new {@link Xyz}
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {Xyz}
 */
export function Xyz(x, y, z) {
  return { x, y, z };
}
