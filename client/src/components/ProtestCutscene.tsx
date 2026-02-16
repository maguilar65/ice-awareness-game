import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProtestCutsceneProps {
  onFinish: () => void;
}

interface Protester {
  id: number;
  x: number;
  speed: number;
  skinColor: string;
  shirtColor: string;
  hairColor: string;
  sign: string;
  signColor: string;
  height: number;
  delay: number;
  row: number;
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
  "NO FEAR IN OUR COMMUNITY",
  "JUSTICE FOR ALL",
  "STAND TOGETHER",
  "END FAMILY SEPARATION",
  "IMMIGRANTS ARE WELCOME",
  "DIGNITY FOR ALL",
  "UNITED WE STAND",
];

const SKIN_COLORS = ["#f5d0a9", "#d4a574", "#c68642", "#8d5524", "#6b3a2a", "#e8beac", "#d2956a"];
const SHIRT_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#f39c12", "#1abc9c", "#e67e22", "#2980b9", "#c0392b", "#27ae60", "#8e44ad", "#d35400", "#16a085"];
const HAIR_COLORS = ["#2c2c2c", "#4a3520", "#1a1a1a", "#6b4226", "#3d2b1f", "#8b6914"];
const SIGN_COLORS = ["#ffffff", "#fff3cd", "#f0f0f0", "#e8f5e9", "#fff8e1"];

function generateProtesters(): Protester[] {
  const protesters: Protester[] = [];
  let id = 0;
  for (let row = 0; row < 3; row++) {
    const count = row === 0 ? 8 : row === 1 ? 10 : 12;
    for (let i = 0; i < count; i++) {
      protesters.push({
        id: id++,
        x: -200 + i * (row === 0 ? 120 : row === 1 ? 100 : 85),
        speed: 0.4 + Math.random() * 0.15,
        skinColor: SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)],
        shirtColor: SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)],
        hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
        sign: SIGNS[Math.floor(Math.random() * SIGNS.length)],
        signColor: SIGN_COLORS[Math.floor(Math.random() * SIGN_COLORS.length)],
        height: 34 + Math.floor(Math.random() * 8),
        delay: row * 0.8 + Math.random() * 0.5,
        row,
      });
    }
  }
  return protesters;
}

function PixelProtester({ protester, frame }: { protester: Protester; frame: number }) {
  const bob = Math.sin((frame + protester.id * 17) * 0.08) * 2;
  const legAnim = Math.sin((frame + protester.id * 13) * 0.12) * 3;
  const signBob = Math.sin((frame + protester.id * 7) * 0.05) * 1.5;
  const h = protester.height;
  const scale = protester.row === 0 ? 1.1 : protester.row === 1 ? 0.9 : 0.75;
  const darkerSkin = adjustColor(protester.skinColor, -25);
  const darkerShirt = adjustColor(protester.shirtColor, -35);

  return (
    <div
      className="absolute"
      style={{
        transform: `scale(${scale})`,
        bottom: protester.row === 0 ? 40 : protester.row === 1 ? 20 : 5,
        zIndex: protester.row === 0 ? 30 : protester.row === 1 ? 20 : 10,
      }}
    >
      <div style={{ transform: `translateY(${bob}px)` }}>
        <div className="absolute" style={{
          left: '50%', transform: `translateX(-50%) translateY(${signBob}px)`,
          bottom: h + 6, width: 'max-content',
        }}>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1" style={{ height: 14, backgroundColor: '#8B7355' }} />
            <div className="px-2 py-1 relative" style={{
              backgroundColor: protester.signColor,
              border: '2px solid #999',
              fontFamily: 'var(--font-pixel)',
              fontSize: '5px',
              color: '#1a1a1a',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              marginBottom: 12,
              boxShadow: '1px 1px 0 rgba(0,0,0,0.2)',
            }}>
              {protester.sign}
            </div>
          </div>
        </div>

        <div className="relative" style={{ width: 28, height: h }}>
          <div className="absolute" style={{
            top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 12, height: 12, backgroundColor: protester.skinColor,
            border: `2px solid ${darkerSkin}`, borderRadius: '2px',
          }}>
            <div className="absolute top-2 left-1 w-1 h-1 bg-black rounded-full" />
            <div className="absolute top-2 right-1 w-1 h-1 bg-black rounded-full" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5" style={{ backgroundColor: darkerSkin }} />
          </div>

          <div className="absolute" style={{
            top: -2, left: '50%', transform: 'translateX(-50%)',
            width: 14, height: 5, backgroundColor: protester.hairColor,
            borderRadius: '2px 2px 0 0',
          }} />

          <div className="absolute" style={{
            top: 12, left: '50%', transform: 'translateX(-50%)',
            width: 16, height: 10, backgroundColor: protester.shirtColor,
            border: `2px solid ${darkerShirt}`, borderRadius: '1px',
          }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
          </div>

          <div className="absolute" style={{
            top: 15, left: 2, width: 4, height: 6,
            backgroundColor: protester.skinColor, border: `1px solid ${darkerSkin}`,
            transform: `rotate(${-15 + signBob}deg)`, transformOrigin: 'top center',
          }} />
          <div className="absolute" style={{
            top: 15, right: 2, width: 4, height: 6,
            backgroundColor: protester.skinColor, border: `1px solid ${darkerSkin}`,
          }} />

          <div className="absolute" style={{
            bottom: 3, left: 6, width: 6, height: 6,
            backgroundColor: '#34495e', border: '1px solid #2c3e50',
            transform: `translateY(${legAnim}px)`,
          }} />
          <div className="absolute" style={{
            bottom: 3, right: 6, width: 6, height: 6,
            backgroundColor: '#34495e', border: '1px solid #2c3e50',
            transform: `translateY(${-legAnim}px)`,
          }} />

          <div className="absolute" style={{
            bottom: 0, left: 5, width: 7, height: 3,
            backgroundColor: '#1a1a1a', borderRadius: '1px',
            transform: `translateY(${legAnim}px)`,
          }} />
          <div className="absolute" style={{
            bottom: 0, right: 5, width: 7, height: 3,
            backgroundColor: '#1a1a1a', borderRadius: '1px',
            transform: `translateY(${-legAnim}px)`,
          }} />
        </div>
      </div>
    </div>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function ProtestCutscene({ onFinish }: ProtestCutsceneProps) {
  const [phase, setPhase] = useState<'fadein' | 'marching' | 'message' | 'fadeout'>('fadein');
  const [frame, setFrame] = useState(0);
  const [protesters] = useState(generateProtesters);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('marching'), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'marching' && phase !== 'message') return;
    const interval = setInterval(() => {
      setFrame(f => f + 1);
      setScrollX(x => x + 0.7);
    }, 33);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === 'marching' && frame > 180) {
      setPhase('message');
    }
    if (phase === 'message' && frame > 320) {
      setPhase('fadeout');
    }
  }, [phase, frame]);

  useEffect(() => {
    if (phase === 'fadeout') {
      const timer = setTimeout(onFinish, 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, onFinish]);

  const handleSkip = () => {
    setPhase('fadeout');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden scanlines" data-testid="protest-cutscene">
      <AnimatePresence>
        {phase === 'fadein' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1a2a4a 0%, #2a4a6a 30%, #3a6a5a 60%, #4a7a4a 85%, #3a5a3a 100%)',
      }}>
        <div className="absolute" style={{
          top: '5%', right: '10%', width: 60, height: 60,
          background: 'radial-gradient(circle, #f4d03f 30%, #f39c12 60%, transparent 70%)',
          borderRadius: '50%',
          boxShadow: '0 0 40px rgba(244,208,63,0.4)',
        }} />

        {[15, 35, 60, 80].map((left, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${left}%`, top: `${8 + i * 3}%`, opacity: 0.15 }}
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
          >
            <div className="flex">
              <div className="rounded-full bg-white" style={{ width: 40 + i * 10, height: 15 + i * 3 }} />
              <div className="rounded-full bg-white -ml-4" style={{ width: 55 + i * 8, height: 22 + i * 3, marginTop: -5 }} />
              <div className="rounded-full bg-white -ml-3" style={{ width: 35 + i * 6, height: 14 + i * 2 }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '35%' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #4a7a4a 0%, #3d6b3d 40%, #2d5a2d 100%)' }} />

        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute" style={{
            bottom: Math.random() * 60 + '%',
            left: (i * 5 + Math.random() * 3) + '%',
            width: 2,
            height: 8 + Math.random() * 6,
            backgroundColor: `rgba(${60 + Math.random() * 40}, ${120 + Math.random() * 60}, ${60 + Math.random() * 40}, 0.4)`,
          }} />
        ))}
      </div>

      <div className="absolute left-0 right-0" style={{ bottom: '12%', height: '8%', backgroundColor: '#555', borderTop: '3px solid #666', borderBottom: '2px solid #444' }}>
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 42px)' }} />
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '55%' }}>
        {protesters.map(p => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: p.x + scrollX * (60 + p.row * 15),
              transition: 'none',
            }}
          >
            <PixelProtester protester={p} frame={frame} />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-[14%] z-40">
        <motion.div
          className="flex whitespace-nowrap"
          style={{ width: 'max-content' }}
          animate={{ x: [0, -2000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex items-center gap-16 mx-8">
              {["NO ONE IS ILLEGAL ON STOLEN LAND", "FAMILIES BELONG TOGETHER", "PROTECT OUR COMMUNITIES", "KNOW YOUR RIGHTS", "COMMUNITIES NOT CAGES", "UNITED WE STAND"].map((text, i) => (
                <span key={i} style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '8px',
                  color: 'rgba(255,255,255,0.2)',
                  letterSpacing: '0.15em',
                }}>
                  {text}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {phase === 'message' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-40"
          >
            <div className="text-center space-y-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.7)' }}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-white"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '16px' }}
              >
                ACROSS AMERICA
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="text-white/90"
                style={{ fontFamily: 'var(--font-retro)', fontSize: '22px', maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}
              >
                Communities stand together to protect their neighbors, defend civil rights, and demand justice.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 0.8 }}
                className="text-green-400"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', letterSpacing: '0.2em' }}
              >
                THIS IS THEIR STORY
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'fadeout' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>

      <motion.button
        data-testid="button-skip-cutscene"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={handleSkip}
        className="absolute top-6 right-6 z-50 px-3 py-1 bg-black/50 border border-white/20 text-white/60 hover:text-white"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
      >
        SKIP
      </motion.button>
    </div>
  );
}
