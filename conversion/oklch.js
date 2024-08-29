export function fromOklab(oklab) {
  const [l, a, b] = oklab;
  var hue = (Math.atan2(b, a) * 180) / Math.PI;
  return [l, Math.sqrt(a ** 2 + b ** 2), hue >= 0 ? hue : hue + 360];
}

export function toOklab(oklch) {
  const [l, c, h] = oklch;
  return [
    l,
    c * Math.cos((h * Math.PI) / 180),
    c * Math.sin((h * Math.PI) / 180),
  ];
}
