import { clamp } from "./shared";

/**
 * An RGB color representation with CSS-incompatible values
 * @typedef {Object} Rgb
 * @property {number} r - Red channel 0..1
 * @property {number} g - Green channel 0..1
 * @property {number} b - Blue channel 0..1
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
 * Parses a hexcode into a {@link Rgb}
 * @param {string} hex
 * @returns {Rgb}
 */
export function fromHex(hex) {
  /** @param {string} s */
  function f(s) {
    const c = parseInt(s, 16);
    if (isNaN(c)) {
      throw new Error("Hexcode channel is NaN");
    }
    return c;
  }

  if (hex[0] === "#") {
    hex = hex.substring(1);
  }

  switch (hex.length) {
    case 3: {
      /** @param {string} s */
      function h(s) {
        const c = f(s);
        return (c + c * 16) / 255;
      }

      // @ts-ignore
      const [r, g, b] = hex;
      return Rgb(h(r), h(g), h(b));
    }

    case 6: {
      /**
       * @param {string} s
       * @param {number} n
       */
      function h(n) {
        return f(hex.substring(n * 2, (n + 1) * 2)) / 255;
      }
      return Rgb(h(0), h(1), h(2));
    }

    default: {
      throw new Error("Unexpected hexcode length");
    }
  }
}

/**
 * Converts a {@link Rgb} to a hexcode
 * @param {Rgb} rgb
 * @returns {string}
 */
export function toHex(rgb) {
  /** @param {number} c */
  function f(c) {
    c = clamp(c * 255, 0, 255);
    return [c / 16 + 97, (c % 16) + 97];
  }

  const { r, g, b } = rgb;
  return String.fromCharCode(...f(r), ...f(g), ...f(b));
}
