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
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">
          <span className="text-gradient-primary">Password</span>{" "}
          <span className="text-foreground">Checker</span>
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          Real-time strength analysis & guidance
        </p>
      </div>

      {/* Input Card */}
      <div
        className={cn(
          "rounded-xl border bg-card p-6 space-y-6 transition-shadow duration-500",
          strength === "strong" && "glow-primary",
          strength === "weak" && password && "glow-destructive",
          strength === "medium" && "glow-warning"
        )}
      >
        {/* Password Input */}
        <div className="relative">
          <input
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
            {password && (
              <button
                onClick={handleCopy}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Copy password"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Strength Bar */}
        <StrengthBar strength={strength} score={score} maxScore={maxScore} />

        {/* Crack Time */}
        {password && (
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

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full h-11 rounded-lg bg-secondary text-secondary-foreground font-mono text-sm font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors border border-border"
      >
        <RefreshCw className="w-4 h-4" />
        Generate Strong Password
      </button>
    </div>
  );
}
