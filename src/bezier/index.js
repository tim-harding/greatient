import {
  createBuffer,
  createProgramFromSources,
  createVao,
  getUniform,
} from "../webgl";
import { FRAGMENT_SOURCE, VERTEX_SOURCE } from "./shader";

/** Offset from anchor point index for the north handle */
const N = 2;
/** Offset from anchor point index for the east handle */
const E = 4;
/** Offset from anchor point index for the south handle */
const S = 6;
/** Offset from anchor point index for the west handle */
const W = 8;

/**
 * State needed to render bezier gradients that can be shared across gradients
 * @typedef {Object} BezierShared
 * @property {WebGLProgram} program
 * @property {GLint} attributeUv
 * @property {WebGLUniformLocation} uniformPx
 * @property {WebGLUniformLocation} uniformPy
 */

/**
 * @typedef {Object} Bezier
 * @property {BezierShared} shared
 * @property {WebGLBuffer} vbo
 * @property {WebGLVertexArrayObject} vao
 */

/**
 * Generates each array element of an instance mesh, which consists of the (u,v)
 * coordinates from (0,0) through (1,1).
 * @param {number} subdivisions Number of edges to insert between control points
 * @yields {number}
 */
function* uvMeshElements(subdivisions) {
  const dim = subdivisions + 2;
  const scalar = 1 / (dim - 1);
  for (let y = 0; y < dim; y++) {
    for (let x = 0; x < dim; x++) {
      yield x * scalar;
      yield y * scalar;
    }
  }
}

/**
 * Create per-gradient bezier rendering state
 * @param {WebGL2RenderingContext} gl
 * @param {BezierShared} shared
 * @param {number} subdivisions Number of edges to insert between control points
 * @return {Bezier}
 */
export function Bezier(gl, shared, subdivisions) {
  const mesh = new Float32Array(uvMeshElements(subdivisions));
  const vbo = createBuffer(gl);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);

  const vao = createVao(gl);
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(shared.attributeUv);
  gl.vertexAttribPointer(shared.attributeUv, 1, gl.FLOAT_VEC2, false, 0, 0);

  return { shared, vbo, vao };
}

/**
 * Create the shared bezier rendering state.
 * @param {WebGL2RenderingContext} gl
 * @return {BezierShared}
 */
export function BezierShared(gl) {
  const program = createProgramFromSources(gl, VERTEX_SOURCE, FRAGMENT_SOURCE);
  const attributeUv = gl.getAttribLocation(program, "uv");
  const uniformPx = getUniform(gl, program, "Px");
  const uniformPy = getUniform(gl, program, "Py");
  return {
    program,
    attributeUv,
    uniformPx,
    uniformPy,
  };
}

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
 * @param {Float32Array} mesh Bezier control points data structure
 * @param {number} x Patch x-index
 * @param {number} y Patch y-index
 * @param {number} w Control mesh width in control points
 * @param {"x" | "y"} axis The patch matrix axis, either x or y
 * @return {Float32Array}
 */
export function patchMatrix(mesh, x, y, w, axis) {
  const o = axis === "x" ? 0 : 1;

  const nw = index(x, y, w) + o;
  const ne = index(x + 1, y, w) + o;
  const sw = index(x, y + 1, w) + o;
  const se = index(x + 1, y + 1, w) + o;

  const nwa = mesh[nw];
  const nwh = mesh[nw + E];
  const nwv = mesh[nw + S];

  const nea = mesh[ne];
  const neh = mesh[ne + W];
  const nev = mesh[ne + S];

  const swa = mesh[sw];
  const swh = mesh[sw + E];
  const swv = mesh[sw + N];

  const sea = mesh[se];
  const seh = mesh[se + W];
  const sev = mesh[se + N];

  const p00 = nwa;
  const p01 = nwa + nwh;
  const p02 = nea + neh;
  const p03 = nea;

  const p10 = nwa + nwv;
  const p11 = nwa + nwv + nwh;
  const p12 = nea + nev + neh;
  const p13 = nea + nev;

  const p20 = swa + swv;
  const p21 = swa + swv + swh;
  const p22 = sea + sev + seh;
  const p23 = sea + sev;

  const p30 = swa;
  const p31 = swa + swh;
  const p32 = sea + seh;
  const p33 = sea;

  // prettier-ignore
  return new Float32Array([
    p00, p01, p02, p03,
    p10, p11, p12, p13,
    p20, p21, p22, p23,
    p30, p31, p32, p33,
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
