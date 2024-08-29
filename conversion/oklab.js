import { Matrix, mulmat } from "./linalg";

/**
 * @typedef {Object} Oklab
 * @property {number} l - Luminance in 0..1
 * @property {number} a - a axis
 * @property {number} b - b axis
 */

/**
 * Create a new {@link Oklab}
 * @param {number} l - Luminance in 0..1
 * @param {number} a - a axis
 * @param {number} b - b axis
 * @returns {Oklab}
 */
export function Oklab(l, a, b) {
  return { l, a, b };
}

// prettier-ignore
/** @type {Matrix} */
const XYZ_TO_LMS = [
  0.8190224379967030, 0.3619062600528904, -0.1288737815209879,
  0.0329836539323885, 0.9292868615863434,  0.0361446663506424,
  0.0481771893596242, 0.2642395317527308,  0.6335478284694309,
];

// prettier-ignore
/** @type {Matrix} */
const  LMS_TO_OKLAB = [
  0.2104542683093140,  0.7936177747023054, -0.0040720430116193,
  1.9779985324311684, -2.4285922420485799,  0.4505937096174110,
  0.0259040424655478,  0.7827717124575296, -0.8086757549230774,
];

// prettier-ignore
/** @type {Matrix} */
const LMS_TO_XYZ =  [
   1.2268798758459243, -0.5578149944602171,  0.2813910456659647,
  -0.0405757452148008,  1.1122868032803170, -0.0717110580655164,
  -0.0763729366746601, -0.4214933324022432,  1.5869240198367816,
];

// prettier-ignore
/** @type {Matrix} */
const OKLAB_TO_LMS = [
  1.0000000000000000,  0.3963377773761749,  0.2158037573099136,
  1.0000000000000000, -0.1055613458156586, -0.0638541728258133,
  1.0000000000000000, -0.0894841775298119, -1.2914855480194092,
];

export const XYZ_TO_OKLAB = mulmat(LMS_TO_OKLAB, XYZ_TO_LMS);

export const OKLAB_TO_XYZ = mulmat(LMS_TO_XYZ, OKLAB_TO_LMS);
