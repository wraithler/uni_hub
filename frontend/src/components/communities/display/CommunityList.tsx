import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { CommunitySortOptions } from "@/api/communities/communityQueryParameters.ts";
import { Community } from "@/api/communities/communityTypes.ts";
import { CommunityCard } from "@/components/communities/CommunityCard.tsx";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

type CommunityListProps = {
  communities: Community[];
  sortBy: CommunitySortOptions;
  setSortBy: (val: CommunitySortOptions) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
};

export default function CommunityList({
  communities,
  sortBy,
  setSortBy,
  setSearchQuery,
  setSelectedCategory,
}: CommunityListProps) {
  return (
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
      {communities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((community: Community) => (
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
    </div>
  );
}
