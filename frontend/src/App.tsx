import { Router } from "@/components/core/Router.tsx";
import { EmailVerificationToast } from "@/components/auth/EmailVerificationToast.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionAuthProvider } from "@/components/auth/SessionAuthProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionAuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
      <Toaster />
      <EmailVerificationToast />
    </SessionAuthProvider>
  );
}

export default App;
