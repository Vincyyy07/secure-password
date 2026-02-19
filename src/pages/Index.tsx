import { PasswordChecker } from "@/components/PasswordChecker";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-warning/10 blur-3xl" />
      </div>

      <header className="relative mx-auto flex w-full max-w-5xl items-center justify-between">
        <div></div>
        <ThemeToggle />
      </header>

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl items-center justify-center">
        <PasswordChecker />
      </div>
    </main>
  );
};

export default Index;
