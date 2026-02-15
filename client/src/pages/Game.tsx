import { useState, useEffect } from "react";
import { GameWorld } from "@/components/GameWorld";
import { GameHUD } from "@/components/GameHUD";
import { DialogModal } from "@/components/DialogModal";
import { useGameContent, useUpdateProgress } from "@/hooks/use-game-content";
import { type GameContent } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Game() {
  const { data: contents, isLoading, error } = useGameContent();
  const updateProgress = useUpdateProgress();
  const { toast } = useToast();

  const [activeContent, setActiveContent] = useState<GameContent | null>(null);
  const [awareness, setAwareness] = useState(0);
  const [storiesFound, setStoriesFound] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate a random session ID for this playthrough
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  const handleInteract = (contentId: number) => {
    const content = contents?.find(c => c.id === contentId);
    if (content) {
      setActiveContent(content);
      
      // Update local state if this is a new discovery
      if (!storiesFound.has(contentId)) {
        const newStories = new Set(storiesFound).add(contentId);
        setStoriesFound(newStories);
        setAwareness(prev => Math.min(prev + 15, 100)); // Cap at 100%
        
        // Persist to backend
        updateProgress.mutate({
          sessionId,
          contentId,
          completed: true,
        });

        // Show toast for small feedback
        toast({
          title: "New Knowledge Gained!",
          description: `You've learned about ${content.title}`,
          variant: "default",
          className: "bg-primary text-primary-foreground border-2 border-white font-pixel"
        });
      }
    }
  };

  const handleCloseModal = () => {
    setActiveContent(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-primary">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="font-pixel text-lg animate-pulse">LOADING WORLD...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-destructive">
        <h1 className="font-pixel text-2xl">ERROR</h1>
        <p className="font-retro text-xl">Failed to load game data. Please refresh.</p>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <h1 className="font-pixel text-4xl md:text-6xl text-primary text-shadow-retro mb-4 leading-relaxed">
            COMMUNITY DEFENDER
          </h1>
          <p className="font-retro text-xl text-muted-foreground leading-relaxed">
            Explore the neighborhood. Learn your rights. Strengthen your community.
          </p>
          
          <div className="p-6 border-2 border-dashed border-muted bg-card/50 rounded-lg">
            <h3 className="font-pixel text-sm text-secondary mb-4">CONTROLS</h3>
            <div className="grid grid-cols-2 gap-4 text-sm font-retro text-left">
              <div className="flex items-center gap-2">
                <span className="bg-muted px-2 py-1 rounded">WASD</span>
                <span>Move</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted px-2 py-1 rounded">SPACE</span>
                <span>Interact</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsPlaying(true)}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-pixel text-xl tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
          >
            START GAME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col">
      <GameHUD 
        awareness={awareness} 
        storiesFound={storiesFound.size} 
        totalStories={contents?.length || 0} 
      />
      
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <GameWorld 
          onInteract={handleInteract} 
          contents={contents || []} 
        />
      </div>

      <DialogModal 
        isOpen={!!activeContent} 
        content={activeContent} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}
