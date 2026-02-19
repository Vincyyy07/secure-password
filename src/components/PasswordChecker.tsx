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
  const completion = Math.round((passed.length / rules.length) * 100);

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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-heading tracking-tight sm:text-4xl">
          <span className="text-gradient-primary">Password</span>{" "}
          <span className="text-foreground">Checker</span>
        </h1>
        <p className="text-sm text-muted-foreground font-mono max-w-xl">
          Test your password strength in real time and fix weak spots with clear, actionable feedback.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-card p-3">
          <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">Rules met</p>
          <p className="text-lg font-semibold font-mono text-foreground">
            {passed.length} / {rules.length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">Length</p>
          <p className="text-lg font-semibold font-mono text-foreground">{password.length} chars</p>
        </div>
      </div>

      {/* Input Card */}
      <div
        className={cn(
          "rounded-xl border bg-card p-5 sm:p-6 space-y-6 transition-shadow duration-500",
          strength === "strong" && "glow-primary",
          strength === "weak" && password && "glow-destructive",
          strength === "medium" && "glow-warning"
        )}
      >
        {/* Password Input */}
        <div className="space-y-3">
          <label htmlFor="password-input" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <div className="relative">
          <input
            id="password-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password..."
            className="w-full h-12 rounded-lg bg-input border border-border px-4 pr-24 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            autoComplete="off"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGenerate}
            className="h-9 rounded-md bg-secondary text-secondary-foreground font-mono text-xs font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors border border-border px-3"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Generate strong password
          </button>
          <button
            onClick={handleCopy}
            disabled={!password}
            className="h-9 rounded-md bg-secondary text-secondary-foreground font-mono text-xs font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors border border-border px-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
        </div>

        {/* Strength Bar */}
        <StrengthBar strength={strength} score={score} maxScore={maxScore} />

        {/* Crack Time */}
        {password.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
            <span className="text-xs font-mono text-muted-foreground">Est. crack time</span>
            <span
              className={cn(
                "text-xs font-mono font-semibold",
                strength === "weak" && "text-destructive",
                strength === "medium" && "text-warning",
                strength === "strong" && "text-primary"
              )}
            >
              {crackTime}
            </span>
          </div>
        )}

        {password.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wide text-muted-foreground">
              <span>Checklist completion</span>
              <span>{completion}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
          </div>
        )}

        {/* Checklist */}
        <RuleChecklist passed={passed} hasInput={password.length > 0} />

        {/* Tip */}
        {password && strength !== "strong" && (
          <p className="text-xs text-muted-foreground font-mono leading-relaxed bg-secondary/30 rounded-lg px-4 py-3">
            💡{" "}
            {strength === "weak"
              ? "Try using a mix of uppercase, numbers, and symbols."
              : "Almost there — add more variety or length to reach strong."}
          </p>
        )}

        {password && strength === "strong" && (
          <p className="text-xs text-primary font-mono leading-relaxed bg-primary/5 rounded-lg px-4 py-3 animate-pulse-glow">
            🔒 Excellent! This is a strong password.
          </p>
        )}
      </div>
    </div>
  );
}
