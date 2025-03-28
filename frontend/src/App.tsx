import { Router } from "@/components/Router.tsx";
import { EmailVerificationToast } from "@/components/auth/EmailVerificationToast.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { AuthProvider } from "@/components/auth/AuthProvider.tsx";
import { CommandMenu } from "@/components/CommandMenu.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
      <Toaster />
      <EmailVerificationToast />
      <CommandMenu />
    </AuthProvider>
  );
}

export default App;
