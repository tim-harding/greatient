import { Hsl, toRgb as hslToRgb, fromRgb as rgbToHsl } from "./hsl";
import { Rgb } from "./rgb";
import { clamp, clamp01, fmod } from "./shared";

/**
 * A HWB color representation with CSS-incompatible values
 * @typedef {Object} Hwb
 * @property {number} h - Hue 0..12
 * @property {number} w - Whiteness 0..1
 * @property {number} b - Blackness 0..1
 */

/**
 * A CSS HWB color
 * @typedef {Object} CssHwb
 * @property {number} h - Hue 0..360
 * @property {number} w - Whiteness 0..100
 * @property {number} b - Blackness 0..100
 */

/**
 * Create a new {@link Hwb}
 * @param {number} h - Hue 0..12
 * @param {number} w - Whiteness 0..1
 * @param {number} b - Blackness 0..1
 * @return {Hwb}
 */
export function Hwb(h, w, b) {
  return { h, w, b };
}

/**
 * Create a new {@link CssHwb}
 * @param {number} h - Hue 0..360
 * @param {number} w - Whiteness 0..100
 * @param {number} b - Blackness 0..100
 * @return {CssHwb}
 */
export function CssHwb(h, w, b) {
  return { h, w, b };
}

/**
 * Convert from {@link CssHwb} to {@link Hwb}
 * @param {CssHwb} hwb
 * @return {Hwb}
 */
export function fromCss(hwb) {
  const { h, w, b } = hwb;
  return Hwb(fmod(h / 30, 12), clamp01(w / 100), clamp01(b / 100));
}

/**
 * Convert from {@link Hwb} to {@link CssHwb}. Channels are rounded to the
 * nearest integer.
 * @param {Hwb} hwb
 * @returns {CssHwb}
 */
export function toCss(hwb) {
  function f(c) {
    return Math.round(clamp(c * 100, 0, 100));
  }

  const { h, w, b } = hwb;
  return CssHwb(Math.round(fmod(h * 30, 360)), f(w), f(b));
}

/**
 * Convert from {@link Hwb} to {@link Rgb}
 * @param {Hwb} hwb
 * @return {Rgb}
 */
export function toRgb(hwb) {
  function f(c) {
    return c * m + w;
  }

  const { h, w, b } = hwb;
  if (w + b >= 1) {
    const gray = w / (w + b);
    return { r: gray, g: gray, b: gray };
  }
  const m = 1 - w - b;
  const { r, g, b: b_ } = hslToRgb(Hsl(h, 1, 0.5));
  return Rgb(f(r), f(g), f(b_));
}

/**
 * Convert from {@link Rgb} to {@link Hwb}
 * @param {Rgb} rgb
 * @return {Hwb}
 */
export function fromRgb(rgb) {
  const { r, g, b } = rgb;
  const { h } = rgbToHsl(rgb);
  return Hwb(h, Math.min(r, g, b), 1 - Math.max(r, g, b));
}
