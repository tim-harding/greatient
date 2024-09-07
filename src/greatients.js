// TODO: Stop and resume gradient canvas

import { SHADER_VERTEX, SHADER_FRAGMENT } from "./shader.js";

/**
 * @typedef {Object} Size
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} Greatient
 * @property {Size} boundingClientRect
 * @property {WebGL2RenderingContext} gl
 * @property {HTMLCanvasElement} canvas
 * @property {WebGLProgram} program
 * @property {WebGLVertexArrayObject} vao
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

  const out = {
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
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(attributePosition);
  gl.vertexAttribPointer(attributePosition, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  if (!program) throw glError(gl);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  /** @type {GLboolean} */
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const log = gl.getProgramInfoLog(program) || "UNREACHABLE";
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {GLenum} type
 * @param {string} source
 */
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw glError(gl);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  /** @type {GLboolean} */
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const log = gl.getShaderInfoLog(shader) || "UNREACHABLE";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

// From GLenum. See also
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError
const GL_ERROR_MESSAGES = new Map([
  [0, "NO_ERROR (Unreachable!)"],
  [1280, "INVALID_ENUM"],
  [1281, "INVALID_VALUE"],
  [1282, "INVALID_OPERATION"],
  [1285, "OUT_OF_MEMORY"],
  [1286, "INVALID_FRAMEBUFFER_OPERATION"],
  [37442, "CONTEXT_LOST_WEBGL"],
]);

/**
 * @param {WebGL2RenderingContext} gl
 * @return {Error}
 */
function glError(gl) {
  const error = gl.getError();
  const message = GL_ERROR_MESSAGES.get(error) || "UNREACHABLE";
  return new Error(message);
}
