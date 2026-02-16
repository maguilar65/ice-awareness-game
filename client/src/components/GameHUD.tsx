import { BookOpen, MapPin } from "lucide-react";

interface HUDProps {
  awareness: number;
  storiesFound: number;
  totalStories: number;
  roomName: string;
}

export function GameHUD({ awareness, storiesFound, totalStories, roomName }: HUDProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-between items-start p-1.5 sm:p-2 gap-1 sm:gap-2">
        <div className="nes-border-light border-white/50 bg-black/90 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2">
          <MapPin className="w-3 h-3 text-green-400 hidden sm:block" />
          <span data-testid="text-room-name" style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px' }} className="text-green-400">
            {roomName}
          </span>
        </div>

        <div className="flex gap-1 sm:gap-2">
          <div className="nes-border-light border-white/50 bg-black/90 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2">
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px' }} className="text-white/60 hidden sm:inline">
              AWARENESS
            </span>
            <div className="w-12 sm:w-20 h-2 bg-gray-800 border border-gray-600">
              <div
                data-testid="awareness-bar"
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${Math.min(awareness, 100)}%` }}
              />
            </div>
            <span data-testid="text-awareness-pct" style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px' }} className="text-green-400">
              {awareness}%
            </span>
          </div>

          <div className="nes-border-light border-white/50 bg-black/90 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2">
            <BookOpen className="w-3 h-3 text-yellow-400" />
            <span data-testid="text-stories-count" style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px' }} className="text-yellow-400">
              {storiesFound}/{totalStories}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
