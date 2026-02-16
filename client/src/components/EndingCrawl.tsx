import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CRAWL_SECTIONS = [
  {
    type: "header" as const,
    text: "YOU LISTENED. YOU LEARNED. YOU STOOD UP.",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "body" as const,
    text: "You spoke to every person in the neighborhood of Esperanza. You heard their stories. You learned their fears. And now you carry their truth with you.",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "divider" as const,
    text: "- - - - - - - - - -",
  },
  {
    type: "header" as const,
    text: "WHAT IS ICE?",
  },
  {
    type: "body" as const,
    text: "U.S. Immigration and Customs Enforcement (ICE) is a federal agency created in 2003 under the Department of Homeland Security. It is responsible for immigration enforcement, including deportation operations and detention.",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "header" as const,
    text: "YOUR RIGHTS",
  },
  {
    type: "body" as const,
    text: "Everyone in the United States has constitutional rights, regardless of immigration status. These rights exist to protect you.",
  },
  {
    type: "fact" as const,
    text: "You have the right to remain silent. You do not have to answer questions about where you were born or your immigration status.",
  },
  {
    type: "fact" as const,
    text: "You have the right to refuse a search. ICE cannot search you or your belongings without a warrant signed by a judge.",
  },
  {
    type: "fact" as const,
    text: "You do not have to open your door. ICE cannot enter your home without a judicial warrant. An ICE administrative warrant (Form I-200) does NOT give them the right to enter.",
  },
  {
    type: "fact" as const,
    text: "You have the right to a lawyer. If detained, you can and should request legal representation before answering any questions.",
  },
  {
    type: "fact" as const,
    text: "You have the right to make a phone call. If detained, ask to call a family member or immigration lawyer immediately.",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "divider" as const,
    text: "- - - - - - - - - -",
  },
  {
    type: "header" as const,
    text: "HOW TO STAY SAFE",
  },
  {
    type: "fact" as const,
    text: "Create a family safety plan. Know who will care for your children, manage your finances, and contact your lawyer if you are detained.",
  },
  {
    type: "fact" as const,
    text: "Carry a know-your-rights card. Keep a card in your wallet that states your rights in English and your language. You can show this card instead of speaking.",
  },
  {
    type: "fact" as const,
    text: "Memorize key phone numbers. Have your lawyer's number and an emergency contact memorized, not just saved in your phone.",
  },
  {
    type: "fact" as const,
    text: "Keep important documents in a safe place. Store copies of IDs, birth certificates, and legal documents where a trusted person can access them.",
  },
  {
    type: "fact" as const,
    text: "Know the difference between ICE and police. Local police and ICE are separate. In many cities, local police will not ask about immigration status.",
  },
  {
    type: "fact" as const,
    text: "Do not sign anything you do not understand. You have the right to read any document before signing. If it is not in your language, ask for a translation.",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "divider" as const,
    text: "- - - - - - - - - -",
  },
  {
    type: "header" as const,
    text: "HOW TO HELP YOUR COMMUNITY",
  },
  {
    type: "fact" as const,
    text: "Be a witness. If you see an ICE operation, observe from a safe distance and record details: time, location, badge numbers, and vehicle plates.",
  },
  {
    type: "fact" as const,
    text: "Support local organizations. Groups like the ACLU, United We Dream, and local legal aid societies provide free or low-cost help to immigrants.",
  },
  {
    type: "fact" as const,
    text: "Volunteer to accompany people to court. Immigration courts can be intimidating. Community accompaniment programs provide moral support.",
  },
  {
    type: "fact" as const,
    text: "Learn and share. The more people who understand these rights, the safer everyone becomes. Share this information with your neighbors.",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "divider" as const,
    text: "- - - - - - - - - -",
  },
  {
    type: "header" as const,
    text: "EMERGENCY RESOURCES",
  },
  {
    type: "resource" as const,
    text: "National Immigration Law Center: (213) 639-3900",
  },
  {
    type: "resource" as const,
    text: "ACLU Immigrants' Rights Project: aclu.org/issues/immigrants-rights",
  },
  {
    type: "resource" as const,
    text: "United We Dream Hotline: 1-844-363-1423",
  },
  {
    type: "resource" as const,
    text: "National Domestic Violence Hotline: 1-800-799-7233",
  },
  {
    type: "resource" as const,
    text: "ICE Detainee Locator: locator.ice.gov",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "closing" as const,
    text: "Knowledge is protection. Community is strength. You are not alone.",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "closing" as const,
    text: "COMMUNITY DEFENDER",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "body" as const,
    text: "Thank you for playing.",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "divider" as const,
    text: "- - - - - - - - - -",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "header" as const,
    text: "MADE BY",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "credit" as const,
    text: "Marcos Aguilar",
  },
  {
    type: "credit" as const,
    text: "Jeremiah Feliciano",
  },
  {
    type: "credit" as const,
    text: "Robert Long-Smith",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "spacer" as const,
    text: "",
  },
  {
    type: "spacer" as const,
    text: "",
  },
];

const CRAWL_DURATION = 90;

export function EndingCrawl({ onFinish }: { onFinish: () => void }) {
  const [started, setStarted] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const autoEnd = setTimeout(() => onFinish(), (CRAWL_DURATION + 5) * 1000);
    return () => clearTimeout(autoEnd);
  }, [onFinish]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showSkip && (e.key === 'Escape' || e.key === ' ' || e.key === 'Space' || e.key === 'Enter')) {
        e.preventDefault();
        onFinish();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showSkip, onFinish]);

  return (
    <div
      data-testid="ending-crawl"
      className="fixed inset-0 bg-black z-50 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              width: Math.random() > 0.9 ? '2px' : '1px',
              height: Math.random() > 0.9 ? '2px' : '1px',
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 flex justify-center"
        style={{ perspective: '400px' }}
      >
        <div
          className="w-full max-w-2xl px-8"
          style={{
            transformOrigin: '50% 100%',
            transform: 'rotateX(25deg)',
            position: 'absolute',
            top: '100%',
          }}
        >
          {started && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: `-${CRAWL_SECTIONS.length * 120 + 800}px` }}
              transition={{ duration: CRAWL_DURATION, ease: "linear" }}
              className="space-y-6 text-center pb-[100vh]"
            >
              {CRAWL_SECTIONS.map((section, i) => {
                if (section.type === "spacer") {
                  return <div key={i} className="h-12" />;
                }
                if (section.type === "divider") {
                  return (
                    <div
                      key={i}
                      className="text-yellow-400/40 tracking-[0.5em]"
                      style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
                    >
                      {section.text}
                    </div>
                  );
                }
                if (section.type === "header") {
                  return (
                    <h2
                      key={i}
                      className="text-yellow-400 leading-relaxed pt-4"
                      style={{
                        fontFamily: 'var(--font-pixel)',
                        fontSize: '16px',
                        textShadow: '0 0 15px rgba(250,204,21,0.4)',
                      }}
                    >
                      {section.text}
                    </h2>
                  );
                }
                if (section.type === "fact") {
                  return (
                    <p
                      key={i}
                      className="text-cyan-300 leading-relaxed"
                      style={{ fontFamily: 'var(--font-retro)', fontSize: '20px' }}
                    >
                      {section.text}
                    </p>
                  );
                }
                if (section.type === "resource") {
                  return (
                    <p
                      key={i}
                      className="text-green-400 leading-relaxed"
                      style={{ fontFamily: 'var(--font-retro)', fontSize: '18px' }}
                    >
                      {section.text}
                    </p>
                  );
                }
                if (section.type === "credit") {
                  return (
                    <p
                      key={i}
                      className="text-white leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-pixel)',
                        fontSize: '14px',
                        textShadow: '0 0 10px rgba(255,255,255,0.3)',
                      }}
                    >
                      {section.text}
                    </p>
                  );
                }
                if (section.type === "closing") {
                  return (
                    <h2
                      key={i}
                      className="text-white leading-relaxed pt-4"
                      style={{
                        fontFamily: 'var(--font-pixel)',
                        fontSize: '18px',
                        textShadow: '0 0 20px rgba(255,255,255,0.3)',
                      }}
                    >
                      {section.text}
                    </h2>
                  );
                }
                return (
                  <p
                    key={i}
                    className="text-white/80 leading-relaxed"
                    style={{ fontFamily: 'var(--font-retro)', fontSize: '20px' }}
                  >
                    {section.text}
                  </p>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {showSkip && (
        <motion.button
          data-testid="button-skip-crawl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onFinish}
          className="absolute bottom-8 right-8 z-50 px-4 py-2 text-white/40 border border-white/20 hover-elevate"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
        >
          SKIP
        </motion.button>
      )}
    </div>
  );
}
