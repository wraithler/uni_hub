import Layout from "@/components/Layout.tsx";
import { InfiniteScrollFeed } from "@/components/InfiniteScrollFeed.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Filter, TrendingUp } from "lucide-react";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";

export default function FeedPage() {
  return (
    <Layout>
      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="hidden lg:block space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-bold text-lg">Archie Jarvis</h2>
                    <p className="text-muted-foreground">Computer Science</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="p-2">
                    <p className="font-bold">8</p>
                    <p className="text-xs text-muted-foreground">Communities</p>
                  </div>
                  <div className="p-2">
                    <p className="font-bold">124</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="p-2">
                    <p className="font-bold">98</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/user-profile")}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">My Communities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {[
                  {
                    name: "Computer Science Society",
                    role: "Moderator",
                    avatar: "/placeholder.svg",
                  },
                  {
                    name: "Web Development Club",
                    role: "Member",
                    avatar: "/placeholder.svg",
                  },
                  {
                    name: "AI Research Group",
                    role: "Member",
                    avatar: "/placeholder.svg",
                  },
                ].map((community, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={community.avatar}
                        alt={community.name}
                      />
                      <AvatarFallback>
                        {community.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{community.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {community.role}
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-primary"
                >
                  View All Communities
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {/*{trendingTopics.map((topic, index) => (*/}
                {/*    <div key={index} className="flex items-center justify-between py-2">*/}
                {/*        <div className="flex items-center gap-2">*/}
                {/*            <span className="text-muted-foreground font-medium">#{index + 1}</span>*/}
                {/*            <span className="font-medium">{topic.name}</span>*/}
                {/*        </div>*/}
                {/*        <span className="text-xs text-muted-foreground">{topic.posts} posts</span>*/}
                {/*    </div>*/}
                {/*))}*/}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Feed Filters */}
            <div className="flex justify-between items-center">
              <Tabs className="w-full" defaultValue="all">
                <TabsList className="w-full grid grid-cols-3 h-auto p-0 bg-transparent gap-2">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="post"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                  >
                    Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="event"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                  >
                    Events
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" className="ml-2">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <InfiniteScrollFeed />
          </div>
        </div>
      </main>
    </Layout>
  );
}
