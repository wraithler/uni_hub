import { Community } from "@/api/communities/communityTypes.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Calendar,
  CheckCircle2,
  MessageSquare,
  User,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import categoryConfig from "@/components/communities/CommunityStyling.tsx";
import { useCommunityApprove } from "@/api/communities/useCommunityApprove.ts";
import Layout from "@/components/core/Layout.tsx";
import { useCommunities } from "@/api/communities/useCommunities.ts";

function CommunityApprovalItem({ community }: { community: Community }) {
  const approveCommunity = useCommunityApprove();
  const config = categoryConfig[community.category as string];
  return (
    <Card className="overflow-hidden flex flex-col">
      <div
        className={`relative h-32 bg-gradient-to-r ${config.bannerGradient}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {config.featuredIcon}
        </div>
        <div className="absolute -bottom-8 left-4">
          <Avatar className="w-16 h-16 border-4 border-white">
            <AvatarImage src={community.avatar_url} alt="Community" />
            <AvatarFallback className={`${config.avatarBg} text-white`}>
              {nameToAvatarFallback(community.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardHeader className="pt-10 flex-grow">
        <CardTitle>{community.name}</CardTitle>
        <CardDescription>{community.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          {community.tags &&
            community.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-1" />
          <span>{community.member_count} members</span>
          <span className="mx-2">•</span>
          <MessageSquare className="w-4 h-4 mr-1" />
          <span>{community.post_count} posts</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
            onClick={() =>
              approveCommunity.mutate({
                id: Number(community.id),
                is_accepted: true,
              })
            }
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            onClick={() =>
              approveCommunity.mutate({
                id: Number(community.id),
                is_accepted: false,
              })
            }
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function CommunityApprovalPage() {
  const { data: communities } = useCommunities({
    is_accepted: false,
    is_declined: false,
  });

  if (!communities) {
    return (
      <Layout>
        <main className="container px-4 py-6 mx-auto">
          <div className="text-center text-muted-foreground">
            No communities pending approval
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Communities Pending Approval
              </CardTitle>
              <CardDescription>
                Approve or reject community creation requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 space-x-4 grid grid-cols-1 md:grid-cols-3">
                {communities.results.map((community: Community) => (
                  <CommunityApprovalItem
                    key={community.id}
                    community={community}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
