import { D50 } from "./whitepoint";

const epsilon = 216 / 24389;
const kappa = 24389 / 27;

/**
 * Convert a D50-relative XYZ color to a CIE LAB color
 */
export function fromXyz(xyz) {
  // Scale relative to reference white
  xyz = xyz.map((value, i) => value / D50[i]);

  const f = xyz.map((c) =>
    c > epsilon ? Math.cbrt(c) : (kappa * c + 16) / 116,
  );

  return [116 * f[1] - 16, 500 * (f[0] - f[1]), 200 * (f[1] - f[2])];
}

/**
 * Convert a CIE LAB color to a D50-relative XYZ color
 */
export function fromXyz(lab) {
  const f = [0, 0, 0];
  f[1] = (lab[0] + 16) / 116;
  f[0] = lab[1] / 500 + f[1];
  f[2] = f[1] - lab[2] / 200;

  const xyz = [
    Math.pow(f[0], 3) > epsilon ? Math.pow(f[0], 3) : (116 * f[0] - 16) / kappa,
    lab[0] > kappa * epsilon
      ? Math.pow((lab[0] + 16) / 116, 3)
      : lab[0] / kappa,
    Math.pow(f[2], 3) > epsilon ? Math.pow(f[2], 3) : (116 * f[2] - 16) / kappa,
  ];

  // Scale by reference white
  return xyz.map((value, i) => value * D50[i]);
}
