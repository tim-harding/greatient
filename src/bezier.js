/**
 * @typedef {Object} Bezier
 * @property {number} width
 * @property {number} height
 * @property {number} subdivisions
 * @property {Float32Array} points
 * @property {Float32Array} colors
 */

/**
 * Creates a new Bezier control mesh
 * @param {number} width
 * @param {number} height
 * @return {Bezier}
 */
function Bezier(width, height, subdivisions) {}

/**
 * Update the number of control points on each axis and the amount of
 * subdivisions to use when tesselating each patch.
 * @param {Bezier} bezier The control mesh to update
 * @param {number} width The number of control points in the horizontal axis
 * @param {number} height The number control points in the vertical axis
 * @param {number} subdivisions The number of curves to insert between control
 * points on each axis
 */
function updateSize(greatient, width, height, subdivisions) {}

/**
 * This callback is called to modify the bezier points of a {@link Greatient}.
 * @callback updateBezierPointsCallback
 * @param {Float32Array} points
 */

/**
 * Update the set of
 * @param {updateBezierPointsCallback} callback
 */
function updateBezierPoints(callback) {}
