import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-lg border-4 border-destructive p-8 md:p-12 relative bg-black/20">
        {/* Retro scanline effect overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
        
        <AlertTriangle className="w-24 h-24 text-destructive mx-auto animate-pulse" />
        
        <h1 className="text-4xl md:text-6xl font-pixel text-destructive text-shadow-retro">
          404
        </h1>
        
        <p className="text-xl md:text-2xl font-retro text-muted-foreground uppercase tracking-widest">
          Zone Not Found
        </p>
        
        <p className="font-retro text-foreground">
          The coordinates you are trying to access do not exist in this sector.
        </p>

        <Link href="/" className="inline-block mt-8">
          <button className="px-8 py-3 bg-destructive hover:bg-destructive/90 text-white font-pixel text-sm uppercase transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            Return to Base
          </button>
        </Link>
      </div>
    </div>
  );
}
