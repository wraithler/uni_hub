import { useAuth } from "@/components/auth/AuthProvider";
import FeaturedProfileCard from "@/components/profile/FeaturedProfileCard.tsx";
import Layout from "@/components/core/Layout.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import profileConfig from "@/components/profile/ProfileStyling.tsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx";
import { FileText, UserPen, Contact } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

// Mock function to simulate API call (replace with actual API call)
const fetchPosts = async () => {
  // Replace this with the actual backend API endpoint
  return [
    { id: 1, title: "Post 1", content: "This is the first post", author: "James Franklin", avatar: "/placeholder.svg" },
    { id: 2, title: "Post 2", content: "This is the second post", author: "James Franklin", avatar: "/placeholder.svg" },
    { id: 3, title: "Post 3", content: "This is the third post", author: "James Franklin", avatar: "/placeholder.svg" },
    // Add more posts
  ];
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]); // Store posts from backend

  useEffect(() => {
    // Fetch posts from the backend (simulated here with fetchPosts function)
    const getPosts = async () => {
      const postsData = await fetchPosts();
      setPosts(postsData);
    };

    getPosts();
  }, []);

  const profile = {
    first_name: user?.first_name ?? "User",
    avatar_url: "",
  };

  const style = profileConfig["Default"];

  return (
    <Layout>
      {/* Profile Banner */}
      <div className={`relative h-48 md:h-64 bg-gradient-to-r ${style.bannerGradient}`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          {style.icon}
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container px-4 mx-auto">
            <div className="relative -bottom-12 md:-bottom-8 flex items-center gap-4">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar_url} alt={profile.first_name} />
                <AvatarFallback className={`${style.avatarBg} text-white text-2xl`}>
                  {nameToAvatarFallback(profile.first_name)}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-3xl font-bold text-white drop-shadow-md mb-1 md:mb-2">
                {profile.first_name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="container px-4 py-6 mx-auto mt-12 space-y-6">
        <FeaturedProfileCard
          profile={profile}
          onEdit={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
        />
      </main>

      <div className="relative container px-4 mx-auto -mt-20">
        <div className="absolute right-0 top-0 w-64">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Email:</strong> user@example.com</p>
              <p><strong>Phone:</strong> +44 123 456 789</p>
              <p><strong>Location:</strong> Bristol, UK</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for Posts, Edit Profile, Friends */}
      <Tabs defaultValue="posts" className="mb-8 mt-16">
        <div className="container px-4 mx-auto mb-4">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex h-auto p-0 bg-transparent gap-2 justify-center">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <UserPen className="w-4 h-4 mr-2" />
              Edit Profile
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <Contact className="w-4 h-4 mr-2" />
              Friends
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tabs Content */}
        <TabsContent value="posts" className="mt-6">
        <div className="container px-4 mx-auto space-y-4 mt-20">
            <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={post.avatar} alt={post.author} />
                      <AvatarFallback>{nameToAvatarFallback(post.author)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{post.author}</span>
                      <p className="text-xs text-muted-foreground">3h ago</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground">{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2"></Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2"></Button>
                  </div>
                  <Button size="sm">View Post</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}