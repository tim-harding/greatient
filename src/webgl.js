/**
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
export function createProgram(gl, vertexShader, fragmentShader) {
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
export function createShader(gl, type, source) {
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
export function glError(gl) {
  const error = gl.getError();
  const message = GL_ERROR_MESSAGES.get(error) || "UNREACHABLE";
  return new Error(message);
}
