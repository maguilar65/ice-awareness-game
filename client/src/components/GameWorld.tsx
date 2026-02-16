import { useEffect, useState, useRef, useCallback } from "react";
import { useEventListener } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";
import { rooms, buildWallMap, findSafeSpawn, TILE, COLS, ROWS, type NpcDef, type Exit } from "@/lib/gameData";
import { playFootstep, playDoorTransition } from "@/lib/audioEngine";

const SPEED = 3;

interface Position { x: number; y: number; }

interface GameWorldProps {
  onInteract: (dialogueId: string) => void;
  currentRoom: string;
  onRoomChange: (roomId: string, spawnX: number, spawnY: number) => void;
  playerStart: Position;
  dialogueOpen: boolean;
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

  switch (type) {
    case 'table':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: color }}>
          <div className="absolute inset-0" style={{ borderTop: isTop ? '3px solid rgba(255,255,255,0.15)' : 'none', borderLeft: isLeft ? '2px solid rgba(255,255,255,0.1)' : 'none', borderRight: isRight ? '2px solid rgba(0,0,0,0.3)' : 'none', borderBottom: isBottom ? '3px solid rgba(0,0,0,0.3)' : 'none' }} />
          <div className="absolute inset-1" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
        </div>
      );
    case 'desk':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: color }}>
          <div className="absolute inset-0" style={{ borderTop: '3px solid rgba(255,255,255,0.12)', borderLeft: isLeft ? '2px solid rgba(255,255,255,0.08)' : 'none', borderBottom: '2px solid rgba(0,0,0,0.3)' }} />
          {isTop && <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-1" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />}
        </div>
      );
    case 'bookshelf':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: color }}>
          <div className="absolute inset-0" style={{ borderTop: '2px solid rgba(255,255,255,0.1)', borderLeft: isLeft ? '2px solid rgba(255,255,255,0.06)' : 'none', borderRight: isRight ? '2px solid rgba(0,0,0,0.2)' : 'none' }} />
          <div className="absolute top-1 left-1 right-1 h-2" style={{ backgroundColor: '#c0392b', opacity: 0.6 }} />
          <div className="absolute top-4 left-1 right-1 h-2" style={{ backgroundColor: '#2980b9', opacity: 0.5 }} />
          <div className="absolute bottom-2 left-1 right-1 h-2" style={{ backgroundColor: '#27ae60', opacity: 0.4 }} />
          {relX % 2 === 0 && <div className="absolute top-2 left-2 w-1.5 h-3" style={{ backgroundColor: '#f1c40f', opacity: 0.4 }} />}
        </div>
      );
    case 'bench':
      return (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-3" style={{ backgroundColor: color, borderTop: '2px solid rgba(255,255,255,0.12)' }} />
          {isLeft && <div className="absolute top-3 left-1 w-2 h-full" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />}
          {isRight && <div className="absolute top-3 right-1 w-2 h-full" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />}
        </div>
      );
    case 'plant':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-6 h-7">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-3" style={{ backgroundColor: '#5c3a1e', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full" style={{ backgroundColor: color, boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(100,255,100,0.15)' }} />
            {relX === 0 && <div className="absolute top-1 left-0 w-2 h-2 rounded-full" style={{ backgroundColor: color, opacity: 0.7 }} />}
          </div>
        </div>
      );
    case 'fountain':
      return (
        <div className="absolute inset-0">
          <div className="absolute inset-1 rounded-sm" style={{ backgroundColor: '#4a6a8a', border: '2px solid #5a7a9a', boxShadow: 'inset 0 0 8px rgba(100,180,255,0.3)' }} />
          {isTop && relX === Math.floor(decW / 2) && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-3" style={{ backgroundColor: '#7ab8e0', opacity: 0.7, boxShadow: '0 0 6px rgba(100,200,255,0.5)' }} />
          )}
        </div>
      );
    case 'bed':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: '#4a4a5a' }}>
          <div className="absolute inset-0" style={{ borderTop: '2px solid rgba(255,255,255,0.08)' }} />
          {isLeft && <div className="absolute top-1 left-1 w-3 h-3 rounded-sm" style={{ backgroundColor: '#ddd', opacity: 0.3 }} />}
          <div className="absolute top-2 left-0 right-0 bottom-1" style={{ backgroundColor: '#3a5a7a', opacity: 0.5, borderTop: '1px solid rgba(255,255,255,0.1)' }} />
        </div>
      );
    case 'counter':
    case 'shelves':
      return (
        <div className="absolute inset-0" style={{ backgroundColor: color }}>
          <div className="absolute inset-0" style={{ borderTop: '2px solid rgba(255,255,255,0.12)', borderLeft: isLeft ? '1px solid rgba(255,255,255,0.06)' : 'none', borderBottom: '2px solid rgba(0,0,0,0.25)' }} />
          {type === 'shelves' && (
            <>
              <div className="absolute top-2 left-1 right-1 h-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
              <div className="absolute bottom-3 left-1 right-1 h-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
            </>
          )}
        </div>
      );
    case 'fence':
      return (
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="w-full h-3/4 flex justify-around">
            <div className="w-1.5 h-full" style={{ backgroundColor: color }} />
            <div className="w-1.5 h-full" style={{ backgroundColor: color }} />
          </div>
          <div className="absolute top-1/4 left-0 right-0 h-1" style={{ backgroundColor: color, opacity: 0.8 }} />
          <div className="absolute top-1/2 left-0 right-0 h-1" style={{ backgroundColor: color, opacity: 0.8 }} />
        </div>
      );
    default:
      return (
        <div className="absolute inset-0" style={{ backgroundColor: color, borderTop: '2px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3)' }} />
      );
  }
}

function NpcSprite({ npc, wanderState, isNearby, onNpcClick, animFrame }: { npc: NpcDef; wanderState?: NpcWanderState; isNearby: boolean; onNpcClick: (npc: NpcDef) => void; animFrame: number }) {
  const posX = wanderState ? wanderState.x : npc.x * TILE;
  const posY = wanderState ? wanderState.y : npc.y * TILE;
  const face = wanderState?.facing || 'right';
  const isWalking = wanderState ? (Math.abs(wanderState.targetX - wanderState.x) > 2 || Math.abs(wanderState.targetY - wanderState.y) > 2) : false;
  const bobY = isWalking ? Math.sin(animFrame * 0.15) * 1.5 : 0;
  const legAnim = isWalking ? Math.sin(animFrame * 0.2) * 2 : 0;

  const darkerSkin = adjustColor(npc.skinColor, -20);
  const darkerShirt = adjustColor(npc.shirtColor, -30);

  return (
    <div
      data-testid={`npc-${npc.id}`}
      className="absolute flex flex-col items-center cursor-pointer z-20"
      style={{
        left: posX, top: posY + bobY, width: TILE, height: TILE,
        transition: 'left 0.06s linear, top 0.06s linear',
      }}
      onClick={() => onNpcClick(npc)}
    >
      <div className="relative" style={{ width: 32, height: 38, transform: face === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: 14, height: 14, backgroundColor: npc.skinColor, border: `2px solid ${darkerSkin}`, borderRadius: '2px' }}>
          <div className="absolute top-2 left-1 w-1.5 h-1.5 bg-black rounded-full" style={{ boxShadow: '0 0 1px rgba(255,255,255,0.5)' }} />
          <div className="absolute top-2 right-1 w-1.5 h-1.5 bg-black rounded-full" style={{ boxShadow: '0 0 1px rgba(255,255,255,0.5)' }} />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5" style={{ backgroundColor: darkerSkin }} />
        </div>
        <div className="absolute" style={{ top: -2, left: '50%', transform: 'translateX(-50%)', width: 16, height: 6, backgroundColor: '#2c2c2c', borderRadius: '2px 2px 0 0' }} />
        <div className="absolute" style={{ top: 14, left: '50%', transform: 'translateX(-50%)', width: 18, height: 12, backgroundColor: npc.shirtColor, border: `2px solid ${darkerShirt}`, borderRadius: '1px' }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)` }} />
        </div>
        <div className="absolute" style={{ top: 18, left: 4, width: 5, height: 7, backgroundColor: npc.skinColor, border: `1px solid ${darkerSkin}`, borderRadius: '1px' }} />
        <div className="absolute" style={{ top: 18, right: 4, width: 5, height: 7, backgroundColor: npc.skinColor, border: `1px solid ${darkerSkin}`, borderRadius: '1px' }} />
        <div className="absolute" style={{ bottom: 0, left: 7, width: 7, height: 6, backgroundColor: '#34495e', border: '1px solid #2c3e50', borderRadius: '1px', transform: `translateY(${legAnim}px)` }} />
        <div className="absolute" style={{ bottom: 0, right: 7, width: 7, height: 6, backgroundColor: '#34495e', border: '1px solid #2c3e50', borderRadius: '1px', transform: `translateY(${-legAnim}px)` }} />
        <div className="absolute" style={{ bottom: -1, left: 6, width: 8, height: 3, backgroundColor: '#1a1a1a', borderRadius: '1px', transform: `translateY(${legAnim}px)` }} />
        <div className="absolute" style={{ bottom: -1, right: 6, width: 8, height: 3, backgroundColor: '#1a1a1a', borderRadius: '1px', transform: `translateY(${-legAnim}px)` }} />
      </div>

      <div
        className="absolute -top-8 left-1/2 whitespace-nowrap z-30"
        style={{ transform: 'translateX(-50%)' }}
      >
        <div className="bg-black/90 border px-2 py-0.5 text-center" style={{
          fontFamily: 'var(--font-pixel)', fontSize: '7px',
          borderColor: isNearby ? 'rgba(74,222,128,0.7)' : 'rgba(255,255,255,0.3)',
          opacity: isNearby ? 1 : 0.75,
          boxShadow: isNearby ? '0 0 8px rgba(74,222,128,0.3)' : 'none',
        }}>
          <span style={{ color: isNearby ? '#4ade80' : '#a0d0a0' }}>{npc.name}</span>
          {isNearby && (
            <>
              <br />
              <span className="text-white/60">SPACE to talk</span>
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
          <div className="flex gap-0" style={{ opacity: 0.12 }}>
            <div className="rounded-full bg-white" style={{ width: cloud.w * 0.4, height: cloud.w * 0.2 }} />
            <div className="rounded-full bg-white -ml-3" style={{ width: cloud.w * 0.55, height: cloud.w * 0.3, marginTop: -cloud.w * 0.06 }} />
            <div className="rounded-full bg-white -ml-3" style={{ width: cloud.w * 0.38, height: cloud.w * 0.22 }} />
          </div>
        </motion.div>
      ))}
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{ boxShadow: 'inset 0 0 80px rgba(100,180,255,0.06)' }}
      />
    </>
  );
}

function PlayerSprite({ facing, isMoving, stepCount }: { facing: 'left' | 'right'; isMoving: boolean; stepCount: number }) {
  const bobY = isMoving ? Math.sin(stepCount * 0.3) * 1.5 : 0;
  const legAnim = isMoving ? Math.sin(stepCount * 0.25) * 2.5 : 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
      <div className="relative" style={{ width: 30, height: 38, transform: `translateY(${bobY}px)` }}>
        <div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, backgroundColor: '#f5d0a9', border: '2px solid #c9a57a', borderRadius: '2px' }}>
          <div className="absolute top-2 left-1 w-1.5 h-1.5 bg-black rounded-full" style={{ boxShadow: '0 0 2px rgba(255,255,255,0.4)' }} />
          <div className="absolute top-2 right-1 w-1.5 h-1.5 bg-black rounded-full" style={{ boxShadow: '0 0 2px rgba(255,255,255,0.4)' }} />
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-red-400/50 rounded-full" />
        </div>
        <div className="absolute" style={{ top: -3, left: '50%', transform: 'translateX(-50%)', width: 16, height: 7, backgroundColor: '#4a2800', borderRadius: '3px 3px 0 0', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.1)' }} />
        <div className="absolute" style={{ top: 14, left: '50%', transform: 'translateX(-50%)', width: 18, height: 12, backgroundColor: '#2563eb', border: '2px solid #1d4ed8', borderRadius: '1px' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
        </div>
        <div className="absolute" style={{ top: 18, left: 3, width: 5, height: 7, backgroundColor: '#f5d0a9', border: '1px solid #c9a57a', borderRadius: '1px' }} />
        <div className="absolute" style={{ top: 18, right: 3, width: 5, height: 7, backgroundColor: '#f5d0a9', border: '1px solid #c9a57a', borderRadius: '1px' }} />
        <div className="absolute" style={{ bottom: 0, left: 7, width: 7, height: 7, backgroundColor: '#374151', border: '1px solid #1f2937', borderRadius: '1px', transform: `translateY(${legAnim}px)` }} />
        <div className="absolute" style={{ bottom: 0, right: 7, width: 7, height: 7, backgroundColor: '#374151', border: '1px solid #1f2937', borderRadius: '1px', transform: `translateY(${-legAnim}px)` }} />
        <div className="absolute" style={{ bottom: -1, left: 6, width: 8, height: 3, backgroundColor: '#b91c1c', borderRadius: '1px', transform: `translateY(${legAnim}px)` }} />
        <div className="absolute" style={{ bottom: -1, right: 6, width: 8, height: 3, backgroundColor: '#b91c1c', borderRadius: '1px', transform: `translateY(${-legAnim}px)` }} />
      </div>
    </div>
  );
}

export function GameWorld({ onInteract, currentRoom, onRoomChange, playerStart, dialogueOpen }: GameWorldProps) {
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

  const interactRef = useRef(false);

  const handleKeyDown = useCallback(({ key }: KeyboardEvent) => {
    if (dialogueOpen) return;
    keysPressed.current.add(key.toLowerCase());
    if ((key === ' ' || key === 'Enter' || key === 'Space') && !interactRef.current) {
      interactRef.current = true;
      if (nearbyNpc) {
        onInteract(nearbyNpc.dialogueId);
      } else if (nearbyExit && !transitioning) {
        setTransitioning(true);
        playDoorTransition();
        setTimeout(() => {
          onRoomChange(nearbyExit.toRoom, nearbyExit.spawnX, nearbyExit.spawnY);
          setTransitioning(false);
        }, 300);
      }
    }
  }, [dialogueOpen, nearbyNpc, nearbyExit, onInteract, onRoomChange, transitioning]);

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
  }, [playerPos, room, npcPositions]);

  return (
    <div className="relative scanlines" data-testid="game-world">
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>

      <div
        className="relative overflow-hidden"
        style={{
          width: COLS * TILE,
          height: ROWS * TILE,
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
                borderTop: isTopWall ? 'none' : `3px solid ${room.wallHighlight}`,
                borderLeft: isEdge ? 'none' : `1px solid ${room.wallHighlight}`,
                boxShadow: room.outdoor ? 'none' : 'inset 0 -2px 4px rgba(0,0,0,0.2)',
              }}>
                {!room.outdoor && y > 0 && y < 3 && x % 4 === 2 && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-2" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
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
              </div>
            );
          }
          return (
            <div key={`f-${x}-${y}`} className="absolute" style={{
              left: x * TILE, top: y * TILE, width: TILE, height: TILE,
              backgroundColor: room.floorColor,
            }}>
              {((x + y) % 2 === 0) && (
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.015)' }} />
              )}
              {room.outdoor && (x + y * 3) % 7 === 0 && (
                <div className="absolute" style={{ left: '30%', top: '40%', width: 3, height: 3, backgroundColor: 'rgba(100,180,100,0.15)', borderRadius: '50%' }} />
              )}
            </div>
          );
        }))}

        {room.exits.map((exit, i) => {
          const isVertical = exit.y === 0 || exit.y === ROWS - 1;
          const arrowDir = exit.y === 0 ? 'up' : exit.y === ROWS - 1 ? 'down' : exit.x === 0 ? 'left' : 'right';
          const arrowRotation = arrowDir === 'up' ? '-45deg' : arrowDir === 'down' ? '135deg' : arrowDir === 'left' ? '-135deg' : '45deg';

          return (
            <div key={`exit-${i}`} className="absolute z-10 flex items-center justify-center" style={{
              left: exit.x * TILE, top: exit.y * TILE, width: TILE, height: TILE,
            }}>
              <div className={`w-full h-full flex items-center justify-center transition-all duration-200`} style={{
                backgroundColor: nearbyExit === exit ? 'rgba(74,222,128,0.25)' : 'rgba(34,197,94,0.08)',
                border: nearbyExit === exit ? '2px solid rgba(74,222,128,0.6)' : '1px solid rgba(74,222,128,0.25)',
                boxShadow: nearbyExit === exit ? '0 0 12px rgba(74,222,128,0.3)' : 'none',
              }}>
                <motion.div
                  animate={{ [isVertical ? 'y' : 'x']: [0, arrowDir === 'up' || arrowDir === 'left' ? -3 : 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-3 h-3 border-t-2 border-r-2 border-green-400"
                  style={{ transform: `rotate(${arrowRotation})` }}
                />
              </div>
              {nearbyExit === exit && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 whitespace-nowrap z-30"
                >
                  <div className="bg-black/95 border border-green-500/60 px-2 py-1" style={{
                    fontFamily: 'var(--font-pixel)', fontSize: '6px', color: '#4ade80',
                    boxShadow: '0 0 10px rgba(74,222,128,0.2)',
                  }}>
                    SPACE: {exit.label}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}

        {room.npcs.map(npc => (
          <NpcSprite
            key={npc.id}
            npc={npc}
            wanderState={npcPositions[npc.id]}
            isNearby={nearbyNpc?.id === npc.id}
            animFrame={animFrame}
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

      <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-1 md:hidden z-40">
        <div />
        <button data-testid="btn-up" className="w-10 h-10 bg-white/10 border border-white/20 active:bg-white/25 flex items-center justify-center text-white/70" style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
          onTouchStart={() => keysPressed.current.add('w')} onTouchEnd={() => keysPressed.current.delete('w')}>W</button>
        <div />
        <button data-testid="btn-left" className="w-10 h-10 bg-white/10 border border-white/20 active:bg-white/25 flex items-center justify-center text-white/70" style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
          onTouchStart={() => keysPressed.current.add('a')} onTouchEnd={() => keysPressed.current.delete('a')}>A</button>
        <button data-testid="btn-down" className="w-10 h-10 bg-white/10 border border-white/20 active:bg-white/25 flex items-center justify-center text-white/70" style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
          onTouchStart={() => keysPressed.current.add('s')} onTouchEnd={() => keysPressed.current.delete('s')}>S</button>
        <button data-testid="btn-right" className="w-10 h-10 bg-white/10 border border-white/20 active:bg-white/25 flex items-center justify-center text-white/70" style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
          onTouchStart={() => keysPressed.current.add('d')} onTouchEnd={() => keysPressed.current.delete('d')}>D</button>
      </div>

      <div className="absolute bottom-4 left-4 md:hidden z-40">
        <button data-testid="btn-interact" className="w-12 h-12 bg-green-700/30 border-2 border-green-500/50 active:bg-green-600/40 flex items-center justify-center text-green-300" style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px' }}
          onTouchStart={() => {
            if (nearbyNpc) onInteract(nearbyNpc.dialogueId);
            else if (nearbyExit && !transitioning) {
              setTransitioning(true);
              playDoorTransition();
              setTimeout(() => { onRoomChange(nearbyExit.toRoom, nearbyExit.spawnX, nearbyExit.spawnY); setTransitioning(false); }, 300);
            }
          }}
        >TALK</button>
      </div>
    </div>
  );
}
