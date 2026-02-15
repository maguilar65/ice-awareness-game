import { useEffect, useState, useRef, useCallback } from "react";
import { useEventListener } from "usehooks-ts";
import { motion } from "framer-motion";
import { GameContent } from "@shared/schema";
import { User, FileText, AlertTriangle } from "lucide-react";

const TILE_SIZE = 48;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;
const MOVEMENT_SPEED = 4;

interface Position {
  x: number;
  y: number;
}

interface Interactable extends Position {
  id: number;
  type: 'npc' | 'object' | 'sign';
  contentId: number;
  label: string;
  iconType: 'person' | 'document' | 'alert';
}

interface GameWorldProps {
  onInteract: (contentId: number) => void;
  contents: GameContent[];
}

const PRESET_LOCATIONS: { x: number; y: number; type: 'npc' | 'object' | 'sign' }[] = [
  { x: 3, y: 3, type: 'npc' },
  { x: 16, y: 3, type: 'sign' },
  { x: 10, y: 2, type: 'object' },
  { x: 3, y: 11, type: 'npc' },
  { x: 16, y: 11, type: 'sign' },
  { x: 8, y: 6, type: 'npc' },
  { x: 14, y: 8, type: 'object' },
  { x: 5, y: 7, type: 'sign' },
  { x: 12, y: 12, type: 'npc' },
  { x: 17, y: 7, type: 'object' },
];

const TYPE_COLORS: Record<string, string> = {
  'npc': 'bg-cyan-400',
  'object': 'bg-rose-400',
  'sign': 'bg-amber-400',
};

const TYPE_LABELS: Record<string, string> = {
  'fact': 'LEARN',
  'story': 'LISTEN',
  'scenario': 'ACT',
};

const generateMap = () => {
  const map = Array(MAP_HEIGHT).fill(0).map(() => Array(MAP_WIDTH).fill(0));

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
        map[y][x] = 1;
      }
    }
  }

  const buildingWalls = [
    [2, 5], [2, 6],
    [17, 5], [17, 6], [18, 5], [18, 6],
    [9, 4], [10, 4], [11, 4],
    [6, 9], [7, 9],
    [13, 10], [14, 10], [15, 10],
  ];
  buildingWalls.forEach(([y, x]) => {
    if (y < MAP_HEIGHT && x < MAP_WIDTH) map[y][x] = 1;
  });

  for (let y = 5; y < 10; y++) {
    for (let x = 8; x < 12; x++) {
      map[y][x] = 0;
    }
  }

  PRESET_LOCATIONS.forEach(loc => {
    map[loc.y][loc.x] = 0;
    if (loc.y > 0) map[loc.y - 1][loc.x] = 0;
    if (loc.y < MAP_HEIGHT - 1) map[loc.y + 1][loc.x] = 0;
    if (loc.x > 0) map[loc.y][loc.x - 1] = 0;
    if (loc.x < MAP_WIDTH - 1) map[loc.y][loc.x + 1] = 0;
  });

  return map;
};

export function GameWorld({ onInteract, contents }: GameWorldProps) {
  const [playerPos, setPlayerPos] = useState<Position>({ x: TILE_SIZE * 10, y: TILE_SIZE * 7 });
  const [map] = useState(generateMap);
  const [interactables, setInteractables] = useState<Interactable[]>([]);
  const keysPressed = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>();
  const [activeZone, setActiveZone] = useState<Interactable | null>(null);
  const [facing, setFacing] = useState<'left' | 'right'>('right');

  useEffect(() => {
    if (contents.length > 0) {
      const newInteractables: Interactable[] = contents.map((content, index) => {
        const loc = PRESET_LOCATIONS[index % PRESET_LOCATIONS.length];
        return {
          id: index,
          x: loc.x * TILE_SIZE,
          y: loc.y * TILE_SIZE,
          type: loc.type,
          contentId: content.id,
          label: TYPE_LABELS[content.type] || 'TALK',
          iconType: content.type === 'story' ? 'person' as const : content.type === 'scenario' ? 'alert' as const : 'document' as const,
        };
      });
      setInteractables(newInteractables);
    }
  }, [contents, map]);

  const handleKeyDown = useCallback(({ key }: KeyboardEvent) => {
    keysPressed.current.add(key.toLowerCase());
  }, []);

  const handleKeyUp = useCallback(({ key }: KeyboardEvent) => {
    keysPressed.current.delete(key.toLowerCase());
    if ((key === ' ' || key === 'Enter') && activeZone) {
      onInteract(activeZone.contentId);
    }
  }, [activeZone, onInteract]);

  useEventListener('keydown', handleKeyDown);
  useEventListener('keyup', handleKeyUp);

  const update = useCallback(() => {
    setPlayerPos((prev) => {
      let dx = 0;
      let dy = 0;

      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) dy -= MOVEMENT_SPEED;
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) dy += MOVEMENT_SPEED;
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) { dx -= MOVEMENT_SPEED; setFacing('left'); }
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) { dx += MOVEMENT_SPEED; setFacing('right'); }

      if (dx === 0 && dy === 0) return prev;

      const nextX = prev.x + dx;
      const nextY = prev.y + dy;

      const tileX = Math.floor((nextX + TILE_SIZE / 2) / TILE_SIZE);
      const tileY = Math.floor((nextY + TILE_SIZE / 2) / TILE_SIZE);

      if (map[tileY] && map[tileY][tileX] === 1) {
        return prev;
      }

      return { x: nextX, y: nextY };
    });

    requestRef.current = requestAnimationFrame(update);
  }, [map]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  useEffect(() => {
    const nearby = interactables.find(obj => {
      const dist = Math.hypot(playerPos.x - obj.x, playerPos.y - obj.y);
      return dist < TILE_SIZE * 1.5;
    });
    setActiveZone(nearby || null);
  }, [playerPos, interactables]);

  return (
    <div className="relative w-full h-full flex justify-center items-center bg-black overflow-hidden shadow-2xl border-4 border-muted" data-testid="game-world">
      <div
        className="relative"
        style={{
          width: MAP_WIDTH * TILE_SIZE,
          height: MAP_HEIGHT * TILE_SIZE,
          backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundColor: '#111827'
        }}
      >
        {map.map((row, y) => row.map((cell, x) => (
          cell === 1 ? (
            <div
              key={`wall-${x}-${y}`}
              className="absolute"
              style={{
                left: x * TILE_SIZE,
                top: y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: '#374151',
                borderTop: '3px solid #4B5563',
                borderLeft: '1px solid #4B5563',
              }}
            />
          ) : null
        )))}

        {interactables.map((obj) => (
          <div
            key={obj.id}
            data-testid={`interactable-${obj.id}`}
            className="absolute flex flex-col items-center justify-center"
            style={{
              left: obj.x,
              top: obj.y,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
          >
            <div className={`w-9 h-9 ${TYPE_COLORS[obj.type]} flex items-center justify-center text-black shadow-[0_0_12px_currentColor] ${activeZone?.id === obj.id ? 'animate-bounce' : 'animate-pulse'}`}>
              {obj.iconType === 'person' && <User className="w-5 h-5" />}
              {obj.iconType === 'document' && <FileText className="w-5 h-5" />}
              {obj.iconType === 'alert' && <AlertTriangle className="w-5 h-5" />}
            </div>

            {activeZone?.id === obj.id && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-10 bg-black/90 text-white px-3 py-1 text-[9px] whitespace-nowrap border border-white/30"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                SPACE: {obj.label}
              </motion.div>
            )}
          </div>
        ))}

        <div
          data-testid="player"
          className="absolute z-10"
          style={{
            left: playerPos.x,
            top: playerPos.y,
            width: TILE_SIZE - 8,
            height: TILE_SIZE - 4,
            transition: 'all 0.05s linear',
            transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
          }}
        >
          <div className="w-full h-full bg-violet-500 border-2 border-white shadow-[0_0_16px_rgba(139,92,246,0.6)]">
            <div className="absolute top-2 left-1.5 w-2 h-2 bg-white" />
            <div className="absolute top-2 right-3 w-2 h-2 bg-white" />
            <div className="absolute bottom-1 left-2 right-2 h-1 bg-white/50" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 grid grid-cols-3 gap-1.5 md:hidden">
        <div />
        <button
          data-testid="btn-up"
          className="w-11 h-11 bg-white/10 border border-white/30 active:bg-white/30 flex items-center justify-center text-white"
          onTouchStart={() => keysPressed.current.add('w')}
          onTouchEnd={() => keysPressed.current.delete('w')}
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
        >W</button>
        <div />
        <button
          data-testid="btn-left"
          className="w-11 h-11 bg-white/10 border border-white/30 active:bg-white/30 flex items-center justify-center text-white"
          onTouchStart={() => keysPressed.current.add('a')}
          onTouchEnd={() => keysPressed.current.delete('a')}
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
        >A</button>
        <button
          data-testid="btn-down"
          className="w-11 h-11 bg-white/10 border border-white/30 active:bg-white/30 flex items-center justify-center text-white"
          onTouchStart={() => keysPressed.current.add('s')}
          onTouchEnd={() => keysPressed.current.delete('s')}
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
        >S</button>
        <button
          data-testid="btn-right"
          className="w-11 h-11 bg-white/10 border border-white/30 active:bg-white/30 flex items-center justify-center text-white"
          onTouchStart={() => keysPressed.current.add('d')}
          onTouchEnd={() => keysPressed.current.delete('d')}
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
        >D</button>
      </div>

      <div className="absolute bottom-6 left-6 md:hidden">
        <button
          data-testid="btn-interact"
          className="w-14 h-14 bg-violet-500/30 border-2 border-violet-400/60 active:bg-violet-500/50 flex items-center justify-center text-violet-200"
          onTouchStart={() => {
            if (activeZone) onInteract(activeZone.contentId);
          }}
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px' }}
        >
          ACT
        </button>
      </div>
    </div>
  );
}
