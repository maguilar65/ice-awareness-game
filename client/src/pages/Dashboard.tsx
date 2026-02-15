import { useGameContent } from "@/hooks/use-game-content";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, BarChart3, Users, BookOpen } from "lucide-react";
import { PixelCard } from "@/components/PixelCard";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: contents } = useGameContent();
  
  // In a real app, this would fetch from a stats endpoint
  // Using mock stats for visual demonstration
  const stats = {
    totalPlayers: 1243,
    avgAwareness: 78,
    storiesRead: 8500
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-retro">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-pixel text-primary mb-2">ADMIN DASHBOARD</h1>
            <p className="text-muted-foreground">Monitor community engagement and update game content.</p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline" className="font-pixel h-12 border-2">
                BACK TO GAME
              </Button>
            </Link>
            <Button className="font-pixel h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="mr-2 h-4 w-4" /> ADD CONTENT
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PixelCard variant="primary" className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase">Total Players</p>
              <h3 className="text-3xl font-bold font-pixel">{stats.totalPlayers}</h3>
            </div>
          </PixelCard>
          
          <PixelCard variant="default" className="flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-full">
              <BarChart3 className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase">Avg Awareness</p>
              <h3 className="text-3xl font-bold font-pixel">{stats.avgAwareness}%</h3>
            </div>
          </PixelCard>
          
          <PixelCard variant="default" className="flex items-center gap-4">
            <div className="p-3 bg-secondary/20 rounded-full">
              <BookOpen className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase">Stories Read</p>
              <h3 className="text-3xl font-bold font-pixel">{stats.storiesRead}</h3>
            </div>
          </PixelCard>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          <h2 className="text-xl font-pixel text-foreground mt-8">ACTIVE GAME CONTENT</h2>
          
          <div className="grid gap-4">
            {contents?.map((content) => (
              <div 
                key={content.id}
                className="bg-card border border-border p-4 flex justify-between items-center hover:border-primary transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-0.5 text-xs uppercase font-bold border ${
                      content.type === 'story' 
                        ? 'border-secondary text-secondary' 
                        : 'border-accent text-accent'
                    }`}>
                      {content.type}
                    </span>
                    <h3 className="font-bold text-lg">{content.title}</h3>
                  </div>
                  <p className="text-muted-foreground line-clamp-1">{content.content}</p>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                </div>
              </div>
            ))}

            {!contents?.length && (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border">
                No content available yet. Add some stories to populate the game world.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
