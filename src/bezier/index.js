/**
 * Create a new data structure for the control points of a Bezier control mesh
 * @param {number} width
 * @param {number} height
 * @return {Float32Array}
 */
export function createControlPoints(width, height) {
  const x = width * 3 + 1;
  const y = height * 3 + 1;
  return new Float32Array(x * y);
}

/**
 * Get the index of the anchor position for the given control point.
 * @param {number} x x-index of the control point
 * @param {number} y y-index of the control point
 * @param {number} w Width of the control mesh
 * @param {number} h Height of the control mesh
 * @return {number} Anchor point index or -1 if not found
 */
export function anchor(x, y, w, h) {
  return isValidArgument(x, y, w, h) ? y * 3 * w + x * 3 : -1;
}

/**
 * Get the index of the anchor position for the given control point.
 * @param {number} x x-index of the control point
 * @param {number} y y-index of the control point
 * @param {number} w Width of the control mesh
 * @param {number} h Height of the control mesh
 * @return {number} Anchor point index or -1 if not found
 */
export function handleWest(x, y, w, h) {
  return isValidArgument(x, y, w, h) && x > 0 ? y * 3 * w + x * 3 - 1 : -1;
}

/**
 * Get the index of the anchor position for the given control point.
 * @param {number} x x-index of the control point
 * @param {number} y y-index of the control point
 * @param {number} w Width of the control mesh
 * @param {number} h Height of the control mesh
 * @return {number} Anchor point index or -1 if not found
 */
export function handleEast(x, y, w, h) {
  return isValidArgument(x, y, w, h) && x < w - 1 ? y * 3 * w + x * 3 + 1 : -1;
}

/**
 * Get the index of the anchor position for the given control point.
 * @param {number} x x-index of the control point
 * @param {number} y y-index of the control point
 * @param {number} w Width of the control mesh
 * @param {number} h Height of the control mesh
 * @return {number} Anchor point index or -1 if not found
 */
export function handleNorth(x, y, w, h) {
  return isValidArgument(x, y, w, h) && y > 0 ? (y - 1) * 3 * w + x * 3 : -1;
}

/**
 * Get the index of the anchor position for the given control point.
 * @param {number} x x-index of the control point
 * @param {number} y y-index of the control point
 * @param {number} w Width of the control mesh
 * @param {number} h Height of the control mesh
 * @return {number} Anchor point index or -1 if not found
 */
export function handleNorth(x, y, w, h) {
  return isValidArgument(x, y, w, h) && y > 0 ? (y - 1) * 3 * w + x * 3 : -1;
}

/**
 * Checks whether the arguments to one of the control point getter functions are
 * valid.
 * @param {number} x x-index of the control point
 * @param {number} y y-index of the control point
 * @param {number} w Width of the control mesh
 * @param {number} h Height of the control mesh
 * @return {boolean} Whether the given set of arguments is valid
 */
function isValidArgument(x, y, w, h) {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    Number.isInteger(w) &&
    Number.isInteger(h) &&
    w > 0 &&
    h > 0 &&
    x >= 0 &&
    x < w &&
    y >= 0 &&
    y < h
  );
}
