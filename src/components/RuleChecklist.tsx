import { rules } from "@/lib/password";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RuleChecklistProps {
  passed: string[];
  hasInput: boolean;
}

export function RuleChecklist({ passed, hasInput }: RuleChecklistProps) {
  return (
    <ul className="space-y-2">
      {rules.map((rule) => {
        const met = passed.includes(rule.id);
        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-3 text-sm font-mono transition-all duration-300",
              !hasInput && "text-muted-foreground",
              hasInput && met && "text-primary",
              hasInput && !met && "text-destructive/80"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-300 shrink-0",
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
