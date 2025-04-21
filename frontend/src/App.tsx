import { Router } from "@/components/core/Router.tsx";
import { EmailVerificationToast } from "@/components/auth/EmailVerificationToast.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { AuthProvider } from "@/components/auth/AuthProvider.tsx";
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
    </AuthProvider>
  );
}

export default App;
