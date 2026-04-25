export type Point = { x: number; y: number };
export type Stroke = Point[];
export type LetterDef = { char: string; strokes: Stroke[] };

const p = (x: number, y: number): Point => ({ x, y });
const line = (...pts: Point[]): Stroke => pts;

// Arc helper: samples an ellipse arc (cx,cy,rx,ry) from angle a0 to a1 (radians)
function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, steps = 18): Stroke {
  const out: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = a0 + (a1 - a0) * t;
    out.push(p(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry));
  }
  return out;
}

// All shapes are in 0..1 normalized canvas space.
export const LETTERS: LetterDef[] = [
  { char: "A", strokes: [
    line(p(0.5, 0.1), p(0.15, 0.9)),
    line(p(0.5, 0.1), p(0.85, 0.9)),
    line(p(0.28, 0.6), p(0.72, 0.6)),
  ]},
  { char: "B", strokes: [
    line(p(0.25, 0.1), p(0.25, 0.9)),
    [...arc(0.5, 0.3, 0.25, 0.2, -Math.PI / 2, Math.PI / 2), p(0.25, 0.5)],
    [...arc(0.5, 0.7, 0.3, 0.2, -Math.PI / 2, Math.PI / 2), p(0.25, 0.9)],
  ]},
  { char: "C", strokes: [
    arc(0.5, 0.5, 0.35, 0.4, -Math.PI / 4, Math.PI / 4 * 7, 28).slice().reverse(),
  ]},
  { char: "D", strokes: [
    line(p(0.25, 0.1), p(0.25, 0.9)),
    [p(0.25, 0.1), ...arc(0.25, 0.5, 0.55, 0.4, -Math.PI / 2, Math.PI / 2), p(0.25, 0.9)],
  ]},
  { char: "E", strokes: [
    line(p(0.8, 0.1), p(0.2, 0.1), p(0.2, 0.9), p(0.8, 0.9)),
    line(p(0.2, 0.5), p(0.65, 0.5)),
  ]},
  { char: "F", strokes: [
    line(p(0.8, 0.1), p(0.2, 0.1), p(0.2, 0.9)),
    line(p(0.2, 0.5), p(0.65, 0.5)),
  ]},
  { char: "G", strokes: [
    [...arc(0.5, 0.5, 0.35, 0.4, -Math.PI / 4, Math.PI / 4 * 7, 28).reverse(),
      p(0.85, 0.5), p(0.6, 0.5)],
  ]},
  { char: "H", strokes: [
    line(p(0.2, 0.1), p(0.2, 0.9)),
    line(p(0.8, 0.1), p(0.8, 0.9)),
    line(p(0.2, 0.5), p(0.8, 0.5)),
  ]},
  { char: "I", strokes: [
    line(p(0.3, 0.1), p(0.7, 0.1)),
    line(p(0.5, 0.1), p(0.5, 0.9)),
    line(p(0.3, 0.9), p(0.7, 0.9)),
  ]},
  { char: "J", strokes: [
    line(p(0.3, 0.1), p(0.8, 0.1)),
    [p(0.65, 0.1), p(0.65, 0.7), ...arc(0.45, 0.7, 0.2, 0.2, 0, Math.PI)],
  ]},
  { char: "K", strokes: [
    line(p(0.25, 0.1), p(0.25, 0.9)),
    line(p(0.8, 0.1), p(0.25, 0.5)),
    line(p(0.25, 0.5), p(0.8, 0.9)),
  ]},
  { char: "L", strokes: [
    line(p(0.25, 0.1), p(0.25, 0.9), p(0.8, 0.9)),
  ]},
  { char: "M", strokes: [
    line(p(0.15, 0.9), p(0.15, 0.1), p(0.5, 0.7), p(0.85, 0.1), p(0.85, 0.9)),
  ]},
  { char: "N", strokes: [
    line(p(0.2, 0.9), p(0.2, 0.1), p(0.8, 0.9), p(0.8, 0.1)),
  ]},
  { char: "O", strokes: [
    arc(0.5, 0.5, 0.35, 0.4, -Math.PI / 2, Math.PI * 1.5, 36),
  ]},
  { char: "P", strokes: [
    line(p(0.25, 0.9), p(0.25, 0.1)),
    [p(0.25, 0.1), ...arc(0.5, 0.3, 0.3, 0.2, -Math.PI / 2, Math.PI / 2), p(0.25, 0.5)],
  ]},
  { char: "Q", strokes: [
    arc(0.5, 0.5, 0.35, 0.4, -Math.PI / 2, Math.PI * 1.5, 36),
    line(p(0.6, 0.7), p(0.9, 0.95)),
  ]},
  { char: "R", strokes: [
    line(p(0.25, 0.9), p(0.25, 0.1)),
    [p(0.25, 0.1), ...arc(0.5, 0.3, 0.3, 0.2, -Math.PI / 2, Math.PI / 2), p(0.25, 0.5)],
    line(p(0.45, 0.5), p(0.8, 0.9)),
  ]},
  { char: "S", strokes: [
    [
      ...arc(0.5, 0.3, 0.3, 0.2, 0, Math.PI, 14).reverse(),
      ...arc(0.5, 0.3, 0.3, 0.2, Math.PI, Math.PI * 1.5, 10).reverse(),
      ...arc(0.5, 0.7, 0.3, 0.2, Math.PI * 1.5, Math.PI * 2.5, 14),
      ...arc(0.5, 0.7, 0.3, 0.2, Math.PI / 2, Math.PI, 10),
    ],
  ]},
  { char: "T", strokes: [
    line(p(0.15, 0.1), p(0.85, 0.1)),
    line(p(0.5, 0.1), p(0.5, 0.9)),
  ]},
  { char: "U", strokes: [
    [p(0.2, 0.1), p(0.2, 0.65), ...arc(0.5, 0.65, 0.3, 0.25, Math.PI, 0).reverse(), p(0.8, 0.1)],
  ]},
  { char: "V", strokes: [
    line(p(0.15, 0.1), p(0.5, 0.9), p(0.85, 0.1)),
  ]},
  { char: "W", strokes: [
    line(p(0.1, 0.1), p(0.3, 0.9), p(0.5, 0.4), p(0.7, 0.9), p(0.9, 0.1)),
  ]},
  { char: "X", strokes: [
    line(p(0.15, 0.1), p(0.85, 0.9)),
    line(p(0.85, 0.1), p(0.15, 0.9)),
  ]},
  { char: "Y", strokes: [
    line(p(0.15, 0.1), p(0.5, 0.5)),
    line(p(0.85, 0.1), p(0.5, 0.5)),
    line(p(0.5, 0.5), p(0.5, 0.9)),
  ]},
  { char: "Z", strokes: [
    line(p(0.2, 0.1), p(0.8, 0.1), p(0.2, 0.9), p(0.8, 0.9)),
  ]},
];
