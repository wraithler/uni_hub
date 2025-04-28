import { useState } from "react";
import { Filter, PlusIcon, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import FeaturedCommunityCard from "@/components/communities/FeaturedCommunityCard.tsx";
import { CommunityCard } from "@/components/communities/CommunityCard.tsx";
import Layout from "@/components/core/Layout.tsx";
import PageHeader from "@/components/core/PageHeader.tsx";
import { Link } from "react-router-dom";
import { useCommunities } from "@/api/communities/useCommunities.ts";
import { Community } from "@/api/communities/communityTypes.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useDebounce } from "@/lib/utils.ts";
import { useCommunitiesPaginated } from "@/api/communities/useCommunitiesPaginated.ts";
import PaginationBox from "@/components/common/PaginationBox.tsx";
import { CommunitySortOptions } from "@/api/communities/communityQueryParameters.ts";

export default function CommunitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<CommunitySortOptions>("alphabetical");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: communities,
    isLoading: isLoading,
    pagination,
  } = useCommunitiesPaginated({
    limit: 12,
    category_name: selectedCategory === "all" ? undefined : selectedCategory,
    name: debouncedSearchQuery,
    sort_by: sortBy,
  });

  const { data: featuredCommunities, isLoading: isFeaturedLoading } =
    useCommunities({
      limit: 3,
      offset: 0,
      is_featured: true,
    });

  if (isFeaturedLoading || isLoading) {
    return (
      <Layout>
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
          <Spinner className="mt-8" />
        </main>
      </Layout>
    );
  }

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

        {/* Featured Communities */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredCommunities.results.length > 0 ? (
              featuredCommunities.results.map((community: Community) => (
                <FeaturedCommunityCard
                  key={community.id}
                  community={community}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center col-span-3">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No featured communities
                </h3>
                <p className="text-muted-foreground mb-4">
                  There are no featured communities at the moment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search communities..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Interest">Interest-based</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-slate-100"
            >
              Most Popular
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-slate-100"
            >
              Newly Created
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-slate-100"
            >
              My Interests
            </Badge>
          </div>
        </div>

        {/* All Communities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Communities</h2>
            <Select
              defaultValue={sortBy}
              onValueChange={(val) => setSortBy(val as CommunitySortOptions)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="new">Newly Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {communities.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.results.map((community: Community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No communities found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any communities matching your search criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {pagination && <PaginationBox pagination={pagination} />}
        </div>

        {/* Create Community */}
        <div className="mt-8 mb-8 bg-slate-100 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Start Your Own Community
            </h3>
            <p className="text-muted-foreground">
              Have a unique interest? Create a community and connect with
              like-minded students.
            </p>
          </div>
          <Button size="lg" className="whitespace-nowrap" asChild>
            <Link to="/communities/create">Create Community</Link>
          </Button>
        </div>
      </main>
    </Layout>
  );
}
