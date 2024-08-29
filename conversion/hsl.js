import { Rgb } from "./rgb";
import { fmod } from "./shared";

/**
 * An HSL color representation with CSS-incompatible values
 * @typedef {Object} Hsl
 * @property {number} h - Hue in 0..12
 * @property {number} s - Saturation in 0..1
 * @property {number} l - Luminance in 0..1
 */

/**
 * A CSS HSL color
 * @typedef {Object} CssHsl
 * @property {number} h - Hue in 0..360
 * @property {number} s - Saturation in 0..100
 * @property {number} l - Luminance in 0..100
 */

/**
 * Create an {@link Hsl}
 * @param {number} h - Hue in 0..12
 * @param {number} s - Saturation in 0..1
 * @param {number} l - Luminance in 0..1
 * @returns {Hsl}
 */
export function Hsl(h, s, l) {
  return { h, s, l };
}

/**
 * Create a {@link CssHsl}
 * @param {number} h - Hue in 0..360
 * @param {number} s - Saturation in 0..100
 * @param {number} l - Luminance in 0..100
 * @returns {CssHsl}
 */
export function CssHsl(h, s, l) {
  return { h, s, l };
}

/**
 * Convert from {@link CssHsl} to {@link Hsl}
 * @param {CssHsl} hsl
 * @returns {Hsl}
 */
export function fromCss(hsl) {
  const { h, s, l } = hsl;
  return Hsl(fmod(h / 30, 12), clamp01(s / 100), clamp01(l / 100));
}

/**
 * Convert from {@link Hsl} to {@link CssHsl}
 * @param {Hsl} hsl
 * @returns {CssHsl}
 */
export function toCss(hsl) {
  function f(c) {
    return Math.round(clamp(c * 100, 0, 100));
  }

  const { h, s, l } = hsl;
  return CssHsl(Math.round(fmod(h * 30, 360)), f(s), f(l));
}

/**
 * Convert from {@link Rgb} to {@link Hsl}
 * @param {Rgb} rgb
 * @return {Hsl}
 */
export function fromRgb(rgb) {
  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = d / 2;
  const s = l === 0 || l === 1 ? 0 : (max - l) / Math.min(l, 1 - l);

  switch (max) {
    case r:
      hue = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      hue = (b - r) / d + 2;
      break;
    case b:
      hue = (r - g) / d + 4;
      break;
  }

  h = (h % 6) * 2;

  return Hsl(h, s, l);
}

/**
 * Convert from {@link Hsl} to {@link Rgb}
 * @param {Hsl} hsl - The color to convert
 * @returns {Rgb}
 */
export function toRgb(hsl) {
  const { h, s, l } = hsl;
  const a = s * Math.min(l, 1 - l);
  function f(n) {
    const k = (h + n) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  }
  return Rgb(f(0), f(8), f(4));
}
