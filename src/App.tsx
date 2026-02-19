import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme";
import Index from "./pages/Index";

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="password-checker-theme">
    <Sonner />
    <Index />
  </ThemeProvider>
);

export default App;
