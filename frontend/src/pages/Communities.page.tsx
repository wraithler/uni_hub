import { useState } from "react";
import { Filter, Search, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeaturedCommunityCard from "@/components/FeaturedCommunityCard.tsx";
import { CommunityCard } from "@/components/CommunityCard.tsx";
import Layout from "@/components/Layout.tsx";
import { useCommunityList } from "@/hooks/useCommunityList.ts";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: communities } = useCommunityList();

  const { data: featuredCommunities } = useCommunityList({
    initialFilters: { is_featured: true },
  });

  // // Filter communities based on search query and selected category
  // const filteredCommunities = communitiesData.filter((community) => {
  //   const matchesSearch =
  //     community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     community.description.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesCategory =
  //     selectedCategory === "all" || community.category === selectedCategory;
  //
  //   return matchesSearch && matchesCategory;
  // });

  return (
    <Layout>
      {/* Main Content */}
      <main className="container px-4 py-6 mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Communities</h1>
          <p className="text-muted-foreground">
            Discover and join communities that match your interests
          </p>
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
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="interest">Interest-based</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
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
              Recently Active
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

        {/* Featured Communities */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredCommunities && featuredCommunities.results.length > 0 ? (
              featuredCommunities.results.map((community) => (
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

        {/* All Communities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Communities</h2>
            <Select defaultValue="popular">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recent">Recently Active</SelectItem>
                <SelectItem value="new">Newly Created</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {communities && communities.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.results.map((community) => (
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
          {communities && communities.results.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-9 h-9 p-0 bg-primary text-primary-foreground"
                >
                  1
                </Button>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  2
                </Button>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  3
                </Button>
                <span className="mx-1">...</span>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  8
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Create Community */}
        <div className="mt-12 bg-slate-100 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Start Your Own Community
            </h3>
            <p className="text-muted-foreground">
              Have a unique interest? Create a community and connect with
              like-minded students.
            </p>
          </div>
          <Button size="lg" className="whitespace-nowrap">
            Create Community
          </Button>
        </div>
      </main>
    </Layout>
  );
}
