import CommunityContentPrivate from "@/components/communities/CommunityContentPrivate.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Calendar, FileText, Info, Users } from "lucide-react";
import PostListContainer from "@/components/posts/display/PostListContainer.tsx";
import { Community } from "@/api/communities/communityTypes.ts";
import EventListContainer from "@/components/events/display/EventListContainer.tsx";
import UserListContainer from "@/components/users/display/UserListContainer.tsx";
import CommunityAbout from "@/components/communities/CommunityAbout.tsx";

export default function CommunityContent({
  community,
}: {
  community: Community;
}) {
  return (
    <>
      {community.privacy === "restricted" && !community.is_member && (
        <CommunityContentPrivate />
      )}

      {/* Community Content Tabs */}
      {(community.privacy === "public" || community.is_member) && (
        <Tabs defaultValue="posts" className="mb-8">
          <TabsList className="w-full md:w-auto grid grid-cols-4 md:inline-flex h-auto p-0 bg-transparent gap-2">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <Users className="w-4 h-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              <Info className="w-4 h-4 mr-2" />
              About
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-6">
            <PostListContainer community={community} />
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <EventListContainer community={community} />
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6">
            <UserListContainer community={community} />
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6">
            <CommunityAbout community={community} />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
