import { User } from "@/api/users/userTypes";
import { Community } from "@/api/communities/communityTypes.ts";
import { Post } from "@/api/posts/postTypes";
import Layout from "@/components/core/Layout.tsx";
import ProfileBanner from "@/components/profiles/ProfileBanner.tsx";
import ProfileHeader from "@/components/profiles/ProfileHeader.tsx";
import ProfileStats from "@/components/profiles/ProfileStats.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import PostList from "@/components/posts/display/PostList.tsx";
import ProfileCommunitiesCard from "@/components/profiles/ProfileCommunitiesCard.tsx";
import ProfileInterests from "@/components/profiles/ProfileInterests.tsx";
import ProfileContactInfo from "@/components/profiles/ProfileContactInfo.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { CommunityCard } from "@/components/communities/CommunityCard.tsx";
import { PaginationProps } from "@/lib/tanstackExtension.ts";
import PaginationBox from "@/components/common/PaginationBox.tsx";

type ProfileContentProps = {
  user: User;
  posts: Post[];
  communities: Community[];
  pagination: PaginationProps;
  self?: boolean;
};

export default function ProfileContent({
  user,
  posts,
  communities,
  pagination,
  self,
}: ProfileContentProps) {
  return (
    <Layout>
      {/* Main Content */}
      <ProfileBanner />
      <main className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <ProfileHeader user={user} self={self || false} />

          {/* User Stats */}
          <ProfileStats user={user} />

          {/* Profile Content */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="w-full md:w-auto grid grid-cols-4 md:inline-flex h-auto p-0 bg-transparent gap-2">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="communities"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
              >
                Communities
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-6">
                  <PostList variant="list" posts={posts} />

                  {posts.length > 0 && (
                    <PaginationBox pagination={pagination} />
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Communities */}
                  <ProfileCommunitiesCard user={user} />

                  {/* Interests */}
                  <ProfileInterests interests={user.interests} />

                  {/* Contact Information */}
                  <ProfileContactInfo user={user} />
                </div>
              </div>
            </TabsContent>

            {/* Communities Tab */}
            <TabsContent value="communities" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Communities</CardTitle>
                    <Button
                      onClick={() =>
                        (window.location.href = "/create-community")
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Community
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {communities.map((community: Community, index: number) => (
                      <CommunityCard key={index} community={community} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </Layout>
  );
}
