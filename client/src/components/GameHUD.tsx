import { BookOpen, MapPin, Compass } from "lucide-react";
import { MiniMap } from "./MiniMap";
import { getStoryHint, getNextStoryStep } from "@/lib/storyPath";

interface HUDProps {
  awareness: number;
  storiesFound: number;
  totalStories: number;
  roomName: string;
  currentRoom: string;
  playerPos: { x: number; y: number };
  talkedTo: Set<string>;
}

export function GameHUD({ awareness, storiesFound, totalStories, roomName, currentRoom, playerPos, talkedTo }: HUDProps) {
  const hint = getStoryHint(talkedTo);
  const nextStep = getNextStoryStep(talkedTo);
  const nextRoom = nextStep?.room || null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-between items-start p-1.5 sm:p-2 gap-1 sm:gap-2">
        <div className="flex flex-col gap-1">
          <div className="nes-border-light border-white/50 bg-black/90 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2">
            <MapPin className="w-3 h-3 text-green-400 hidden sm:block" />
            <span data-testid="text-room-name" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }} className="text-green-400">
              {roomName}
            </span>
          </div>

          {hint && (
            <div className="nes-border-light border-yellow-500/40 bg-black/90 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 max-w-[200px] sm:max-w-[280px]">
              <Compass className="w-3 h-3 text-yellow-400 flex-shrink-0" />
              <span data-testid="text-story-hint" style={{ fontFamily: 'var(--font-retro)', fontSize: 'clamp(10px, 2vw, 14px)', lineHeight: 1.3 }} className="text-yellow-300/90">
                {hint}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-1 sm:gap-2">
          <div className="flex flex-col gap-1">
            <div className="nes-border-light border-white/50 bg-black/90 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2">
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px' }} className="text-white/60 hidden sm:inline">
                AWARENESS
              </span>
              <div className="w-12 sm:w-20 h-2 bg-gray-800 border border-gray-600">
                <div
                  data-testid="awareness-bar"
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${Math.min(awareness, 100)}%` }}
                />
              </div>
              <span data-testid="text-awareness-pct" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }} className="text-green-400">
                {awareness}%
              </span>
            </div>

            <div className="nes-border-light border-white/50 bg-black/90 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2">
              <BookOpen className="w-3 h-3 text-yellow-400" />
              <span data-testid="text-stories-count" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }} className="text-yellow-400">
                {storiesFound}/{totalStories}
              </span>
            </div>
          </div>

          <div className="nes-border-light border-white/50 bg-black/90 p-1">
            <MiniMap currentRoom={currentRoom} playerPos={playerPos} talkedTo={talkedTo} nextRoom={nextRoom} />
          </div>
        </div>
      </div>
    </div>
  );
}
