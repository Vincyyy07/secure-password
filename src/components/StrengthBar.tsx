import { Strength } from "@/lib/password";
import { cn } from "@/lib/utils";

interface StrengthBarProps {
  strength: Strength;
  score: number;
  maxScore: number;
}

const strengthConfig: Record<Exclude<Strength, "none">, { label: string; colorClass: string; glowClass: string }> = {
  weak: { label: "Weak", colorClass: "bg-destructive", glowClass: "glow-destructive" },
  medium: { label: "Medium", colorClass: "bg-warning", glowClass: "glow-warning" },
  strong: { label: "Strong", colorClass: "bg-primary", glowClass: "glow-primary" },
};

export function StrengthBar({ strength, score, maxScore }: StrengthBarProps) {
  const percentage = strength === "none" ? 0 : Math.max(5, (score / maxScore) * 100);
  const config = strength !== "none" ? strengthConfig[strength] : null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center h-5">
        <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
          Strength
        </span>
        {config && (
          <span
            className={cn(
              "text-xs font-mono font-semibold tracking-wider uppercase transition-colors duration-300",
              strength === "weak" && "text-destructive",
              strength === "medium" && "text-warning",
              strength === "strong" && "text-primary"
            )}
          >
            {config.label}
          </span>
        )}
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            config?.colorClass ?? "bg-secondary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
