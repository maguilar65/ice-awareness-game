import { useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";

interface ArcadeCabinetProps {
  title: string;
  color: string;
  onClose: () => void;
  joystickDirection?: 'left' | 'right' | 'up' | 'down' | 'center';
  activeButton?: number | null;
  children: ReactNode;
}

export function ArcadeCabinet({ title, color, onClose, joystickDirection = 'center', activeButton = null, children }: ArcadeCabinetProps) {
  const [powerOn, setPowerOn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPowerOn(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const joyRotation = joystickDirection === 'left' ? -25 : joystickDirection === 'right' ? 25 : joystickDirection === 'up' ? -20 : joystickDirection === 'down' ? 20 : 0;
  const joyX = joystickDirection === 'left' ? -3 : joystickDirection === 'right' ? 3 : 0;
  const joyY = joystickDirection === 'up' ? -3 : joystickDirection === 'down' ? 3 : 0;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center" data-testid="arcade-cabinet-wrapper">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-full flex flex-col items-center justify-center"
        style={{ maxWidth: '100vw', maxHeight: '100vh' }}
      >
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 30%, ${color}15 0%, transparent 60%), linear-gradient(180deg, #0a0a1a 0%, #050510 100%)`,
        }} />

        <div className="relative w-full h-full flex flex-col" style={{ maxWidth: 'min(95vw, 900px)', maxHeight: '100vh' }}>

          <div className="flex-shrink-0 relative z-10 flex items-center justify-center py-1 sm:py-2" style={{
            background: `linear-gradient(180deg, #1a1a2e 0%, #0f0f20 100%)`,
            borderBottom: `3px solid ${color}`,
            borderLeft: '4px solid #2a2a3e',
            borderRight: '4px solid #1a1a28',
            borderTop: '4px solid #3a3a4e',
            borderRadius: '12px 12px 0 0',
          }}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 4px #4ade80', opacity: powerOn ? 1 : 0.3 }} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(10px, 2.5vw, 16px)',
              color: color,
              textShadow: `0 0 15px ${color}88, 0 0 30px ${color}44`,
              letterSpacing: '0.15em',
            }}>
              {title}
            </h1>
            <button
              data-testid="button-cabinet-exit"
              onClick={onClose}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/40"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
            >
              ESC
            </button>
          </div>

          <div className="flex-1 relative overflow-hidden" style={{
            borderLeft: '6px solid #1e1e30',
            borderRight: '6px solid #14142a',
            background: '#050508',
          }}>
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
            }} />
            <div className="absolute right-0 top-0 bottom-0 w-1" style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)',
            }} />

            <div className="absolute inset-2 sm:inset-3 rounded-sm overflow-hidden" style={{
              border: `2px solid ${color}33`,
              boxShadow: `inset 0 0 30px rgba(0,0,0,0.8), 0 0 15px ${color}11`,
            }}>
              <div className="absolute inset-0 pointer-events-none z-50" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
              }} />
              <div className="absolute inset-0 pointer-events-none z-50" style={{
                background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.03) 0%, transparent 60%)',
              }} />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: powerOn ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative w-full h-full overflow-y-auto"
              >
                {children}
              </motion.div>
            </div>
          </div>

          <div className="flex-shrink-0 relative z-10" style={{
            background: 'linear-gradient(180deg, #1a1a2e 0%, #12122a 50%, #0e0e22 100%)',
            borderTop: '2px solid #2a2a3e',
            borderLeft: '6px solid #1e1e30',
            borderRight: '6px solid #14142a',
            borderBottom: '6px solid #0a0a1a',
            borderRadius: '0 0 8px 8px',
            padding: 'clamp(8px, 2vh, 20px) clamp(12px, 3vw, 32px)',
          }}>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="relative" style={{ width: 'clamp(36px, 8vw, 56px)', height: 'clamp(36px, 8vw, 56px)' }}>
                  <div className="absolute inset-0 rounded-full" style={{
                    background: 'radial-gradient(circle, #2a2a3e 0%, #1a1a2e 70%, #0e0e1e 100%)',
                    border: '2px solid #3a3a4e',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.05)',
                  }} />
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 'clamp(10px, 2.5vw, 16px)',
                      height: 'clamp(28px, 6vw, 44px)',
                      left: '50%',
                      top: '50%',
                      background: `linear-gradient(180deg, #4a4a5e 0%, #2a2a3e 100%)`,
                      border: '2px solid #5a5a6e',
                      borderRadius: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.15)',
                      transformOrigin: '50% 50%',
                    }}
                    animate={{
                      x: `calc(-50% + ${joyX}px)`,
                      y: `calc(-50% + ${joyY}px)`,
                      rotate: joyRotation,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, mass: 0.5 }}
                  />
                  <div className="absolute rounded-full" style={{
                    width: 'clamp(6px, 1.5vw, 10px)',
                    height: 'clamp(6px, 1.5vw, 10px)',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: '#1a1a28',
                    border: '1px solid #2a2a3e',
                    zIndex: 5,
                  }} />
                </div>
                <span className="text-white/30" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(5px, 1.2vw, 7px)' }}>
                  JOYSTICK
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3">
                <span className="text-white/20 hidden sm:block" style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px' }}>
                  INSERT COIN
                </span>
                <div className="w-6 h-1 rounded-full" style={{
                  background: 'linear-gradient(90deg, #1a1a2e, #2a2a3e, #1a1a2e)',
                  border: '1px solid #3a3a4e',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
                }} />
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-2 sm:gap-3">
                  {[
                    { label: 'A', btnColor: '#dc2626', idx: 0 },
                    { label: 'B', btnColor: '#2563eb', idx: 1 },
                    { label: 'C', btnColor: '#16a34a', idx: 2 },
                    { label: 'D', btnColor: '#ca8a04', idx: 3 },
                  ].map(btn => {
                    const isActive = activeButton === btn.idx;
                    return (
                      <div key={btn.label} className="flex flex-col items-center gap-0.5">
                        <motion.div
                          className="rounded-full flex items-center justify-center"
                          style={{
                            width: 'clamp(24px, 5vw, 38px)',
                            height: 'clamp(24px, 5vw, 38px)',
                            background: `radial-gradient(circle at 35% 35%, ${btn.btnColor}dd, ${btn.btnColor}88)`,
                            border: `2px solid ${btn.btnColor}`,
                            boxShadow: isActive
                              ? `0 0 12px ${btn.btnColor}88, inset 0 2px 4px rgba(0,0,0,0.5)`
                              : `0 3px 6px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2), 0 0 4px ${btn.btnColor}33`,
                          }}
                          animate={{
                            scale: isActive ? 0.88 : 1,
                            y: isActive ? 2 : 0,
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25, mass: 0.3 }}
                        >
                          <span style={{
                            fontFamily: 'var(--font-pixel)',
                            fontSize: 'clamp(6px, 1.5vw, 9px)',
                            color: 'rgba(255,255,255,0.9)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          }}>
                            {btn.label}
                          </span>
                        </motion.div>
                        <span className="text-white/20 hidden sm:block" style={{ fontFamily: 'var(--font-pixel)', fontSize: '5px' }}>
                          {btn.idx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <span className="text-white/30" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(5px, 1.2vw, 7px)' }}>
                  BUTTONS
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-1 sm:mt-2 gap-2">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-full" style={{
                  width: 'clamp(3px, 0.6vw, 5px)',
                  height: 'clamp(3px, 0.6vw, 5px)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
