import { Lab } from "./lab";

/**
 * A color in LCH
 * @typedef {Object} Lch
 * @property {number} l - Luminance 0..1
 * @property {number} c - Chromiticity
 * @property {number} h - Hue in radians -pi..pi
 */

/**
 * Create a new {@link Lch}
 * @param {number} l
 * @param {number} c
 * @param {number} h
 * @return {Lch}
 */
export function Lch(l, c, h) {
  return { l, c, h };
}

/**
 * Convert a color from {@link Lab} to {@link Lch}
 * @param {Lab} lab
 * @return {Lch}
 */
export function fromLab(lab) {
  const [l, a, b] = lab;
  return [l, Math.sqrt(a * a + b * b), Math.atan2(b, a)];
}

/**
 * Convert a color for {@link Lch} to {@link Lab}
 * @param {Lch} lch
 * @return {Lab}
 */
export function toLab(lch) {
  const [l, c, h] = lch;
  return Lab(l, c * Math.cos(h), c * Math.sin(h));
}
