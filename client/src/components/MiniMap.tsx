import { useMemo } from "react";
import { rooms, COLS, ROWS, TILE } from "@/lib/gameData";

interface MiniMapProps {
  currentRoom: string;
  playerPos: { x: number; y: number };
  talkedTo: Set<string>;
  nextRoom?: string | null;
}

const MAP_SCALE = 3;
const MAP_W = COLS * MAP_SCALE;
const MAP_H = ROWS * MAP_SCALE;

const WORLD_LAYOUT: Record<string, { wx: number; wy: number }> = {
  school: { wx: 0, wy: 0 },
  community_center: { wx: 1, wy: 0 },
  courthouse: { wx: 2, wy: 0 },
  library: { wx: 3, wy: 0 },
  main_street: { wx: 0, wy: 1 },
  neighborhood: { wx: 1, wy: 1 },
  park: { wx: 2, wy: 1 },
  shelter: { wx: 3, wy: 1 },
  arcade: { wx: 0, wy: 2 },
  home: { wx: 1, wy: 2 },
};

const GRID_COLS = 4;
const GRID_ROWS = 3;

export function MiniMap({ currentRoom, playerPos, talkedTo, nextRoom }: MiniMapProps) {
  const room = rooms[currentRoom];
  if (!room) return null;

  const px = Math.floor(playerPos.x / TILE);
  const py = Math.floor(playerPos.y / TILE);

  const worldRooms = useMemo(() => Object.keys(rooms), []);

  const cellW = Math.floor(MAP_W / GRID_COLS);
  const cellH = Math.floor(cellW * 0.6);
  const worldH = cellH * GRID_ROWS;

  return (
    <div className="flex flex-col gap-1" data-testid="mini-map" style={{ imageRendering: 'pixelated' as const }}>
      <div className="relative" style={{
        width: MAP_W, height: MAP_H,
        backgroundColor: room.floorColor,
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 0 4px rgba(0,0,0,0.5)',
      }}>
        {room.decorations.map((dec, i) => (
          <div key={`d-${i}`} className="absolute" style={{
            left: dec.x * MAP_SCALE,
            top: dec.y * MAP_SCALE,
            width: dec.w * MAP_SCALE,
            height: dec.h * MAP_SCALE,
            backgroundColor: dec.type === 'arcade_cabinet' ? dec.color + '88' : 'rgba(255,255,255,0.08)',
          }} />
        ))}

        {room.exits.map((exit, i) => {
          const isNextRoomExit = nextRoom && exit.toRoom === nextRoom && nextRoom !== currentRoom;
          return (
            <div key={`e-${i}`} className="absolute" style={{
              left: exit.x * MAP_SCALE,
              top: exit.y * MAP_SCALE,
              width: MAP_SCALE,
              height: MAP_SCALE,
              backgroundColor: isNextRoomExit ? '#f472b6' : '#fbbf24',
              boxShadow: isNextRoomExit ? '0 0 4px rgba(244,114,182,0.8)' : '0 0 2px rgba(251,191,36,0.5)',
              animation: isNextRoomExit ? 'minimap-pulse 1s ease-in-out infinite' : 'none',
            }} />
          );
        })}

        {room.npcs.map(npc => {
          const talked = talkedTo.has(npc.dialogueId);
          return (
            <div key={npc.id} className="absolute" style={{
              left: npc.x * MAP_SCALE,
              top: npc.y * MAP_SCALE,
              width: MAP_SCALE,
              height: MAP_SCALE,
              backgroundColor: talked ? '#4ade80' : '#60a5fa',
              boxShadow: talked ? 'none' : '0 0 2px rgba(96,165,250,0.5)',
            }} />
          );
        })}

        <div className="absolute" style={{
          left: px * MAP_SCALE,
          top: py * MAP_SCALE,
          width: MAP_SCALE,
          height: MAP_SCALE,
          backgroundColor: '#fff',
          boxShadow: '0 0 3px rgba(255,255,255,0.7)',
        }} />
      </div>

      <div className="relative" style={{ width: MAP_W, height: worldH }}>
        {worldRooms.map(roomId => {
          const pos = WORLD_LAYOUT[roomId];
          if (!pos) return null;
          const isCurrent = roomId === currentRoom;
          const isNext = roomId === nextRoom && nextRoom !== currentRoom;
          return (
            <div key={roomId} className="absolute" style={{
              left: pos.wx * cellW,
              top: pos.wy * cellH,
              width: cellW - 1,
              height: cellH - 1,
              backgroundColor: isCurrent ? 'rgba(74,222,128,0.25)' : isNext ? 'rgba(244,114,182,0.2)' : 'rgba(255,255,255,0.06)',
              border: isCurrent ? '1px solid rgba(74,222,128,0.5)' : isNext ? '1px solid rgba(244,114,182,0.5)' : '1px solid rgba(255,255,255,0.1)',
              animation: isNext ? 'minimap-pulse 1.5s ease-in-out infinite' : 'none',
            }}>
              <span className="absolute inset-0 flex items-center justify-center" style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '3px',
                color: isCurrent ? '#4ade80' : isNext ? '#f472b6' : 'rgba(255,255,255,0.3)',
                lineHeight: 1,
                textAlign: 'center',
                overflow: 'hidden',
              }}>
                {rooms[roomId]?.name?.split(' ')[0]?.substring(0, 4) || ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
