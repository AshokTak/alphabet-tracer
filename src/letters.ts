export type Point = { x: number; y: number };
export type Stroke = Point[];
export type LetterDef = { char: string; strokes: Stroke[] };

const p = (x: number, y: number): Point => ({ x, y });
const line = (...pts: Point[]): Stroke => pts;

// Sample an ellipse arc from a0 to a1 (radians, 0=right, π/2=down).
function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, steps = 24): Stroke {
  const out: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = a0 + (a1 - a0) * t;
    out.push(p(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry));
  }
  return out;
}

// Standard layout: letters fit in y=0.10..0.90, x=0.15..0.85.
export const LETTERS: LetterDef[] = [
  { char: "A", strokes: [
    line(p(0.5, 0.1), p(0.18, 0.9)),
    line(p(0.5, 0.1), p(0.82, 0.9)),
    line(p(0.30, 0.62), p(0.70, 0.62)),
  ]},
  { char: "B", strokes: [
    line(p(0.28, 0.1), p(0.28, 0.9)),
    [p(0.28, 0.1), ...arc(0.28, 0.30, 0.32, 0.20, -Math.PI / 2, Math.PI / 2), p(0.28, 0.50)],
    [p(0.28, 0.50), ...arc(0.28, 0.70, 0.36, 0.20, -Math.PI / 2, Math.PI / 2), p(0.28, 0.90)],
  ]},
  { char: "C", strokes: [
    arc(0.52, 0.50, 0.34, 0.40, -Math.PI / 4, -Math.PI / 4 - Math.PI * 1.5, 32),
  ]},
  { char: "D", strokes: [
    line(p(0.25, 0.1), p(0.25, 0.9)),
    [p(0.25, 0.10), ...arc(0.25, 0.50, 0.55, 0.40, -Math.PI / 2, Math.PI / 2), p(0.25, 0.90)],
  ]},
  { char: "E", strokes: [
    line(p(0.78, 0.10), p(0.22, 0.10), p(0.22, 0.90), p(0.78, 0.90)),
    line(p(0.22, 0.50), p(0.62, 0.50)),
  ]},
  { char: "F", strokes: [
    line(p(0.78, 0.10), p(0.22, 0.10), p(0.22, 0.90)),
    line(p(0.22, 0.50), p(0.62, 0.50)),
  ]},
  { char: "G", strokes: [
    arc(0.52, 0.50, 0.34, 0.40, -Math.PI / 4, -Math.PI / 4 - Math.PI * 1.5, 32),
    line(p(0.76, 0.78), p(0.76, 0.55), p(0.56, 0.55)),
  ]},
  { char: "H", strokes: [
    line(p(0.22, 0.10), p(0.22, 0.90)),
    line(p(0.78, 0.10), p(0.78, 0.90)),
    line(p(0.22, 0.50), p(0.78, 0.50)),
  ]},
  { char: "I", strokes: [
    line(p(0.32, 0.10), p(0.68, 0.10)),
    line(p(0.50, 0.10), p(0.50, 0.90)),
    line(p(0.32, 0.90), p(0.68, 0.90)),
  ]},
  { char: "J", strokes: [
    line(p(0.32, 0.10), p(0.78, 0.10)),
    [p(0.62, 0.10), p(0.62, 0.70), ...arc(0.42, 0.70, 0.20, 0.18, 0, Math.PI)],
  ]},
  { char: "K", strokes: [
    line(p(0.25, 0.10), p(0.25, 0.90)),
    line(p(0.78, 0.10), p(0.25, 0.50)),
    line(p(0.25, 0.50), p(0.78, 0.90)),
  ]},
  { char: "L", strokes: [
    line(p(0.25, 0.10), p(0.25, 0.90), p(0.78, 0.90)),
  ]},
  { char: "M", strokes: [
    line(p(0.16, 0.90), p(0.16, 0.10), p(0.50, 0.70), p(0.84, 0.10), p(0.84, 0.90)),
  ]},
  { char: "N", strokes: [
    line(p(0.22, 0.90), p(0.22, 0.10), p(0.78, 0.90), p(0.78, 0.10)),
  ]},
  { char: "O", strokes: [
    arc(0.50, 0.50, 0.34, 0.40, -Math.PI / 2, Math.PI * 1.5, 40),
  ]},
  { char: "P", strokes: [
    line(p(0.25, 0.90), p(0.25, 0.10)),
    [p(0.25, 0.10), ...arc(0.25, 0.32, 0.34, 0.22, -Math.PI / 2, Math.PI / 2), p(0.25, 0.54)],
  ]},
  { char: "Q", strokes: [
    arc(0.50, 0.50, 0.34, 0.40, -Math.PI / 2, Math.PI * 1.5, 40),
    line(p(0.58, 0.66), p(0.88, 0.94)),
  ]},
  { char: "R", strokes: [
    line(p(0.25, 0.90), p(0.25, 0.10)),
    [p(0.25, 0.10), ...arc(0.25, 0.32, 0.34, 0.22, -Math.PI / 2, Math.PI / 2), p(0.25, 0.54)],
    line(p(0.45, 0.54), p(0.80, 0.90)),
  ]},
  { char: "S", strokes: [
    [
      ...arc(0.50, 0.30, 0.30, 0.20, 0, -Math.PI, 14),
      ...arc(0.50, 0.30, 0.30, 0.20, Math.PI, Math.PI / 2, 10),
      ...arc(0.50, 0.70, 0.30, 0.20, -Math.PI / 2, Math.PI / 2, 14),
      ...arc(0.50, 0.70, 0.30, 0.20, Math.PI / 2, Math.PI, 10),
    ],
  ]},
  { char: "T", strokes: [
    line(p(0.15, 0.10), p(0.85, 0.10)),
    line(p(0.50, 0.10), p(0.50, 0.90)),
  ]},
  { char: "U", strokes: [
    [p(0.20, 0.10), p(0.20, 0.65), ...arc(0.50, 0.65, 0.30, 0.25, Math.PI, 0, 22), p(0.80, 0.10)],
  ]},
  { char: "V", strokes: [
    line(p(0.18, 0.10), p(0.50, 0.90), p(0.82, 0.10)),
  ]},
  { char: "W", strokes: [
    line(p(0.10, 0.10), p(0.30, 0.90), p(0.50, 0.40), p(0.70, 0.90), p(0.90, 0.10)),
  ]},
  { char: "X", strokes: [
    line(p(0.18, 0.10), p(0.82, 0.90)),
    line(p(0.82, 0.10), p(0.18, 0.90)),
  ]},
  { char: "Y", strokes: [
    line(p(0.18, 0.10), p(0.50, 0.50)),
    line(p(0.82, 0.10), p(0.50, 0.50)),
    line(p(0.50, 0.50), p(0.50, 0.90)),
  ]},
  { char: "Z", strokes: [
    line(p(0.20, 0.10), p(0.80, 0.10), p(0.20, 0.90), p(0.80, 0.90)),
  ]},
];
