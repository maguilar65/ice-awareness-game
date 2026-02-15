import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "destructive";
}

export function PixelCard({ children, className, variant = "default" }: PixelCardProps) {
  const borderColors = {
    default: "border-border",
    primary: "border-primary",
    destructive: "border-destructive",
  };

  const bgColors = {
    default: "bg-card",
    primary: "bg-primary/10",
    destructive: "bg-destructive/10",
  };

  return (
    <div className={cn(
      "relative p-6 border-4",
      borderColors[variant],
      bgColors[variant],
      className
    )}>
      {/* Decorative corner accents */}
      <div className={cn("absolute -top-1 -left-1 w-2 h-2 bg-background z-10")} />
      <div className={cn("absolute -top-1 -right-1 w-2 h-2 bg-background z-10")} />
      <div className={cn("absolute -bottom-1 -left-1 w-2 h-2 bg-background z-10")} />
      <div className={cn("absolute -bottom-1 -right-1 w-2 h-2 bg-background z-10")} />
      
      {/* Inner border for depth */}
      <div className="absolute inset-0 border border-black/20 pointer-events-none" />
      
      {children}
    </div>
  );
}
