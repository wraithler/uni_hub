import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import Layout from "@/components/core/Layout.tsx";
import CommunityCreateForm from "@/components/communities/CommunityCreateForm.tsx";

export default function CommunityCreatePage() {
  return (
    <Layout>
      {/* Main Content */}

      <main className="container px-4 py-6 mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create a community</h1>
          <p className="text-muted-foreground">
            Start a new community and bring people together around a shared interest
          </p>
        </div>
        <CommunityCreateForm />
      </main>

      {/* Community Examples Section */}
      <section className="container px-4 mx-auto py-12 bg-slate-50 border-t">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Successful Community Examples
            </h2>
            <p className="text-muted-foreground">
              Get inspired by these thriving communities on Uni Hub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Computer Science Society",
                members: 324,
                description:
                  "A community for CS students to collaborate on projects and share resources.",
                category: "academic",
                color: "bg-blue-500",
              },
              {
                name: "Environmental Action",
                members: 156,
                description:
                  "Working together to promote sustainability and environmental awareness on campus.",
                category: "interest",
                color: "bg-green-500",
              },
              {
                name: "International Students",
                members: 203,
                description:
                  "Supporting international students and celebrating cultural diversity.",
                category: "cultural",
                color: "bg-purple-500",
              },
            ].map((community, index) => (
              <Card key={index} className="overflow-hidden">
                <div className={`h-2 ${community.color}`}></div>
                <CardHeader>
                  <CardTitle className="text-lg">{community.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{community.members} members</span>
                    <span className="mx-1">•</span>
                    <Badge variant="outline" className="text-xs">
                      {community.category.charAt(0).toUpperCase() +
                        community.category.slice(1)}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-grow">
                  <p className="text-sm text-muted-foreground">
                    {community.description}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => (window.location.href = "/communities")}
                  >
                    View Community
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
