import { PasswordChecker } from "@/components/PasswordChecker";

const Index = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <PasswordChecker />
      </div>
    </main>
  );
};

export default Index;
