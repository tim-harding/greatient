/**
 * @typedef {Object} Shared
 * @property {WebGL2RenderingContext} gl
 * @property {HTMLCanvasElement} canvas
 * @property {ResizeObserver?} resize
 * @property {number} prevClientRectX
 * @property {number} prevClientRectY
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @return {Shared}
 */
export function Shared(canvas) {
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

  return {
    gl,
    canvas,
    resize: null,
    prevClientRectX: 0,
    prevClientRectY: 0,
  };
}

/**
 * Start resize and intersection event handling.
 * @param {Shared} shared
 */
export function resume(shared) {
  if (shared.resize !== null) return;
  const { gl, canvas } = shared;

  /**
   * @param {number} width
   * @param {number} height
   */
  const handleResizeShared = (width, height) => {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    redrawImmediate(shared);
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
      let { inlineSize, blockSize } = entries[0].contentBoxSize[0];
      const dpr = window.devicePixelRatio;
      handleResizeShared(inlineSize * dpr, blockSize * dpr);
    });
    resize.observe(canvas, { box: "content-box" });
  }

  shared.resize = resize;
}

/**
 * Stop resize and intersection event handling.
 * @param {Shared} shared
 */
export function pause(shared) {
  const { resize } = shared;
  if (!resize) return;
  resize.disconnect();
  shared.resize = null;
}

/**
 * Repaint the canvas. When manually driving gradient animations, this should
 * be called in a `requestAnimationFrame` callback.
 * @param {Shared} shared
 */
export function redraw(shared) {
  const rect = shared.canvas.getBoundingClientRect();
  const isWidthSame = rect.width === shared.prevClientRectX;
  const isHeightSame = rect.height === shared.prevClientRectY;
  const isSizeSame = isWidthSame && isHeightSame;
  if (!isSizeSame) {
    // Handle drawing in the ResizeObserver callback instead.
    shared.prevClientRectX = rect.width;
    shared.prevClientRectY = rect.height;
    return;
  }
  redrawImmediate(shared);
}

/**
 * Execute the WebGL canvas drawing commands.
 * @param {Shared} shared
 */
function redrawImmediate(shared) {
  throw new Error("Unimplemented");
  // gl.clearColor(0, 0.2, 0, 0);
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // gl.useProgram(program);
  // gl.drawArrays(gl.TRIANGLES, 0, 6);
}
