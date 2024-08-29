export function xyzToLab(xyz) {
  // Assuming XYZ is relative to D50, convert to CIE Lab
  // from CIE standard, which now defines these as a rational fraction
  var epsilon = 216 / 24389; // 6^3/29^3
  var kappa = 24389 / 27; // 29^3/3^3

  // Scale relative to reference white
  xyz = xyz.map((value, i) => value / D50[i]);

  // now compute f
  const f = xyz.map((value) =>
    value > epsilon ? Math.cbrt(value) : (kappa * value + 16) / 116,
  );

  return [116 * f[1] - 16, 500 * (f[0] - f[1]), 200 * (f[1] - f[2])];
}

export function labToXyz(Lab) {
  // Convert Lab to D50-adapted XYZ
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  var kappa = 24389 / 27; // 29^3/3^3
  var epsilon = 216 / 24389; // 6^3/29^3
  var f = [];

  // compute f, starting with the luminance-related term
  f[1] = (Lab[0] + 16) / 116;
  f[0] = Lab[1] / 500 + f[1];
  f[2] = f[1] - Lab[2] / 200;

  // compute xyz
  var xyz = [
    Math.pow(f[0], 3) > epsilon ? Math.pow(f[0], 3) : (116 * f[0] - 16) / kappa,
    Lab[0] > kappa * epsilon
      ? Math.pow((Lab[0] + 16) / 116, 3)
      : Lab[0] / kappa,
    Math.pow(f[2], 3) > epsilon ? Math.pow(f[2], 3) : (116 * f[2] - 16) / kappa,
  ];

  // Compute XYZ by scaling xyz by reference white
  return xyz.map((value, i) => value * D50[i]);
}

export function labToLch(Lab) {
  // Convert to polar form
  var hue = (Math.atan2(Lab[2], Lab[1]) * 180) / Math.PI;
  return [
    Lab[0], // L is still L
    Math.sqrt(Math.pow(Lab[1], 2) + Math.pow(Lab[2], 2)), // Chroma
    hue >= 0 ? hue : hue + 360, // Hue, in degrees [0 to 360)
  ];
}

export function lchToLab(LCH) {
  // Convert from polar form
  return [
    LCH[0], // L is still L
    LCH[1] * Math.cos((LCH[2] * Math.PI) / 180), // a
    LCH[1] * Math.sin((LCH[2] * Math.PI) / 180), // b
  ];
}

export function oklabToOklch(oklab) {
  const [l, a, b] = oklab;
  var hue = (Math.atan2(b, a) * 180) / Math.PI;
  return [l, Math.sqrt(a ** 2 + b ** 2), hue >= 0 ? hue : hue + 360];
}

export function oklchToOklab(oklch) {
  const [l, c, h] = oklch;
  return [
    l,
    c * Math.cos((h * Math.PI) / 180),
    c * Math.sin((h * Math.PI) / 180),
  ];
}

// prettier-ignore
/** @type {import("./matrix").Matrix} */
export const XYZ_TO_LMS = [
  0.8190224379967030, 0.3619062600528904, -0.1288737815209879,
  0.0329836539323885, 0.9292868615863434,  0.0361446663506424,
  0.0481771893596242, 0.2642395317527308,  0.6335478284694309,
];

// prettier-ignore
/** @type {import("./matrix").Matrix} */
export const  LMS_TO_OKLAB = [
  0.2104542683093140,  0.7936177747023054, -0.0040720430116193,
  1.9779985324311684, -2.4285922420485799,  0.4505937096174110,
  0.0259040424655478,  0.7827717124575296, -0.8086757549230774,
];

// prettier-ignore
/** @type {import("./matrix").Matrix} */
export const LMS_TO_XYZ =  [
   1.2268798758459243, -0.5578149944602171,  0.2813910456659647,
  -0.0405757452148008,  1.1122868032803170, -0.0717110580655164,
  -0.0763729366746601, -0.4214933324022432,  1.5869240198367816,
];

// prettier-ignore
/** @type {import("./matrix").Matrix} */
export const OKLAB_TO_LMS = [
  1.0000000000000000,  0.3963377773761749,  0.2158037573099136,
  1.0000000000000000, -0.1055613458156586, -0.0638541728258133,
  1.0000000000000000, -0.0894841775298119, -1.2914855480194092,
];
