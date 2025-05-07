"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import Layout from "@/components/core/Layout.tsx";
import { useCommunityDashboard } from "@/api/communities/useCommunityDashboard.ts";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner.tsx";
import CommunityDashboardEventManagement from "@/pages/communities/dashboard/tabs/CommunityDashboardEventManagement.tsx";
import CommunityDashboardOverview from "@/pages/communities/dashboard/tabs/CommunityDashboardOverview.tsx";
import CommunityDashboardMembers from "@/pages/communities/dashboard/tabs/CommunityDashboardMembers.tsx";
import { useCommunityDetail } from "@/api/communities/useCommunityDetail.ts";
import CommunityDashboardHeader from "@/pages/communities/dashboard/CommunityDashboardHeader.tsx";
import CommunityDashboardSettings from "@/pages/communities/dashboard/tabs/CommunityDashboardSettings.tsx";

export default function CommunityDashboardPage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { id } = useParams();

  const { data, isLoading } = useCommunityDashboard({ id: Number(id) });
  const { data: community } = useCommunityDetail({ id: Number(id) });

  if (isLoading || !data || !community) {
    return (
      <Layout>
        <Spinner className="m-auto mt-5" />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Community Dashboard Header */}
      <CommunityDashboardHeader community={community} />

      {/* Main Dashboard Content */}
      <main className="container px-4 py-6 mx-auto">
        {/* Dashboard Tabs */}
        <Tabs
          defaultValue="overview"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-8"
        >
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <CommunityDashboardOverview data={data} />
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <CommunityDashboardMembers id={Number(id)} data={data} />
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <CommunityDashboardEventManagement events={data.upcoming_events} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <CommunityDashboardSettings community={community} />
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
}
