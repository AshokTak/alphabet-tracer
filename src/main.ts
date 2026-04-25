import "./style.css";
import { LETTERS, type Point, type Stroke } from "./letters";

const canvas = document.getElementById("board") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const promptEl = document.getElementById("prompt")!;
const starsEl = document.getElementById("stars")!;
const levelBar = document.getElementById("levelbar")!;
const prevBtn = document.getElementById("prev") as HTMLButtonElement;
const nextBtn = document.getElementById("next") as HTMLButtonElement;
const resetBtn = document.getElementById("reset") as HTMLButtonElement;

const SAMPLE_STEP = 6;
const HIT_RADIUS = 38;
const COMPLETE_THRESHOLD = 0.85;
const COLORS = ["#58cc02", "#1cb0f6", "#ffc800", "#ff9600", "#ce82ff", "#ff4b4b"];
const DUO_GREEN = "#58cc02";
const DUO_GREY = "#e5e5e5";
const DUO_INK = "#3c3c3c";

type Confetto = { x: number; y: number; vx: number; vy: number; color: string; rot: number; vr: number; life: number };

let levelIdx = 0;
let strokeIdx = 0;
let sampledStrokes: Point[][] = [];
let covered: boolean[][] = [];
let drawing = false;
let userPath: Point[] = [];
let confetti: Confetto[] = [];
let completed = new Set<number>();
let levelColor = COLORS[0];
let lockInput = false;

function fitCanvas() {
  const size = Math.min(window.innerWidth * 0.95, window.innerHeight * 0.65, 640);
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = canvas.style.height = `${size}px`;
  canvas.width = canvas.height = Math.floor(size * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  loadLevel(levelIdx, false);
}

function sampleStroke(stroke: Stroke, w: number, h: number): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < stroke.length - 1; i++) {
    const a = { x: stroke[i].x * w, y: stroke[i].y * h };
    const b = { x: stroke[i + 1].x * w, y: stroke[i + 1].y * h };
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.floor(len / SAMPLE_STEP));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      out.push({ x: a.x + dx * t, y: a.y + dy * t });
    }
  }
  const last = stroke[stroke.length - 1];
  out.push({ x: last.x * w, y: last.y * h });
  return out;
}

function buildLevelBar() {
  levelBar.innerHTML = "";
  LETTERS.forEach((L, i) => {
    const d = document.createElement("button");
    d.className = "level-dot";
    if (i === levelIdx) d.classList.add("active");
    if (completed.has(i)) d.classList.add("done");
    d.textContent = L.char;
    d.addEventListener("click", () => loadLevel(i));
    levelBar.appendChild(d);
  });
}

function loadLevel(idx: number, animate = true) {
  levelIdx = ((idx % LETTERS.length) + LETTERS.length) % LETTERS.length;
  strokeIdx = 0;
  levelColor = COLORS[levelIdx % COLORS.length];
  const def = LETTERS[levelIdx];
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  sampledStrokes = def.strokes.map((s) => sampleStroke(s, w, h));
  covered = sampledStrokes.map((s) => s.map(() => false));
  userPath = [];
  lockInput = false;
  promptEl.textContent = `Trace the letter ${def.char}`;
  starsEl.textContent = "";
  if (animate) promptEl.classList.remove("celebrate");
  buildLevelBar();
}

function drawArrow(a: Point, b: Point, color: string) {
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  const ax = a.x + Math.cos(angle) * 38;
  const ay = a.y + Math.sin(angle) * 38;
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ax, ay); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ax + Math.cos(angle) * 12, ay + Math.sin(angle) * 12);
  ctx.lineTo(ax + Math.cos(angle + 2.5) * 16, ay + Math.sin(angle + 2.5) * 16);
  ctx.lineTo(ax + Math.cos(angle - 2.5) * 16, ay + Math.sin(angle - 2.5) * 16);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawStar(x: number, y: number, r: number, color: string, rot = 0) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = color;
  ctx.shadowColor = color; ctx.shadowBlur = 18;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = Math.cos(a) * rr, py = Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function draw() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  const t = performance.now();

  sampledStrokes.forEach((pts, si) => {
    const isCurrent = si === strokeIdx;
    const isDone = si < strokeIdx;

    // dotted guide
    ctx.save();
    ctx.lineWidth = 32; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.setLineDash(isDone ? [] : [2, 22]);
    ctx.strokeStyle = isDone ? DUO_GREEN : isCurrent ? DUO_INK : DUO_GREY;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (const pt of pts) ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.restore();

    if (isCurrent) {
      // green coverage trail
      ctx.save();
      ctx.fillStyle = DUO_GREEN;
      pts.forEach((pt, i) => {
        if (covered[si][i]) {
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2); ctx.fill();
        }
      });
      ctx.restore();

      // mascot star traveling along the stroke
      const phase = (t / 1400) % 1;
      const idx = Math.floor(phase * (pts.length - 1));
      const mp = pts[idx];
      drawStar(mp.x, mp.y, 14 + Math.sin(t / 200) * 2, levelColor, t / 600);

      // start arrow
      const a = pts[0], b = pts[Math.min(8, pts.length - 1)];
      drawArrow(a, b, levelColor);
      ctx.save();
      ctx.fillStyle = levelColor;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 13 + Math.sin(t / 200) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });

  // user trail (rainbow gradient feel)
  if (userPath.length > 1) {
    ctx.save();
    ctx.strokeStyle = levelColor;
    ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.shadowColor = levelColor; ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(userPath[0].x, userPath[0].y);
    for (const pt of userPath) ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.restore();
  }

  // confetti
  if (confetti.length) {
    confetti.forEach((c) => {
      c.vy += 0.25; c.x += c.vx; c.y += c.vy; c.rot += c.vr; c.life -= 1;
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      ctx.fillRect(-6, -3, 12, 6);
      ctx.restore();
    });
    confetti = confetti.filter((c) => c.life > 0 && c.y < h + 40);
  }
}

function localPoint(e: PointerEvent): Point {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function markCovered(pt: Point) {
  if (lockInput || strokeIdx >= sampledStrokes.length) return;
  const guide = sampledStrokes[strokeIdx];
  const cov = covered[strokeIdx];
  for (let i = 0; i < guide.length; i++) {
    if (cov[i]) continue;
    const dx = guide[i].x - pt.x, dy = guide[i].y - pt.y;
    if (dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS) cov[i] = true;
  }
  const ratio = cov.filter(Boolean).length / cov.length;
  if (ratio >= COMPLETE_THRESHOLD) advanceStroke();
}

function advanceStroke() {
  strokeIdx++;
  userPath = [];
  beep(660);
  if (strokeIdx >= sampledStrokes.length) finishLevel();
}

function spawnConfetti() {
  const w = canvas.clientWidth;
  for (let i = 0; i < 80; i++) {
    confetti.push({
      x: w / 2 + (Math.random() - 0.5) * 80,
      y: canvas.clientHeight / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: -Math.random() * 10 - 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      life: 120,
    });
  }
}

function finishLevel() {
  lockInput = true;
  completed.add(levelIdx);
  starsEl.textContent = "⭐⭐⭐";
  promptEl.textContent = `Yay! That's ${LETTERS[levelIdx].char}!`;
  promptEl.classList.add("celebrate");
  spawnConfetti();
  beep(880); setTimeout(() => beep(1100), 150); setTimeout(() => beep(1320), 300);
  speakLetter(LETTERS[levelIdx].char);
  buildLevelBar();
  setTimeout(() => loadLevel(levelIdx + 1), 1800);
}

function speakLetter(ch: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(ch);
      u.lang = "en-US";
      u.rate = 0.85;
      u.pitch = 1.2;
      const voices = synth.getVoices();
      const kid = voices.find((v) => /child|kid|samantha|karen|google us english/i.test(v.name));
      if (kid) u.voice = kid;
      synth.cancel();
      synth.speak(u);
    }, 500);
  } catch {}
}

let audioCtx: AudioContext | null = null;
function beep(freq: number) {
  try {
    audioCtx ??= new AudioContext();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = freq; o.type = "sine";
    g.gain.value = 0.08;
    o.connect(g).connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
    o.stop(audioCtx.currentTime + 0.26);
  } catch {}
}

canvas.addEventListener("pointerdown", (e) => {
  if (lockInput) return;
  drawing = true;
  canvas.setPointerCapture(e.pointerId);
  userPath = [localPoint(e)];
  markCovered(userPath[0]);
});
canvas.addEventListener("pointermove", (e) => {
  if (!drawing) return;
  const pt = localPoint(e);
  userPath.push(pt);
  markCovered(pt);
});
const endStroke = () => { drawing = false; userPath = []; };
canvas.addEventListener("pointerup", endStroke);
canvas.addEventListener("pointercancel", endStroke);
canvas.addEventListener("pointerleave", endStroke);

prevBtn.addEventListener("click", () => loadLevel(levelIdx - 1));
nextBtn.addEventListener("click", () => loadLevel(levelIdx + 1));
resetBtn.addEventListener("click", () => loadLevel(levelIdx));

window.addEventListener("resize", fitCanvas);
fitCanvas();
(function loop() { draw(); requestAnimationFrame(loop); })();
