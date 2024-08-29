/**
 * An HSL color
 * @typedef {Object} Hsl
 * @property {number} h - Hue in 0..12
 * @property {number} s - Saturation in 0..1
 * @property {number} l - Luminance in 0..1
 */

/**
 * Create an {@link Hsl} from CSS syntax.
 * @param {number} h Hue in degrees
 * @param {number} s Saturation as a percentage (0-100)
 * @param {number} l Luminance as a percentage (0-100)
 * @returns {Hsl}
 */
export function Hsl(h, s, l) {
  return {
    h: fmod(h / 30, 12),
    s: fmod(s / 100, 1),
    l: fmod(l / 100, 1),
  };
}

/**
 * Convert an RGB color to HSL
 * @param {Rgb} rgb
 * @return {Hsl}
 */
function fromRgb(rgb) {
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

  return { h, s, l };
}

/**
 * Convert a color from HSL to RGB
 * @param {Hsl} hsl - The color to convert
 * @returns {Rgb}
 */
export function toRgb(hsl) {
  const { h, s, l } = hsl;
  const a = s * Math.min(l, 1 - l);
  function f(n) {
    const k = (h + n) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  }
  return {
    r: f(0),
    g: f(8),
    b: f(4),
  };
}
