"use client";

import { Badge } from "@/components/ui/badge.tsx";
import Layout from "@/components/core/Layout.tsx";
import { useParams } from "react-router-dom";
import { useCommunityDetail } from "@/api/communities/useCommunityDetail.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import CommunityBanner from "@/components/communities/CommunityBanner.tsx";
import CommunityActions from "@/components/communities/CommunityActions.tsx";
import CommunityDescription from "@/components/communities/CommunityDescription.tsx";
import CommunityContent from "@/components/communities/CommunityContent.tsx";

export default function CommunityDetail() {
  const { id } = useParams();

  const { data: community } = useCommunityDetail({
    id: Number(id),
  });

  if (!community) {
    return (
      <Layout>
        <Spinner className="m-auto mt-24" />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Community Banner */}
      <CommunityBanner community={community} />

      {/* Main Content */}
      <main className="container px-4 mx-auto pt-16 md:pt-20 pb-12">
        {/* Mobile Title (visible on small screens) */}
        <div className="md:hidden mb-6">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2">
            {community.category}
          </Badge>
          <h1 className="text-2xl font-bold">{community.name}</h1>
        </div>

        {/* Community Actions */}
        <CommunityActions community={community} />

        {/* Community Description */}
        <CommunityDescription community={community} />

        {/* Community Content */}
        <CommunityContent community={community} />
      </main>
    </Layout>
  );
}
