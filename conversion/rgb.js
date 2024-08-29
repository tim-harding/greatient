/**
 * An RGB color
 * @typedef {Object} Rgb
 * @property {number} r - Red channel 0..1
 * @property {number} g - Green channel 0..1
 * @property {number} b - Blue channel 0..1
 */

/**
 * Create an {@link Rgb} color from CSS syntax.
 * @param {number} r - Red channel [0, 255]
 * @param {number} g - Green channel [0, 255]
 * @param {number} b - Blue channel [0, 255]
 * @return {Rgb}
 */
export function Rgb(r, g, b) {
  return {
    r: r,
    g: g,
    b: b,
  };
}
