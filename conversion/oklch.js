import { Oklab } from "./oklab";
/** @typedef {import("./matrix").Vector} Vector */

/**
 * Description
 * @typedef {Object} Oklch
 * @property {"oklch"} kind
 * @property {Vector} v
 */

/**
 * Create a new {@link Oklch}
 * @param {Vector} v
 * @return {Oklch}
 */
export function Oklch(v) {
  return {
    kind: "oklch",
    v,
  };
}

/**
 * @param {Oklab} oklab
 * @return {Oklch}
 */
export function fromOklab(oklab) {
  const [l, a, b] = oklab.v;
  var hue = (Math.atan2(b, a) * 180) / Math.PI;
  return Oklch([l, Math.sqrt(a ** 2 + b ** 2), hue >= 0 ? hue : hue + 360]);
}

/**
 * Convert from {@link Oklch} to {@link Oklab}
 * @param {Oklch} oklch
 * @return {Oklab}
 */
export function toOklab(oklch) {
  const [l, c, h] = oklch.v;
  return Oklab([
    l,
    c * Math.cos((h * Math.PI) / 180),
    c * Math.sin((h * Math.PI) / 180),
  ]);
}
