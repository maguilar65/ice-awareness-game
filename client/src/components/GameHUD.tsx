import { Heart, BookOpen, Shield } from "lucide-react";

interface HUDProps {
  awareness: number;
  storiesFound: number;
  totalStories: number;
}

export function GameHUD({ awareness, storiesFound, totalStories }: HUDProps) {
  return (
    <div className="fixed top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-50">
      {/* Left stats */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-background/90 border-2 border-primary p-3 shadow-lg">
          <Shield className="w-6 h-6 text-secondary animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase">Awareness</span>
            <div className="w-32 h-4 bg-muted border border-muted-foreground relative">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
                style={{ width: `${Math.min(awareness, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right stats */}
      <div className="flex items-center gap-3 bg-background/90 border-2 border-accent p-3 shadow-lg">
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground uppercase">Community Stories</span>
          <span className="text-xl font-bold text-accent font-pixel">
            {storiesFound}/{totalStories}
          </span>
        </div>
        <BookOpen className="w-6 h-6 text-accent" />
      </div>
    </div>
  );
}
