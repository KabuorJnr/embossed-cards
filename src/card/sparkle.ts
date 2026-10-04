/** Generates the sparkle texture that glitter overlays slide across as the card tilts. */
let cached: string | null = null;

export function sparkleTexture(): string {
  if (cached) return cached;
  const size = 160;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  if (!g) return '';
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 70; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 0.5 + rand() * 1.3;
    const a = 0.35 + rand() * 0.65;
    const grad = g.createRadialGradient(x, y, 0, x, y, r * 2.4);
    grad.addColorStop(0, `rgba(255,255,255,${a})`);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r * 2.4, 0, Math.PI * 2);
    g.fill();
  }
  // A few four point glints.
  g.strokeStyle = 'rgba(255,255,255,0.9)';
  g.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 3 + rand() * 4;
    g.lineWidth = 0.8;
    g.beginPath();
    g.moveTo(x - r, y);
    g.lineTo(x + r, y);
    g.moveTo(x, y - r);
    g.lineTo(x, y + r);
    g.stroke();
  }
  cached = c.toDataURL('image/png');
  return cached;
}
