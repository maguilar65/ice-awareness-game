import { useState, useCallback, useEffect } from "react";
import { GameWorld } from "@/components/GameWorld";
import { GameHUD } from "@/components/GameHUD";
import { DialogModal } from "@/components/DialogModal";
import { EndingCrawl } from "@/components/EndingCrawl";
import { ProtestCutscene } from "@/components/ProtestCutscene";
import { PauseMenu } from "@/components/PauseMenu";
import { QuizMode } from "@/components/QuizMode";
import { RightsMatchGame } from "@/components/RightsMatchGame";
import { MythOrFactGame } from "@/components/MythOrFactGame";
import { SpeedQuizGame } from "@/components/SpeedQuizGame";
import { useGameContent } from "@/hooks/use-game-content";
import { rooms, CHAPTER_INTRO } from "@/lib/gameData";
import { npcDialogues, type DialogueTree } from "@/lib/dialogueData";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ALL_NPCS_BY_DIALOGUE_ID = Object.fromEntries(
  Object.values(rooms).flatMap(room => room.npcs.map(npc => [npc.dialogueId, npc]))
);
const ALL_NPC_IDS = new Set(Object.keys(ALL_NPCS_BY_DIALOGUE_ID));
const TOTAL_NPCS = ALL_NPC_IDS.size;

export default function Game() {
  const { data: contents, isLoading, error } = useGameContent();

  const [activeDialogue, setActiveDialogue] = useState<DialogueTree | null>(null);
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const [awareness, setAwareness] = useState(0);
  const [storiesFound, setStoriesFound] = useState<Set<number>>(new Set());
  const [talkedTo, setTalkedTo] = useState<Set<string>>(new Set());
  const [gameState, setGameState] = useState<'title' | 'cutscene' | 'intro' | 'playing' | 'ending' | 'credits' | 'quiz'>('title');
  const [currentRoom, setCurrentRoom] = useState("neighborhood");
  const [playerSpawn, setPlayerSpawn] = useState({ x: 7, y: 6 });
  const [paused, setPaused] = useState(false);
  const [activeMiniGame, setActiveMiniGame] = useState<string | null>(null);
  const [playerPos, setPlayerPos] = useState({ x: 7 * 32, y: 6 * 32 });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameState === 'playing' && !activeDialogue) {
        e.preventDefault();
        setPaused(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [gameState, activeDialogue]);

  const handleInteract = (dialogueId: string) => {
    const dialogue = npcDialogues[dialogueId];
    if (dialogue) {
      setActiveDialogue(dialogue);
      setActiveDialogueId(dialogueId);
    }
  };

  const handleContentRevealed = (contentId: number) => {
    if (!storiesFound.has(contentId)) {
      const newStories = new Set(storiesFound).add(contentId);
      setStoriesFound(newStories);
    }
  };

  const handleCloseModal = useCallback(() => {
    if (activeDialogueId) {
      setTalkedTo(prev => {
        const next = new Set(prev);
        next.add(activeDialogueId);
        const newAwareness = Math.round((next.size / TOTAL_NPCS) * 100);
        setAwareness(Math.min(newAwareness, 100));
        return next;
      });
    }
    setActiveDialogue(null);
    setActiveDialogueId(null);
  }, [activeDialogueId]);

  useEffect(() => {
    if (gameState === 'playing' && talkedTo.size >= TOTAL_NPCS) {
      const timer = setTimeout(() => setGameState('ending'), 1500);
      return () => clearTimeout(timer);
    }
  }, [talkedTo.size, gameState]);

  const handleRoomChange = (roomId: string, spawnX: number, spawnY: number) => {
    setCurrentRoom(roomId);
    setPlayerSpawn({ x: spawnX, y: spawnY });
  };

  const handleEndingFinish = useCallback(() => {
    setGameState('credits');
  }, []);

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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 scanlines">
        <div className="max-w-lg w-full text-center space-y-6 sm:space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1
              className="text-green-400 mb-2 leading-loose"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(18px, 5vw, 28px)', textShadow: '2px 2px 0 #064e3b, 0 0 20px rgba(74,222,128,0.3)' }}
            >
              COMMUNITY
            </h1>
            <h1
              className="text-white leading-loose"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(18px, 5vw, 28px)', textShadow: '2px 2px 0 #1a1a1a' }}
            >
              DEFENDER
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/70 leading-relaxed"
            style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(16px, 4vw, 22px)' }}
          >
            Walk through the neighborhood of Esperanza. Talk to your neighbors. Make choices. Learn the truth about what is happening in communities across America.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="nes-border border-white/30 bg-white/5 p-3 sm:p-4"
          >
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px' }} className="text-white/50 mb-3">CONTROLS</p>
            <div className="hidden sm:flex justify-center gap-8 flex-wrap" style={{ fontFamily: 'var(--font-retro)', fontSize: '18px' }}>
              <span className="text-white/70">WASD / Arrows - Move</span>
              <span className="text-white/70">SPACE - Talk / Enter</span>
            </div>
            <div className="sm:hidden flex justify-center gap-4 flex-wrap" style={{ fontFamily: 'var(--font-retro)', fontSize: '16px' }}>
              <span className="text-white/70">D-Pad - Move</span>
              <span className="text-white/70">TALK Button - Interact</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
            <button
              data-testid="button-start-game"
              onClick={() => setGameState('cutscene')}
              className="w-full py-3 bg-green-700 text-white border-2 border-green-500 hover-elevate active-elevate-2"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(10px, 3vw, 14px)', boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.3), inset 3px 3px 0 rgba(255,255,255,0.15)' }}
            >
              START
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (gameState === 'cutscene') {
    return <ProtestCutscene onFinish={() => setGameState('intro')} />;
  }

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 scanlines">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-lg w-full text-center space-y-6"
        >
          <h2 className="text-green-400" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(10px, 3vw, 14px)', textShadow: '1px 1px 0 #064e3b' }}>
            {CHAPTER_INTRO.title}
          </h2>
          <p className="text-white/80 leading-relaxed" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(16px, 4vw, 22px)' }}>
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

  if (gameState === 'ending') {
    return <EndingCrawl onFinish={handleEndingFinish} />;
  }

  if (gameState === 'credits') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-4 sm:p-8 scanlines z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full max-w-2xl text-center space-y-6 sm:space-y-10 py-4"
        >
          <h1
            className="text-green-400 leading-loose"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(20px, 6vw, 36px)', textShadow: '0 0 30px rgba(74,222,128,0.5), 2px 2px 0 #064e3b' }}
          >
            COMMUNITY DEFENDER
          </h1>
          <p className="text-white/70 leading-relaxed" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(18px, 4vw, 26px)' }}>
            You talked to {TOTAL_NPCS} neighbors and learned {storiesFound.size} facts about civil rights and community safety.
          </p>
          <p className="text-yellow-400 leading-relaxed" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(16px, 3.5vw, 24px)' }}>
            Knowledge is protection. Share what you learned.
          </p>
          <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <p className="text-white/40" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(10px, 3vw, 14px)', letterSpacing: '0.2em' }}>MADE BY</p>
            <p className="text-white" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(12px, 3.5vw, 18px)', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>Marcos Aguilar</p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              data-testid="button-take-quiz"
              onClick={() => setGameState('quiz')}
              className="px-8 py-3 bg-yellow-600 text-white border-2 border-yellow-400 hover-elevate active-elevate-2"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(9px, 2.5vw, 12px)', boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.3), inset 3px 3px 0 rgba(255,255,255,0.15)' }}
            >
              TAKE THE QUIZ
            </button>
            <button
              data-testid="button-play-again"
              onClick={() => {
                setGameState('title');
                setTalkedTo(new Set());
                setStoriesFound(new Set());
                setAwareness(0);
                setCurrentRoom("neighborhood");
                setPlayerSpawn({ x: 7, y: 6 });
                setPaused(false);
              }}
              className="px-8 py-3 bg-green-700 text-white border-2 border-green-500 hover-elevate active-elevate-2"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(9px, 2.5vw, 12px)', boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.3), inset 3px 3px 0 rgba(255,255,255,0.15)' }}
            >
              PLAY AGAIN
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'quiz') {
    return (
      <QuizMode
        onFinish={() => {
          setGameState('title');
          setTalkedTo(new Set());
          setStoriesFound(new Set());
          setAwareness(0);
          setCurrentRoom("neighborhood");
          setPlayerSpawn({ x: 7, y: 6 });
          setPaused(false);
        }}
      />
    );
  }

  const roomData = rooms[currentRoom];

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center">
      <GameHUD
        awareness={awareness}
        storiesFound={talkedTo.size}
        totalStories={TOTAL_NPCS}
        roomName={roomData?.name || "Unknown"}
        currentRoom={currentRoom}
        playerPos={playerPos}
        talkedTo={talkedTo}
      />

      <div className="flex-shrink-0">
        <GameWorld
          onInteract={handleInteract}
          onMiniGame={(id) => setActiveMiniGame(id)}
          currentRoom={currentRoom}
          onRoomChange={handleRoomChange}
          playerStart={playerSpawn}
          dialogueOpen={!!activeDialogue || paused || !!activeMiniGame}
          onPause={() => setPaused(true)}
          talkedTo={talkedTo}
          onPlayerMove={setPlayerPos}
        />
      </div>

      {gameState === 'playing' && talkedTo.size > 0 && talkedTo.size < TOTAL_NPCS && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        >
          <div
            className="bg-black/80 border border-white/20 px-3 py-1"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
          >
            <span className="text-white/50">NEIGHBORS: </span>
            <span className="text-green-400" data-testid="text-talked-count">{talkedTo.size}/{TOTAL_NPCS}</span>
          </div>
        </motion.div>
      )}

      <DialogModal
        isOpen={!!activeDialogue}
        dialogue={activeDialogue}
        onClose={handleCloseModal}
        onContentRevealed={handleContentRevealed}
        activeNpc={activeDialogueId ? ALL_NPCS_BY_DIALOGUE_ID[activeDialogueId] || null : null}
      />

      <PauseMenu
        isOpen={paused && gameState === 'playing'}
        onResume={() => setPaused(false)}
        onSkipToCredits={() => {
          setPaused(false);
          setGameState('ending');
        }}
        talkedTo={talkedTo.size}
        totalNpcs={TOTAL_NPCS}
      />

      {activeMiniGame === 'rights_match' && (
        <RightsMatchGame onClose={() => setActiveMiniGame(null)} />
      )}
      {activeMiniGame === 'myth_or_fact' && (
        <MythOrFactGame onClose={() => setActiveMiniGame(null)} />
      )}
      {activeMiniGame === 'speed_quiz' && (
        <SpeedQuizGame onClose={() => setActiveMiniGame(null)} />
      )}
    </div>
  );
}
