import { useAuth } from "@/components/auth/SessionAuthProvider";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const EmailVerificationToast = () => {
  const { user } = useAuth();
  const hasShownToastRef = useRef(false); // for dev to counter react strict mode double render

  useEffect(() => {
    if (user && !user.is_email_verified && !hasShownToastRef.current) {
      hasShownToastRef.current = true;

      toast.info("Please verify your email address", {
        description: (
          <span className="text-foreground">
            You need to verify your email address to access all features
          </span>
        )
      });
    }
  }, [user]);

  return null;
};
