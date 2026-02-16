export interface RoomDef {
  id: string;
  name: string;
  bgColor: string;
  floorColor: string;
  wallColor: string;
  wallHighlight: string;
  outdoor?: boolean;
  exits: Exit[];
  npcs: NpcDef[];
  decorations: Decoration[];
}

export interface Exit {
  x: number;
  y: number;
  toRoom: string;
  spawnX: number;
  spawnY: number;
  label: string;
}

export interface NpcDef {
  id: string;
  name: string;
  x: number;
  y: number;
  skinColor: string;
  shirtColor: string;
  dialogueId: string;
}

export interface Decoration {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  type: 'table' | 'desk' | 'bench' | 'plant' | 'bookshelf' | 'fence' | 'crate' | 'counter' | 'fountain' | 'statue' | 'shelves' | 'bed' | 'chair' | 'arcade_cabinet';
  label?: string;
  miniGame?: string;
}

export const TILE = 40;
export const COLS = 16;
export const ROWS = 12;

export const CHAPTER_INTRO = {
  title: "CHAPTER 1: THE NEIGHBORHOOD",
  text: "Something has changed in Esperanza. ICE has been spotted in the neighborhood. People are scared. Walk around. Talk to your neighbors. Learn what is happening — and what you can do about it.",
};

export const rooms: Record<string, RoomDef> = {
  neighborhood: {
    id: "neighborhood",
    name: "Esperanza St.",
    bgColor: "#1a2833",
    floorColor: "#2a3a2a",
    wallColor: "#2d1f0e",
    wallHighlight: "#4a3520",
    outdoor: true,
    exits: [
      { x: 7, y: 0, toRoom: "community_center", spawnX: 7, spawnY: 9, label: "Community Center" },
      { x: 15, y: 5, toRoom: "courthouse", spawnX: 2, spawnY: 5, label: "Courthouse" },
      { x: 0, y: 5, toRoom: "school", spawnX: 13, spawnY: 5, label: "School" },
      { x: 7, y: 11, toRoom: "home", spawnX: 7, spawnY: 2, label: "Home" },
      { x: 15, y: 9, toRoom: "park", spawnX: 2, spawnY: 5, label: "Park" },
      { x: 0, y: 9, toRoom: "main_street", spawnX: 13, spawnY: 5, label: "Main Street" },
    ],
    npcs: [
      { id: "elena", name: "Elena", x: 4, y: 4, skinColor: "#d4a574", shirtColor: "#e74c3c", dialogueId: "elena" },
      { id: "carlos", name: "Carlos", x: 11, y: 3, skinColor: "#c68642", shirtColor: "#3498db", dialogueId: "carlos" },
      { id: "mrs_chen", name: "Mrs. Chen", x: 9, y: 8, skinColor: "#f5d0a9", shirtColor: "#27ae60", dialogueId: "mrs_chen" },
    ],
    decorations: [
      { x: 2, y: 2, w: 2, h: 1, color: "#2d4a2d", type: 'plant' },
      { x: 12, y: 2, w: 2, h: 1, color: "#2d4a2d", type: 'plant' },
      { x: 5, y: 9, w: 3, h: 1, color: "#3d2b1f", type: 'bench' },
      { x: 10, y: 9, w: 2, h: 1, color: "#3d2b1f", type: 'bench' },
    ],
  },

  community_center: {
    id: "community_center",
    name: "Community Center",
    bgColor: "#1a1520",
    floorColor: "#2a2020",
    wallColor: "#3d2b1f",
    wallHighlight: "#5c4033",
    exits: [
      { x: 7, y: 11, toRoom: "neighborhood", spawnX: 7, spawnY: 2, label: "Back Outside" },
    ],
    npcs: [
      { id: "rosa", name: "Rosa", x: 4, y: 4, skinColor: "#d4a574", shirtColor: "#9b59b6", dialogueId: "rosa" },
      { id: "james", name: "James", x: 10, y: 4, skinColor: "#8d5524", shirtColor: "#f39c12", dialogueId: "james" },
      { id: "pastor_davis", name: "Pastor Davis", x: 7, y: 2, skinColor: "#6f4e37", shirtColor: "#1a1a2e", dialogueId: "pastor_davis" },
    ],
    decorations: [
      { x: 2, y: 2, w: 3, h: 1, color: "#4a3520", type: 'bookshelf' },
      { x: 11, y: 2, w: 3, h: 1, color: "#4a3520", type: 'bookshelf' },
      { x: 5, y: 7, w: 6, h: 2, color: "#3d2b1f", type: 'table' },
    ],
  },

  courthouse: {
    id: "courthouse",
    name: "County Courthouse",
    bgColor: "#151520",
    floorColor: "#1e1e2e",
    wallColor: "#333350",
    wallHighlight: "#4a4a6a",
    exits: [
      { x: 0, y: 5, toRoom: "neighborhood", spawnX: 13, spawnY: 5, label: "Back to Street" },
    ],
    npcs: [
      { id: "lawyer_kim", name: "Atty. Kim", x: 8, y: 3, skinColor: "#f5d0a9", shirtColor: "#2c3e50", dialogueId: "lawyer_kim" },
      { id: "davino", name: "Davino", x: 12, y: 6, skinColor: "#6f4e37", shirtColor: "#e67e22", dialogueId: "davino" },
    ],
    decorations: [
      { x: 5, y: 2, w: 6, h: 1, color: "#4a3520", type: 'desk' },
      { x: 3, y: 5, w: 1, h: 3, color: "#333350", type: 'bookshelf' },
      { x: 12, y: 2, w: 1, h: 3, color: "#333350", type: 'bookshelf' },
    ],
  },

  school: {
    id: "school",
    name: "Esperanza Elementary",
    bgColor: "#152015",
    floorColor: "#1e2e1e",
    wallColor: "#2d4a2d",
    wallHighlight: "#3d6a3d",
    exits: [
      { x: 15, y: 5, toRoom: "neighborhood", spawnX: 2, spawnY: 5, label: "Back to Street" },
    ],
    npcs: [
      { id: "teacher_martinez", name: "Ms. Martinez", x: 7, y: 3, skinColor: "#d4a574", shirtColor: "#8e44ad", dialogueId: "teacher_martinez" },
      { id: "tommy", name: "Tommy", x: 4, y: 7, skinColor: "#c68642", shirtColor: "#2980b9", dialogueId: "tommy" },
      { id: "sofia", name: "Sofia", x: 11, y: 7, skinColor: "#d4a574", shirtColor: "#e91e63", dialogueId: "sofia" },
    ],
    decorations: [
      { x: 3, y: 2, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
      { x: 7, y: 2, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
      { x: 11, y: 2, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
      { x: 3, y: 6, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
      { x: 7, y: 6, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
    ],
  },

  home: {
    id: "home",
    name: "Your Home",
    bgColor: "#1a1510",
    floorColor: "#2a2015",
    wallColor: "#4a3520",
    wallHighlight: "#6a5030",
    exits: [
      { x: 7, y: 0, toRoom: "neighborhood", spawnX: 7, spawnY: 9, label: "Go Outside" },
    ],
    npcs: [
      { id: "abuela", name: "Abuela", x: 5, y: 5, skinColor: "#d4a574", shirtColor: "#c0392b", dialogueId: "abuela" },
      { id: "mama", name: "Mama", x: 10, y: 4, skinColor: "#d4a574", shirtColor: "#16a085", dialogueId: "mama" },
    ],
    decorations: [
      { x: 3, y: 2, w: 4, h: 2, color: "#3d2b1f", type: 'table' },
      { x: 10, y: 2, w: 3, h: 1, color: "#2d4a2d", type: 'plant' },
      { x: 11, y: 7, w: 3, h: 2, color: "#4a3520", type: 'bookshelf' },
    ],
  },

  park: {
    id: "park",
    name: "Esperanza Park",
    bgColor: "#1a2f20",
    floorColor: "#2a3e2a",
    wallColor: "#1a3a1a",
    wallHighlight: "#2d5a2d",
    outdoor: true,
    exits: [
      { x: 0, y: 5, toRoom: "neighborhood", spawnX: 13, spawnY: 9, label: "Back to Street" },
      { x: 15, y: 5, toRoom: "shelter", spawnX: 2, spawnY: 5, label: "Community Shelter" },
    ],
    npcs: [
      { id: "lucia", name: "Lucia", x: 5, y: 4, skinColor: "#c68642", shirtColor: "#e74c3c", dialogueId: "lucia" },
      { id: "officer_reyes", name: "Officer Reyes", x: 11, y: 7, skinColor: "#8d5524", shirtColor: "#1a237e", dialogueId: "officer_reyes" },
    ],
    decorations: [
      { x: 7, y: 3, w: 2, h: 2, color: "#3d6a3d", type: 'fountain' },
      { x: 2, y: 2, w: 2, h: 1, color: "#2d4a2d", type: 'plant' },
      { x: 12, y: 2, w: 2, h: 1, color: "#2d4a2d", type: 'plant' },
      { x: 3, y: 8, w: 3, h: 1, color: "#3d2b1f", type: 'bench' },
      { x: 10, y: 8, w: 3, h: 1, color: "#3d2b1f", type: 'bench' },
      { x: 6, y: 6, w: 1, h: 1, color: "#2d4a2d", type: 'plant' },
      { x: 9, y: 6, w: 1, h: 1, color: "#2d4a2d", type: 'plant' },
    ],
  },

  main_street: {
    id: "main_street",
    name: "Main Street",
    bgColor: "#1a2025",
    floorColor: "#2a2a2e",
    wallColor: "#2d2020",
    wallHighlight: "#4a3535",
    outdoor: true,
    exits: [
      { x: 15, y: 5, toRoom: "neighborhood", spawnX: 2, spawnY: 9, label: "Esperanza St." },
      { x: 0, y: 5, toRoom: "library", spawnX: 13, spawnY: 5, label: "Public Library" },
      { x: 7, y: 0, toRoom: "arcade", spawnX: 7, spawnY: 9, label: "Arcade" },
    ],
    npcs: [
      { id: "mr_park", name: "Mr. Park", x: 5, y: 4, skinColor: "#f5d0a9", shirtColor: "#795548", dialogueId: "mr_park" },
    ],
    decorations: [
      { x: 2, y: 2, w: 4, h: 1, color: "#3d2b1f", type: 'counter' },
      { x: 2, y: 3, w: 1, h: 3, color: "#4a3520", type: 'shelves' },
      { x: 9, y: 2, w: 4, h: 1, color: "#333340", type: 'counter' },
      { x: 9, y: 3, w: 1, h: 2, color: "#333340", type: 'shelves' },
      { x: 6, y: 8, w: 4, h: 1, color: "#3d2b1f", type: 'bench' },
      { x: 13, y: 2, w: 1, h: 3, color: "#333340", type: 'shelves' },
    ],
  },

  shelter: {
    id: "shelter",
    name: "Community Shelter",
    bgColor: "#15151a",
    floorColor: "#1e1e25",
    wallColor: "#2a2a3a",
    wallHighlight: "#3d3d55",
    exits: [
      { x: 0, y: 5, toRoom: "park", spawnX: 13, spawnY: 5, label: "Back to Park" },
    ],
    npcs: [],
    decorations: [
      { x: 2, y: 2, w: 3, h: 1, color: "#3d3d4a", type: 'bed' },
      { x: 6, y: 2, w: 3, h: 1, color: "#3d3d4a", type: 'bed' },
      { x: 10, y: 2, w: 3, h: 1, color: "#3d3d4a", type: 'bed' },
      { x: 2, y: 5, w: 3, h: 1, color: "#3d3d4a", type: 'bed' },
      { x: 6, y: 5, w: 3, h: 1, color: "#3d3d4a", type: 'bed' },
      { x: 10, y: 5, w: 3, h: 1, color: "#3d3d4a", type: 'bed' },
      { x: 2, y: 8, w: 5, h: 1, color: "#3d2b1f", type: 'table' },
      { x: 8, y: 8, w: 2, h: 1, color: "#3d2b1f", type: 'chair' },
    ],
  },

  library: {
    id: "library",
    name: "Public Library",
    bgColor: "#1a1815",
    floorColor: "#25221e",
    wallColor: "#3d3520",
    wallHighlight: "#5c5030",
    exits: [
      { x: 15, y: 5, toRoom: "main_street", spawnX: 2, spawnY: 5, label: "Back to Main St." },
    ],
    npcs: [],
    decorations: [
      { x: 2, y: 2, w: 2, h: 4, color: "#4a3520", type: 'bookshelf' },
      { x: 5, y: 2, w: 2, h: 4, color: "#4a3520", type: 'bookshelf' },
      { x: 8, y: 2, w: 2, h: 4, color: "#4a3520", type: 'bookshelf' },
      { x: 11, y: 2, w: 2, h: 4, color: "#4a3520", type: 'bookshelf' },
      { x: 4, y: 8, w: 4, h: 2, color: "#3d2b1f", type: 'table' },
      { x: 9, y: 8, w: 4, h: 2, color: "#3d2b1f", type: 'table' },
    ],
  },

  arcade: {
    id: "arcade",
    name: "Esperanza Arcade",
    bgColor: "#0a0a1a",
    floorColor: "#1a1a2e",
    wallColor: "#16213e",
    wallHighlight: "#0f3460",
    exits: [
      { x: 7, y: 11, toRoom: "main_street", spawnX: 7, spawnY: 2, label: "Back to Main St." },
    ],
    npcs: [
      { id: "arcade_kid", name: "Danny", x: 6, y: 6, skinColor: "#c68642", shirtColor: "#e74c3c", dialogueId: "arcade_kid" },
      { id: "arcade_owner", name: "Val", x: 12, y: 5, skinColor: "#f5d0a9", shirtColor: "#9b59b6", dialogueId: "arcade_owner" },
    ],
    decorations: [
      { x: 2, y: 2, w: 2, h: 2, color: "#e74c3c", type: 'arcade_cabinet', label: "RIGHTS MATCH", miniGame: "rights_match" },
      { x: 7, y: 2, w: 2, h: 2, color: "#3498db", type: 'arcade_cabinet', label: "MYTH OR FACT", miniGame: "myth_or_fact" },
      { x: 12, y: 2, w: 2, h: 2, color: "#f39c12", type: 'arcade_cabinet', label: "SPEED QUIZ", miniGame: "speed_quiz" },
      { x: 5, y: 8, w: 3, h: 1, color: "#3d2b1f", type: 'bench' },
      { x: 10, y: 8, w: 3, h: 1, color: "#3d2b1f", type: 'bench' },
    ],
  },
};

export function buildWallMap(room: RoomDef): number[][] {
  const map = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (x === 0 || x === COLS - 1 || y === 0 || y === ROWS - 1) {
        map[y][x] = 1;
      }
    }
  }

  for (const exit of room.exits) {
    map[exit.y][exit.x] = 0;
    if (exit.y === 0 || exit.y === ROWS - 1) {
      if (exit.x > 0) map[exit.y][exit.x - 1] = 0;
      if (exit.x < COLS - 1) map[exit.y][exit.x + 1] = 0;
    }
    if (exit.x === 0 || exit.x === COLS - 1) {
      if (exit.y > 0) map[exit.y - 1][exit.x] = 0;
      if (exit.y < ROWS - 1) map[exit.y + 1][exit.x] = 0;
    }
  }

  for (const dec of room.decorations) {
    for (let dy = 0; dy < dec.h; dy++) {
      for (let dx = 0; dx < dec.w; dx++) {
        const ty = dec.y + dy;
        const tx = dec.x + dx;
        if (ty > 0 && ty < ROWS - 1 && tx > 0 && tx < COLS - 1) {
          map[ty][tx] = 2;
        }
      }
    }
  }

  return map;
}

export function findSafeSpawn(wallMap: number[][], targetX: number, targetY: number, npcs: NpcDef[]): { x: number; y: number } {
  if (
    targetY > 0 && targetY < ROWS - 1 &&
    targetX > 0 && targetX < COLS - 1 &&
    wallMap[targetY]?.[targetX] === 0 &&
    !npcs.some(n => n.x === targetX && n.y === targetY)
  ) {
    return { x: targetX, y: targetY };
  }
  for (let radius = 1; radius <= 4; radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = targetX + dx;
        const ny = targetY + dy;
        if (ny > 0 && ny < ROWS - 1 && nx > 0 && nx < COLS - 1 &&
            wallMap[ny]?.[nx] === 0 &&
            !npcs.some(n => n.x === nx && n.y === ny)) {
          return { x: nx, y: ny };
        }
      }
    }
  }
  return { x: targetX, y: targetY };
}
