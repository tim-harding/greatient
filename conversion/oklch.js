import { Oklab } from "./oklab";
/** @typedef {import("./linalg").Vector} Vector */

/**
 * Description
 * @typedef {Object} Oklch
 * @property {number} l - Luminance in 0..1
 * @property {number} c - Chromiticity
 * @property {number} h - Hue in radians -pi..pi
 */

/**
 * Create a new {@link Oklch}
 * @param {number} l - Luminance in 0..1
 * @param {number} c - Chromiticity
 * @param {number} h - Hue in radians -pi..pi
 * @return {Oklch}
 */
export function Oklch(l, c, h) {
  return { l, c, h };
}

/**
 * @param {Oklab} oklab
 * @return {Oklch}
 */
export function fromOklab(oklab) {
  const { l, a, b } = oklab;
  return Oklch(l, Math.sqrt(a * a + b * b), Math.atan2(b, a));
}

/**
 * Convert from {@link Oklch} to {@link Oklab}
 * @param {Oklch} oklch
 * @return {Oklab}
 */
export function toOklab(oklch) {
  const { l, c, h } = oklch;
  return Oklab(
    l,
    c * Math.cos((h * Math.PI) / 180),
    c * Math.sin((h * Math.PI) / 180),
  );
}
