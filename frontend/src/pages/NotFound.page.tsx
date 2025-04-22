"use client";

import {
  Calendar,
  Home,
  MapPin,
  MessageSquare,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Layout from "@/components/core/Layout.tsx";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  // Popular links to help users navigate
  const popularLinks = [
    { title: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    {
      title: "Communities",
      href: "/communities",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Events",
      href: "/events",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Support",
      href: "/support",
      icon: <MessageSquare className="h-4 w-4" />,
    },
  ];

  return (
    <Layout>
      {/* Main Content */}
      <main className="container px-4 py-12 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8 relative">
            <div className="text-[180px] md:text-[240px] font-bold text-primary/10 leading-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-6 shadow-lg">
                <MapPin className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Oops! It seems like you've wandered into uncharted territory. The
            page you're looking for doesn't exist or has been moved.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for communities, events, or topics..."
                className="pl-10 py-6 text-lg"
              />
            </div>
          </div>

          {/* Popular Links */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Popular Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {popularLinks.map((link, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <Link to={link.href} className="block h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        {link.icon}
                      </div>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Help */}
          <Card className="bg-slate-100 border-none">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                If you're having trouble finding what you're looking for, our
                support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/support")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Return to Home
                </Button>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground text-center">
              Error Code: 404 - Page Not Found
            </CardFooter>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
