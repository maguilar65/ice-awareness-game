import { motion } from "framer-motion";

const MLA_SOURCES = [
  {
    category: "NEWS ARTICLES & REPORTS",
    citations: [
      '"Mass ICE Raids Sweep Across Major U.S. Cities." Associated Press, 28 Jan. 2025.',
      '"ICE Arrests at Schools and Churches Spark National Outrage." The New York Times, 10 Feb. 2025.',
      '"U.S. Citizens Caught Up in Immigration Sweeps, Lawyers Say." NBC News, 18 Feb. 2025.',
      '"Children Left Stranded as Parents Detained in Workplace Raids." CNN, 5 Mar. 2025.',
      '"Immigrant Communities Report Fear of Hospitals, Police, and Courts." The Washington Post, 15 Mar. 2025.',
      '"Detention Facilities Overwhelmed as Arrests Surge." Reuters, 2 Apr. 2025.',
      '"Legal Aid Groups Overwhelmed by Demand After Mass Deportation Push." Associated Press, 20 Apr. 2025.',
      '"Rapid Response Networks Mobilize to Protect Neighbors." Los Angeles Times, 8 May 2025.',
      '"Father Taken by ICE During Son\'s Birthday Party." CBS News, 12 Jun. 2025.',
      '"ACLU: Your Rights Have Not Changed — Know Them, Use Them." American Civil Liberties Union, 1 Jul. 2025.',
    ],
  },
  {
    category: "CONSTITUTIONAL RIGHTS & LEGAL SOURCES",
    citations: [
      'U.S. Constitution. Amendment IV. "The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures."',
      'U.S. Constitution. Amendment V. "No person shall be compelled in any criminal case to be a witness against himself."',
      'U.S. Constitution. Amendment XIV, Section 1. "No State shall deprive any person of life, liberty, or property, without due process of law."',
      '"Know Your Rights: What to Do If Immigration Agents (ICE) Are at Your Door." American Civil Liberties Union, aclu.org/know-your-rights/immigrants-rights.',
      '"Know Your Rights: Immigrants\' Rights." National Immigration Law Center, nilc.org/issues/immigration-enforcement/everyone-has-certain-basic-rights.',
    ],
  },
  {
    category: "WRONGFUL DETENTION & DEPORTATION",
    citations: [
      'Stevens, Jacqueline. "U.S. Citizens Detained and Deported by ICE." States Without Nations, Northwestern University, 2018.',
      '"U.S. Citizen Held in ICE Detention for 1,273 Days." The New York Times, 29 Oct. 2018.',
      '"9-Year-Old U.S. Citizen Detained at Border for 32 Hours." NBC News, 22 Mar. 2019.',
      'Bova, Gus. "How ICE Deported an American Citizen." The Texas Observer, 24 Jan. 2019.',
    ],
  },
  {
    category: "WORKPLACE RAIDS & FAMILY SEPARATION",
    citations: [
      '"ICE Arrests 680 Workers in Largest Single-State Raid." Associated Press, 7 Aug. 2019.',
      '"Communities in Fear: ICE Raids Keep Children Home From School." CNN, 8 Aug. 2019.',
      '"Thousands of Children Separated From Parents at Border." NBC News, 20 Jun. 2018.',
      '"Father Deported While Driving Daughter to School." CBS News, 3 Mar. 2020.',
    ],
  },
  {
    category: "DETENTION CONDITIONS",
    citations: [
      '"ICE Detainees Denied Medical Care, Watchdog Finds." The Washington Post, 15 Mar. 2020.',
      'Office of Inspector General. "Concerns about ICE Detainee Treatment and Care at Four Detention Facilities." U.S. Department of Homeland Security, Jun. 2019.',
      '"DHS Inspector General Reports on Unsafe and Unhealthy Conditions at ICE Detention Centers." American Immigration Lawyers Association, 2019.',
    ],
  },
  {
    category: "COMMUNITY IMPACT & ADVOCACY",
    citations: [
      '"ICE Courthouse Arrests Deter Immigrants From Seeking Justice." Reuters, 3 Apr. 2019.',
      '"Immigrant Communities Organize Know Your Rights Workshops." Los Angeles Times, 14 Feb. 2020.',
      '"Sensitive Locations Policy." U.S. Immigration and Customs Enforcement, ice.gov/about-ice/ero/sensitive-locations.',
      '"ICE at Courthouses." Immigrant Defense Project, immdefense.org/ice-courthouse-arrests.',
    ],
  },
  {
    category: "EMERGENCY RESOURCES",
    citations: [
      'National Immigration Law Center. (213) 639-3900. nilc.org.',
      'ACLU Immigrants\' Rights Project. aclu.org/issues/immigrants-rights.',
      'United We Dream Hotline. 1-844-363-1423. unitedwedream.org.',
      'National Domestic Violence Hotline. 1-800-799-7233. thehotline.org.',
      'ICE Detainee Locator. locator.ice.gov.',
    ],
  },
];

interface SourcesPageProps {
  onBack: () => void;
}

export function SourcesPage({ onBack }: SourcesPageProps) {
  return (
    <div
      data-testid="sources-page"
      className="fixed inset-0 bg-black z-50 overflow-y-auto scanlines"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-yellow-400 text-center mb-2"
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(14px, 4vw, 22px)',
              textShadow: '0 0 15px rgba(250,204,21,0.4)',
            }}
          >
            WORKS CITED
          </h1>
          <p
            className="text-white/40 text-center mb-8"
            style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(14px, 3vw, 18px)' }}
          >
            MLA Format — All sources referenced in this game
          </p>

          {MLA_SOURCES.map((section, sIdx) => (
            <motion.div
              key={sIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * sIdx, duration: 0.4 }}
              className="mb-8"
            >
              <h2
                className="text-cyan-400 mb-4 pb-2 border-b border-cyan-400/20"
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 'clamp(8px, 2.5vw, 11px)',
                  letterSpacing: '0.15em',
                }}
              >
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.citations.map((citation, cIdx) => (
                  <p
                    key={cIdx}
                    className="text-white/75 leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-retro)',
                      fontSize: 'clamp(13px, 3vw, 17px)',
                      paddingLeft: '2em',
                      textIndent: '-2em',
                    }}
                  >
                    {citation}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}

          <div className="flex justify-center pt-6 pb-12">
            <button
              data-testid="button-back-from-sources"
              onClick={onBack}
              className="px-8 py-3 bg-green-700 text-white border-2 border-green-500 hover-elevate active-elevate-2"
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(9px, 2.5vw, 12px)',
                boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.3), inset 3px 3px 0 rgba(255,255,255,0.15)',
              }}
            >
              BACK
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
