"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/core/Layout.tsx";
import { useAuth } from "@/components/auth/SessionAuthProvider";

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [valid, setIsValid] = useState(false);
  const { uid, token } = useParams();

  useEffect(() => {
    const redirect = () => {
      navigate("/feed");
    };

    const checkIsValid = async () => {
      try {
        await verifyEmail(uid as string, token as string); // checked below
        setTimeout(redirect, 1500);
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    };

    if (uid != null && token != null) {
      checkIsValid();
    }
  }, [verifyEmail, navigate, uid, token]);

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
          </CardHeader>

          <CardContent className="space-y-4">
            {valid && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your email was successfully verified. Redirecting to home...
                </AlertDescription>
              </Alert>
            )}

            {!valid && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was a problem verifying your email, try again.
                </AlertDescription>
              </Alert>
            )}
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
