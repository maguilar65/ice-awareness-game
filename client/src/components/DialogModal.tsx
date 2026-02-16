import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type DialogueNode, type DialogueTree } from "@/lib/dialogueData";
import { playTalkBleep, playChoiceSelect, playDialogOpen, playDialogClose } from "@/lib/audioEngine";

interface DialogModalProps {
  isOpen: boolean;
  dialogue: DialogueTree | null;
  onClose: () => void;
  onContentRevealed: (contentId: number) => void;
}

export function DialogModal({ isOpen, dialogue, onClose, onContentRevealed }: DialogModalProps) {
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
      <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-3xl pointer-events-auto"
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
          <div className="nes-border border-white/80 bg-black/95 p-4">
            <div className="flex items-center gap-3 mb-2">
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
              className="text-white/90 leading-relaxed min-h-[50px] mb-3"
              style={{ fontFamily: 'var(--font-retro)', fontSize: '20px' }}
              data-testid="dialog-text"
            >
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-white/80 ml-0.5 animate-pulse" />}
            </p>

            {showChoices && !isTyping && hasChoices && !currentNode.isEnd && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1.5 border-t border-white/20 pt-3"
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
                    className="w-full text-left px-3 py-2 bg-white/5 border border-white/20 text-white/90 hover-elevate active-elevate-2 flex items-center gap-2 transition-colors"
                    style={{ fontFamily: 'var(--font-retro)', fontSize: '18px' }}
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
                  PRESS SPACE TO CLOSE
                </motion.span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
