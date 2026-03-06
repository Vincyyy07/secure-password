import { PasswordChecker } from "@/components/PasswordChecker";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background px-4 py-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-warning/10 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between">
        <div></div>
        <ThemeToggle />
      </header>

      <div className="relative z-10 mx-auto flex flex-1 w-full max-w-5xl items-center justify-center py-12">
        <PasswordChecker />
      </div>

      <footer className="relative z-10 mx-auto w-full max-w-5xl text-center pb-2">
        <p className="text-sm font-mono text-muted-foreground/80 transition-colors hover:text-muted-foreground">
          &copy; 2026 Raj Vincy Degapati. Crafted with <span className="text-red-500 transition-colors hover:text-red-600 dark:hover:text-red-400">&hearts;</span> and a lot of Vibe.
        </p>
      </footer>
    </main>
  );
};

export default Index;
