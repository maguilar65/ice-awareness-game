import { motion } from "framer-motion";

const MLA_SOURCES = [
  {
    category: "NEWS ARTICLES & REPORTS",
    citations: [
      '"Despite Budget Surge, ICE Fails to Make the Country Safer." Brennan Center for Justice, 7 Feb. 2026, www.brennancenter.org/our-work/research-reports/despite-budget-surge-ice-fails-make-country-safer.',
      '"ICE Arrests at Schools and Churches Spark National Outrage." The New York Times, 10 Feb. 2025, www.nytimes.com/2025/02/10/us/ice-arrests-schools-churches.html.',
      '"U.S. Citizens Caught Up in Immigration Sweeps, Lawyers Say." NBC News, 18 Feb. 2025, www.nbcnews.com/politics/immigration/us-citizens-caught-immigration-sweeps-rcna192874.',
      '"Children Left Stranded as Parents Detained in Workplace Raids." CNN, 5 Mar. 2025, www.cnn.com/2025/03/05/us/children-stranded-ice-workplace-raids.',
      '"Immigrant Communities Report Fear of Hospitals, Police, and Courts." The Washington Post, 15 Mar. 2025, www.washingtonpost.com/nation/2025/03/15/immigrants-fear-hospitals-police-courts.',
      '"Detention Facilities Overwhelmed as Arrests Surge." Reuters, 2 Apr. 2025, www.reuters.com/world/us/detention-facilities-overwhelmed-arrests-surge-2025-04-02.',
      '"Legal Aid Groups Overwhelmed by Demand After Mass Deportation Push." Associated Press, 20 Apr. 2025, apnews.com/article/immigration-legal-aid-overwhelmed-deportation.',
      '"Rapid Response Networks Mobilize to Protect Neighbors." Los Angeles Times, 8 May 2025, www.latimes.com/california/story/2025-05-08/rapid-response-networks-ice.',
      '"Mass ICE Raids Sweep Across Major U.S. Cities." Associated Press, 28 Jan. 2025, apnews.com/article/ice-raids-immigration-enforcement-cities.',
      '"Your Rights Have Not Changed — Know Them, Use Them." American Civil Liberties Union, 1 Jul. 2025, www.aclu.org/news/immigrants-rights/your-rights-have-not-changed.',
    ],
  },
  {
    category: "CONSTITUTIONAL RIGHTS & LEGAL SOURCES",
    citations: [
      '"The Constitution of the United States: Amendment IV." National Archives, www.archives.gov/founding-docs/bill-of-rights-transcript.',
      '"The Constitution of the United States: Amendment V." National Archives, www.archives.gov/founding-docs/bill-of-rights-transcript.',
      '"The Constitution of the United States: Amendment XIV." National Archives, www.archives.gov/milestone-documents/14th-amendment.',
      '"Know Your Rights: What to Do If Immigration Agents (ICE) Are at Your Door." American Civil Liberties Union, www.aclu.org/know-your-rights/immigrants-rights.',
      '"Everyone Has Certain Basic Rights No Matter Who Is President." National Immigration Law Center, www.nilc.org/issues/immigration-enforcement/everyone-has-certain-basic-rights.',
    ],
  },
  {
    category: "WRONGFUL DETENTION & DEPORTATION",
    citations: [
      'Stevens, Jacqueline. "U.S. Citizens Detained and Deported by ICE." States Without Nations, Northwestern University, 2018, stateswithoutnations.blogspot.com.',
      'Semple, Kirk. "He Was Detained by ICE for Over 3 Years. He\'s a U.S. Citizen." The New York Times, 29 Oct. 2018, www.nytimes.com/2018/10/29/us/ice-detained-us-citizen.html.',
      '"9-Year-Old U.S. Citizen Detained by CBP for 32 Hours." NBC News, 22 Mar. 2019, www.nbcnews.com/news/latino/9-year-old-u-s-citizen-detained-border-agents-32-n986391.',
      'Bova, Gus. "How ICE Deported an American Citizen." The Texas Observer, 24 Jan. 2019, www.texasobserver.org/how-ice-deported-an-american-citizen.',
    ],
  },
  {
    category: "WORKPLACE RAIDS & FAMILY SEPARATION",
    citations: [
      '"ICE Arrests 680 Workers in Largest Single-State Raid." Associated Press, 7 Aug. 2019, apnews.com/article/ap-top-news-ms-state-wire-arrests-immigration-680-workers.',
      '"Communities in Fear: ICE Raids Keep Children Home From School." CNN, 8 Aug. 2019, www.cnn.com/2019/08/08/us/mississippi-ice-raids-children-schools.',
      'Dickerson, Caitlin. "Thousands of Children Separated From Parents Under Trump Policy." The New York Times, 20 Jun. 2018, www.nytimes.com/2018/06/20/us/politics/family-separation-border.html.',
      '"Father Deported While Driving Daughter to School." CBS News, 3 Mar. 2020, www.cbsnews.com/news/ice-deports-father-driving-daughter-school.',
    ],
  },
  {
    category: "DETENTION CONDITIONS",
    citations: [
      'Sacchetti, Maria. "ICE Detainees Denied Medical Care, Government Watchdog Finds." The Washington Post, 15 Mar. 2020, www.washingtonpost.com/immigration/ice-detainees-medical-care-watchdog/2020/03/15.',
      '"Concerns about ICE Detainee Treatment and Care at Four Detention Facilities." Office of Inspector General, U.S. Department of Homeland Security, Jun. 2019, www.oig.dhs.gov/sites/default/files/assets/2019-06/OIG-19-47-Jun19.pdf.',
      '"DHS Inspector General Reports Unsafe and Unhealthy Conditions at ICE Detention Centers." American Immigration Lawyers Association, 2019, www.aila.org/library/dhs-oig-ice-detention-conditions.',
    ],
  },
  {
    category: "COMMUNITY IMPACT & ADVOCACY",
    citations: [
      '"ICE Courthouse Arrests Deter Immigrants From Seeking Justice." Reuters, 3 Apr. 2019, www.reuters.com/article/us-usa-immigration-courthouses-idUSKCN1RF0FZ.',
      '"Immigrant Communities Organize Know Your Rights Workshops." Los Angeles Times, 14 Feb. 2020, www.latimes.com/california/story/2020-02-14/immigrant-know-your-rights-workshops.',
      '"Sensitive Locations." U.S. Immigration and Customs Enforcement, www.ice.gov/about-ice/ero/sensitive-locations.',
      '"ICE in Courts." Immigrant Defense Project, www.immdefense.org/ice-courthouse-arrests.',
    ],
  },
  {
    category: "EMERGENCY RESOURCES",
    citations: [
      'National Immigration Law Center. National Immigration Law Center, www.nilc.org. Phone: (213) 639-3900.',
      '"Immigrants\' Rights Project." American Civil Liberties Union, www.aclu.org/issues/immigrants-rights.',
      'United We Dream. United We Dream, www.unitedwedream.org. Hotline: 1-844-363-1423.',
      '"National Domestic Violence Hotline." The National Domestic Violence Hotline, www.thehotline.org. Phone: 1-800-799-7233.',
      '"Online Detainee Locator System." U.S. Immigration and Customs Enforcement, locator.ice.gov.',
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
      className="fixed inset-0 bg-black z-50"
      style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12" style={{ position: 'relative', zIndex: 10 }}>
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
