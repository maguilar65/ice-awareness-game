import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type DialogueNode, type DialogueTree } from "@/lib/dialogueData";
import { type NpcDef } from "@/lib/gameData";
import { playTalkBleep, playChoiceSelect, playDialogOpen, playDialogClose } from "@/lib/audioEngine";

function adjustColor(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function NpcPortrait({ npc }: { npc: NpcDef }) {
  const P = 3;
  const darkerShirt = adjustColor(npc.shirtColor, -40);

  return (
    <div className="relative flex-shrink-0" style={{ width: P * 8, height: P * 8 }}>
      {npc.female ? (
        <>
          <div className="absolute" style={{ left: P*1, top: 0, width: P*6, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: 0, top: P, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: P, top: P, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: P*2, top: P, width: P*4, height: P, backgroundColor: npc.skinColor }} />
          <div className="absolute" style={{ left: P*6, top: P, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: P*7, top: P, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: 0, top: P*2, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: P, top: P*2, width: P, height: P, backgroundColor: npc.skinColor }} />
          <div className="absolute" style={{ left: P*2, top: P*2, width: P, height: P, backgroundColor: '#1a1a1a' }} />
          <div className="absolute" style={{ left: P*3, top: P*2, width: P*2, height: P, backgroundColor: npc.skinColor }} />
          <div className="absolute" style={{ left: P*5, top: P*2, width: P, height: P, backgroundColor: '#1a1a1a' }} />
          <div className="absolute" style={{ left: P*6, top: P*2, width: P, height: P, backgroundColor: npc.skinColor }} />
          <div className="absolute" style={{ left: P*7, top: P*2, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: 0, top: P*3, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: P*2, top: P*3, width: P*4, height: P, backgroundColor: adjustColor(npc.skinColor, -20) }} />
          <div className="absolute" style={{ left: P*7, top: P*3, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: 0, top: P*4, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: P, top: P*4, width: P*6, height: P, backgroundColor: npc.shirtColor }} />
          <div className="absolute" style={{ left: P*7, top: P*4, width: P, height: P, backgroundColor: '#2c2c2c' }} />
        </>
      ) : (
        <>
          <div className="absolute" style={{ left: P*2, top: 0, width: P*4, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: P, top: P, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: P*2, top: P, width: P*4, height: P, backgroundColor: npc.skinColor }} />
          <div className="absolute" style={{ left: P*6, top: P, width: P, height: P, backgroundColor: '#2c2c2c' }} />
          <div className="absolute" style={{ left: P, top: P*2, width: P, height: P, backgroundColor: npc.skinColor }} />
          <div className="absolute" style={{ left: P*2, top: P*2, width: P, height: P, backgroundColor: '#1a1a1a' }} />
          <div className="absolute" style={{ left: P*3, top: P*2, width: P*2, height: P, backgroundColor: npc.skinColor }} />
          <div className="absolute" style={{ left: P*5, top: P*2, width: P, height: P, backgroundColor: '#1a1a1a' }} />
          <div className="absolute" style={{ left: P*6, top: P*2, width: P, height: P, backgroundColor: npc.skinColor }} />
          <div className="absolute" style={{ left: P*2, top: P*3, width: P*4, height: P, backgroundColor: adjustColor(npc.skinColor, -20) }} />
          <div className="absolute" style={{ left: P, top: P*4, width: P*6, height: P, backgroundColor: npc.shirtColor }} />
        </>
      )}
      <div className="absolute" style={{ left: 0, top: P*5, width: P, height: P*2, backgroundColor: npc.skinColor }} />
      <div className="absolute" style={{ left: P, top: P*5, width: P*6, height: P*2, backgroundColor: darkerShirt }} />
      <div className="absolute" style={{ left: P*7, top: P*5, width: P, height: P*2, backgroundColor: npc.skinColor }} />
      <div className="absolute" style={{ left: P*2, top: P*7, width: P*2, height: P, backgroundColor: '#34495e' }} />
      <div className="absolute" style={{ left: P*4, top: P*7, width: P*2, height: P, backgroundColor: '#34495e' }} />
    </div>
  );
}

interface DialogModalProps {
  isOpen: boolean;
  dialogue: DialogueTree | null;
  onClose: () => void;
  onContentRevealed: (contentId: number) => void;
  activeNpc?: NpcDef | null;
}

export function DialogModal({ isOpen, dialogue, onClose, onContentRevealed, activeNpc }: DialogModalProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [revealedContentIds, setRevealedContentIds] = useState<Set<number>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen && dialogue) {
      setCurrentNodeId(dialogue.startNodeId);
      setRevealedContentIds(new Set());
      playDialogOpen();
    } else {
      setCurrentNodeId("");
      setDisplayedText("");
      setIsTyping(true);
      setShowChoices(false);
    }
  }, [isOpen, dialogue]);

  const currentNode: DialogueNode | null =
    dialogue && currentNodeId ? dialogue.nodes[currentNodeId] || null : null;

  const finishTyping = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (currentNode) {
      setDisplayedText(currentNode.text);
      setIsTyping(false);
      if (currentNode.contentId && !revealedContentIds.has(currentNode.contentId)) {
        onContentRevealed(currentNode.contentId);
        setRevealedContentIds(prev => new Set(prev).add(currentNode.contentId!));
      }
      setTimeout(() => setShowChoices(true), 150);
    }
  }, [currentNode, onContentRevealed, revealedContentIds]);

  useEffect(() => {
    if (!currentNode) return;

    setDisplayedText("");
    setIsTyping(true);
    setShowChoices(false);
    let idx = 0;
    const fullText = currentNode.text;

    intervalRef.current = setInterval(() => {
      idx++;
      setDisplayedText(fullText.slice(0, idx));
      const char = fullText[idx - 1];
      if (char && char !== ' ' && char !== '.' && char !== ',') {
        playTalkBleep(currentNode.speaker, idx);
      }
      if (idx >= fullText.length) {
        setIsTyping(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (currentNode.contentId && !revealedContentIds.has(currentNode.contentId)) {
          onContentRevealed(currentNode.contentId);
          setRevealedContentIds(prev => new Set(prev).add(currentNode.contentId!));
        }
        setTimeout(() => setShowChoices(true), 150);
      }
    }, 18);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentNodeId, currentNode?.id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen || !currentNode) return;
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Space') {
        e.preventDefault();
        if (isTyping) {
          finishTyping();
        } else if (currentNode.isEnd) {
          playDialogClose();
          onClose();
        }
      }
      if (e.key === 'Escape') {
        playDialogClose();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isTyping, currentNode, onClose, finishTyping]);

  const handleChoiceClick = (nextNodeId: string) => {
    playChoiceSelect();
    setCurrentNodeId(nextNodeId);
  };

  if (!isOpen || !currentNode) return null;

  const hasChoices = currentNode.choices && currentNode.choices.length > 0;
  const isFactNode = !!currentNode.contentId;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center p-2 sm:p-4 pointer-events-none">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-3xl pointer-events-auto mb-[env(safe-area-inset-bottom,0px)]"
          data-testid="dialog-modal"
          onClick={() => {
            if (isTyping) {
              finishTyping();
            } else if (currentNode.isEnd) {
              playDialogClose();
              onClose();
            }
          }}
        >
          <div className="nes-border border-white/80 bg-black/95 p-3 sm:p-4">
            <div className="flex items-start gap-3 sm:gap-4">
              {activeNpc && (
                <div className="flex-shrink-0 nes-border-light border-white/40 bg-white/5 p-1.5 sm:p-2" data-testid="npc-portrait">
                  <NpcPortrait npc={activeNpc} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                  <div
                    className="px-2 py-0.5 bg-green-600 text-black font-bold"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px' }}
                  >
                    {currentNode.speaker}
                  </div>
                  {isFactNode && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-2 py-0.5 bg-yellow-500 text-black font-bold"
                      style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px' }}
                    >
                      NEW INFO
                    </motion.div>
                  )}
                </div>

            <p
              className="text-white/90 leading-relaxed min-h-[40px] sm:min-h-[50px] mb-2 sm:mb-3"
              style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(15px, 3.5vw, 20px)' }}
              data-testid="dialog-text"
            >
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-white/80 ml-0.5 animate-pulse" />}
            </p>

            {showChoices && !isTyping && hasChoices && !currentNode.isEnd && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1.5 border-t border-white/20 pt-2 sm:pt-3"
                data-testid="dialog-choices"
              >
                {currentNode.choices!.map((choice, i) => (
                  <button
                    key={i}
                    data-testid={`dialog-choice-${i}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoiceClick(choice.nextNodeId);
                    }}
                    className="w-full text-left px-2 sm:px-3 py-2 bg-white/5 border border-white/20 text-white/90 hover-elevate active-elevate-2 flex items-center gap-2 transition-colors"
                    style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(14px, 3vw, 18px)' }}
                  >
                    <span className="text-green-400 flex-shrink-0" style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <span>{choice.text}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {showChoices && !isTyping && currentNode.isEnd && (
              <div className="flex justify-end mt-2">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
                  className="text-white/60"
                >
                  <span className="hidden sm:inline">PRESS SPACE TO CLOSE</span>
                  <span className="sm:hidden">TAP TO CLOSE</span>
                </motion.span>
              </div>
            )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
