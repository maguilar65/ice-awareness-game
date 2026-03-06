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
    headline: "Mass ICE Raids Sweep Across Major U.S. Cities",
    source: "Associated Press",
    date: "Jan 28, 2025",
    snippet: "Federal immigration agents launched large-scale enforcement operations across multiple cities, detaining hundreds. Community organizations reported widespread panic as families hid indoors.",
    tag: "RAIDS",
    tagColor: "#ef4444",
  },
  {
    headline: "ICE Arrests at Schools and Churches Spark National Outrage",
    source: "The New York Times",
    date: "Feb 10, 2025",
    snippet: "Despite longstanding policies against enforcement at sensitive locations, reports emerged of ICE agents detaining people near schools and houses of worship, reversing years of precedent.",
    tag: "CIVIL RIGHTS",
    tagColor: "#3b82f6",
  },
  {
    headline: "U.S. Citizens Caught Up in Immigration Sweeps, Lawyers Say",
    source: "NBC News",
    date: "Feb 18, 2025",
    snippet: "Civil rights attorneys report a surge in U.S. citizens being wrongfully detained during mass immigration operations. Some were held for days before their citizenship was confirmed.",
    tag: "DETENTION",
    tagColor: "#f97316",
  },
  {
    headline: "Children Left Stranded as Parents Detained in Workplace Raids",
    source: "CNN",
    date: "Mar 5, 2025",
    snippet: "After a series of workplace raids, schools and community centers scrambled to care for children whose parents were taken into custody without warning.",
    tag: "FAMILIES",
    tagColor: "#a855f7",
  },
  {
    headline: "Immigrant Communities Report Fear of Hospitals, Police, and Courts",
    source: "The Washington Post",
    date: "Mar 15, 2025",
    snippet: "Doctors and law enforcement officials warn that immigrants are avoiding hospitals, refusing to report crimes, and skipping court dates due to fear of deportation.",
    tag: "COMMUNITY",
    tagColor: "#22c55e",
  },
  {
    headline: "Detention Facilities Overwhelmed as Arrests Surge",
    source: "Reuters",
    date: "Apr 2, 2025",
    snippet: "Immigration detention centers are operating far beyond capacity. Inspectors found overcrowding, inadequate food, and detainees sleeping on floors without blankets.",
    tag: "DETENTION",
    tagColor: "#f97316",
  },
  {
    headline: "Legal Aid Groups Overwhelmed by Demand After Mass Deportation Push",
    source: "Associated Press",
    date: "Apr 20, 2025",
    snippet: "Free legal clinics across the country are turning people away as demand for immigration lawyers has skyrocketed. Many detainees face hearings without any legal representation.",
    tag: "CIVIL RIGHTS",
    tagColor: "#3b82f6",
  },
  {
    headline: "Rapid Response Networks Mobilize to Protect Neighbors",
    source: "Los Angeles Times",
    date: "May 8, 2025",
    snippet: "Community groups are organizing rapid response networks — volunteers who document ICE activity, provide legal information, and support families after raids.",
    tag: "COMMUNITY",
    tagColor: "#22c55e",
  },
  {
    headline: "Father Taken by ICE During Son's Birthday Party",
    source: "CBS News",
    date: "Jun 12, 2025",
    snippet: "Agents arrived at a family home during a child's birthday celebration and detained the father in front of guests. His three U.S.-born children watched as he was taken away.",
    tag: "FAMILIES",
    tagColor: "#a855f7",
  },
  {
    headline: "ACLU: Your Rights Have Not Changed — Know Them, Use Them",
    source: "ACLU",
    date: "Jul 1, 2025",
    snippet: "The ACLU reminds everyone: you still have the right to remain silent, the right to refuse entry without a judicial warrant, and the right to a lawyer. These rights belong to everyone.",
    tag: "CIVIL RIGHTS",
    tagColor: "#3b82f6",
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

    const timer = setTimeout(cycle, 5500);
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
        padding: 'clamp(16px, 4vw, 32px)',
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
          fontSize: 'clamp(10px, 3vw, 15px)',
          color: '#ffffff',
          lineHeight: 1.8,
          marginBottom: 16,
          textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
        }}>
          {article.headline}
        </h2>

        <p style={{
          fontFamily: '"VT323", monospace',
          fontSize: 'clamp(16px, 4vw, 22px)',
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
          animation: visible ? 'progressBar 5.5s linear forwards' : 'none',
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
