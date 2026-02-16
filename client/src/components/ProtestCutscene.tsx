import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface ProtestCutsceneProps {
  onFinish: () => void;
}

interface Protester {
  id: number;
  baseX: number;
  skinColor: string;
  shirtColor: string;
  hairColor: string;
  sign: string;
  signColor: string;
  h: number;
  row: number;
  phaseOffset: number;
}

const SIGNS = [
  "NO ONE IS ILLEGAL",
  "KNOW YOUR RIGHTS",
  "FAMILIES BELONG TOGETHER",
  "STOP ICE RAIDS",
  "PROTECT OUR NEIGHBORS",
  "COMMUNITIES NOT CAGES",
  "WE ARE ALL HUMAN",
  "DEFEND CIVIL RIGHTS",
  "JUSTICE FOR ALL",
  "STAND TOGETHER",
  "END FAMILY SEPARATION",
  "IMMIGRANTS WELCOME",
  "DIGNITY FOR ALL",
  "UNITED WE STAND",
];

const SKIN_COLORS = ["#f5d0a9", "#d4a574", "#c68642", "#8d5524", "#6b3a2a", "#e8beac", "#d2956a"];
const SHIRT_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#f39c12", "#1abc9c", "#e67e22", "#2980b9", "#c0392b", "#27ae60"];
const HAIR_COLORS = ["#2c2c2c", "#4a3520", "#1a1a1a", "#6b4226", "#3d2b1f", "#8b6914"];
const SIGN_COLORS = ["#ffffff", "#fff3cd", "#f0f0f0", "#e8f5e9", "#fff8e1"];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function makeProtesters(): Protester[] {
  const list: Protester[] = [];
  let id = 0;
  for (let row = 0; row < 3; row++) {
    const count = row === 0 ? 6 : row === 1 ? 8 : 10;
    const spacing = row === 0 ? 140 : row === 1 ? 110 : 90;
    for (let i = 0; i < count; i++) {
      list.push({
        id: id++,
        baseX: i * spacing,
        skinColor: pick(SKIN_COLORS),
        shirtColor: pick(SHIRT_COLORS),
        hairColor: pick(HAIR_COLORS),
        sign: pick(SIGNS),
        signColor: pick(SIGN_COLORS),
        h: 36 + Math.floor(Math.random() * 6),
        row,
        phaseOffset: Math.random() * Math.PI * 2,
      });
    }
  }
  return list;
}

function darken(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) + amt);
  const g = Math.max(0, ((n >> 8) & 0xff) + amt);
  const b = Math.max(0, (n & 0xff) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function drawProtester(ctx: CanvasRenderingContext2D, p: Protester, x: number, y: number, frame: number) {
  const bob = Math.sin((frame * 0.08) + p.phaseOffset) * 2;
  const legMove = Math.sin((frame * 0.12) + p.phaseOffset) * 3;
  const signBob = Math.sin((frame * 0.05) + p.phaseOffset * 2) * 2;
  const scale = p.row === 0 ? 2.2 : p.row === 1 ? 1.7 : 1.3;

  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(scale, scale);

  const stickW = 2;
  const stickH = 18;
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(-stickW / 2, -p.h - stickH - 4 + signBob, stickW, stickH);

  ctx.font = '5px "Press Start 2P", monospace';
  const textW = ctx.measureText(p.sign).width;
  const signW = textW + 8;
  const signH = 12;
  const signX = -signW / 2;
  const signY = -p.h - stickH - 4 - signH + signBob;

  ctx.fillStyle = p.signColor;
  ctx.fillRect(signX, signY, signW, signH);
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 1;
  ctx.strokeRect(signX, signY, signW, signH);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText(p.sign, signX + 4, signY + 8);

  const ds = darken(p.skinColor, -25);
  ctx.fillStyle = p.hairColor;
  ctx.fillRect(-7, -p.h, 14, 5);

  ctx.fillStyle = p.skinColor;
  ctx.fillRect(-6, -p.h + 4, 12, 12);
  ctx.fillStyle = ds;
  ctx.strokeStyle = ds;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(-6, -p.h + 4, 12, 12);

  ctx.fillStyle = '#000';
  ctx.fillRect(-4, -p.h + 8, 2, 2);
  ctx.fillRect(2, -p.h + 8, 2, 2);
  ctx.fillStyle = ds;
  ctx.fillRect(-2, -p.h + 12, 4, 1);

  const dsh = darken(p.shirtColor, -35);
  ctx.fillStyle = p.shirtColor;
  ctx.fillRect(-8, -p.h + 16, 16, 12);
  ctx.strokeStyle = dsh;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(-8, -p.h + 16, 16, 12);

  ctx.fillStyle = p.skinColor;
  ctx.fillRect(-12, -p.h + 18, 4, 8);
  ctx.fillRect(8, -p.h + 18, 4, 8);

  ctx.fillStyle = '#34495e';
  ctx.fillRect(-6, -p.h + 28, 6, 7 + legMove);
  ctx.fillRect(1, -p.h + 28, 6, 7 - legMove);

  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-7, -p.h + 35 + legMove, 7, 3);
  ctx.fillRect(1, -p.h + 35 - legMove, 7, 3);

  ctx.restore();
}

export function ProtestCutscene({ onFinish }: ProtestCutsceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'scene' | 'message' | 'fadeout'>('scene');
  const [opacity, setOpacity] = useState(0);
  const [protesters] = useState(makeProtesters);
  const frameRef = useRef(0);
  const scrollRef = useRef(0);
  const rafRef = useRef<number>();
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const finishedRef = useRef(false);

  useEffect(() => {
    const fadeIn = setInterval(() => {
      setOpacity(prev => {
        if (prev >= 1) { clearInterval(fadeIn); return 1; }
        return prev + 0.05;
      });
    }, 30);
    return () => clearInterval(fadeIn);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    frameRef.current++;
    scrollRef.current += 0.8;
    const frame = frameRef.current;
    const scroll = scrollRef.current;

    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.55);
    skyGrad.addColorStop(0, '#1a3050');
    skyGrad.addColorStop(0.4, '#2a5070');
    skyGrad.addColorStop(0.7, '#3a7060');
    skyGrad.addColorStop(1, '#4a8a50');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H * 0.55);

    ctx.beginPath();
    ctx.arc(W * 0.85, H * 0.08, 30, 0, Math.PI * 2);
    const sunGrad = ctx.createRadialGradient(W * 0.85, H * 0.08, 5, W * 0.85, H * 0.08, 35);
    sunGrad.addColorStop(0, '#f4d03f');
    sunGrad.addColorStop(0.5, '#f39c12');
    sunGrad.addColorStop(1, 'rgba(243,156,18,0)');
    ctx.fillStyle = sunGrad;
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    const cloudX1 = (frame * 0.3) % (W + 200) - 100;
    const cloudX2 = ((frame * 0.2) + 300) % (W + 200) - 100;
    drawCloud(ctx, cloudX1, H * 0.06, 80);
    drawCloud(ctx, cloudX2, H * 0.12, 60);

    const grassGrad = ctx.createLinearGradient(0, H * 0.5, 0, H);
    grassGrad.addColorStop(0, '#4a8a4a');
    grassGrad.addColorStop(0.3, '#3d7a3d');
    grassGrad.addColorStop(1, '#2d5a2d');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, H * 0.5, W, H * 0.5);

    for (let i = 0; i < 30; i++) {
      const gx = ((i * 43 + 17) % W);
      const gy = H * 0.52 + ((i * 31) % (H * 0.35));
      ctx.fillStyle = `rgba(${50 + (i * 7) % 40}, ${100 + (i * 13) % 60}, ${50 + (i * 3) % 30}, 0.3)`;
      ctx.fillRect(gx, gy, 2, 5 + (i % 4));
    }

    ctx.fillStyle = '#555';
    ctx.fillRect(0, H * 0.65, W, H * 0.08);
    ctx.fillStyle = '#666';
    ctx.fillRect(0, H * 0.65, W, 2);
    ctx.fillStyle = '#444';
    ctx.fillRect(0, H * 0.73 - 2, W, 2);
    ctx.fillStyle = '#ffff0033';
    for (let lx = (frame * 0.5) % 60 - 30; lx < W; lx += 60) {
      ctx.fillRect(lx, H * 0.69, 20, 2);
    }

    const rowConfigs = [
      { yBase: H * 0.85, speedMult: 1.0 },
      { yBase: H * 0.75, speedMult: 0.8 },
      { yBase: H * 0.62, speedMult: 0.6 },
    ];

    for (let row = 2; row >= 0; row--) {
      const { yBase, speedMult } = rowConfigs[row];
      const rowProtesters = protesters.filter(p => p.row === row);
      for (const p of rowProtesters) {
        const x = ((p.baseX + scroll * speedMult * 40) % (W + 400)) - 200;
        drawProtester(ctx, p, x, yBase, frame);
      }
    }

    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    const bannerTexts = ["NO ONE IS ILLEGAL ON STOLEN LAND", "FAMILIES BELONG TOGETHER", "PROTECT OUR COMMUNITIES", "KNOW YOUR RIGHTS", "UNITED WE STAND"];
    const bannerScroll = (frame * 0.8) % 2000;
    let bx = -bannerScroll;
    for (let rep = 0; rep < 3; rep++) {
      for (const t of bannerTexts) {
        ctx.fillText(t, bx, H * 0.64);
        bx += ctx.measureText(t).width + 40;
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [protesters]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('message'), 7000);
    const t2 = setTimeout(() => setPhase('fadeout'), 14000);
    const t3 = setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinishRef.current();
      }
    }, 15500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleSkip = () => {
    setPhase('fadeout');
    setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinishRef.current();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden scanlines" data-testid="protest-cutscene">
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        className="absolute inset-0 w-full h-full"
        style={{ opacity, transition: 'opacity 0.8s ease-in', imageRendering: 'pixelated' }}
      />

      {phase === 'message' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center z-40"
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          <div className="text-center space-y-5 px-6" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.8)' }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-white"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '20px' }}
            >
              ACROSS AMERICA
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-white/90"
              style={{ fontFamily: 'var(--font-retro)', fontSize: '24px', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}
            >
              Communities stand together to protect their neighbors, defend civil rights, and demand justice.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="text-green-400"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', letterSpacing: '0.2em' }}
            >
              THIS IS THEIR STORY
            </motion.p>
          </div>
        </motion.div>
      )}

      {phase === 'fadeout' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-black z-50"
        />
      )}

      <button
        data-testid="button-skip-cutscene"
        onClick={handleSkip}
        className="absolute top-6 right-6 z-50 px-3 py-1 bg-black/60 border border-white/30 text-white/50 hover:text-white transition-colors"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', opacity: opacity > 0.5 ? 1 : 0 }}
      >
        SKIP
      </button>
    </div>
  );
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.beginPath();
  ctx.ellipse(x, y, w * 0.3, w * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + w * 0.2, y - w * 0.04, w * 0.25, w * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x - w * 0.2, y + w * 0.02, w * 0.2, w * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
}
