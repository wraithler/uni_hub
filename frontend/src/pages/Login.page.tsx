import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs.tsx";
import { Button } from "../components/ui/button.tsx";
import { LoginForm } from "@/components/auth/LoginForm.tsx";
import { RegisterForm } from "@/components/auth/RegisterForm.tsx";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider.tsx";

export default function LoginPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-primary relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <a className="flex items-center gap-2">
              <div className="size-10 rounded-full bg-white flex items-center justify-center text-primary font-bold">
                U
              </div>
              <span className="text-2xl font-bold text-white">Uni Hub</span>
            </a>
          </div>

          <div className="max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Welcome to your university community
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Connect with fellow students, join communities, and discover
              events on campus.
            </p>

            <div className="space-y-4">
              {[
                "Access to 200+ student communities",
                "Stay updated with campus events",
                "Connect with peers in your courses",
                "Discover research and career opportunities",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="size-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                    ✓
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm opacity-80">
            © {new Date().getFullYear()} Uni Hub. All rights reserved.
          </div>
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 md:hidden">
          <Link to="/landing-page" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Log in to your account
                  </CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LoginForm />
                </CardContent>
                <CardFooter className="flex flex-col">
                  <div className="relative w-full mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button variant="outline">
                      <img
                        src="/placeholder.svg?height=24&width=24"
                        alt="Google"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Google
                    </Button>
                    <Button variant="outline">
                      <img
                        src="/placeholder.svg?height=24&width=24"
                        alt="Microsoft"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Microsoft
                    </Button>
                  </div>
                </CardFooter>
              </TabsContent>

              <TabsContent value="register">
                <CardHeader>
                  <CardTitle className="text-2xl">Create an account</CardTitle>
                  <CardDescription>
                    Enter your details to create your Uni Hub account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RegisterForm />
                </CardContent>
                <CardFooter className="flex flex-col">
                  <div className="relative w-full mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button variant="outline">
                      <img
                        src="/placeholder.svg?height=24&width=24"
                        alt="Google"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Google
                    </Button>
                    <Button variant="outline">
                      <img
                        src="/placeholder.svg?height=24&width=24"
                        alt="Microsoft"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Microsoft
                    </Button>
                  </div>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="p-4 text-center text-sm text-muted-foreground md:hidden">
          © {new Date().getFullYear()} Uni Hub. All rights reserved.
        </div>
      </div>
    </div>
  );
}
