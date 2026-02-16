import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProtestCutsceneProps {
  onFinish: () => void;
}

interface NewsArticle {
  headline: string;
  source: string;
  date: string;
  snippet: string;
  category: 'raid' | 'detention' | 'rights' | 'family' | 'community';
}

const ARTICLES: NewsArticle[] = [
  {
    headline: "ICE Arrests 680 Workers in Largest Single-State Raid",
    source: "Associated Press",
    date: "Aug 7, 2019",
    snippet: "Federal agents carried out the largest single-state immigration enforcement operation in U.S. history at food processing plants across Mississippi, leaving children stranded.",
    category: 'raid',
  },
  {
    headline: "U.S. Citizen Held in ICE Detention for 1,273 Days",
    source: "The New York Times",
    date: "Oct 29, 2018",
    snippet: "Davino Watson, born in the United States, was detained by ICE for over three years. Officials ignored his repeated claims of citizenship.",
    category: 'detention',
  },
  {
    headline: "Families Separated at the Border: What We Know",
    source: "NBC News",
    date: "Jun 20, 2018",
    snippet: "Thousands of children have been separated from their parents under the administration's zero-tolerance policy. Many families remain apart.",
    category: 'family',
  },
  {
    headline: "Report: ICE Detainees Denied Medical Care",
    source: "The Washington Post",
    date: "Mar 15, 2020",
    snippet: "A government watchdog found inadequate medical care in ICE detention facilities, with detainees suffering from untreated infections, chronic conditions, and mental health crises.",
    category: 'detention',
  },
  {
    headline: "Communities in Fear: ICE Raids Keep Children Home From School",
    source: "CNN",
    date: "Aug 8, 2019",
    snippet: "In the wake of massive immigration raids, schools reported record absences as terrified families kept their children home.",
    category: 'community',
  },
  {
    headline: "ACLU: Know Your Rights When Encountering Immigration Agents",
    source: "ACLU",
    date: "Jan 12, 2020",
    snippet: "You have constitutional rights regardless of immigration status. You have the right to remain silent, the right to refuse entry without a judicial warrant, and the right to an attorney.",
    category: 'rights',
  },
  {
    headline: "ICE Courthouse Arrests Deter Immigrants From Seeking Justice",
    source: "Reuters",
    date: "Apr 3, 2019",
    snippet: "Reports of ICE agents making arrests at courthouses have caused a dramatic drop in immigrants reporting crimes or appearing as witnesses.",
    category: 'community',
  },
  {
    headline: "9-Year-Old U.S. Citizen Detained at Border for 32 Hours",
    source: "NBC News",
    date: "Mar 22, 2019",
    snippet: "A young American citizen was held by CBP agents who questioned her citizenship, despite carrying a U.S. passport.",
    category: 'rights',
  },
  {
    headline: "Deaths in ICE Custody Reach Highest Level in 15 Years",
    source: "The Guardian",
    date: "Dec 5, 2020",
    snippet: "At least 21 people died in ICE custody this fiscal year, the most in over a decade, raising questions about conditions and oversight.",
    category: 'detention',
  },
  {
    headline: "Immigrant Communities Organize 'Know Your Rights' Workshops",
    source: "Los Angeles Times",
    date: "Feb 14, 2020",
    snippet: "Community organizations across the country are holding workshops teaching residents their constitutional rights during ICE encounters.",
    category: 'community',
  },
  {
    headline: "ICE Uses Facial Recognition on Millions of Driver's License Photos",
    source: "The Washington Post",
    date: "Jul 7, 2019",
    snippet: "Federal agents have been scanning driver's license databases using facial recognition technology without the knowledge or consent of the individuals involved.",
    category: 'rights',
  },
  {
    headline: "Father Deported While Driving Daughter to School",
    source: "CBS News",
    date: "Mar 3, 2020",
    snippet: "A father of four U.S.-born children was arrested by ICE agents during a routine school drop-off. His daughter watched from the car.",
    category: 'family',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  raid: '#ef4444',
  detention: '#f97316',
  rights: '#3b82f6',
  family: '#a855f7',
  community: '#22c55e',
};

const CATEGORY_LABELS: Record<string, string> = {
  raid: 'RAIDS',
  detention: 'DETENTION',
  rights: 'CIVIL RIGHTS',
  family: 'FAMILIES',
  community: 'COMMUNITY',
};

export function ProtestCutscene({ onFinish }: ProtestCutsceneProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [fadeOut, setFadeOut] = useState(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const finishedRef = useRef(false);

  useEffect(() => {
    const showNext = () => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        if (next >= ARTICLES.length) {
          setFadeOut(true);
          setTimeout(() => {
            if (!finishedRef.current) {
              finishedRef.current = true;
              onFinishRef.current();
            }
          }, 1500);
          return prev;
        }
        return next;
      });
    };

    const initialDelay = setTimeout(showNext, 400);

    const interval = setInterval(showNext, 2200);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  const handleSkip = () => {
    if (!finishedRef.current) {
      finishedRef.current = true;
      setFadeOut(true);
      setTimeout(() => onFinishRef.current(), 800);
    }
  };

  const article = currentIndex >= 0 && currentIndex < ARTICLES.length ? ARTICLES[currentIndex] : null;
  const catColor = article ? CATEGORY_COLORS[article.category] : '#666';
  const catLabel = article ? CATEGORY_LABELS[article.category] : '';

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden scanlines" data-testid="protest-cutscene">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(30,30,50,1) 0%, rgba(5,5,10,1) 100%)',
      }} />

      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute left-0 right-0" style={{
            top: `${i * 12.5}%`,
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.5)',
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {article && !fadeOut && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            <div className="max-w-2xl w-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mb-4 flex items-center gap-3"
              >
                <div className="px-2 py-0.5" style={{
                  backgroundColor: catColor,
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '7px',
                  color: '#fff',
                  letterSpacing: '0.1em',
                }}>
                  {catLabel}
                </div>
                <span style={{
                  fontFamily: 'var(--font-retro)',
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  {article.source}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-white mb-4 leading-tight"
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
                }}
              >
                {article.headline}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-retro)',
                  fontSize: '20px',
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.6,
                }}
              >
                {article.snippet}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="mt-4"
                style={{
                  fontFamily: 'var(--font-retro)',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.2)',
                }}
              >
                {article.date}
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.0, ease: 'linear' }}
                className="mt-6 h-0.5 origin-left"
                style={{ backgroundColor: catColor, opacity: 0.4 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-40">
        {ARTICLES.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i <= currentIndex ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)',
              transform: i === currentIndex ? 'scale(1.5)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      <div className="absolute top-6 right-6 z-40" style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: '7px',
        color: 'rgba(255,255,255,0.2)',
      }}>
        {currentIndex >= 0 ? `${currentIndex + 1}/${ARTICLES.length}` : ''}
      </div>

      {fadeOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-black z-50"
        />
      )}

      <button
        data-testid="button-skip-cutscene"
        onClick={handleSkip}
        className="absolute top-6 left-6 z-50 px-3 py-1 bg-black/60 border border-white/20 text-white/40 hover:text-white transition-colors"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
      >
        SKIP
      </button>
    </div>
  );
}
