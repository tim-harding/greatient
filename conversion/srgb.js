import { Matrix } from "./linalg";
import { sign } from "./shared";

/**
 * Convert an sRGB channel from gamma to linear
 * @param {number} c
 * @return {number}
 */
export function gammaToLinear(c) {
  const abs = Math.abs(c);
  return abs <= 0.04045
    ? c / 12.92
    : sign(c) * Math.pow((abs + 0.055) / 1.055, 2.4);
}

/**
 * Convert an sRGB channel from linear to gamma
 * @param {number} c
 * @return {number}
 */
export function linearToGamma(c) {
  const abs = Math.abs(c);
  return abs > 0.0031308
    ? sign(c) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055)
    : 12.92 * c;
}

// prettier-ignore
/** @type {Matrix} */
export const SRGB_TO_XYZ = [
  506752 / 1228815,  87881 / 245763,   12673 /   70218,
   87098 /  409605, 175762 / 245763,   12673 /  175545,
    7918 /  409605,  87881 / 737289, 1001167 / 1053270,
];

// prettier-ignore
/** @type {Matrix} */
export const XYZ_TO_SRGB = [
    12831 /   3959,    -329 /    214, -1974 /   3959,
  -851781 / 878810, 1648619 / 878810, 36519 / 878810,
      705 /  12673,   -2585 /  12673,   705 /    667,
];
