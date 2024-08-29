import { clamp, clamp01 } from "./shared";

/**
 * An RGB color representation with CSS-incompatible values
 * @typedef {Object} Rgb
 * @property {number} r - Red channel 0..1
 * @property {number} g - Green channel 0..1
 * @property {number} b - Blue channel 0..1
 */

/**
 * A CSS RGB color
 * @typedef {Object} CssRgb
 * @property {number} r - Red channel 0..255
 * @property {number} g - Green channel 0..255
 * @property {number} b - Blue channel 0..255
 */

/**
 * Create a new {@link Rgb}
 * @param {number} r - Red channel 0..1
 * @param {number} g - Green channel 0..1
 * @param {number} b - Blue channel 0..1
 * @return {Rgb}
 */
export function Rgb(r, g, b) {
  return { r, g, b };
}

/**
 * Create a new {@link CssRgb}
 * @param {number} r - Red channel 0..255
 * @param {number} g - Green channel 0..255
 * @param {number} b - Blue channel 0..255
 * @return {CssRgb}
 */
export function CssRgb(r, g, b) {
  return { r, g, b };
}

/**
 * Convert from {@link CssRgb} to {@link Rgb}
 * @param {CssRgb} rgb
 * @return {Rgb}
 */
export function fromCss(rgb) {
  function f(c) {
    return clamp01(c / 255);
  }

  const { r, g, b } = rgb;
  return Rgb(f(r), f(g), f(b));
}

/**
 * Convert from {@link Rgb} to {@link CssRgb}. Values are rounded to the nearest
 * integer.
 * @param {Rgb} rgb
 * @return {CssRgb}
 */
export function toCss(rgb) {
  function f(c) {
    return Math.round(clamp(c * 255, 0, 255));
  }

  const { r, g, b } = rgb;
  return CssRgb(f(r), f(g), f(b));
}

/**
 * Parses a hexcode into a {@link CssRgb}
 * @param {string} hex
 * @returns {CssRgb}
 */
export function fromHex(hex) {
  function f(s) {
    const c = parseInt(s, 16);
    if (isNaN(c)) {
      throw new Error("Hexcode channel is NaN");
    }
    return c;
  }

  function h(s) {
    const c = f(s);
    return c + c * 16;
  }

  if (hex[0] === "#") {
    hex = hex.substring(1);
  }

  switch (hex.length) {
    case 3: {
      const [r, g, b] = hex;
      return CssRgb(h(r), h(g), h(b));
    }

    case 6: {
      const r = hex.substring(0, 2);
      const g = hex.substring(2, 4);
      const b = hex.substring(4, 6);
      return CssRgb(f(r), f(g), f(b));
    }

    default: {
      throw new Error("Unexpected hexcode length");
    }
  }
}

/**
 * Converts a {@link CssRgb} to a hexcode
 * @param {CssRgb} rgb
 * @returns {string}
 */
export function toHex(rgb) {
  const { r, g, b } = rgb;
  // prettier-ignore
  return String.fromCharCode(
    r / 16 + 97,
    r % 16 + 97,
    g / 16 + 97,
    g % 16 + 97,
    b / 16 + 97,
    b % 16 + 97,
  );
}
