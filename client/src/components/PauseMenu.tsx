import { motion } from "framer-motion";

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onSkipToCredits: () => void;
  talkedTo: number;
  totalNpcs: number;
}

export function PauseMenu({ isOpen, onResume, onSkipToCredits, talkedTo, totalNpcs }: PauseMenuProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      data-testid="pause-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm mx-4"
      >
        <div className="border-2 border-white/30 bg-black p-6 space-y-6" style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.5), inset 0 0 30px rgba(74,222,128,0.05)' }}>
          <h2
            className="text-green-400 text-center"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '16px', textShadow: '0 0 10px rgba(74,222,128,0.3)' }}
          >
            PAUSED
          </h2>

          <div className="space-y-1 text-center">
            <p className="text-white/50" style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>PROGRESS</p>
            <p className="text-white/80" style={{ fontFamily: 'var(--font-retro)', fontSize: '18px' }}>
              Neighbors talked to: <span className="text-green-400">{talkedTo}</span> / {totalNpcs}
            </p>
          </div>

          <div className="space-y-3">
            <button
              data-testid="button-resume"
              onClick={onResume}
              className="w-full py-2 bg-green-700 text-white border-2 border-green-500 hover-elevate active-elevate-2"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.3), inset 3px 3px 0 rgba(255,255,255,0.15)' }}
            >
              RESUME
            </button>

            <button
              data-testid="button-skip-credits"
              onClick={onSkipToCredits}
              className="w-full py-2 bg-white/10 text-white/70 border-2 border-white/20 hover-elevate active-elevate-2"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.2), inset 3px 3px 0 rgba(255,255,255,0.05)' }}
            >
              SKIP TO CREDITS
            </button>
          </div>

          <p className="text-white/30 text-center hidden sm:block" style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px' }}>
            PRESS ESC TO RESUME
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
