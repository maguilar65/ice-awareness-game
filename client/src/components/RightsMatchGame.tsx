import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArcadeCabinet } from "./ArcadeCabinet";

interface Card {
  id: number;
  content: string;
  pairId: number;
  type: 'right' | 'description';
  flipped: boolean;
  matched: boolean;
}

const PAIRS = [
  { right: "Right to Remain Silent", description: "You do not have to answer questions about your immigration status" },
  { right: "Right to a Lawyer", description: "You can request legal representation if detained" },
  { right: "Warrant Requirement", description: "ICE needs a judicial warrant signed by a judge to enter your home" },
  { right: "Refuse a Search", description: "You can say 'I do not consent to a search' of your vehicle" },
  { right: "Record Encounters", description: "You can observe and record ICE activity from a safe distance" },
  { right: "Emergency Plan", description: "Designate a trusted person and memorize a lawyer's number" },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface RightsMatchGameProps {
  onClose: () => void;
}

export function RightsMatchGame({ onClose }: RightsMatchGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lastClickedBtn, setLastClickedBtn] = useState<number | null>(null);

  useEffect(() => {
    const allCards: Card[] = [];
    PAIRS.forEach((pair, idx) => {
      allCards.push({ id: idx * 2, content: pair.right, pairId: idx, type: 'right', flipped: false, matched: false });
      allCards.push({ id: idx * 2 + 1, content: pair.description, pairId: idx, type: 'description', flipped: false, matched: false });
    });
    setCards(shuffleArray(allCards));
  }, []);

  const handleCardClick = useCallback((cardId: number) => {
    if (checking || gameOver) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;
    if (selected.length >= 2) return;

    setLastClickedBtn(cardId % 4);
    setTimeout(() => setLastClickedBtn(null), 150);

    const newCards = cards.map(c => c.id === cardId ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newSelected = [...selected, cardId];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      setChecking(true);
      const first = newCards.find(c => c.id === newSelected[0])!;
      const second = newCards.find(c => c.id === newSelected[1])!;

      if (first.pairId === second.pairId && first.type !== second.type) {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.pairId === first.pairId ? { ...c, matched: true, flipped: true } : c
          ));
          const newMatched = matchedPairs + 1;
          setMatchedPairs(newMatched);
          if (newMatched === PAIRS.length) setGameOver(true);
          setSelected([]);
          setChecking(false);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newSelected.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setChecking(false);
        }, 1000);
      }
    }
  }, [cards, selected, checking, gameOver, matchedPairs]);

  const getRating = () => {
    if (moves <= PAIRS.length + 2) return { text: "PERFECT!", color: "#fbbf24" };
    if (moves <= PAIRS.length * 2) return { text: "GREAT!", color: "#4ade80" };
    if (moves <= PAIRS.length * 3) return { text: "GOOD", color: "#60a5fa" };
    return { text: "KEEP PRACTICING", color: "#f87171" };
  };

  return (
    <ArcadeCabinet
      title="RIGHTS MATCH"
      color="#ef4444"
      onClose={onClose}
      joystickDirection="center"
      activeButton={lastClickedBtn}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-5 bg-black/90">
        <div className="w-full max-w-3xl flex flex-col items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-white/60" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(8px, 2vw, 11px)' }}>
                MOVES: <span className="text-white">{moves}</span>
              </span>
            </div>
            <span className="text-red-400" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(8px, 2vw, 11px)' }}>
              {matchedPairs}/{PAIRS.length}
            </span>
          </div>

          <p className="text-white/50 text-center" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(11px, 2vw, 14px)' }}>
            Match each right with its description
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 w-full">
            {cards.map(card => (
              <motion.button
                key={card.id}
                data-testid={`card-${card.id}`}
                onClick={() => handleCardClick(card.id)}
                className="relative aspect-[3/4] rounded-sm overflow-visible"
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: card.matched ? 'rgba(74,222,128,0.15)' : card.flipped ? '#1a1a3e' : '#2a2a4e',
                  border: card.matched ? '2px solid rgba(74,222,128,0.5)' : card.flipped ? '2px solid rgba(100,150,255,0.5)' : '2px solid rgba(255,255,255,0.15)',
                  cursor: card.matched || card.flipped ? 'default' : 'pointer',
                  boxShadow: card.matched ? '0 0 12px rgba(74,222,128,0.2)' : card.flipped ? '0 0 8px rgba(100,150,255,0.2)' : 'none',
                }}
              >
                {(card.flipped || card.matched) ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-1 sm:p-1.5">
                    <span className="text-center leading-tight" style={{
                      fontFamily: card.type === 'right' ? 'var(--font-pixel)' : 'var(--font-retro)',
                      fontSize: card.type === 'right' ? 'clamp(5px, 1.2vw, 8px)' : 'clamp(7px, 1.5vw, 11px)',
                      color: card.type === 'right' ? '#fbbf24' : '#e0e0ff',
                    }}>
                      {card.content}
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(10px, 2.5vw, 18px)', color: 'rgba(255,255,255,0.3)' }}>?</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-[10] bg-black/90 flex flex-col items-center justify-center p-4"
              >
                <div className="nes-border border-white/60 bg-black p-4 sm:p-6 text-center space-y-3 max-w-md">
                  <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(12px, 3.5vw, 20px)', color: getRating().color, textShadow: `0 0 15px ${getRating().color}44` }}>
                    {getRating().text}
                  </h2>
                  <p className="text-white/70" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(13px, 2.5vw, 18px)' }}>
                    All rights matched in {moves} moves!
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      data-testid="button-play-again-match"
                      onClick={() => {
                        const allCards: Card[] = [];
                        PAIRS.forEach((pair, idx) => {
                          allCards.push({ id: idx * 2, content: pair.right, pairId: idx, type: 'right', flipped: false, matched: false });
                          allCards.push({ id: idx * 2 + 1, content: pair.description, pairId: idx, type: 'description', flipped: false, matched: false });
                        });
                        setCards(shuffleArray(allCards));
                        setSelected([]);
                        setMatchedPairs(0);
                        setMoves(0);
                        setGameOver(false);
                      }}
                      className="px-3 py-1.5 bg-green-700 text-white border-2 border-green-500 hover-elevate active-elevate-2"
                      style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(7px, 1.8vw, 10px)' }}
                    >
                      PLAY AGAIN
                    </button>
                    <button
                      data-testid="button-exit-match"
                      onClick={onClose}
                      className="px-3 py-1.5 bg-white/10 text-white border-2 border-white/30 hover-elevate active-elevate-2"
                      style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(7px, 1.8vw, 10px)' }}
                    >
                      WALK AWAY
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ArcadeCabinet>
  );
}
