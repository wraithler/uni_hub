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
import PageHeader from "@/components/PageHeader.tsx";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api.ts";
import { CommunityList } from "@/api/types/communities.tsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [offset, setOffset] = useState(0);

  const {
    data: communities,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["communities", 12, offset],
    queryFn: async () => {
      const response = await api.get("/communities/", {
        params: { limit: 12, offset: offset },
      });
      return response.data as CommunityList;
    },
    placeholderData: (prevData) => prevData,
  });

  const {
    data: featuredCommunities,
    isError: isFeaturedError,
    isPending: isFeaturedPending,
  } = useQuery({
    queryKey: ["featuredCommunities", { limit: 3, offset: 0 }],
    queryFn: async () => {
      const response = await api.get("/communities/", {
        params: { limit: 3, offset: 0 },
      });
      return response.data as CommunityList;
    },
    placeholderData: (prevData) => prevData,
  });

  if (communities === undefined || featuredCommunities === undefined) {
    return null;
  }

  const totalPages = Math.ceil(communities?.count / 12);
  const currentPage = offset / 12 + 1;
  const nextPages = [currentPage + 1, currentPage + 2].filter(
    (p) => p <= totalPages,
  );
  const prevPages = [currentPage - 1, currentPage - 2].filter((p) => p > 0);
  const pages = [...prevPages, currentPage, ...nextPages];

  return (
    <Layout>
      {/* Main Content */}
      <main className="container px-4 py-6 mx-auto">
        <PageHeader
          title="Communities"
          description="Discover and join communities that match your interests"
        />

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
            {featuredCommunities.results &&
            featuredCommunities.results.length > 0 ? (
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

          {communities.results && communities.results.length > 0 ? (
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
          {communities.results && communities.results.length > 0 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      type="button"
                      onClick={() => setOffset(Math.max(0, offset - 12))}
                    />
                  </PaginationItem>
                  {pages.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        type="button"
                        onClick={() => setOffset((page - 1) * 12)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
              </Pagination>
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
            <a href="/communities/create">Create Community</a>
          </Button>
        </div>
      </main>
    </Layout>
  );
}
