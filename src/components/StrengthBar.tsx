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
  const segments = Array.from({ length: maxScore });

  return (
    <div className="space-y-3">
      <div className="flex h-5 items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Strength
        </span>
        {config && (
          <span
            className={cn(
              "text-xs font-mono font-semibold uppercase tracking-wider transition-colors duration-300",
              strength === "weak" && "text-destructive",
              strength === "medium" && "text-warning",
              strength === "strong" && "text-primary"
            )}
          >
            {config.label}
          </span>
        )}
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            config?.colorClass ?? "bg-secondary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-8 gap-1">
        {segments.map((_, index) => {
          const threshold = ((index + 1) / maxScore) * 100;
          const isActive = percentage >= threshold;

          return (
            <span
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-colors duration-300",
                isActive && config?.colorClass,
                !isActive && "bg-secondary"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
