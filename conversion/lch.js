export function labToLch(lab) {
  const [l, a, b] = lab;
  const hue = (Math.atan2(b, a) * 180) / Math.PI;
  return [
    l,
    Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
    hue >= 0 ? hue : hue + 360,
  ];
}

export function lchToLab(lch) {
  const [l, c, h] = lch;
  return [
    l,
    c * Math.cos((h * Math.PI) / 180),
    c * Math.sin((h * Math.PI) / 180),
  ];
}
