export interface RoomDef {
  id: string;
  name: string;
  bgColor: string;
  floorColor: string;
  wallColor: string;
  wallHighlight: string;
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
  contentIds: number[];
}

export interface Decoration {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  type: 'table' | 'desk' | 'bench' | 'plant' | 'bookshelf' | 'fence' | 'crate';
}

export const TILE = 40;
export const COLS = 16;
export const ROWS = 12;

export const CHAPTER_INTRO = {
  title: "CHAPTER 1: THE NEIGHBORHOOD",
  text: "Something has changed in Esperanza. ICE has been spotted in the neighborhood. People are scared. Walk around. Talk to your neighbors. Learn what is happening.",
};

export const rooms: Record<string, RoomDef> = {
  neighborhood: {
    id: "neighborhood",
    name: "Esperanza St.",
    bgColor: "#0f1923",
    floorColor: "#1a2a1a",
    wallColor: "#2d1f0e",
    wallHighlight: "#4a3520",
    exits: [
      { x: 7, y: 0, toRoom: "community_center", spawnX: 7, spawnY: 9, label: "Community Center" },
      { x: 15, y: 5, toRoom: "courthouse", spawnX: 2, spawnY: 5, label: "Courthouse" },
      { x: 0, y: 5, toRoom: "school", spawnX: 13, spawnY: 5, label: "School" },
      { x: 7, y: 11, toRoom: "home", spawnX: 7, spawnY: 2, label: "Home" },
    ],
    npcs: [
      { id: "elena", name: "Elena", x: 4, y: 4, skinColor: "#d4a574", shirtColor: "#e74c3c", contentIds: [9] },
      { id: "carlos", name: "Carlos", x: 11, y: 3, skinColor: "#c68642", shirtColor: "#3498db", contentIds: [12] },
      { id: "mrs_chen", name: "Mrs. Chen", x: 9, y: 8, skinColor: "#f5d0a9", shirtColor: "#27ae60", contentIds: [5] },
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
      { id: "rosa", name: "Rosa", x: 4, y: 4, skinColor: "#d4a574", shirtColor: "#9b59b6", contentIds: [8] },
      { id: "james", name: "James", x: 10, y: 4, skinColor: "#8d5524", shirtColor: "#f39c12", contentIds: [7] },
      { id: "pastor_davis", name: "Pastor Davis", x: 7, y: 2, skinColor: "#6f4e37", shirtColor: "#1a1a2e", contentIds: [14] },
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
      { id: "lawyer_kim", name: "Atty. Kim", x: 8, y: 3, skinColor: "#f5d0a9", shirtColor: "#2c3e50", contentIds: [6] },
      { id: "davino", name: "Davino", x: 12, y: 6, skinColor: "#6f4e37", shirtColor: "#e67e22", contentIds: [8] },
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
      { id: "teacher_martinez", name: "Ms. Martinez", x: 7, y: 3, skinColor: "#d4a574", shirtColor: "#8e44ad", contentIds: [11] },
      { id: "tommy", name: "Tommy", x: 4, y: 7, skinColor: "#c68642", shirtColor: "#2980b9", contentIds: [13] },
    ],
    decorations: [
      { x: 3, y: 2, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
      { x: 7, y: 2, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
      { x: 11, y: 2, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
      { x: 3, y: 6, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
      { x: 7, y: 6, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
      { x: 11, y: 6, w: 2, h: 1, color: "#3d2b1f", type: 'desk' },
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
      { id: "abuela", name: "Abuela", x: 5, y: 5, skinColor: "#d4a574", shirtColor: "#c0392b", contentIds: [10] },
      { id: "mama", name: "Mama", x: 10, y: 4, skinColor: "#d4a574", shirtColor: "#16a085", contentIds: [13] },
    ],
    decorations: [
      { x: 3, y: 2, w: 4, h: 2, color: "#3d2b1f", type: 'table' },
      { x: 10, y: 2, w: 3, h: 1, color: "#2d4a2d", type: 'plant' },
      { x: 11, y: 7, w: 3, h: 2, color: "#4a3520", type: 'bookshelf' },
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
