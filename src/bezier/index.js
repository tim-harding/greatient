/**
 * Create a array containing the control points of a bezier control mesh.
 * Each control point is specified by ten numbers:
 *
 * - Anchor (x,y)
 * - Top control point (x,y)
 * - Bottom control point (x,y)
 * - Left control point (x,y)
 * - Right control point (x,y)
 *
 * The control are stored one after another, row by row.
 *
 * @param {number} width Number of control points in the x-axis
 * @param {number} height Number of control points in the y-axis
 * @return {Float32Array}
 */
export function createControlPoints(width, height) {
  return new Float32Array(width * height * 10);
}

/**
 * Resize a bezier control mesh previously created with {@see createControlPoints}.
 * @param {Float32Array} oldControlPoints
 * @param {number} oldWidth Current number of control points in the x-axis
 * @param {number} oldHeight Current number of control points in the y-axis
 * @param {number} newWidth Number of control points in the x-axis to resize to
 * @param {number} newHeight Number of control points in the y-axis to resize to
 */
export function resizeControlPoints(
  oldControlPoints,
  oldWidth,
  oldHeight,
  newWidth,
  newHeight,
) {
  const out = createControlPoints(newWidth, newHeight);
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
