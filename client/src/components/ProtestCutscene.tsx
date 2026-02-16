import { useState, useEffect, useRef } from "react";

interface ProtestCutsceneProps {
  onFinish: () => void;
}

interface NewsArticle {
  headline: string;
  source: string;
  date: string;
  snippet: string;
  tag: string;
  tagColor: string;
}

const ARTICLES: NewsArticle[] = [
  {
    headline: "ICE Arrests 680 Workers in Largest Single-State Raid",
    source: "Associated Press",
    date: "Aug 7, 2019",
    snippet: "Federal agents carried out the largest single-state immigration enforcement operation in U.S. history at food processing plants across Mississippi, leaving children stranded.",
    tag: "RAIDS",
    tagColor: "#ef4444",
  },
  {
    headline: "U.S. Citizen Held in ICE Detention for 1,273 Days",
    source: "The New York Times",
    date: "Oct 29, 2018",
    snippet: "Davino Watson, born in the United States, was detained by ICE for over three years. Officials ignored his repeated claims of citizenship.",
    tag: "DETENTION",
    tagColor: "#f97316",
  },
  {
    headline: "Thousands of Children Separated From Parents at Border",
    source: "NBC News",
    date: "Jun 20, 2018",
    snippet: "Thousands of children have been separated from their parents under the zero-tolerance policy. Many families remain apart years later.",
    tag: "FAMILIES",
    tagColor: "#a855f7",
  },
  {
    headline: "ICE Detainees Denied Medical Care, Watchdog Finds",
    source: "The Washington Post",
    date: "Mar 15, 2020",
    snippet: "A government watchdog found inadequate medical care in ICE detention facilities, with detainees suffering from untreated infections and chronic conditions.",
    tag: "DETENTION",
    tagColor: "#f97316",
  },
  {
    headline: "Communities in Fear: ICE Raids Keep Children Home From School",
    source: "CNN",
    date: "Aug 8, 2019",
    snippet: "In the wake of massive immigration raids, schools reported record absences as terrified families kept their children home.",
    tag: "COMMUNITY",
    tagColor: "#22c55e",
  },
  {
    headline: "ACLU: Know Your Rights When Encountering Immigration Agents",
    source: "ACLU",
    date: "Jan 12, 2020",
    snippet: "You have constitutional rights regardless of immigration status. You have the right to remain silent and the right to refuse entry without a judicial warrant.",
    tag: "CIVIL RIGHTS",
    tagColor: "#3b82f6",
  },
  {
    headline: "ICE Courthouse Arrests Deter Immigrants From Seeking Justice",
    source: "Reuters",
    date: "Apr 3, 2019",
    snippet: "Reports of ICE agents arresting people at courthouses caused a dramatic drop in immigrants reporting crimes or appearing as witnesses.",
    tag: "COMMUNITY",
    tagColor: "#22c55e",
  },
  {
    headline: "9-Year-Old U.S. Citizen Detained at Border for 32 Hours",
    source: "NBC News",
    date: "Mar 22, 2019",
    snippet: "A young American citizen was held by border agents who questioned her citizenship, despite carrying a U.S. passport.",
    tag: "CIVIL RIGHTS",
    tagColor: "#3b82f6",
  },
  {
    headline: "Father Deported While Driving Daughter to School",
    source: "CBS News",
    date: "Mar 3, 2020",
    snippet: "A father of four U.S.-born children was arrested by ICE agents during a routine school drop-off. His daughter watched from the car.",
    tag: "FAMILIES",
    tagColor: "#a855f7",
  },
  {
    headline: "Immigrant Communities Organize Know Your Rights Workshops",
    source: "Los Angeles Times",
    date: "Feb 14, 2020",
    snippet: "Community organizations across the country are holding workshops teaching residents their constitutional rights during ICE encounters.",
    tag: "COMMUNITY",
    tagColor: "#22c55e",
  },
];

export function ProtestCutscene({ onFinish }: ProtestCutsceneProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const calledRef = useRef(false);

  useEffect(() => {
    if (done) return;

    const cycle = () => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => {
          const next = prev + 1;
          if (next >= ARTICLES.length) {
            setDone(true);
            return prev;
          }
          setVisible(true);
          return next;
        });
      }, 500);
    };

    const timer = setTimeout(cycle, 2500);
    return () => clearTimeout(timer);
  }, [index, done]);

  useEffect(() => {
    if (done && !calledRef.current) {
      calledRef.current = true;
      const t = setTimeout(() => onFinishRef.current(), 1500);
      return () => clearTimeout(t);
    }
  }, [done]);

  const handleSkip = () => {
    if (!calledRef.current) {
      calledRef.current = true;
      setDone(true);
      setTimeout(() => onFinishRef.current(), 600);
    }
  };

  const article = ARTICLES[index];

  return (
    <div
      data-testid="protest-cutscene"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        opacity: done ? 0 : 1,
        transition: 'opacity 1s ease-out',
      }}
    >
      <div
        style={{
          maxWidth: 640,
          width: '100%',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            display: 'inline-block',
            padding: '3px 8px',
            backgroundColor: article.tagColor,
            color: '#fff',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 7,
            letterSpacing: '0.1em',
          }}>
            {article.tag}
          </span>
          <span style={{
            fontFamily: '"VT323", monospace',
            fontSize: 18,
            color: 'rgba(255,255,255,0.35)',
          }}>
            {article.source}
          </span>
        </div>

        <h2 style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 15,
          color: '#ffffff',
          lineHeight: 1.8,
          marginBottom: 16,
          textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
        }}>
          {article.headline}
        </h2>

        <p style={{
          fontFamily: '"VT323", monospace',
          fontSize: 22,
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.5,
          marginBottom: 12,
        }}>
          {article.snippet}
        </p>

        <p style={{
          fontFamily: '"VT323", monospace',
          fontSize: 16,
          color: 'rgba(255,255,255,0.2)',
        }}>
          {article.date}
        </p>

        <div style={{
          marginTop: 20,
          height: 2,
          backgroundColor: article.tagColor,
          opacity: 0.4,
          animation: visible ? 'progressBar 2.5s linear forwards' : 'none',
          transformOrigin: 'left',
        }} />
      </div>

      <div style={{
        position: 'absolute',
        bottom: 24,
        display: 'flex',
        gap: 6,
      }}>
        {ARTICLES.map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: i <= index ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)',
              transform: i === index ? 'scale(1.4)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      <div style={{
        position: 'absolute',
        top: 24,
        right: 24,
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 7,
        color: 'rgba(255,255,255,0.25)',
      }}>
        {index + 1}/{ARTICLES.length}
      </div>

      <button
        data-testid="button-skip-cutscene"
        onClick={handleSkip}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 10,
          padding: '4px 12px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 8,
          cursor: 'pointer',
        }}
      >
        SKIP
      </button>

      <style>{`
        @keyframes progressBar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
