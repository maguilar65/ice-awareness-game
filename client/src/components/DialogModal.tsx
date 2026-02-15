import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, AlertTriangle, BookOpen, Shield, Megaphone } from "lucide-react";
import { type GameContent } from "@shared/schema";

interface DialogModalProps {
  isOpen: boolean;
  content: GameContent | null;
  onClose: () => void;
  onNext?: () => void;
}

const CATEGORY_CONFIG: Record<string, { icon: typeof Shield; color: string; label: string }> = {
  rights: { icon: Shield, color: 'text-cyan-400 border-cyan-400/50', label: 'KNOW YOUR RIGHTS' },
  history: { icon: AlertTriangle, color: 'text-rose-400 border-rose-400/50', label: 'DOCUMENTED FACTS' },
  community: { icon: BookOpen, color: 'text-amber-400 border-amber-400/50', label: 'COMMUNITY STORIES' },
};

const TYPE_BADGE: Record<string, { bg: string; text: string }> = {
  fact: { bg: 'bg-cyan-900/60', text: 'FACT' },
  story: { bg: 'bg-amber-900/60', text: 'TESTIMONY' },
  scenario: { bg: 'bg-violet-900/60', text: 'TAKE ACTION' },
};

export function DialogModal({ isOpen, content, onClose, onNext }: DialogModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" || e.key === " ") {
        if (onNext) onNext();
        else onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext]);

  if (!isOpen || !content) return null;

  const catConfig = CATEGORY_CONFIG[content.category] || CATEGORY_CONFIG.community;
  const typeBadge = TYPE_BADGE[content.type] || TYPE_BADGE.fact;
  const CatIcon = catConfig.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          className={`relative w-full max-w-2xl bg-gray-900 border-2 ${catConfig.color} shadow-[0_0_30px_rgba(0,0,0,0.5)] p-6 sm:p-8`}
          data-testid="dialog-modal"
        >
          <div className="absolute top-2 left-2 right-2 h-0.5 bg-white/10" />
          <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-white/10" />

          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <CatIcon className={`w-5 h-5 ${catConfig.color.split(' ')[0]}`} />
              <span className={`text-[9px] px-2 py-0.5 border ${catConfig.color} uppercase tracking-widest`}
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                {catConfig.label}
              </span>
              <span className={`text-[9px] px-2 py-0.5 ${typeBadge.bg} text-white uppercase tracking-widest`}
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                {typeBadge.text}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
              data-testid="btn-close-dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl text-white font-bold mb-6"
            style={{ fontFamily: 'var(--font-pixel)', textShadow: '2px 2px 0 rgba(0,0,0,0.8)' }}
          >
            {content.title}
          </h2>

          <div className="mb-8 leading-relaxed">
            <p className="text-gray-200 text-lg sm:text-xl" style={{ fontFamily: 'var(--font-retro)' }}>
              {content.content}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-700">
            <span className="text-[8px] text-gray-500 uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              Press SPACE or ENTER to continue
            </span>

            <button
              onClick={onNext || onClose}
              data-testid="btn-continue"
              className="group flex items-center gap-2 px-5 py-2 bg-violet-600 text-white hover:bg-violet-500 transition-all focus:outline-none"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
            >
              {onNext ? "NEXT" : "CLOSE"} <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
