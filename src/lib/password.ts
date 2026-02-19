export interface PasswordRule {
  id: string;
  label: string;
  test: (pw: string) => boolean;
}

export const rules: PasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { id: "number", label: "One number", test: (pw) => /\d/.test(pw) },
  { id: "special", label: "One special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
  { id: "no-repeat", label: "No 3+ repeated characters", test: (pw) => !/(.)\1{2,}/.test(pw) },
  { id: "no-sequence", label: "No common sequences", test: (pw) => !/(?:012|123|234|345|456|567|678|789|abc|bcd|cde|def|qwerty)/i.test(pw) },
];

export type Strength = "none" | "weak" | "medium" | "strong";

export function evaluatePassword(pw: string): { score: number; strength: Strength; passed: string[] } {
  if (!pw) return { score: 0, strength: "none", passed: [] };

  const passed = rules.filter((r) => r.test(pw)).map((r) => r.id);
  let score = passed.length;

  // Bonus for length
  if (pw.length >= 12) score += 1;
  if (pw.length >= 16) score += 1;

  // Penalty for very short
  if (pw.length < 6) score = Math.min(score, 1);

  const ratio = score / (rules.length + 2); // max possible = rules + 2 bonuses

  const strength: Strength = ratio <= 0.3 ? "weak" : ratio <= 0.65 ? "medium" : "strong";

  return { score, strength, passed };
}

export function estimateCrackTime(pw: string): string {
  if (!pw) return "";
  let poolSize = 0;
  if (/[a-z]/.test(pw)) poolSize += 26;
  if (/[A-Z]/.test(pw)) poolSize += 26;
  if (/\d/.test(pw)) poolSize += 10;
  if (/[^A-Za-z0-9]/.test(pw)) poolSize += 32;
  if (poolSize === 0) return "instantly";

  const combinations = Math.pow(poolSize, pw.length);
  const guessesPerSecond = 1e10; // 10 billion
  const seconds = combinations / guessesPerSecond;

  if (seconds < 1) return "instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1e6) return `${Math.round(seconds / 31536000 / 1000)}k years`;
  return "millions of years";
}

export function generateStrongPassword(length = 16): string {
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  const special = "!@#$%&*?";
  const all = lower + upper + digits + special;

  const pw = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  for (let i = pw.length; i < length; i++) {
    pw.push(all[Math.floor(Math.random() * all.length)]);
  }

  // Shuffle
  for (let i = pw.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pw[i], pw[j]] = [pw[j], pw[i]];
  }

  return pw.join("");
}
