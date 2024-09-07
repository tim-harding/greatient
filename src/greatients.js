// TODO: Stop and resume gradient canvas

import { SHADER_VERTEX, SHADER_FRAGMENT } from "./shader.js";
import { createShader, createProgram, glError } from "./webgl.js";

/**
 * @typedef {Object} Size
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} Greatient
 * @property {number} width Control points in x-axis
 * @property {number} height Control points in y-axis
 * @property {number} subdivisions Edges between control points on each axis
 * @property {boolean} dirty Did the mesh change since last redraw
 * @property {Float32Array} controlPoints Bezier or bspline control point data
 * @property {Float32Array} colors Control point color data
 * @property {Size} boundingClientRect Canvas size at last redraw
 * @property {WebGL2RenderingContext} gl WebGL context for canvas
 * @property {HTMLCanvasElement} canvas Canvas to draw the gradient into
 * @property {WebGLProgram} program WebGL program to draw with
 * @property {WebGLVertexArrayObject} vao WebGL VAO to draw with
 * @property {GLint} attributePosition
 */

/**
 * @param {HTMLCanvasElement} canvas
 */
export function Greatient(canvas) {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    premultipliedAlpha: true,
    depth: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "low-power",
  });
  if (!gl) throw new Error("WebGL2 not available");

  if (window.matchMedia("(color-gamut: p3)").matches) {
    gl.drawingBufferColorSpace = "display-p3";
  }
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, SHADER_VERTEX);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, SHADER_FRAGMENT);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const attributePosition = gl.getAttribLocation(program, "a_position");

  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) throw glError(gl);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const vao = gl.createVertexArray();
  if (!vao) throw glError(gl);

  /** @type {Greatient} */
  const out = {
    width: 0,
    height: 0,
    subdivisions: 0,
    dirty: false,
    controlPoints: new Float32Array(),
    colors: new Float32Array(),
    gl,
    canvas,
    program,
    vao,
    attributePosition,
    boundingClientRect: { width: 0, height: 0 },
  };

  /**
   * @param {number} width
   * @param {number} height
   */
  const handleResizeShared = (width, height) => {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    redrawImmediate(out);
  };
  let resize = new ResizeObserver((entries) => {
    const size = entries[0].devicePixelContentBoxSize[0];
    handleResizeShared(size.inlineSize, size.blockSize);
  });
  try {
    resize.observe(canvas, { box: "device-pixel-content-box" });
  } catch (e) {
    // Safari still doesn't support device-pixel-content-box :/
    resize = new ResizeObserver((entries) => {
      let { inlineSize: width, blockSize: height } =
        entries[0].contentBoxSize[0];
      const dpr = window.devicePixelRatio;
      handleResizeShared(width * dpr, height * dpr);
    });
    resize.observe(canvas, { box: "content-box" });
  }

  return out;
}

/**
 * Update the number of control points on each axis and the amount of
 * subdivisions to use when tesselating each patch.
 * @param {Greatient} greatient The gradient to update
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

/**
 * Repaint the canvas. When manually driving gradient animations, this should
 * be called in a `requestAnimationFrame` callback.
 * @param {Greatient} greatient
 */
function redraw(greatient) {
  const rect = greatient.canvas.getBoundingClientRect();
  const rectPrev = greatient.boundingClientRect;
  if (rect.width != rectPrev.width || rect.height != rectPrev.height) {
    // Handle drawing in the ResizeObserver callback instead.
    greatient.boundingClientRect = rect;
    return;
  }
  redrawImmediate(greatient);
}

/**
 * Execute the WebGL canvas drawing commands.
 * @param {Greatient} greatient
 */
function redrawImmediate(greatient) {
  const { gl, program, vao, attributePosition } = greatient;
  gl.clearColor(0, 0.2, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);
  //gl.bindVertexArray(vao);
  //gl.enableVertexAttribArray(attributePosition);
  //gl.vertexAttribPointer(attributePosition, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
