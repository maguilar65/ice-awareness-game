import { useEffect, useState, useRef, useCallback } from "react";
import { useEventListener } from "usehooks-ts";
import { motion } from "framer-motion";
import { GameContent } from "@shared/schema";

// Game Constants
const TILE_SIZE = 48; // px
const MAP_WIDTH = 20; // tiles
const MAP_HEIGHT = 15; // tiles
const MOVEMENT_SPEED = 4; // pixels per frame

interface Position {
  x: number;
  y: number;
}

interface Interactable extends Position {
  id: number;
  type: 'npc' | 'object';
  contentId: number;
  label: string;
}

interface GameWorldProps {
  onInteract: (contentId: number) => void;
  contents: GameContent[];
}

// Generate a simple map layout (1 = wall, 0 = floor)
const generateMap = () => {
  const map = Array(MAP_HEIGHT).fill(0).map(() => Array(MAP_WIDTH).fill(0));
  
  // Create walls
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
        map[y][x] = 1; // Border walls
      } else if (Math.random() > 0.85) {
        map[y][x] = 1; // Random obstacles
      }
    }
  }
  
  // Clear center spawn area
  for (let y = 5; y < 10; y++) {
    for (let x = 8; x < 12; x++) {
      map[y][x] = 0;
    }
  }
  
  return map;
};

export function GameWorld({ onInteract, contents }: GameWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPos, setPlayerPos] = useState<Position>({ x: TILE_SIZE * 10, y: TILE_SIZE * 7 });
  const [map] = useState(generateMap());
  const [interactables, setInteractables] = useState<Interactable[]>([]);
  const keysPressed = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>();
  const [activeZone, setActiveZone] = useState<Interactable | null>(null);

  // Initialize interactables based on fetched content
  useEffect(() => {
    if (contents.length > 0) {
      const newInteractables: Interactable[] = contents.map((content, index) => {
        // Simple algorithm to place them in valid spots
        let x, y;
        do {
          x = Math.floor(Math.random() * (MAP_WIDTH - 2) + 1);
          y = Math.floor(Math.random() * (MAP_HEIGHT - 2) + 1);
        } while (map[y][x] === 1); // Avoid walls

        return {
          id: index,
          x: x * TILE_SIZE,
          y: y * TILE_SIZE,
          type: index % 2 === 0 ? 'npc' : 'object',
          contentId: content.id,
          label: content.type === 'story' ? 'Story' : 'Fact',
        };
      });
      setInteractables(newInteractables);
    }
  }, [contents, map]);

  // Input handling
  const handleKeyDown = useCallback(({ key }: KeyboardEvent) => {
    keysPressed.current.add(key.toLowerCase());
  }, []);

  const handleKeyUp = useCallback(({ key }: KeyboardEvent) => {
    keysPressed.current.delete(key.toLowerCase());
    
    // Interaction logic on Space/Enter
    if ((key === ' ' || key === 'Enter') && activeZone) {
      onInteract(activeZone.contentId);
    }
  }, [activeZone, onInteract]);

  useEventListener('keydown', handleKeyDown);
  useEventListener('keyup', handleKeyUp);

  // Game Loop
  const update = useCallback(() => {
    setPlayerPos((prev) => {
      let dx = 0;
      let dy = 0;

      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) dy -= MOVEMENT_SPEED;
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) dy += MOVEMENT_SPEED;
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) dx -= MOVEMENT_SPEED;
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) dx += MOVEMENT_SPEED;

      if (dx === 0 && dy === 0) return prev;

      const nextX = prev.x + dx;
      const nextY = prev.y + dy;

      // Collision detection (simple bounding box vs tile center)
      // Check the tile the player is trying to move into (center point)
      const tileX = Math.floor((nextX + TILE_SIZE/2) / TILE_SIZE);
      const tileY = Math.floor((nextY + TILE_SIZE/2) / TILE_SIZE);

      if (map[tileY] && map[tileY][tileX] === 1) {
        return prev; // Collision with wall
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

  // Check for nearby interactables
  useEffect(() => {
    const nearby = interactables.find(obj => {
      const dist = Math.hypot(playerPos.x - obj.x, playerPos.y - obj.y);
      return dist < TILE_SIZE * 1.2;
    });
    setActiveZone(nearby || null);
  }, [playerPos, interactables]);

  return (
    <div className="relative w-full h-full flex justify-center items-center bg-black overflow-hidden shadow-2xl border-8 border-muted rounded-lg">
      <div 
        className="relative transition-transform duration-75 ease-linear will-change-transform"
        style={{ 
          width: MAP_WIDTH * TILE_SIZE, 
          height: MAP_HEIGHT * TILE_SIZE,
          // Simple styling for map tiles
          backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundColor: '#1a1a2e'
        }}
      >
        {/* Render Map Walls */}
        {map.map((row, y) => row.map((cell, x) => (
          cell === 1 ? (
            <div 
              key={`wall-${x}-${y}`} 
              className="absolute bg-slate-700 border-t-4 border-slate-600 shadow-lg"
              style={{
                left: x * TILE_SIZE,
                top: y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
            />
          ) : null
        )))}

        {/* Render Interactables */}
        {interactables.map((obj) => (
          <div
            key={obj.id}
            className="absolute flex flex-col items-center justify-center"
            style={{
              left: obj.x,
              top: obj.y,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
          >
            {/* Object Sprite */}
            <div className={`w-8 h-8 rounded-full ${obj.type === 'npc' ? 'bg-secondary animate-bounce' : 'bg-accent animate-pulse'} shadow-[0_0_15px_currentColor]`} />
            
            {/* Interaction Prompt */}
            {activeZone?.id === obj.id && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-10 bg-black/80 text-white px-3 py-1 text-[10px] font-pixel whitespace-nowrap border border-white/20 rounded"
              >
                PRESS SPACE
              </motion.div>
            )}
          </div>
        ))}

        {/* Render Player */}
        <div 
          className="absolute z-10 w-10 h-10 bg-primary rounded-sm shadow-[0_0_20px_rgba(124,58,237,0.5)] border-2 border-white"
          style={{
            left: playerPos.x,
            top: playerPos.y,
            transition: 'all 0.05s linear' // Smooth out the frame updates slightly
          }}
        >
          {/* Simple eyes for directionality hint */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-black rounded-full" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full" />
        </div>

      </div>

      {/* Mobile Controls Overlay (visible only on small screens) */}
      <div className="absolute bottom-8 right-8 grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button 
          className="w-12 h-12 bg-white/10 rounded-full border border-white/30 active:bg-white/30"
          onTouchStart={() => keysPressed.current.add('w')}
          onTouchEnd={() => keysPressed.current.delete('w')}
        >↑</button>
        <div />
        <button 
          className="w-12 h-12 bg-white/10 rounded-full border border-white/30 active:bg-white/30"
          onTouchStart={() => keysPressed.current.add('a')}
          onTouchEnd={() => keysPressed.current.delete('a')}
        >←</button>
        <button 
          className="w-12 h-12 bg-white/10 rounded-full border border-white/30 active:bg-white/30"
          onTouchStart={() => keysPressed.current.add('s')}
          onTouchEnd={() => keysPressed.current.delete('s')}
        >↓</button>
        <button 
          className="w-12 h-12 bg-white/10 rounded-full border border-white/30 active:bg-white/30"
          onTouchStart={() => keysPressed.current.add('d')}
          onTouchEnd={() => keysPressed.current.delete('d')}
        >→</button>
      </div>

      <div className="absolute bottom-8 left-8 md:hidden">
         <button 
          className="w-16 h-16 bg-red-500/20 rounded-full border-2 border-red-500/50 active:bg-red-500/40 font-pixel text-xs text-red-200"
          onTouchStart={() => {
            if (activeZone) onInteract(activeZone.contentId);
          }}
        >
          ACT
        </button>
      </div>
    </div>
  );
}
