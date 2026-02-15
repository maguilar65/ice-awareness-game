import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type GameContent } from "@shared/schema";

interface DialogModalProps {
  isOpen: boolean;
  content: GameContent | null;
  speakerName: string;
  onClose: () => void;
}

const TYPE_LABEL: Record<string, string> = {
  fact: 'FACT',
  story: 'TESTIMONY',
  scenario: 'TAKE ACTION',
};

const CATEGORY_COLOR: Record<string, string> = {
  rights: '#4ade80',
  history: '#f87171',
  community: '#fbbf24',
};

export function DialogModal({ isOpen, content, speakerName, onClose }: DialogModalProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen || !content) {
      setDisplayedText("");
      setIsTyping(true);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let idx = 0;
    const fullText = content.content;

    intervalRef.current = setInterval(() => {
      idx++;
      setDisplayedText(fullText.slice(0, idx));
      if (idx >= fullText.length) {
        setIsTyping(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 18);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, content]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (isTyping && content) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayedText(content.content);
          setIsTyping(false);
        } else {
          onClose();
        }
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isTyping, content, onClose]);

  if (!isOpen || !content) return null;

  const catColor = CATEGORY_COLOR[content.category] || '#4ade80';
  const typeLabel = TYPE_LABEL[content.type] || 'INFO';

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
            if (isTyping && content) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setDisplayedText(content.content);
              setIsTyping(false);
            } else {
              onClose();
            }
          }}
        >
          <div className="nes-border border-white/80 bg-black/95 p-5">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-2 py-0.5 text-black font-bold"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', backgroundColor: catColor }}
              >
                {typeLabel}
              </span>
              <span
                className="text-white"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
              >
                {speakerName}
              </span>
            </div>

            <h3
              className="mb-3"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: catColor, textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}
            >
              {content.title}
            </h3>

            <p
              className="text-white/90 leading-relaxed min-h-[60px]"
              style={{ fontFamily: 'var(--font-retro)', fontSize: '20px' }}
            >
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-white/80 ml-0.5 animate-pulse" />}
            </p>

            <div className="flex justify-end mt-3">
              {!isTyping && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
                  className="text-white/60"
                >
                  PRESS SPACE
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
