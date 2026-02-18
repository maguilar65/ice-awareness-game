import { useEffect, useState, useRef, useCallback } from "react";
import { useEventListener } from "usehooks-ts";
import { motion } from "framer-motion";
import { rooms, buildWallMap, findSafeSpawn, TILE, COLS, ROWS, type NpcDef, type Exit, type Decoration } from "@/lib/gameData";
import { playFootstep, playDoorTransition } from "@/lib/audioEngine";

const SPEED = 3;
const CANVAS_W = COLS * TILE;
const CANVAS_H = ROWS * TILE;

function useGameScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const hud = 44;
      const isMobile = vw < 768;
      const controlsH = isMobile ? 140 : 0;
      const availH = vh - hud - controlsH;
      const sx = vw / CANVAS_W;
      const sy = availH / CANVAS_H;
      setScale(Math.min(sx, sy));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return scale;
}

interface Position { x: number; y: number; }

interface GameWorldProps {
  onInteract: (dialogueId: string) => void;
  onMiniGame?: (miniGameId: string) => void;
  currentRoom: string;
  onRoomChange: (roomId: string, spawnX: number, spawnY: number) => void;
  playerStart: Position;
  dialogueOpen: boolean;
  onPause?: () => void;
  talkedTo?: Set<string>;
  onPlayerMove?: (pos: { x: number; y: number }) => void;
}

interface NpcWanderState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  waitTimer: number;
  facing: 'left' | 'right';
}

function DecorationTile({ type, color, tileX, tileY, decX, decY, decW, decH }: { type: string; color: string; tileX: number; tileY: number; decX: number; decY: number; decW: number; decH: number }) {
  const relX = tileX - decX;
  const relY = tileY - decY;
  const isLeft = relX === 0;
  const isRight = relX === decW - 1;
  const isTop = relY === 0;
  const isBottom = relY === decH - 1;
  const hiColor = adjustColor(color, 30);
  const loColor = adjustColor(color, -30);

  switch (type) {
    case 'table':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: color }}>
          <div className="absolute inset-0" style={{ borderTop: isTop ? `4px solid ${hiColor}` : 'none', borderLeft: isLeft ? `4px solid ${hiColor}` : 'none', borderRight: isRight ? `4px solid ${loColor}` : 'none', borderBottom: isBottom ? `4px solid ${loColor}` : 'none' }} />
        </div>
      );
    case 'desk':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: color }}>
          <div className="absolute inset-0" style={{ borderTop: `4px solid ${hiColor}`, borderBottom: `4px solid ${loColor}` }} />
          {isTop && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-2" style={{ backgroundColor: hiColor }} />}
        </div>
      );
    case 'bookshelf':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: color }}>
          <div className="absolute inset-0" style={{ borderTop: `3px solid ${hiColor}`, borderLeft: isLeft ? `3px solid ${hiColor}` : 'none', borderRight: isRight ? `3px solid ${loColor}` : 'none' }} />
          <div className="absolute top-2 left-2 right-2 h-3" style={{ backgroundColor: '#c03030' }} />
          <div className="absolute top-6 left-2 right-2 h-3" style={{ backgroundColor: '#3060b0' }} />
          <div className="absolute bottom-2 left-2 right-2 h-3" style={{ backgroundColor: '#30a060' }} />
          {relX % 2 === 0 && <div className="absolute top-3 left-3 w-2 h-4" style={{ backgroundColor: '#e0c030' }} />}
        </div>
      );
    case 'bench':
      return (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-4" style={{ backgroundColor: color, borderTop: `3px solid ${hiColor}` }} />
          {isLeft && <div className="absolute top-4 left-2 w-3" style={{ height: TILE - 16, backgroundColor: loColor }} />}
          {isRight && <div className="absolute top-4 right-2 w-3" style={{ height: TILE - 16, backgroundColor: loColor }} />}
        </div>
      );
    case 'plant':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: 20, height: 24 }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: 12, height: 8, backgroundColor: '#5c3a1e' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: 16, height: 16, backgroundColor: color }} />
            <div className="absolute" style={{ top: 2, left: 2, width: 4, height: 4, backgroundColor: adjustColor(color, 40) }} />
          </div>
        </div>
      );
    case 'fountain':
      return (
        <div className="absolute inset-0">
          <div className="absolute inset-2" style={{ backgroundColor: '#4a6a8a', border: '3px solid #5a7a9a' }} />
          {isTop && relX === Math.floor(decW / 2) && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: 6, height: 8, backgroundColor: '#7ab8e0' }} />
          )}
        </div>
      );
    case 'bed':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: '#4a4a5a' }}>
          <div className="absolute inset-0" style={{ borderTop: '3px solid #5a5a6a' }} />
          {isLeft && <div className="absolute top-2 left-2" style={{ width: 8, height: 8, backgroundColor: '#ddd' }} />}
          <div className="absolute top-4 left-0 right-0 bottom-2" style={{ backgroundColor: '#3a5a7a' }} />
        </div>
      );
    case 'counter':
    case 'shelves':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: color }}>
          <div className="absolute inset-0" style={{ borderTop: `3px solid ${hiColor}`, borderLeft: isLeft ? `3px solid ${hiColor}` : 'none', borderBottom: `3px solid ${loColor}` }} />
          {type === 'shelves' && (
            <>
              <div className="absolute top-3 left-2 right-2 h-2" style={{ backgroundColor: hiColor }} />
              <div className="absolute bottom-4 left-2 right-2 h-2" style={{ backgroundColor: hiColor }} />
            </>
          )}
        </div>
      );
    case 'arcade_cabinet':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: '#1a1a2e' }}>
          <div className="absolute inset-0" style={{ backgroundColor: color, borderTop: isTop ? `4px solid ${adjustColor(color, 30)}` : 'none', borderLeft: isLeft ? `3px solid ${adjustColor(color, 20)}` : 'none', borderRight: isRight ? `3px solid ${adjustColor(color, -40)}` : 'none', borderBottom: isBottom ? `4px solid ${adjustColor(color, -40)}` : 'none' }} />
          {isTop && (
            <div className="absolute top-2 left-2 right-2 bottom-4" style={{ backgroundColor: '#000', border: '2px solid #333' }}>
              <div className="absolute inset-1" style={{ backgroundColor: adjustColor(color, -60) }}>
                <div className="absolute" style={{ top: 2, left: 2, width: 4, height: 4, backgroundColor: '#0f0' }} />
                <div className="absolute" style={{ top: 2, right: 2, width: 4, height: 4, backgroundColor: color }} />
              </div>
            </div>
          )}
          {isBottom && (
            <>
              <div className="absolute top-2 left-4 right-4 h-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2" style={{ width: 8, height: 8, backgroundColor: '#ff0' }} />
            </>
          )}
        </div>
      );
    case 'fence':
      return (
        <div className="absolute inset-0">
          <div className="absolute" style={{ left: 4, top: 8, width: 4, height: TILE - 8, backgroundColor: color }} />
          <div className="absolute" style={{ right: 4, top: 8, width: 4, height: TILE - 8, backgroundColor: color }} />
          <div className="absolute" style={{ left: 0, top: Math.floor(TILE * 0.3), width: TILE, height: 3, backgroundColor: color }} />
          <div className="absolute" style={{ left: 0, top: Math.floor(TILE * 0.6), width: TILE, height: 3, backgroundColor: color }} />
        </div>
      );
    default:
      return (
        <div className="absolute inset-0" style={{ backgroundColor: color, borderTop: `3px solid ${hiColor}`, borderLeft: `2px solid ${hiColor}`, borderRight: `2px solid ${loColor}`, borderBottom: `3px solid ${loColor}` }} />
      );
  }
}

function NpcSprite({ npc, wanderState, isNearby, onNpcClick, animFrame, talked }: { npc: NpcDef; wanderState?: NpcWanderState; isNearby: boolean; onNpcClick: (npc: NpcDef) => void; animFrame: number; talked?: boolean }) {
  const posX = wanderState ? wanderState.x : npc.x * TILE;
  const posY = wanderState ? wanderState.y : npc.y * TILE;
  const face = wanderState?.facing || 'right';
  const isWalking = wanderState ? (Math.abs(wanderState.targetX - wanderState.x) > 2 || Math.abs(wanderState.targetY - wanderState.y) > 2) : false;
  const walkBob = isWalking ? Math.floor(Math.sin(animFrame * 0.15) * 2) : 0;
  const idleBob = !isWalking ? Math.floor(Math.sin(animFrame * 0.04) * 1) : 0;
  const bobY = walkBob + idleBob;
  const frame = isWalking ? Math.floor(animFrame * 0.08) % 2 : 0;
  const P = 4;

  const darkerShirt = adjustColor(npc.shirtColor, -40);

  return (
    <div
      data-testid={`npc-${npc.id}`}
      className="absolute flex flex-col items-center cursor-pointer z-20"
      style={{
        left: posX, top: posY + bobY, width: TILE, height: TILE,
        transition: 'left 0.06s linear, top 0.06s linear',
        ...((!talked && !isWalking) ? { animation: 'npc-glow 2.5s ease-in-out infinite' } : {}),
      }}
      onClick={() => onNpcClick(npc)}
    >
      <div className="relative" style={{ width: P * 8, height: P * 10, transform: face === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
        {npc.female ? (
          <>
            <PixelBlock x={P*1} y={0} w={P*6} h={P} color="#2c2c2c" />
            <PixelBlock x={P*0} y={P} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*1} y={P} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*2} y={P} w={P*4} h={P} color={npc.skinColor} />
            <PixelBlock x={P*6} y={P} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*7} y={P} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*0} y={P*2} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*1} y={P*2} w={P} h={P} color={npc.skinColor} />
            <PixelBlock x={P*2} y={P*2} w={P} h={P} color="#1a1a1a" />
            <PixelBlock x={P*3} y={P*2} w={P*2} h={P} color={npc.skinColor} />
            <PixelBlock x={P*5} y={P*2} w={P} h={P} color="#1a1a1a" />
            <PixelBlock x={P*6} y={P*2} w={P} h={P} color={npc.skinColor} />
            <PixelBlock x={P*7} y={P*2} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*0} y={P*3} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*2} y={P*3} w={P*4} h={P} color={adjustColor(npc.skinColor, -20)} />
            <PixelBlock x={P*7} y={P*3} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*0} y={P*4} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*1} y={P*4} w={P*6} h={P} color={npc.shirtColor} />
            <PixelBlock x={P*7} y={P*4} w={P} h={P} color="#2c2c2c" />
          </>
        ) : (
          <>
            <PixelBlock x={P*2} y={0} w={P*4} h={P} color="#2c2c2c" />
            <PixelBlock x={P*1} y={P} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*2} y={P} w={P*4} h={P} color={npc.skinColor} />
            <PixelBlock x={P*6} y={P} w={P} h={P} color="#2c2c2c" />
            <PixelBlock x={P*1} y={P*2} w={P} h={P} color={npc.skinColor} />
            <PixelBlock x={P*2} y={P*2} w={P} h={P} color="#1a1a1a" />
            <PixelBlock x={P*3} y={P*2} w={P*2} h={P} color={npc.skinColor} />
            <PixelBlock x={P*5} y={P*2} w={P} h={P} color="#1a1a1a" />
            <PixelBlock x={P*6} y={P*2} w={P} h={P} color={npc.skinColor} />
            <PixelBlock x={P*2} y={P*3} w={P*4} h={P} color={adjustColor(npc.skinColor, -20)} />
            <PixelBlock x={P*1} y={P*4} w={P*6} h={P} color={npc.shirtColor} />
          </>
        )}
        <PixelBlock x={P*0} y={P*5} w={P} h={P*2} color={npc.skinColor} />
        <PixelBlock x={P*1} y={P*5} w={P*6} h={P*2} color={darkerShirt} />
        <PixelBlock x={P*7} y={P*5} w={P} h={P*2} color={npc.skinColor} />
        {frame === 0 ? (
          <>
            <PixelBlock x={P*2} y={P*7} w={P*2} h={P*2} color="#34495e" />
            <PixelBlock x={P*4} y={P*7} w={P*2} h={P*2} color="#34495e" />
            <PixelBlock x={P*2} y={P*9} w={P*2} h={P} color="#1a1a1a" />
            <PixelBlock x={P*4} y={P*9} w={P*2} h={P} color="#1a1a1a" />
          </>
        ) : (
          <>
            <PixelBlock x={P*1} y={P*7} w={P*2} h={P*2} color="#34495e" />
            <PixelBlock x={P*5} y={P*7} w={P*2} h={P*2} color="#34495e" />
            <PixelBlock x={P*1} y={P*9} w={P*2} h={P} color="#1a1a1a" />
            <PixelBlock x={P*5} y={P*9} w={P*2} h={P} color="#1a1a1a" />
          </>
        )}
      </div>

      <div
        className="absolute -top-8 left-1/2 whitespace-nowrap z-30"
        style={{ transform: 'translateX(-50%)' }}
      >
        <div className="bg-black border-2 px-2 py-0.5 text-center" style={{
          fontFamily: 'var(--font-pixel)', fontSize: '7px',
          borderColor: isNearby ? '#4ade80' : '#555',
          opacity: isNearby ? 1 : 0.75,
        }}>
          <span style={{ color: isNearby ? '#4ade80' : '#a0d0a0' }}>{npc.name}</span>
          {isNearby && (
            <>
              <br />
              <span style={{ color: '#888' }}>SPACE to talk</span>
            </>
          )}
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

function OutdoorEffects() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(80,140,210,0.18) 0%, rgba(60,120,180,0.08) 25%, transparent 55%)',
        }}
      />
      {[
        { left: '8%', top: '2%', w: 90, delay: 0 },
        { left: '32%', top: '5%', w: 65, delay: 2.5 },
        { left: '58%', top: '1%', w: 100, delay: 5 },
        { left: '82%', top: '4%', w: 55, delay: 1.5 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-[2]"
          style={{ left: cloud.left, top: cloud.top }}
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 25 + cloud.delay * 4, repeat: Infinity, ease: "linear" }}
        >
          <div className="flex" style={{ opacity: 0.15 }}>
            <div className="bg-white" style={{ width: cloud.w * 0.4, height: cloud.w * 0.2 }} />
            <div className="bg-white -ml-1" style={{ width: cloud.w * 0.5, height: cloud.w * 0.3, marginTop: -cloud.w * 0.08 }} />
            <div className="bg-white -ml-1" style={{ width: cloud.w * 0.35, height: cloud.w * 0.2 }} />
          </div>
        </motion.div>
      ))}
      <AmbientParticles />
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{ boxShadow: 'inset 0 0 80px rgba(100,180,255,0.06)' }}
      />
    </>
  );
}

function AmbientParticles() {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      dx: `${(Math.random() - 0.5) * 80}px`,
      dy: `${-20 - Math.random() * 60}px`,
      rot: `${Math.random() * 360}deg`,
    }))
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none z-[2]">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: 'rgba(180,220,140,0.3)',
            '--dx': p.dx,
            '--dy': p.dy,
            '--rot': p.rot,
            animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function ExitSparkles({ x, y }: { x: number; y: number }) {
  const sparkles = useRef(
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      offX: 8 + Math.floor(Math.random() * (TILE - 16) / 4) * 4,
      offY: 8 + Math.floor(Math.random() * (TILE - 16) / 4) * 4,
      delay: i * 0.5,
    }))
  ).current;

  return (
    <>
      {sparkles.map(s => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: x * TILE + s.offX,
            top: y * TILE + s.offY,
            width: 4,
            height: 4,
            backgroundColor: '#4ade80',
            animation: `sparkle 1.8s ${s.delay}s ease-in-out infinite`,
            zIndex: 8,
          }}
        />
      ))}
    </>
  );
}

function PixelTransition({ active }: { active: boolean }) {
  if (!active) return null;
  const gridSize = 32;
  const cols = Math.ceil(CANVAS_W / gridSize);
  const rows = Math.ceil(CANVAS_H / gridSize);
  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const delay = (r + c) * 12;
          return (
            <div
              key={`${r}-${c}`}
              className="absolute bg-black"
              style={{
                left: c * gridSize,
                top: r * gridSize,
                width: gridSize,
                height: gridSize,
                opacity: 0,
                animation: `pixelBlockIn 0.15s ${delay}ms forwards`,
              }}
            />
          );
        })
      )}
    </div>
  );
}

function PixelBlock({ x, y, w, h, color, style }: { x: number; y: number; w: number; h: number; color: string; style?: React.CSSProperties }) {
  return <div className="absolute" style={{ left: x, top: y, width: w, height: h, backgroundColor: color, ...style }} />;
}

function PlayerSprite({ facing, isMoving, stepCount }: { facing: 'left' | 'right'; isMoving: boolean; stepCount: number }) {
  const bobY = isMoving ? Math.floor(Math.sin(stepCount * 0.3) * 2) : 0;
  const frame = isMoving ? Math.floor(stepCount * 0.15) % 2 : 0;
  const P = 4;

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
      <div className="relative" style={{ width: P * 8, height: P * 10, transform: `translateY(${bobY}px)` }}>
        <PixelBlock x={P*2} y={0} w={P*4} h={P} color="#4a2800" />
        <PixelBlock x={P*1} y={P} w={P} h={P} color="#4a2800" />
        <PixelBlock x={P*2} y={P} w={P*4} h={P} color="#f5c090" />
        <PixelBlock x={P*6} y={P} w={P} h={P} color="#4a2800" />
        <PixelBlock x={P*1} y={P*2} w={P} h={P} color="#f5c090" />
        <PixelBlock x={P*2} y={P*2} w={P} h={P} color="#1a1a1a" />
        <PixelBlock x={P*3} y={P*2} w={P*2} h={P} color="#f5c090" />
        <PixelBlock x={P*5} y={P*2} w={P} h={P} color="#1a1a1a" />
        <PixelBlock x={P*6} y={P*2} w={P} h={P} color="#f5c090" />
        <PixelBlock x={P*2} y={P*3} w={P*4} h={P} color="#c9a070" />
        <PixelBlock x={P*1} y={P*4} w={P*6} h={P} color="#2563eb" />
        <PixelBlock x={P*0} y={P*5} w={P} h={P*2} color="#f5c090" />
        <PixelBlock x={P*1} y={P*5} w={P*6} h={P*2} color="#1d4ed8" />
        <PixelBlock x={P*7} y={P*5} w={P} h={P*2} color="#f5c090" />
        {frame === 0 ? (
          <>
            <PixelBlock x={P*2} y={P*7} w={P*2} h={P*2} color="#374151" />
            <PixelBlock x={P*4} y={P*7} w={P*2} h={P*2} color="#374151" />
            <PixelBlock x={P*2} y={P*9} w={P*2} h={P} color="#8b1a1a" />
            <PixelBlock x={P*4} y={P*9} w={P*2} h={P} color="#8b1a1a" />
          </>
        ) : (
          <>
            <PixelBlock x={P*1} y={P*7} w={P*2} h={P*2} color="#374151" />
            <PixelBlock x={P*5} y={P*7} w={P*2} h={P*2} color="#374151" />
            <PixelBlock x={P*1} y={P*9} w={P*2} h={P} color="#8b1a1a" />
            <PixelBlock x={P*5} y={P*9} w={P*2} h={P} color="#8b1a1a" />
          </>
        )}
      </div>
    </div>
  );
}

export function GameWorld({ onInteract, onMiniGame, currentRoom, onRoomChange, playerStart, dialogueOpen, onPause, talkedTo, onPlayerMove }: GameWorldProps) {
  const scale = useGameScale();
  const room = rooms[currentRoom];
  const [playerPos, setPlayerPos] = useState<Position>(() => {
    const wm = buildWallMap(room);
    const safe = findSafeSpawn(wm, playerStart.x, playerStart.y, room.npcs);
    return { x: safe.x * TILE, y: safe.y * TILE };
  });
  const [wallMap, setWallMap] = useState(() => buildWallMap(room));
  const keysPressed = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>();
  const [nearbyNpc, setNearbyNpc] = useState<NpcDef | null>(null);
  const [nearbyExit, setNearbyExit] = useState<Exit | null>(null);
  const [nearbyArcade, setNearbyArcade] = useState<Decoration | null>(null);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [transitioning, setTransitioning] = useState(false);
  const stepCountRef = useRef(0);
  const [isMoving, setIsMoving] = useState(false);
  const [animFrame, setAnimFrame] = useState(0);

  const [npcPositions, setNpcPositions] = useState<Record<string, NpcWanderState>>({});

  useEffect(() => {
    const initial: Record<string, NpcWanderState> = {};
    room.npcs.forEach(npc => {
      initial[npc.id] = {
        x: npc.x * TILE,
        y: npc.y * TILE,
        targetX: npc.x * TILE,
        targetY: npc.y * TILE,
        waitTimer: Math.random() * 120 + 60,
        facing: Math.random() > 0.5 ? 'left' : 'right',
      };
    });
    setNpcPositions(initial);
  }, [currentRoom]);

  useEffect(() => {
    const destRoom = rooms[currentRoom];
    const destWallMap = buildWallMap(destRoom);
    const safe = findSafeSpawn(destWallMap, playerStart.x, playerStart.y, destRoom.npcs);
    setPlayerPos({ x: safe.x * TILE, y: safe.y * TILE });
  }, [playerStart.x, playerStart.y, currentRoom]);

  useEffect(() => {
    setWallMap(buildWallMap(room));
  }, [room]);

  useEffect(() => {
    if (onPlayerMove) onPlayerMove(playerPos);
  }, [playerPos.x, playerPos.y]);

  const interactRef = useRef(false);

  const handleKeyDown = useCallback(({ key }: KeyboardEvent) => {
    if (dialogueOpen) return;
    keysPressed.current.add(key.toLowerCase());
    if ((key === ' ' || key === 'Enter' || key === 'Space') && !interactRef.current) {
      interactRef.current = true;
      if (nearbyNpc) {
        onInteract(nearbyNpc.dialogueId);
      } else if (nearbyArcade && nearbyArcade.miniGame && onMiniGame) {
        onMiniGame(nearbyArcade.miniGame);
      } else if (nearbyExit && !transitioning) {
        setTransitioning(true);
        playDoorTransition();
        setTimeout(() => {
          onRoomChange(nearbyExit.toRoom, nearbyExit.spawnX, nearbyExit.spawnY);
          setTransitioning(false);
        }, 600);
      }
    }
  }, [dialogueOpen, nearbyNpc, nearbyExit, nearbyArcade, onInteract, onMiniGame, onRoomChange, transitioning]);

  const handleKeyUp = useCallback(({ key }: KeyboardEvent) => {
    keysPressed.current.delete(key.toLowerCase());
    if (key === ' ' || key === 'Enter' || key === 'Space') {
      interactRef.current = false;
    }
  }, []);

  useEventListener('keydown', handleKeyDown);
  useEventListener('keyup', handleKeyUp);

  const update = useCallback(() => {
    if (transitioning || dialogueOpen) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    setAnimFrame(f => f + 1);

    setPlayerPos((prev) => {
      let dx = 0, dy = 0;
      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) dy -= SPEED;
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) dy += SPEED;
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) { dx -= SPEED; setFacing('left'); }
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) { dx += SPEED; setFacing('right'); }
      if (dx === 0 && dy === 0) {
        setIsMoving(false);
        return prev;
      }

      const nextX = prev.x + dx;
      const nextY = prev.y + dy;
      const tileX = Math.floor((nextX + TILE / 2) / TILE);
      const tileY = Math.floor((nextY + TILE / 2) / TILE);

      if (tileY < 0 || tileY >= ROWS || tileX < 0 || tileX >= COLS) return prev;

      const npcBlock = Object.values(npcPositions).some(np => {
        const npTileX = Math.floor((np.x + TILE / 2) / TILE);
        const npTileY = Math.floor((np.y + TILE / 2) / TILE);
        return npTileX === tileX && npTileY === tileY;
      });
      if (wallMap[tileY]?.[tileX] !== 0 || npcBlock) return prev;

      setIsMoving(true);
      stepCountRef.current++;
      playFootstep(stepCountRef.current);

      return { x: nextX, y: nextY };
    });

    setNpcPositions(prev => {
      const next = { ...prev };
      let changed = false;
      for (const npcId in next) {
        const state = { ...next[npcId] };
        if (state.waitTimer > 0) {
          state.waitTimer--;
          next[npcId] = state;
          changed = true;
          continue;
        }

        const distX = state.targetX - state.x;
        const distY = state.targetY - state.y;
        const dist = Math.abs(distX) + Math.abs(distY);

        if (dist < 2) {
          const npc = room.npcs.find(n => n.id === npcId);
          if (!npc) continue;
          const wanderRange = 2;
          const newTileX = Math.max(2, Math.min(COLS - 3, npc.x + Math.floor(Math.random() * (wanderRange * 2 + 1)) - wanderRange));
          const newTileY = Math.max(2, Math.min(ROWS - 3, npc.y + Math.floor(Math.random() * (wanderRange * 2 + 1)) - wanderRange));

          if (wallMap[newTileY]?.[newTileX] === 0) {
            state.targetX = newTileX * TILE;
            state.targetY = newTileY * TILE;
          }
          state.waitTimer = Math.random() * 180 + 90;
        } else {
          const npcSpeed = 1;
          let newX = state.x;
          let newY = state.y;
          if (Math.abs(distX) > 1) {
            newX += Math.sign(distX) * npcSpeed;
            state.facing = distX > 0 ? 'right' : 'left';
          }
          if (Math.abs(distY) > 1) {
            newY += Math.sign(distY) * npcSpeed;
          }
          const checkTileX = Math.floor((newX + TILE / 2) / TILE);
          const checkTileY = Math.floor((newY + TILE / 2) / TILE);
          if (checkTileX > 0 && checkTileX < COLS - 1 && checkTileY > 0 && checkTileY < ROWS - 1 && wallMap[checkTileY]?.[checkTileX] === 0) {
            state.x = newX;
            state.y = newY;
          } else {
            state.targetX = state.x;
            state.targetY = state.y;
            state.waitTimer = 60;
          }
        }
        next[npcId] = state;
        changed = true;
      }
      return changed ? next : prev;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [wallMap, room.npcs, transitioning, dialogueOpen, npcPositions]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [update]);

  useEffect(() => {
    const px = Math.floor((playerPos.x + TILE / 2) / TILE);
    const py = Math.floor((playerPos.y + TILE / 2) / TILE);

    const npc = room.npcs.find(n => {
      const np = npcPositions[n.id];
      const nx = np ? Math.floor((np.x + TILE / 2) / TILE) : n.x;
      const ny = np ? Math.floor((np.y + TILE / 2) / TILE) : n.y;
      const dist = Math.abs(nx - px) + Math.abs(ny - py);
      return dist > 0 && dist <= 2;
    });
    setNearbyNpc(npc || null);

    const exit = room.exits.find(e => Math.abs(e.x - px) <= 1 && Math.abs(e.y - py) <= 1);
    setNearbyExit(exit || null);

    const arcadeCab = room.decorations.find(d => {
      if (d.type !== 'arcade_cabinet' || !d.miniGame) return false;
      for (let dy = 0; dy < d.h; dy++) {
        for (let dx = 0; dx < d.w; dx++) {
          const dist = Math.abs((d.x + dx) - px) + Math.abs((d.y + dy) - py);
          if (dist > 0 && dist <= 2) return true;
        }
      }
      return false;
    });
    setNearbyArcade(arcadeCab || null);
  }, [playerPos, room, npcPositions]);

  return (
    <div className="relative flex flex-col items-center" data-testid="game-world">
      <div style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }} className="relative scanlines">
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: CANVAS_W, height: CANVAS_H }} className="relative">
          <PixelTransition active={transitioning} />

          <div
            className="relative overflow-hidden"
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              backgroundColor: room.bgColor,
            }}
          >
        {room.outdoor && <OutdoorEffects />}

        {wallMap.map((row, y) => row.map((cell, x) => {
          if (cell === 1) {
            const isEdge = x === 0 || x === COLS - 1;
            const isTopWall = y === 0;
            if (room.outdoor && isTopWall) {
              return <div key={`w-${x}-${y}`} className="absolute" style={{ left: x * TILE, top: y * TILE, width: TILE, height: TILE }} />;
            }
            return (
              <div key={`w-${x}-${y}`} className="absolute" style={{
                left: x * TILE, top: y * TILE, width: TILE, height: TILE,
                backgroundColor: room.wallColor,
                borderTop: isTopWall ? 'none' : `4px solid ${room.wallHighlight}`,
                borderBottom: '4px solid rgba(0,0,0,0.4)',
                borderLeft: isEdge ? 'none' : `2px solid ${room.wallHighlight}`,
              }}>
                {!room.outdoor && y > 0 && y < 3 && x % 4 === 2 && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-3" style={{ backgroundColor: room.wallHighlight }} />
                )}
                {(x + y) % 3 === 0 && (
                  <div className="absolute" style={{ right: 0, bottom: 0, width: 4, height: 4, backgroundColor: 'rgba(0,0,0,0.15)' }} />
                )}
              </div>
            );
          }
          if (cell === 2) {
            const dec = room.decorations.find(d =>
              x >= d.x && x < d.x + d.w && y >= d.y && y < d.y + d.h
            );
            return (
              <div key={`d-${x}-${y}`} className="absolute" style={{
                left: x * TILE, top: y * TILE, width: TILE, height: TILE,
                backgroundColor: room.floorColor,
              }}>
                {dec && <DecorationTile type={dec.type} color={dec.color} tileX={x} tileY={y} decX={dec.x} decY={dec.y} decW={dec.w} decH={dec.h} />}
              {dec && dec.type === 'arcade_cabinet' && dec.label && x === dec.x && y === dec.y && (
                <div className="absolute -top-6 left-1/2 z-30 whitespace-nowrap" style={{ transform: 'translateX(-25%)' }}>
                  <div className="px-2 py-0.5 text-center" style={{
                    fontFamily: 'var(--font-pixel)', fontSize: '6px',
                    color: nearbyArcade === dec ? '#fbbf24' : dec.color,
                    backgroundColor: '#000',
                    border: `2px solid ${nearbyArcade === dec ? '#fbbf24' : '#555'}`,
                  }}>
                    {dec.label}
                    {nearbyArcade === dec && (
                      <><br /><span style={{ color: '#888' }}>SPACE to play</span></>
                    )}
                  </div>
                </div>
              )}
              </div>
            );
          }
          return (
            <div key={`f-${x}-${y}`} className="absolute" style={{
              left: x * TILE, top: y * TILE, width: TILE, height: TILE,
              backgroundColor: room.floorColor,
            }}>
              {((x + y) % 2 === 0) && (
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
              )}
              {room.outdoor && (x + y * 3) % 5 === 0 && (
                <div className="absolute" style={{ left: 4, top: 4, width: 4, height: 4, backgroundColor: 'rgba(100,180,100,0.2)' }} />
              )}
              {room.outdoor && (x * 7 + y * 3) % 11 === 0 && (
                <div className="absolute" style={{ right: 4, bottom: 4, width: 4, height: 4, backgroundColor: 'rgba(140,200,100,0.15)' }} />
              )}
            </div>
          );
        }))}

        {room.exits.map((exit, i) => {
          const isVertical = exit.y === 0 || exit.y === ROWS - 1;
          const arrowDir = exit.y === 0 ? 'up' : exit.y === ROWS - 1 ? 'down' : exit.x === 0 ? 'left' : 'right';
          const arrowRotation = arrowDir === 'up' ? '-45deg' : arrowDir === 'down' ? '135deg' : arrowDir === 'left' ? '-135deg' : '45deg';

          return (
            <div key={`exit-${i}`} className="absolute z-[8] flex items-center justify-center" style={{
              left: exit.x * TILE, top: exit.y * TILE, width: TILE, height: TILE,
            }}>
              <div className="w-full h-full flex items-center justify-center" style={{
                backgroundColor: nearbyExit === exit ? 'rgba(74,222,128,0.25)' : 'rgba(34,197,94,0.08)',
                border: nearbyExit === exit ? '3px solid #4ade80' : '2px solid rgba(74,222,128,0.3)',
              }}>
                <motion.div
                  animate={{ [isVertical ? 'y' : 'x']: [0, arrowDir === 'up' || arrowDir === 'left' ? -4 : 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="border-t-2 border-r-2 border-green-400"
                  style={{ width: 8, height: 8, transform: `rotate(${arrowRotation})` }}
                />
              </div>
              {nearbyExit === exit && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute left-1/2 z-30"
                  style={{
                    transform: 'translateX(-50%)',
                    ...(exit.y === 0
                      ? { top: TILE + 4 }
                      : exit.y === ROWS - 1
                        ? { bottom: TILE + 4 }
                        : exit.x === 0
                          ? { left: TILE + 4, top: '50%', transform: 'translateY(-50%)' }
                          : { right: -(TILE + 4), left: 'auto', top: '50%', transform: 'translateY(-50%)' }),
                  }}
                >
                  <div className="bg-black border-2 px-2 py-1 whitespace-nowrap" style={{
                    fontFamily: 'var(--font-pixel)', fontSize: '7px', color: '#4ade80',
                    borderColor: '#4ade80',
                  }}>
                    {exit.label}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}

        {room.exits.map((exit, i) => (
          <ExitSparkles key={`sparkle-${i}`} x={exit.x} y={exit.y} />
        ))}

        {room.npcs.map(npc => (
          <NpcSprite
            key={npc.id}
            npc={npc}
            wanderState={npcPositions[npc.id]}
            isNearby={nearbyNpc?.id === npc.id}
            animFrame={animFrame}
            talked={talkedTo?.has(npc.dialogueId)}
            onNpcClick={(clickedNpc) => {
              if (!dialogueOpen) onInteract(clickedNpc.dialogueId);
            }}
          />
        ))}

        <div
          data-testid="player"
          className="absolute z-20"
          style={{
            left: playerPos.x, top: playerPos.y, width: TILE, height: TILE,
            transition: 'all 0.04s linear',
          }}
        >
          <PlayerSprite facing={facing} isMoving={isMoving} stepCount={stepCountRef.current} />
        </div>

        {!room.outdoor && (
          <div className="absolute inset-0 pointer-events-none z-[3]" style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.15) 100%)',
          }} />
        )}

          </div>
        </div>
      </div>

      <div className="md:hidden w-full flex items-center justify-between px-4 py-2" style={{ maxWidth: CANVAS_W * scale }}>
        <div className="flex items-center gap-2">
          <button data-testid="btn-interact" className="w-14 h-14 rounded-full bg-green-700/40 border-2 border-green-500/60 active:bg-green-600/50 flex items-center justify-center text-green-300" style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
            onTouchStart={(e) => {
              e.preventDefault();
              if (nearbyNpc) onInteract(nearbyNpc.dialogueId);
              else if (nearbyArcade && nearbyArcade.miniGame && onMiniGame) onMiniGame(nearbyArcade.miniGame);
              else if (nearbyExit && !transitioning) {
                setTransitioning(true);
                playDoorTransition();
                setTimeout(() => { onRoomChange(nearbyExit.toRoom, nearbyExit.spawnX, nearbyExit.spawnY); setTransitioning(false); }, 600);
              }
            }}
          >{nearbyArcade ? 'PLAY' : 'TALK'}</button>
          {onPause && (
            <button data-testid="btn-pause" className="w-10 h-10 rounded-full bg-white/10 border border-white/30 active:bg-white/20 flex items-center justify-center text-white/60" style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px' }}
              onClick={onPause}
            >| |</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1">
          <div />
          <button data-testid="btn-up" className="w-12 h-12 rounded-md bg-white/10 border border-white/25 active:bg-white/25 flex items-center justify-center text-white/70" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
            onTouchStart={(e) => { e.preventDefault(); keysPressed.current.add('w'); }} onTouchEnd={() => keysPressed.current.delete('w')}>W</button>
          <div />
          <button data-testid="btn-left" className="w-12 h-12 rounded-md bg-white/10 border border-white/25 active:bg-white/25 flex items-center justify-center text-white/70" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
            onTouchStart={(e) => { e.preventDefault(); keysPressed.current.add('a'); }} onTouchEnd={() => keysPressed.current.delete('a')}>A</button>
          <button data-testid="btn-down" className="w-12 h-12 rounded-md bg-white/10 border border-white/25 active:bg-white/25 flex items-center justify-center text-white/70" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
            onTouchStart={(e) => { e.preventDefault(); keysPressed.current.add('s'); }} onTouchEnd={() => keysPressed.current.delete('s')}>S</button>
          <button data-testid="btn-right" className="w-12 h-12 rounded-md bg-white/10 border border-white/25 active:bg-white/25 flex items-center justify-center text-white/70" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
            onTouchStart={(e) => { e.preventDefault(); keysPressed.current.add('d'); }} onTouchEnd={() => keysPressed.current.delete('d')}>D</button>
        </div>
      </div>
    </div>
  );
}
