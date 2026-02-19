import { rules } from "@/lib/password";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RuleChecklistProps {
  passed: string[];
  hasInput: boolean;
}

export function RuleChecklist({ passed, hasInput }: RuleChecklistProps) {
  return (
    <ul className="space-y-2.5">
      {rules.map((rule) => {
        const met = passed.includes(rule.id);
        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-mono transition-all duration-300",
              !hasInput && "border-border/70 bg-secondary/20 text-muted-foreground",
              hasInput && met && "border-primary/30 bg-primary/5 text-primary",
              hasInput && !met && "border-destructive/30 bg-destructive/5 text-destructive/90"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                !hasInput && "border-muted-foreground/30",
                hasInput && met && "border-primary bg-primary/10",
                hasInput && !met && "border-destructive/40"
              )}
            >
              {hasInput && met && <Check className="w-3 h-3" />}
              {hasInput && !met && <X className="w-3 h-3" />}
            </span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
