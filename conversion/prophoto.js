import { sign } from "./shared";
import { Matrix } from "./matrix";

const Et2 = 16 / 512;
const Et = 1 / 512;

/**
 * Convert a ProPhoto channel from gamma to linear
 * @param {number} c
 * @return {number}
 */
export function gammaToLinear(c) {
  const abs = Math.abs(c);
  return abs <= Et2 ? c / 16 : sign(c) * Math.pow(abs, 1.8);
}

/**
 * Convert a ProPhoto channel from linear to gamma
 * @param {number} c
 * @return {number}
 */
export function linearToGamma(c) {
  let abs = Math.abs(c);
  return abs >= Et ? sign(c) * Math.pow(abs, 1 / 1.8) : 16 * c;
}

// prettier-ignore
/** @type {Matrix} */
export const PROPHOTO_TO_XYZ = [
  0.79776664490064230, 0.13518129740053308, 0.03134773412839220,
  0.28807482881940130, 0.71183523424187300, 0.00008993693872564,
  0.00000000000000000, 0.00000000000000000, 0.82510460251046020,
];

// prettier-ignore
/** @type {Matrix} */
export const XYZ_TO_PROPHOTO = [
   1.34578688164715830, -0.25557208737979464, -0.05110186497554526,
  -0.54463070512490190,  1.50824774284514680,  0.02052744743642139,
   0.00000000000000000,  0.00000000000000000,  1.21196754563894520,
];
