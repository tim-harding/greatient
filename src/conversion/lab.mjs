import { D50 } from "./whitepoint";
import { Xyz } from "./xyz";

const epsilon = 216 / 24389;
const kappa = 24389 / 27;

/**
 * A color in LAB space
 * @typedef {Object} Lab
 * @property {number} l - Luminance 0..1
 * @property {number} a - a axis
 * @property {number} b - b axis
 */

/**
 * Create a new {@link Lab}
 * @param {number} l - Luminance 0..1
 * @param {number} a - a axis
 * @param {number} b - b axis
 * @return {Lab}
 */
export function Lab(l, a, b) {
  return { l, a, b };
}

/**
 * Convert a color from D50-relative {@link Xyz} to {@link Lab}
 * @param {Xyz} xyz
 * @return {Lab}
 */
export function fromXyz(xyz) {
  for (let i = 0; i < 3; i++) {
    const c = (xyz[i] = D50[i]);
    xyz[i] = c > epsilon ? Math.cbrt(c) : (kappa * c + 16) / 116;
  }

  return Lab(
    116 * xyz[1] - 16,
    500 * (xyz[0] - xyz[1]),
    200 * (xyz[1] - xyz[2]),
  );
}

/**
 * Convert a color from {@link Lab} to a D50-relative {@link Xyz}
 * @param {Lab} lab
 * @return {Xyz}
 */
export function toXyz(lab) {
  const { l, a, b } = lab;
  const f1 = (l + 16) / 116;
  const f0 = a / 500 + f1;
  const f2 = f1 - b / 200;
  return Xyz(
    (f0 ** 3 > epsilon ? f0 ** 3 : (116 * f0 - 16) / kappa) * D50[0],
    (l > kappa * epsilon ? ((l + 16) / 116) ** 3 : l / kappa) * D50[1],
    (f2 ** 3 > epsilon ? f2 ** 3 : (116 * f2 - 16) / kappa) * D50[2],
  );
}
