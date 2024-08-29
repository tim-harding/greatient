import {
  gammaToLinear as srgbGammaToLinear,
  linearToGamma as srgbLinearToGamma,
} from "./srgb";
import { Matrix } from "./matrix";

/** Convert a P3 channel from gamma to linear */
export const gammaToLinear = srgbGammaToLinear;

/** Convert a P3 channel from gamma to linear */
export const linearToGamma = srgbLinearToGamma;

// prettier-ignore
/** @type {Matrix} */
export const P3_TO_XYZ = 	 [
  608311 / 1250200, 189793 / 714400,  198249 / 1000160,
   35783 /  156275, 247089 / 357200,  198249 / 2500400,
       0 /       1,  32229 / 714400, 5220557 / 5000800,
];

// prettier-ignore
/** @type {Matrix} */
export const XYZ_TO_P3 = [
  446124 / 178915, -333277 / 357830, -72051 / 178915,
  -14852 /  17905,   63121 /  35810,    423 /  17905,
   11844 / 330415,  -50337 / 660830, 316169 / 330415,
];
