import { sign } from "./shared";
import { Matrix } from "./matrix";

/**
 * Convert an a98 channel from gamma to linear
 * @param {number} c
 * @return {number}
 */
export function gammaToLinear(c) {
  return sign(c) * Math.pow(Math.abs(c), 563 / 256);
}

/**
 * Convert an a98 channel from linear to gamma
 * @param {number} c
 * @return {number}
 */
export function linearToGamma(c) {
  return sign(c) * Math.pow(Math.abs(c), 256 / 563);
}

// prettier-ignore
/** @type {Matrix} */
export const A98_TO_XYZ = [
  573536 /  994567,  263643 / 1420810,  187206 /  994567,
  591459 / 1989134, 6239551 / 9945670,  374412 / 4972835,
   53769 / 1989134,  351524 / 4972835, 4929758 / 4972835,
];

// prettier-ignore
/** @type {Matrix} */
export const XYZ_TO_A98 = [
  1829569 /  896150, -506331 /  896150, -308931 /  896150,
  -851781 /  878810, 1648619 /  878810,   36519 /  878810,
    16779 / 1248040, -147721 / 1248040, 1266979 / 1248040,
];
