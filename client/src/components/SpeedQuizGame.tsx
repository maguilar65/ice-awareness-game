import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArcadeCabinet } from "./ArcadeCabinet";

interface QuizQuestion {
  question: string;
  answers: string[];
  correctIndex: number;
}

const QUESTIONS: QuizQuestion[] = [
  { question: "What type of warrant does ICE need to legally enter your home?", answers: ["Administrative warrant", "Judicial warrant signed by a judge", "Any warrant", "No warrant needed"], correctIndex: 1 },
  { question: "What amendment gives you the right to remain silent?", answers: ["First Amendment", "Third Amendment", "Fifth Amendment", "Tenth Amendment"], correctIndex: 2 },
  { question: "What should you say if asked to consent to a search of your car?", answers: ["Sure, go ahead", "I do not consent to a search", "I have nothing to hide", "Search whatever you want"], correctIndex: 1 },
  { question: "Can ICE conduct operations at schools?", answers: ["Yes, anytime", "Only with permission", "No, schools are sensitive locations", "Only on weekdays"], correctIndex: 2 },
  { question: "If detained by ICE, what should you do first?", answers: ["Sign all papers they give you", "Answer all their questions", "Ask for a lawyer immediately", "Try to run away"], correctIndex: 2 },
  { question: "Do constitutional rights apply only to citizens?", answers: ["Yes, only citizens", "Only to legal residents", "No, they apply to everyone on U.S. soil", "Only in certain states"], correctIndex: 2 },
  { question: "What happened to Davino Watson?", answers: ["He was promoted at work", "He was wrongfully deported despite being a U.S. citizen", "He won the lottery", "He moved to another country"], correctIndex: 1 },
  { question: "What should be part of a family emergency plan?", answers: ["A vacation itinerary", "A trusted guardian, documents in one place, lawyer's number", "A list of restaurants", "Extra cash only"], correctIndex: 1 },
  { question: "Can you legally record ICE encounters?", answers: ["No, it is illegal", "Only with ICE permission", "Yes, from a safe distance", "Only if you are a journalist"], correctIndex: 2 },
  { question: "What is the difference between local police and ICE?", answers: ["They are the same", "Local police handle local crimes, ICE is federal immigration enforcement", "ICE handles traffic stops", "Local police enforce immigration law"], correctIndex: 1 },
  { question: "What should you do if someone in uniform says 'Police, open up'?", answers: ["Open immediately", "Ignore them completely", "Ask for identification and a judicial warrant", "Call a neighbor"], correctIndex: 2 },
  { question: "What amendment protects against unreasonable searches?", answers: ["First Amendment", "Second Amendment", "Fourth Amendment", "Sixth Amendment"], correctIndex: 2 },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface SpeedQuizGameProps {
  onClose: () => void;
}

export function SpeedQuizGame({ onClose }: SpeedQuizGameProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'feedback' | 'done'>('ready');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
  const [joystickDir, setJoystickDir] = useState<'up' | 'down' | 'left' | 'right' | 'center'>('center');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setQuestions(shuffleArray(QUESTIONS));
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

  const handleAnswer = useCallback((answerIdx: number) => {
    if (gameState !== 'playing') return;
    const current = questions[currentIdx];
    if (!current) { setGameState('done'); return; }

    setActiveBtn(answerIdx);
    const dirs: Array<'up' | 'right' | 'down' | 'left'> = ['up', 'right', 'down', 'left'];
    setJoystickDir(dirs[answerIdx] || 'center');
    setTimeout(() => { setActiveBtn(null); setJoystickDir('center'); }, 250);

    const wasCorrect = answerIdx === current.correctIndex;
    setSelectedAnswer(answerIdx);
    setIsCorrect(wasCorrect);
    setGameState('feedback');

    if (wasCorrect) {
      setScore(s => s + Math.max(10, timeLeft));
      setCorrect(c => c + 1);
    }

    setTimeout(() => {
      if (currentIdx + 1 >= questions.length) {
        setGameState('done');
      } else {
        setCurrentIdx(i => i + 1);
        setGameState('playing');
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 1200);
  }, [gameState, questions, currentIdx, timeLeft]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        if (e.key === '1') handleAnswer(0);
        if (e.key === '2') handleAnswer(1);
        if (e.key === '3') handleAnswer(2);
        if (e.key === '4') handleAnswer(3);
      }
      if (gameState === 'ready' && (e.key === ' ' || e.key === 'Enter')) {
        setGameState('playing');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, handleAnswer]);

  const current = questions[currentIdx];

  const getRating = () => {
    const pct = correct / Math.max(currentIdx, 1);
    if (pct >= 0.9) return { text: "RIGHTS EXPERT!", color: "#fbbf24" };
    if (pct >= 0.7) return { text: "WELL INFORMED!", color: "#4ade80" };
    if (pct >= 0.5) return { text: "GETTING THERE", color: "#60a5fa" };
    return { text: "KEEP STUDYING", color: "#f87171" };
  };

  const timerPct = (timeLeft / 30) * 100;

  return (
    <ArcadeCabinet
      title="SPEED QUIZ"
      color="#eab308"
      onClose={onClose}
      joystickDirection={joystickDir}
      activeButton={activeBtn}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-5 bg-black/90">
        <div className="w-full max-w-2xl flex flex-col items-center gap-2 sm:gap-4">
          {gameState !== 'ready' && (
            <div className="flex items-center justify-between w-full">
              <span className="text-white/60" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(10px, 2.5vw, 14px)' }}>
                {correct} correct
              </span>
              <span style={{
                fontFamily: 'var(--font-pixel)', fontSize: 'clamp(11px, 2.5vw, 15px)',
                color: timeLeft <= 10 ? '#f87171' : timeLeft <= 20 ? '#fbbf24' : '#4ade80',
              }}>
                {timeLeft}s
              </span>
            </div>
          )}

          {(gameState === 'playing' || gameState === 'feedback') && (
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: timeLeft <= 10 ? '#f87171' : timeLeft <= 20 ? '#fbbf24' : '#4ade80' }}
                animate={{ width: `${timerPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {gameState === 'ready' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3 sm:space-y-5">
              <p className="text-white/70" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(15px, 3vw, 22px)' }}>
                Answer as many rights questions as you can in 30 seconds! Press 1-4 or tap to answer. Faster answers = more points!
              </p>
              <button
                data-testid="button-start-speed"
                onClick={() => setGameState('playing')}
                className="px-6 py-2 bg-yellow-700 text-white border-2 border-yellow-500 hover-elevate active-elevate-2"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(11px, 2.5vw, 15px)' }}
              >
                START
              </button>
            </motion.div>
          )}

          {(gameState === 'playing' || gameState === 'feedback') && current && (
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-2 sm:space-y-3"
            >
              <div className="nes-border border-white/40 bg-white/5 p-2.5 sm:p-4">
                <p className="text-white leading-relaxed text-center" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(14px, 2.8vw, 22px)' }}>
                  {current.question}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {current.answers.map((answer, i) => {
                  let borderColor = 'rgba(255,255,255,0.2)';
                  let bgColor = 'rgba(255,255,255,0.05)';
                  const btnColors = ['#dc2626', '#2563eb', '#16a34a', '#ca8a04'];

                  if (gameState === 'feedback') {
                    if (i === current.correctIndex) {
                      borderColor = 'rgba(74,222,128,0.7)';
                      bgColor = 'rgba(74,222,128,0.15)';
                    } else if (i === selectedAnswer && !isCorrect) {
                      borderColor = 'rgba(248,113,113,0.7)';
                      bgColor = 'rgba(248,113,113,0.15)';
                    }
                  }

                  return (
                    <button
                      key={i}
                      data-testid={`speed-answer-${i}`}
                      onClick={() => handleAnswer(i)}
                      disabled={gameState !== 'playing'}
                      className="w-full text-left px-2.5 py-2 flex items-center gap-2 transition-colors hover-elevate active-elevate-2"
                      style={{
                        border: `2px solid ${borderColor}`,
                        backgroundColor: bgColor,
                        fontFamily: 'var(--font-retro)',
                        fontSize: 'clamp(13px, 2.5vw, 17px)',
                        opacity: gameState === 'feedback' ? 0.8 : 1,
                      }}
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{
                        backgroundColor: `${btnColors[i]}44`,
                        border: `1px solid ${btnColors[i]}88`,
                        fontFamily: 'var(--font-pixel)',
                        fontSize: 'clamp(10px, 2vw, 12px)',
                        color: btnColors[i],
                      }}>
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      <span className="text-white/90">{answer}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <span style={{
                      fontFamily: 'var(--font-pixel)', fontSize: 'clamp(11px, 2.5vw, 15px)',
                      color: isCorrect ? '#4ade80' : '#f87171',
                    }}>
                      {isCorrect ? '+' + Math.max(10, timeLeft) + ' pts!' : 'WRONG'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  {correct} correct out of {currentIdx} questions
                </p>
                <p className="text-yellow-400" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(11px, 2.5vw, 15px)' }}>
                  SCORE: {score}
                </p>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    data-testid="button-play-again-speed"
                    onClick={() => {
                      setQuestions(shuffleArray(QUESTIONS));
                      setCurrentIdx(0);
                      setScore(0);
                      setCorrect(0);
                      setTimeLeft(30);
                      setGameState('ready');
                      setSelectedAnswer(null);
                      setIsCorrect(null);
                    }}
                    className="px-3 py-1.5 bg-yellow-700 text-white border-2 border-yellow-500 hover-elevate active-elevate-2"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(9px, 2vw, 13px)' }}
                  >
                    PLAY AGAIN
                  </button>
                  <button
                    data-testid="button-exit-speed"
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
