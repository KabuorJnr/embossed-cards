import type { ConfettiKind } from './types';

/**
 * A small particle system for the moment a card opens: petals that flutter,
 * foil flakes that flash as they turn, stars that twinkle, beads that bounce
 * light. Draws on one canvas and stops itself when the last piece is gone.
 */

interface Piece {
  kind: ConfettiKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  phase: number;
  spin: number;
  age: number;
  life: number;
}

export interface BurstOptions {
  kind: ConfettiKind;
  colors: string[];
  /** Origin in CSS pixels relative to the canvas. */
  x: number;
  y: number;
  count?: number;
  /** Upward launch speed in CSS pixels per frame. */
  power?: number;
  /** Horizontal spread of the origin, for a line source such as an envelope mouth. */
  width?: number;
  /** Vertical spread of the origin, for a line source such as the fold of a card. */
  height?: number;
  /** Mostly upward (fountain) or all directions (bloom). */
  shape?: 'fountain' | 'bloom';
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export class Confetti {
  private ctx: CanvasRenderingContext2D;
  private pieces: Piece[] = [];
  private raf = 0;
  private last = 0;
  private dpr = 1;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.tick = this.tick.bind(this);
  }

  burst(o: BurstOptions) {
    if (reduced() || !o.colors.length) return;
    this.resize();
    const count = o.count ?? 70;
    const power = o.power ?? 9;
    for (let i = 0; i < count; i++) {
      const bloom = o.shape === 'bloom';
      const a = bloom ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const speed = power * (0.45 + Math.random() * 0.75);
      const size =
        o.kind === 'petal' ? 7 + Math.random() * 7 : o.kind === 'bead' ? 2.6 + Math.random() * 2.2 : o.kind === 'star' ? 3.5 + Math.random() * 4 : 3 + Math.random() * 4.5;
      this.pieces.push({
        kind: o.kind,
        x: o.x + (Math.random() - 0.5) * (o.width ?? 0),
        y: o.y + (Math.random() - 0.5) * (o.height ?? 6),
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed * (bloom ? 0.8 : 1),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
        size,
        color: o.colors[Math.floor(Math.random() * o.colors.length)],
        phase: Math.random() * Math.PI * 2,
        spin: 0.08 + Math.random() * 0.14,
        age: 0,
        life: 150 + Math.random() * 90,
      });
    }
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.pieces = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(r.width * this.dpr);
    const h = Math.round(r.height * this.dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }

  private tick(t: number) {
    const dt = Math.min(2.5, (t - this.last) / 16.67);
    this.last = t;
    const { ctx } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.pieces = this.pieces.filter((p) => p.age < p.life);
    for (const p of this.pieces) {
      p.age += dt;
      p.phase += p.spin * dt;
      const heavy = p.kind === 'bead' ? 0.2 : p.kind === 'petal' ? 0.055 : 0.09;
      const drag = p.kind === 'petal' ? 0.955 : p.kind === 'bead' ? 0.985 : 0.965;
      p.vx *= Math.pow(drag, dt);
      p.vy = p.vy * Math.pow(drag, dt) + heavy * dt;
      // Light pieces flutter side to side as they fall.
      const flutter = p.kind === 'petal' ? Math.sin(p.phase) * 0.9 : p.kind === 'flake' ? Math.sin(p.phase * 1.3) * 0.5 : 0;
      p.x += (p.vx + flutter) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      const fade = Math.min(1, (p.life - p.age) / 40, p.age / 4);
      ctx.globalAlpha = Math.max(0, fade);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      this.draw(p);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (this.pieces.length) this.raf = requestAnimationFrame(this.tick);
    else {
      this.raf = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private draw(p: Piece) {
    const { ctx } = this;
    const turn = Math.cos(p.phase);
    switch (p.kind) {
      case 'petal': {
        ctx.scale(1, 0.35 + Math.abs(turn) * 0.65);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.6, p.size * 0.6, p.size * 0.55, 0, p.size * 0.8);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.55, -p.size * 0.75, -p.size * 0.6, 0, -p.size);
        ctx.fill();
        ctx.globalAlpha *= 0.35;
        ctx.strokeStyle = 'rgba(120, 40, 60, 0.6)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
        break;
      }
      case 'flake': {
        // Foil flashes white for the instant it faces the light.
        const face = Math.abs(turn);
        ctx.scale(0.18 + face * 0.82, 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
        if (face > 0.92) {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
        }
        break;
      }
      case 'star': {
        const s = p.size * (0.75 + 0.25 * Math.sin(p.phase * 2));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r = i % 2 ? s * 0.28 : s;
          const a = (i * Math.PI) / 4;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'bead': {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.beginPath();
        ctx.arc(-p.size * 0.32, -p.size * 0.34, p.size * 0.36, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
  }
}
