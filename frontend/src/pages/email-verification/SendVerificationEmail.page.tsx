"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Link } from "react-router-dom";
import Layout from "@/components/core/Layout.tsx";
import { useAuth } from "@/components/auth/AuthProvider.tsx";

export default function SendVerificationEmailPage() {
  const { sendVerificationEmail } = useAuth();
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, canResend]);

  const handleResendEmail = async () => {
    if (!canResend) return;

    setIsResending(true);
    setResendSuccess(false);
    setResendError(false);

    try {
      await sendVerificationEmail();

      // Success scenario
      setIsFirstLoad(false);
      setResendSuccess(true);
      setCanResend(false);
      setCountdown(60);
    } catch {
      // Error scenario
      setResendError(true);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const sendInitialEmail = async () => {
      try {
        await sendVerificationEmail();

        setIsFirstLoad(true);
        setResendSuccess(true);
      } catch {
        setResendError(true);
      }
    };

    sendInitialEmail();
  }, [sendVerificationEmail]);

  return (
    <Layout>
      <div className="flex justify-center pt-8 pb-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center">
                <Mail className="h-10 w-10 text-blue-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Verify Your Email
            </CardTitle>
            <CardDescription>
              We've sent a verification link to your email address
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-center text-slate-600">
              Please check your inbox and click on the verification link to
              complete your registration. If you don't see the email, check your
              spam folder.
            </p>

            {(resendSuccess && !isFirstLoad) && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  A new verification email has been sent to your inbox.
                </AlertDescription>
              </Alert>
            )}

            {resendError && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was a problem sending the verification email. Please try
                  again later.
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <h3 className="font-medium mb-2">Didn't receive the email?</h3>
              <p className="text-sm text-slate-600 mb-4">
                The email might take a few minutes to arrive. You can resend the
                verification email if needed.
              </p>
              <Button
                onClick={handleResendEmail}
                disabled={!canResend || isResending}
                className="w-full"
                variant={canResend ? "default" : "outline"}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : canResend ? (
                  "Resend Verification Email"
                ) : (
                  `Resend available in ${countdown}s`
                )}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-slate-500">
              Need help?{" "}
              <Link to="/support" className="text-blue-600 hover:underline">
                Contact Support
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
