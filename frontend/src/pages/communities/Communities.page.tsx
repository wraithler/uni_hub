import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import Layout from "@/components/core/Layout.tsx";
import PageHeader from "@/components/core/PageHeader.tsx";
import { Link } from "react-router-dom";
import CommunityListContainer from "@/components/communities/display/CommunityListContainer.tsx";
import CommunityCreate from "@/components/communities/CommunityCreate.tsx";

export default function CommunitiesPage() {
  return (
    <Layout>
      {/* Main Content */}
      <main className="container px-4 py-6 mx-auto">
        <PageHeader
          title="Communities"
          description="Discover and join communities that match your interests"
          button={
            <Button variant="outline" asChild>
              <Link to="/communities/create">
                <PlusIcon />
                Create a community
              </Link>
            </Button>
          }
        />

        {/* Community List & Filters */}
        <CommunityListContainer />

        {/* Create Community */}
        <CommunityCreate />
      </main>
    </Layout>
  );
}
