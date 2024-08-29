import { Matrix } from "./linalg";
import { sign } from "./shared";

const alpha = 1.09929682680944;
const beta = 0.018053968510807;

/**
 * Convert a rec2020 channel from gamma to linear
 * @param {number} c
 * @return {number}
 */
export function gammaToLinear(c) {
  const abs = Math.abs(c);
  return abs < beta * 4.5
    ? c / 4.5
    : sign(c) * Math.pow((abs + alpha - 1) / alpha, 1 / 0.45);
}

/**
 * Convert a rec2020 channel from linear to gamma
 * @param {number} c
 * @return {number}
 */
export function linearToGamma(c) {
  const abs = Math.abs(c);
  return abs > beta
    ? sign(c) * (alpha * Math.pow(abs, 0.45) - (alpha - 1))
    : 4.5 * c;
}

// prettier-ignore
/** @type {Matrix} */
export const REC2020_TO_XYZ = [
  63426534 / 99577255,  20160776 / 139408157,  47086771 / 278816314,
  26158966 / 99577255, 472592308 / 697040785,   8267143 / 139408157,
         0 /        1,  19567812 / 697040785, 295819943 / 278816314,
];

// prettier-ignore
/** @type {Matrix} */
export const XYZ_TO_REC2020 = [
   30757411 / 17917100, -6372589 / 17917100, -4539589 / 17917100,
  -19765991 / 29648200, 47925759 / 29648200,   467509 / 29648200,
     792561 / 44930125, -1921689 / 44930125, 42328811 / 44930125,
];
