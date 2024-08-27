// TODO: Resize the canvas
// https://webgl2fundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

function main() {
  Promise.all([
    fetchShaderSource("/vertex.glsl"),
    fetchShaderSource("/fragment.glsl"),
  ]).then(([vertexSource, fragmentSource]) =>
    init(vertexSource, fragmentSource),
  );
}

/**
 * @param {URL} filename
 * @return {Promise<string>}
 */
async function fetchShaderSource(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `${response.status} response for ${url}: ${response.statusText}`,
    );
  }
  const text = await response.text();
  if (!(typeof text === "string")) {
    throw new Error("Expected a string response body");
  }
  return text;
}

/**
 * @param {string} vertexSource
 * @param {string} fragmentSource
 */
function init(vertexSource, fragmentSource) {
  const canvas = document.getElementById("gradient");
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Expected a canvas element");
  }
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    premultipliedAlpha: true,
    depth: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "low-power",
  });
  if (!gl) {
    console.error("WebGL2 not available");
    return;
  }
  if (window.matchMedia("(color-gamut: p3)").matches) {
    gl.drawingBufferColorSpace = "display-p3";
  }
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = createProgram(gl, vertexShader, fragmentShader);
  const positionAttribute = gl.getAttribLocation(program, "a_position");
  const resolutionUniform = gl.getUniformLocation(program, "u_resolution");
  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) throw new glError(gl);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  const vao = gl.createVertexArray();
  if (!vao) throw new glError(gl);
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttribute);
  gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);
  gl.uniform2f(resolutionUniform, gl.canvas.width, gl.canvas.height);
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
    gl.deleteProgram(program);
    throw new Error(gl.getProgramInfoLog(program));
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
    gl.deleteShader(shader);
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

/**
 * @param {WebGL2RenderingContext} gl
 * @return {Error}
 */
function glError(gl) {
  // From GLenum. See also
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError
  const GL_ERROR_MESSAGES = {
    0: "NO_ERROR (Unreachable!)",
    1280: "INVALID_ENUM",
    1281: "INVALID_VALUE",
    1282: "INVALID_OPERATION",
    1285: "OUT_OF_MEMORY",
    1286: "INVALID_FRAMEBUFFER_OPERATION",
    37442: "CONTEXT_LOST_WEBGL",
  };
  const error = gl.getError();
  let message = GL_ERROR_MESSAGES[error];
  if (!message) {
    message = `Unknown WebGL error: ${error}`;
  }
  return new Error(message);
}

main();
