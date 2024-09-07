const N = 2;
const E = 4;
const S = 6;
const W = 8;

/**
 * Create a array containing the control points of a bezier control mesh.
 * Each control point is specified by ten numbers:
 *
 * - Anchor (x,y)
 * - North control point relative to the anchor (x,y)
 * - East control point relative to the anchor (x,y)
 * - South control point relative to the anchor (x,y)
 * - West control point relative to the anchor (x,y)
 *
 * The control are stored one after another, row by row.
 *
 * @param {number} width Number of control points in the x-axis
 * @param {number} height Number of control points in the y-axis
 * @return {Float32Array}
 */
export function create(width, height) {
  return new Float32Array(width * height * 10);
}

/**
 * Resize a bezier control mesh previously created with {@see create}.
 * @param {Float32Array} oldControlPoints
 * @param {number} oldWidth Current number of control points in the x-axis
 * @param {number} oldHeight Current number of control points in the y-axis
 * @param {number} newWidth Number of control points in the x-axis to resize to
 * @param {number} newHeight Number of control points in the y-axis to resize to
 */
export function resize(
  oldControlPoints,
  oldWidth,
  oldHeight,
  newWidth,
  newHeight,
) {
  const out = create(newWidth, newHeight);
  const w = Math.min(oldWidth, newWidth);
  const h = Math.min(oldHeight, newHeight);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcStart = y * oldWidth + x;
      const srcEnd = srcStart + w;
      const dstStart = y * newWidth + x;
      const src = oldControlPoints.subarray(srcStart * 10, srcEnd * 10);
      out.set(src, dstStart * 10);
    }
  }
  return out;
}

/**
 * Compute the patch matrix P for the bezier patch at index (x,y)
 * @param {Float32Array} controlPoints
 * @param {number} x Patch x-index
 * @param {number} y Patch y-index
 * @param {number} w Control mesh width in control points
 */
export function patchMatrix(controlPoints, x, y, w) {
  const nw = index(x, y, w);
  const ne = index(x + 1, y, w);
  const sw = index(x, y + 1, w);
  const se = index(x + 1, y + 1, w);

  const nwax = controlPoints[nw];
  const nway = controlPoints[nw + 1];
  const nwhx = controlPoints[nw + E];
  const nwhy = controlPoints[nw + E + 1];
  const nwvx = controlPoints[nw + S];
  const nwvy = controlPoints[nw + S + 1];

  const neax = controlPoints[ne];
  const neay = controlPoints[ne + 1];
  const nehx = controlPoints[ne + W];
  const nehy = controlPoints[ne + W + 1];
  const nevx = controlPoints[ne + S];
  const nevy = controlPoints[ne + S + 1];

  const swax = controlPoints[sw];
  const sway = controlPoints[sw + 1];
  const swhx = controlPoints[sw + E];
  const swhy = controlPoints[sw + E + 1];
  const swvx = controlPoints[sw + N];
  const swvy = controlPoints[sw + N + 1];

  const seax = controlPoints[se];
  const seay = controlPoints[se + 1];
  const sehx = controlPoints[se + W];
  const sehy = controlPoints[se + W + 1];
  const sevx = controlPoints[se + N];
  const sevy = controlPoints[se + N + 1];

  const p00x = nwax;
  const p00y = nway;
  const p01x = nwax + nwhx;
  const p01y = nway + nwhy;
  const p02x = neax + nehx;
  const p02y = neay + nehy;
  const p03x = neax;
  const p03y = neay;

  const p10x = nwax + nwvx;
  const p10y = nway + nwvy;
  const p11x = nwax + nwvx + nwhx;
  const p11y = nway + nwvy + nwhy;
  const p12x = neax + nevx + nehx;
  const p12y = neay + nevy + nehy;
  const p13x = neax + nevx;
  const p13y = neay + nevy;

  const p20x = swax + swvx;
  const p20y = sway + swvy;
  const p21x = swax + swvx + swhx;
  const p21y = sway + swvy + swhy;
  const p22x = seax + sevx + sehx;
  const p22y = seay + sevy + sehy;
  const p23x = seax + sevx;
  const p23y = seay + sevy;

  const p30x = swax;
  const p30y = sway;
  const p31x = swax + swhx;
  const p31y = sway + swhy;
  const p32x = seax + sehx;
  const p32y = seay + sehy;
  const p33x = seax;
  const p33y = seay;

  // prettier-ignore
  return new Float32Array([
    p00x, p00y, p01x, p01y, p02x, p02y, p03x, p03y,
    p10x, p10y, p11x, p11y, p12x, p12y, p13x, p13y,
    p20x, p20y, p21x, p21y, p22x, p22y, p23x, p23y,
    p30x, p30y, p31x, p31y, p32x, p32y, p33x, p33y,
  ])
}

/**
 * Get the index for a control point
 * @param {number} x Control point x-index
 * @param {number} y Control point y-index
 * @param {number} w Control mesh width in control points
 * @return {number}
 */
function index(x, y, w) {
  return (x * w + y) * 10;
}
