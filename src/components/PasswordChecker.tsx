import { useState, useMemo } from "react";
import { Eye, EyeOff, RefreshCw, Copy, Shield } from "lucide-react";
import { evaluatePassword, estimateCrackTime, generateStrongPassword, rules } from "@/lib/password";
import { StrengthBar } from "./StrengthBar";
import { RuleChecklist } from "./RuleChecklist";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { score, strength, passed } = useMemo(() => evaluatePassword(password), [password]);
  const crackTime = useMemo(() => estimateCrackTime(password), [password]);
  const maxScore = rules.length + 2;
  const metRules = passed.length;
  const completion = password ? Math.round((score / maxScore) * 100) : 0;

  const handleGenerate = () => {
    const pw = generateStrongPassword();
    setPassword(pw);
    setShowPassword(true);
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="space-y-3 text-center">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-mono tracking-wider text-primary">
          <Shield className="h-3.5 w-3.5" />
          SECURITY SUITE
        </span>
        <div className="inline-flex items-center justify-center mb-1 h-16 w-16 rounded-2xl border border-primary/20 bg-card/90 shadow-lg shadow-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-heading tracking-tight sm:text-4xl">
          <span className="text-gradient-primary">Password</span>{" "}
          <span className="text-foreground">Command Center</span>
        </h1>
        <p className="text-sm font-mono text-muted-foreground">
          Real-time analysis, policy checks, and one-click generation
        </p>
      </div>

      <div
        className={cn(
          "rounded-2xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur-sm transition-shadow duration-500 sm:p-8",
          strength === "strong" && "glow-primary",
          strength === "weak" && password && "glow-destructive",
          strength === "medium" && "glow-warning"
        )}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Live Password Input
            </p>
            <span className="rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs font-mono text-secondary-foreground">
              {password ? `${password.length} chars` : "No input"}
            </span>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              className="h-12 w-full rounded-xl border border-border bg-input/80 px-4 pr-24 font-mono text-sm text-foreground placeholder:text-muted-foreground/80 transition-all focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="off"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {password && (
                <button
                  onClick={handleCopy}
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Copy password"
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-secondary/40 px-4 py-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Score</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{score} / {maxScore}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-secondary/40 px-4 py-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Rules Met</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{metRules} / {rules.length}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-secondary/40 px-4 py-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Coverage</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{completion}%</p>
            </div>
          </div>

          <StrengthBar strength={strength} score={score} maxScore={maxScore} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/70 bg-secondary/30 px-4 py-3">
            <span className="text-xs font-mono text-muted-foreground">Estimated crack time</span>
            <span
              className={cn(
                "text-xs font-mono font-semibold",
                !password && "text-muted-foreground",
                strength === "weak" && "text-destructive",
                strength === "medium" && "text-warning",
                strength === "strong" && "text-primary"
              )}
            >
              {password ? crackTime : "Awaiting analysis"}
            </span>
          </div>

          <RuleChecklist passed={passed} hasInput={password.length > 0} />

          {password && strength !== "strong" && (
            <p className="rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-xs font-mono leading-relaxed text-muted-foreground">
              💡 {strength === "weak"
                ? "Try using a mix of uppercase, numbers, and symbols."
                : "Almost there — add more variety or length to reach strong."}
            </p>
          )}

          {password && strength === "strong" && (
            <p className="animate-pulse-glow rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs font-mono leading-relaxed text-primary">
              🔒 Excellent! This password passes strong security standards.
            </p>
          )}

          <button
            onClick={handleGenerate}
            className="h-11 w-full rounded-xl border border-border bg-secondary text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 flex items-center justify-center gap-2 font-mono"
          >
            <RefreshCw className="h-4 w-4" />
            Generate Strong Password
          </button>
        </div>
      </div>
    </div>
  );
}
