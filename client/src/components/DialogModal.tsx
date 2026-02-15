import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { type GameContent } from "@shared/schema";

interface DialogModalProps {
  isOpen: boolean;
  content: GameContent | null;
  onClose: () => void;
  onNext?: () => void;
}

export function DialogModal({ isOpen, content, onClose, onNext }: DialogModalProps) {
  // Close on Escape key
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-background border-4 border-primary shadow-[0_0_40px_rgba(124,58,237,0.3)] p-6 sm:p-8"
        >
          {/* Retro decoration lines */}
          <div className="absolute top-2 left-2 right-2 h-1 bg-primary/20" />
          <div className="absolute bottom-2 left-2 right-2 h-1 bg-primary/20" />

          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl sm:text-2xl text-primary font-bold text-shadow-retro">
              {content.title}
            </h2>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="prose prose-invert prose-p:font-retro prose-p:text-xl max-w-none mb-8 leading-relaxed">
            <p className="typing-effect">{content.content}</p>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-dashed border-muted">
            <span className="text-xs text-muted-foreground font-pixel uppercase tracking-widest">
              Category: {content.category}
            </span>
            
            <button
              onClick={onNext || onClose}
              className="
                group flex items-center gap-2 px-6 py-2 
                bg-primary text-primary-foreground font-bold font-pixel text-xs
                hover:bg-primary/90 hover:translate-x-1 transition-all
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
              "
            >
              {onNext ? "NEXT" : "CLOSE"} <ChevronRight className="w-4 h-4 group-hover:animate-pulse" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
