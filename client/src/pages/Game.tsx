import { useState } from "react";
import { GameWorld } from "@/components/GameWorld";
import { GameHUD } from "@/components/GameHUD";
import { DialogModal } from "@/components/DialogModal";
import { useGameContent } from "@/hooks/use-game-content";
import { type GameContent } from "@shared/schema";
import { rooms, CHAPTER_INTRO } from "@/lib/gameData";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Game() {
  const { data: contents, isLoading, error } = useGameContent();

  const [activeContent, setActiveContent] = useState<GameContent | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState("");
  const [awareness, setAwareness] = useState(0);
  const [storiesFound, setStoriesFound] = useState<Set<number>>(new Set());
  const [gameState, setGameState] = useState<'title' | 'intro' | 'playing'>('title');
  const [currentRoom, setCurrentRoom] = useState("neighborhood");
  const [playerSpawn, setPlayerSpawn] = useState({ x: 7, y: 6 });

  const handleInteract = (contentId: number, npcName: string) => {
    const content = contents?.find(c => c.id === contentId);
    if (content) {
      setActiveContent(content);
      setActiveSpeaker(npcName);

      if (!storiesFound.has(contentId)) {
        const newStories = new Set(storiesFound).add(contentId);
        setStoriesFound(newStories);
        setAwareness(prev => Math.min(prev + 10, 100));
      }
    }
  };

  const handleCloseModal = () => {
    setActiveContent(null);
    setActiveSpeaker("");
  };

  const handleRoomChange = (roomId: string, spawnX: number, spawnY: number) => {
    setCurrentRoom(roomId);
    setPlayerSpawn({ x: spawnX, y: spawnY });
  };

  if (isLoading) {
    return (
      <div data-testid="loading-state" className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }} className="text-green-400 animate-pulse">LOADING...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="error-state" className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-red-400">
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px' }}>SYSTEM ERROR</p>
        <p style={{ fontFamily: 'var(--font-retro)', fontSize: '18px' }} className="text-white/60">Failed to load. Please refresh.</p>
      </div>
    );
  }

  if (gameState === 'title') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 scanlines">
        <div className="max-w-lg w-full text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1
              className="text-green-400 mb-2 leading-loose"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '28px', textShadow: '2px 2px 0 #064e3b, 0 0 20px rgba(74,222,128,0.3)' }}
            >
              COMMUNITY
            </h1>
            <h1
              className="text-white leading-loose"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '28px', textShadow: '2px 2px 0 #1a1a1a' }}
            >
              DEFENDER
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/70 leading-relaxed"
            style={{ fontFamily: 'var(--font-retro)', fontSize: '22px' }}
          >
            ICE has wrongfully detained and deported U.S. citizens. Used force against nonviolent people. Torn families apart in raids. Walk through the neighborhood of Esperanza, talk to your neighbors, and learn the truth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="nes-border border-white/30 bg-white/5 p-4"
          >
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }} className="text-white/50 mb-3">CONTROLS</p>
            <div className="flex justify-center gap-8" style={{ fontFamily: 'var(--font-retro)', fontSize: '18px' }}>
              <span className="text-white/70">WASD / Arrows - Move</span>
              <span className="text-white/70">SPACE - Talk / Enter</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
            <button
              data-testid="button-start-game"
              onClick={() => setGameState('intro')}
              className="w-full py-3 bg-green-700 text-white border-2 border-green-500 hover-elevate active-elevate-2"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.3), inset 3px 3px 0 rgba(255,255,255,0.15)' }}
            >
              START
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 scanlines">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-lg w-full text-center space-y-6"
        >
          <h2 className="text-green-400" style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', textShadow: '1px 1px 0 #064e3b' }}>
            {CHAPTER_INTRO.title}
          </h2>
          <p className="text-white/80 leading-relaxed" style={{ fontFamily: 'var(--font-retro)', fontSize: '22px' }}>
            {CHAPTER_INTRO.text}
          </p>
          <button
            data-testid="button-begin"
            onClick={() => setGameState('playing')}
            className="px-8 py-2 bg-green-700 text-white border-2 border-green-500 hover-elevate active-elevate-2"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.3), inset 3px 3px 0 rgba(255,255,255,0.15)' }}
          >
            BEGIN
          </button>
        </motion.div>
      </div>
    );
  }

  const roomData = rooms[currentRoom];

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center">
      <GameHUD
        awareness={awareness}
        storiesFound={storiesFound.size}
        totalStories={contents?.length || 0}
        roomName={roomData?.name || "Unknown"}
      />

      <div className="flex-shrink-0">
        <GameWorld
          onInteract={handleInteract}
          contents={contents || []}
          currentRoom={currentRoom}
          onRoomChange={handleRoomChange}
          playerStart={playerSpawn}
        />
      </div>

      <DialogModal
        isOpen={!!activeContent}
        content={activeContent}
        speakerName={activeSpeaker}
        onClose={handleCloseModal}
      />
    </div>
  );
}
