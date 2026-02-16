import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "Do you have to open the door if ICE knocks?",
    choices: ["Yes, it is required by law", "No, unless they have a judicial warrant", "Only if they ask nicely", "Only during daytime hours"],
    correctIndex: 1,
    explanation: "You do NOT have to open your door unless ICE has a judicial warrant signed by a judge. An administrative warrant (Form I-200) does not give them authority to enter your home.",
  },
  {
    question: "What right does everyone in the U.S. have, regardless of immigration status?",
    choices: ["The right to vote", "The right to remain silent", "The right to carry a firearm", "The right to free healthcare"],
    correctIndex: 1,
    explanation: "Everyone in the United States has the right to remain silent under the Fifth Amendment, regardless of their immigration status. You do not have to answer questions about where you were born or your immigration status.",
  },
  {
    question: "What is a 'sensitive location' where ICE generally cannot conduct enforcement?",
    choices: ["Shopping malls", "Schools and churches", "Public parks", "Gas stations"],
    correctIndex: 1,
    explanation: "Under policy guidelines, ICE generally avoids enforcement actions at sensitive locations like schools, hospitals, churches, courthouses, and public demonstrations.",
  },
  {
    question: "If ICE stops you on the street, what should you do?",
    choices: ["Run away immediately", "Stay calm, ask if you are free to leave, and exercise your right to remain silent", "Give them fake documents", "Argue with the officers"],
    correctIndex: 1,
    explanation: "Stay calm. You can ask 'Am I free to leave?' If yes, walk away calmly. If detained, you have the right to remain silent and the right to speak with a lawyer. Do not sign anything you don't understand.",
  },
  {
    question: "Can ICE legally deport a U.S. citizen?",
    choices: ["No, it has never happened", "Yes, it has happened by mistake to thousands of citizens", "Only if they commit a crime", "Only if they were born abroad"],
    correctIndex: 1,
    explanation: "Wrongful deportation of U.S. citizens has been documented. Studies show thousands of U.S. citizens have been mistakenly detained or deported by ICE, highlighting the importance of knowing your rights.",
  },
  {
    question: "What is a 'Know Your Rights' card?",
    choices: ["A government-issued ID", "A card stating your constitutional rights to show to agents", "A library card", "A voter registration card"],
    correctIndex: 1,
    explanation: "A Know Your Rights card is a printed card you can carry that states your constitutional rights. You can show it to officers instead of speaking, helping you exercise your right to remain silent.",
  },
  {
    question: "What should a family have prepared in case of an ICE encounter?",
    choices: ["A getaway car", "An emergency plan including emergency contacts, important documents, and a plan for children", "Hidden weapons", "Nothing, there is no way to prepare"],
    correctIndex: 1,
    explanation: "Families should prepare an emergency plan that includes: trusted emergency contacts, copies of important documents, a plan for who will care for children, and a memorized lawyer's phone number.",
  },
  {
    question: "Can ICE enter your workplace without permission?",
    choices: ["Yes, anytime they want", "Only with a valid judicial warrant or employer consent", "Only on weekdays", "Only if they suspect a crime"],
    correctIndex: 1,
    explanation: "ICE needs either a valid judicial warrant or employer consent to enter non-public areas of a workplace. Workers have rights during workplace raids, including the right to remain silent.",
  },
  {
    question: "What does 'due process' mean for immigrants?",
    choices: ["They have no rights in court", "They have the right to a hearing before a judge before being deported", "They must leave immediately when told", "It only applies to citizens"],
    correctIndex: 1,
    explanation: "Due process means everyone, including undocumented immigrants, has the right to a hearing before an immigration judge. This is protected by the U.S. Constitution's 14th Amendment.",
  },
  {
    question: "How can communities protect each other from unjust enforcement?",
    choices: ["By ignoring the problem", "By organizing rapid response networks, knowing rights, and supporting affected families", "By calling ICE on suspicious neighbors", "There is nothing communities can do"],
    correctIndex: 1,
    explanation: "Communities can organize rapid response networks to document encounters, share know-your-rights information, provide legal resources, and support families affected by enforcement actions.",
  },
];

interface QuizModeProps {
  onFinish: () => void;
}

export function QuizMode({ onFinish }: QuizModeProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[currentQ];
  const isCorrect = selected === question.correctIndex;

  const handleSelect = useCallback((index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (index === question.correctIndex) {
      setScore(prev => prev + 1);
    }
  }, [showResult, question.correctIndex]);

  const handleNext = useCallback(() => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  }, [currentQ]);

  if (finished) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const grade = percentage >= 90 ? "COMMUNITY CHAMPION" : percentage >= 70 ? "RIGHTS DEFENDER" : percentage >= 50 ? "LEARNING ADVOCATE" : "KEEP LEARNING";
    const gradeColor = percentage >= 90 ? "#4ade80" : percentage >= 70 ? "#facc15" : percentage >= 50 ? "#fb923c" : "#f87171";

    return (
      <div className="fixed inset-0 bg-black flex flex-col scanlines z-50 overflow-y-auto p-6 sm:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex-1 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8"
        >
          <h2
            className="leading-loose"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(14px, 4vw, 22px)', color: gradeColor, textShadow: `0 0 20px ${gradeColor}40` }}
          >
            {grade}
          </h2>
          <div className="bg-white/5 border border-white/20 p-4 sm:p-6 space-y-4">
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(10px, 3vw, 14px)', color: '#4ade80' }} data-testid="text-quiz-score">
              {score} / {quizQuestions.length}
            </p>
            <p className="text-white/70" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(16px, 4vw, 22px)' }}>
              {percentage >= 70
                ? "Great job! You know your rights and how to protect your community."
                : "Knowledge is power. Keep learning about your rights and share what you know with your community."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              data-testid="button-retake-quiz"
              onClick={() => {
                setCurrentQ(0);
                setSelected(null);
                setShowResult(false);
                setScore(0);
                setFinished(false);
              }}
              className="px-6 py-2 bg-white/10 text-white border border-white/30 hover-elevate active-elevate-2"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(8px, 2.5vw, 11px)', boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.1)' }}
            >
              RETAKE QUIZ
            </button>
            <button
              data-testid="button-back-to-title"
              onClick={onFinish}
              className="px-6 py-2 bg-green-700 text-white border-2 border-green-500 hover-elevate active-elevate-2"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(8px, 2.5vw, 11px)', boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.1)' }}
            >
              BACK TO TITLE
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col scanlines z-50 p-6 sm:p-10 lg:p-14">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(8px, 2.5vw, 11px)' }} className="text-green-400">
          KNOW YOUR RIGHTS QUIZ
        </p>
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(8px, 2.5vw, 10px)' }} className="text-white/40" data-testid="text-question-progress">
          {currentQ + 1} / {quizQuestions.length}
        </p>
      </div>

      <div className="w-full bg-white/10 h-1 mb-4 sm:mb-6 flex-shrink-0">
        <motion.div
          className="h-full bg-green-500"
          animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            <p
              className="text-white leading-relaxed mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(20px, 4.5vw, 32px)' }}
              data-testid="text-quiz-question"
            >
              {question.question}
            </p>

            <div className="flex-1 flex flex-col gap-3 sm:gap-4 justify-center">
              {question.choices.map((choice, i) => {
                let borderColor = 'rgba(255,255,255,0.15)';
                let bgColor = 'rgba(255,255,255,0.03)';
                let textColor = 'rgba(255,255,255,0.8)';

                if (showResult) {
                  if (i === question.correctIndex) {
                    borderColor = '#4ade80';
                    bgColor = 'rgba(74,222,128,0.1)';
                    textColor = '#4ade80';
                  } else if (i === selected && !isCorrect) {
                    borderColor = '#f87171';
                    bgColor = 'rgba(248,113,113,0.1)';
                    textColor = '#f87171';
                  } else {
                    textColor = 'rgba(255,255,255,0.3)';
                  }
                }

                return (
                  <button
                    key={i}
                    data-testid={`button-quiz-choice-${i}`}
                    onClick={() => handleSelect(i)}
                    disabled={showResult}
                    className="w-full flex-1 text-left p-5 sm:p-6 transition-all duration-200 flex items-center"
                    style={{
                      fontFamily: 'var(--font-retro)',
                      fontSize: 'clamp(16px, 3.5vw, 22px)',
                      border: `2px solid ${borderColor}`,
                      backgroundColor: bgColor,
                      color: textColor,
                      cursor: showResult ? 'default' : 'pointer',
                      boxShadow: !showResult ? 'inset -2px -2px 0 rgba(0,0,0,0.2), inset 2px 2px 0 rgba(255,255,255,0.05)' : 'none',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(8px, 2vw, 10px)', marginRight: 8, opacity: 0.5 }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {choice}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div
                  className="p-3 sm:p-4"
                  style={{
                    backgroundColor: isCorrect ? 'rgba(74,222,128,0.08)' : 'rgba(251,191,36,0.08)',
                    border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.3)' : 'rgba(251,191,36,0.3)'}`,
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(8px, 2.5vw, 10px)', color: isCorrect ? '#4ade80' : '#fbbf24', marginBottom: 6 }}>
                    {isCorrect ? "CORRECT" : "NOT QUITE"}
                  </p>
                  <p className="text-white/70 leading-relaxed" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(13px, 3vw, 16px)' }} data-testid="text-quiz-explanation">
                    {question.explanation}
                  </p>
                </div>
                <button
                  data-testid="button-quiz-next"
                  onClick={handleNext}
                  className="w-full py-2 bg-green-700 text-white border-2 border-green-500 hover-elevate active-elevate-2"
                  style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(8px, 2.5vw, 11px)', boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.15)' }}
                >
                  {currentQ < quizQuestions.length - 1 ? "NEXT QUESTION" : "SEE RESULTS"}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
