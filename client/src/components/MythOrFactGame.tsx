import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArcadeCabinet } from "./ArcadeCabinet";

interface Statement {
  text: string;
  isFact: boolean;
  explanation: string;
}

const STATEMENTS: Statement[] = [
  { text: "ICE needs a judicial warrant signed by a judge to legally enter your home.", isFact: true, explanation: "An ICE administrative warrant does NOT give them the right to enter. Only a judicial warrant signed by a federal judge does." },
  { text: "You must answer all questions about your immigration status when stopped.", isFact: false, explanation: "You have the Fifth Amendment right to remain silent. You do not have to answer questions about your immigration status." },
  { text: "U.S. citizens have been wrongfully deported by ICE.", isFact: true, explanation: "Davino Watson, a U.S. citizen, was wrongfully deported despite telling agents he was born in America." },
  { text: "ICE can search your car at a checkpoint without your consent.", isFact: false, explanation: "You have the right to say 'I do not consent to a search.' The Fourth Amendment protects against unreasonable searches." },
  { text: "Schools are designated safe zones where ICE cannot enter.", isFact: true, explanation: "Schools, hospitals, and places of worship are considered sensitive locations where ICE generally cannot conduct enforcement." },
  { text: "If ICE knocks on your door, you must open it immediately.", isFact: false, explanation: "You have the right to keep your door closed. Ask them to slip the warrant under the door. If it's not signed by a judge, don't open." },
  { text: "You have the right to record ICE encounters from a safe distance.", isFact: true, explanation: "You can legally observe and record law enforcement activity from a safe distance. This evidence can help fight wrongful detentions." },
  { text: "Only citizens have constitutional rights in the United States.", isFact: false, explanation: "The Constitution protects everyone on U.S. soil, regardless of immigration status. This includes the right to remain silent and the right to a lawyer." },
  { text: "Local police and ICE are the same organization.", isFact: false, explanation: "Local police handle local crimes. ICE is a federal agency. Many cities have policies preventing local police from cooperating with ICE." },
  { text: "People in ICE detention have the right to contact a lawyer.", isFact: true, explanation: "Everyone detained has the right to request legal representation. If detained, ask for a lawyer immediately." },
  { text: "Having an emergency family plan can help if a family member is detained.", isFact: true, explanation: "An emergency plan includes a trusted guardian for children, important documents in one place, and a lawyer's number memorized." },
  { text: "ICE agents sometimes identify themselves as 'police' to get people to open doors.", isFact: true, explanation: "This is a documented tactic. Always ask for identification and a judicial warrant before opening your door." },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface MythOrFactGameProps {
  onClose: () => void;
}

export function MythOrFactGame({ onClose }: MythOrFactGameProps) {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'feedback' | 'done'>('ready');
  const [lastAnswer, setLastAnswer] = useState<'correct' | 'wrong' | null>(null);
  const [joystickDir, setJoystickDir] = useState<'left' | 'right' | 'center'>('center');
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setStatements(shuffleArray(STATEMENTS));
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('done');
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState]);

  const handleAnswer = useCallback((answeredFact: boolean) => {
    if (gameState !== 'playing') return;
    const current = statements[currentIdx];
    if (!current) { setGameState('done'); return; }

    setJoystickDir(answeredFact ? 'right' : 'left');
    setActiveBtn(answeredFact ? 2 : 0);
    setTimeout(() => { setJoystickDir('center'); setActiveBtn(null); }, 300);

    const isCorrect = answeredFact === current.isFact;
    if (isCorrect) {
      setScore(s => s + 10 + streak * 5);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setLastAnswer(isCorrect ? 'correct' : 'wrong');
    setGameState('feedback');

    setTimeout(() => {
      if (currentIdx + 1 >= statements.length) {
        setGameState('done');
      } else {
        setCurrentIdx(i => i + 1);
        setGameState('playing');
        setLastAnswer(null);
      }
    }, 1500);
  }, [gameState, statements, currentIdx, streak]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        if (e.key === 'f' || e.key === 'F' || e.key === 'ArrowRight') handleAnswer(true);
        if (e.key === 'm' || e.key === 'M' || e.key === 'ArrowLeft') handleAnswer(false);
      }
      if (gameState === 'ready' && (e.key === ' ' || e.key === 'Enter')) {
        setGameState('playing');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, handleAnswer]);

  const current = statements[currentIdx];

  const getRating = () => {
    const maxScore = statements.length * 10;
    const pct = score / maxScore;
    if (pct >= 0.8) return { text: "EXPERT!", color: "#fbbf24" };
    if (pct >= 0.6) return { text: "GREAT JOB!", color: "#4ade80" };
    if (pct >= 0.4) return { text: "GOOD EFFORT", color: "#60a5fa" };
    return { text: "KEEP LEARNING", color: "#f87171" };
  };

  return (
    <ArcadeCabinet
      title="MYTH OR FACT"
      color="#3b82f6"
      onClose={onClose}
      joystickDirection={joystickDir}
      activeButton={activeBtn}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-5 bg-black/90">
        <div className="w-full max-w-2xl flex flex-col items-center gap-3 sm:gap-4">
          {gameState !== 'ready' && (
            <div className="flex items-center justify-between w-full">
              <span className="text-white/60" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(10px, 2.5vw, 14px)' }}>
                SCORE: <span className="text-yellow-400">{score}</span>
              </span>
              <span style={{
                fontFamily: 'var(--font-pixel)', fontSize: 'clamp(10px, 2.5vw, 14px)',
                color: timeLeft <= 10 ? '#f87171' : '#fff',
              }}>
                {timeLeft}s
              </span>
            </div>
          )}

          {gameState === 'ready' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3 sm:space-y-5">
              <p className="text-white/70" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(15px, 3vw, 22px)' }}>
                Read each statement and decide — is it a FACT or a MYTH? You have 45 seconds. Streaks give bonus points!
              </p>
              <div className="flex justify-center gap-4 flex-wrap" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(13px, 2.5vw, 17px)' }}>
                <span className="text-red-400">M / Left = Myth</span>
                <span className="text-green-400">F / Right = Fact</span>
              </div>
              <button
                data-testid="button-start-myth"
                onClick={() => setGameState('playing')}
                className="px-6 py-2 bg-blue-700 text-white border-2 border-blue-500 hover-elevate active-elevate-2"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(11px, 2.5vw, 15px)' }}
              >
                START
              </button>
            </motion.div>
          )}

          {(gameState === 'playing' || gameState === 'feedback') && current && (
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full"
            >
              {streak >= 3 && (
                <div className="text-center mb-2">
                  <span className="text-yellow-400" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(9px, 2vw, 13px)' }}>
                    STREAK x{streak}!
                  </span>
                </div>
              )}
              <div className="nes-border border-white/40 bg-white/5 p-3 sm:p-5 text-center">
                <p className="text-white leading-relaxed" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(15px, 3vw, 24px)' }}>
                  "{current.text}"
                </p>
              </div>

              <AnimatePresence>
                {lastAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 p-2 text-center"
                    style={{
                      backgroundColor: lastAnswer === 'correct' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                      border: `1px solid ${lastAnswer === 'correct' ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`,
                    }}
                  >
                    <p style={{
                      fontFamily: 'var(--font-pixel)', fontSize: 'clamp(10px, 2vw, 14px)',
                      color: lastAnswer === 'correct' ? '#4ade80' : '#f87171',
                    }}>
                      {lastAnswer === 'correct' ? 'CORRECT!' : 'WRONG!'}
                    </p>
                    <p className="text-white/60 mt-1" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(12px, 2.2vw, 16px)' }}>
                      {current.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {gameState === 'playing' && (
                <div className="flex gap-3 justify-center mt-3">
                  <button
                    data-testid="button-myth"
                    onClick={() => handleAnswer(false)}
                    className="flex-1 max-w-[180px] py-2.5 bg-red-800/50 text-white border-2 border-red-500/60 hover-elevate active-elevate-2"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(11px, 2.5vw, 15px)' }}
                  >
                    MYTH
                  </button>
                  <button
                    data-testid="button-fact"
                    onClick={() => handleAnswer(true)}
                    className="flex-1 max-w-[180px] py-2.5 bg-green-800/50 text-white border-2 border-green-500/60 hover-elevate active-elevate-2"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(11px, 2.5vw, 15px)' }}
                  >
                    FACT
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {gameState === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-3 w-full"
            >
              <div className="nes-border border-white/60 bg-black p-4 sm:p-6 space-y-3">
                <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(15px, 4vw, 24px)', color: getRating().color, textShadow: `0 0 15px ${getRating().color}44` }}>
                  {getRating().text}
                </h2>
                <p className="text-white/70" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(15px, 3vw, 22px)' }}>
                  Final score: {score} points
                </p>
                <p className="text-white/50" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(13px, 2.5vw, 17px)' }}>
                  You answered {currentIdx} out of {statements.length} statements
                </p>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    data-testid="button-play-again-myth"
                    onClick={() => {
                      setStatements(shuffleArray(STATEMENTS));
                      setCurrentIdx(0);
                      setScore(0);
                      setStreak(0);
                      setTimeLeft(45);
                      setGameState('ready');
                      setLastAnswer(null);
                    }}
                    className="px-3 py-1.5 bg-blue-700 text-white border-2 border-blue-500 hover-elevate active-elevate-2"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(9px, 2vw, 13px)' }}
                  >
                    PLAY AGAIN
                  </button>
                  <button
                    data-testid="button-exit-myth"
                    onClick={onClose}
                    className="px-3 py-1.5 bg-white/10 text-white border-2 border-white/30 hover-elevate active-elevate-2"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(9px, 2vw, 13px)' }}
                  >
                    WALK AWAY
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ArcadeCabinet>
  );
}
