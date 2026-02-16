import { useEffect, useState, useRef, useCallback } from "react";
import { useEventListener } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";
import { rooms, buildWallMap, TILE, COLS, ROWS, type RoomDef, type NpcDef, type Exit } from "@/lib/gameData";
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

function NpcSprite({ npc, wanderState, isNearby, onNpcClick }: { npc: NpcDef; wanderState?: NpcWanderState; isNearby: boolean; onNpcClick: (npc: NpcDef) => void }) {
  const posX = wanderState ? wanderState.x : npc.x * TILE;
  const posY = wanderState ? wanderState.y : npc.y * TILE;
  const face = wanderState?.facing || 'right';

  return (
    <div
      data-testid={`npc-${npc.id}`}
      className="absolute flex flex-col items-center cursor-pointer z-20"
      style={{
        left: posX, top: posY, width: TILE, height: TILE,
        transition: 'left 0.06s linear, top 0.06s linear',
        transform: face === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
      onClick={() => onNpcClick(npc)}
    >
      <div className="relative" style={{ width: 32, height: 36, transform: face === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5"
          style={{ backgroundColor: npc.skinColor, border: '2px solid rgba(0,0,0,0.3)' }}
        />
        <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1 h-1 bg-black" />
          <div className="w-1 h-1 bg-black" />
        </div>
        <div
          className="absolute top-5 left-1/2 -translate-x-1/2 w-7 h-4"
          style={{ backgroundColor: npc.shirtColor, border: '2px solid rgba(0,0,0,0.2)' }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-2 h-2" style={{ backgroundColor: '#2c3e50' }} />
          <div className="w-2 h-2" style={{ backgroundColor: '#2c3e50' }} />
        </div>
      </div>

      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-30"
        style={{ transform: face === 'left' ? 'scaleX(-1) translateX(50%)' : 'translateX(-50%)' }}
      >
        <div className="bg-black/90 border border-white/40 px-2 py-0.5 text-center" style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', opacity: isNearby ? 1 : 0.7 }}>
          <span className="text-green-400">{npc.name}</span>
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

function OutdoorEffects() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(100,160,220,0.12) 0%, rgba(80,140,200,0.06) 30%, transparent 60%)',
        }}
      />
      {[
        { left: '10%', top: '3%', w: 80, delay: 0 },
        { left: '35%', top: '6%', w: 60, delay: 2 },
        { left: '65%', top: '2%', w: 90, delay: 4 },
        { left: '85%', top: '5%', w: 50, delay: 1 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-[2]"
          style={{ left: cloud.left, top: cloud.top }}
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 20 + cloud.delay * 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="flex gap-0" style={{ opacity: 0.15 }}>
            <div className="rounded-full bg-white" style={{ width: cloud.w * 0.4, height: cloud.w * 0.2 }} />
            <div className="rounded-full bg-white -ml-2" style={{ width: cloud.w * 0.5, height: cloud.w * 0.3, marginTop: -cloud.w * 0.05 }} />
            <div className="rounded-full bg-white -ml-2" style={{ width: cloud.w * 0.35, height: cloud.w * 0.2 }} />
          </div>
        </motion.div>
      ))}
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          boxShadow: 'inset 0 0 60px rgba(100,180,255,0.08)',
        }}
      />
    </>
  );
}

export function GameWorld({ onInteract, currentRoom, onRoomChange, playerStart, dialogueOpen }: GameWorldProps) {
  const room = rooms[currentRoom];
  const [playerPos, setPlayerPos] = useState<Position>({ x: playerStart.x * TILE, y: playerStart.y * TILE });
  const [wallMap, setWallMap] = useState(() => buildWallMap(room));
  const keysPressed = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>();
  const [nearbyNpc, setNearbyNpc] = useState<NpcDef | null>(null);
  const [nearbyExit, setNearbyExit] = useState<Exit | null>(null);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [transitioning, setTransitioning] = useState(false);
  const stepCountRef = useRef(0);
  const [isMoving, setIsMoving] = useState(false);

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
    setPlayerPos({ x: playerStart.x * TILE, y: playerStart.y * TILE });
  }, [playerStart.x, playerStart.y]);

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
            if (room.outdoor) {
              return (
                <div key={`w-${x}-${y}`} className="absolute" style={{
                  left: x * TILE, top: y * TILE, width: TILE, height: TILE,
                  backgroundColor: y === 0 ? 'transparent' : room.wallColor,
                  borderTop: y === 0 ? 'none' : `3px solid ${room.wallHighlight}`,
                  borderLeft: y === 0 ? 'none' : `1px solid ${room.wallHighlight}`,
                }} />
              );
            }
            return (
              <div key={`w-${x}-${y}`} className="absolute" style={{
                left: x * TILE, top: y * TILE, width: TILE, height: TILE,
                backgroundColor: room.wallColor,
                borderTop: `3px solid ${room.wallHighlight}`,
                borderLeft: `1px solid ${room.wallHighlight}`,
              }} />
            );
          }
          if (cell === 2) {
            const dec = room.decorations.find(d =>
              x >= d.x && x < d.x + d.w && y >= d.y && y < d.y + d.h
            );
            return (
              <div key={`d-${x}-${y}`} className="absolute" style={{
                left: x * TILE, top: y * TILE, width: TILE, height: TILE,
                backgroundColor: dec?.color || '#333',
                borderTop: '2px solid rgba(255,255,255,0.1)',
                borderLeft: '1px solid rgba(255,255,255,0.05)',
                boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3)',
              }} />
            );
          }
          return (
            <div key={`f-${x}-${y}`} className="absolute" style={{
              left: x * TILE, top: y * TILE, width: TILE, height: TILE,
              backgroundColor: room.floorColor,
              borderRight: '1px solid rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.02)',
            }} />
          );
        }))}

        {room.exits.map((exit, i) => (
          <div key={`exit-${i}`} className="absolute z-10 flex items-center justify-center" style={{
            left: exit.x * TILE, top: exit.y * TILE, width: TILE, height: TILE,
          }}>
            <div className={`w-full h-full ${nearbyExit === exit ? 'bg-green-500/30' : 'bg-green-900/20'} border border-green-500/40 flex items-center justify-center transition-colors`}>
              <div className="w-3 h-3 border-t-2 border-r-2 border-green-400 rotate-45" style={{ transform: exit.y === 0 ? 'rotate(-45deg)' : exit.y === ROWS - 1 ? 'rotate(135deg)' : exit.x === 0 ? 'rotate(-135deg)' : 'rotate(45deg)' }} />
            </div>
            {nearbyExit === exit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-7 whitespace-nowrap z-30"
              >
                <div className="bg-black/90 border border-green-500/50 px-2 py-0.5" style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', color: '#4ade80' }}>
                  SPACE: {exit.label}
                </div>
              </motion.div>
            )}
          </div>
        ))}

        {room.npcs.map(npc => (
          <NpcSprite
            key={npc.id}
            npc={npc}
            wanderState={npcPositions[npc.id]}
            isNearby={nearbyNpc?.id === npc.id}
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
            transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative" style={{ width: 28, height: 34 }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-amber-200 border-2 border-amber-700/30" />
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-6 h-2 bg-amber-800" style={{ top: '-2px' }} />
              <div className="absolute top-1 left-2 flex gap-1.5">
                <div className="w-1 h-1 bg-black" />
                <div className="w-1 h-1 bg-black" />
              </div>
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-7 h-4 bg-blue-600 border-2 border-blue-900/30" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                <div className="w-2.5 h-2" style={{ backgroundColor: '#2c3e50', transform: isMoving ? `translateY(${Math.sin(stepCountRef.current * 0.3) * 1}px)` : 'none' }} />
                <div className="w-2.5 h-2" style={{ backgroundColor: '#2c3e50', transform: isMoving ? `translateY(${Math.sin(stepCountRef.current * 0.3 + Math.PI) * 1}px)` : 'none' }} />
              </div>
            </div>
          </div>
        </div>
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
