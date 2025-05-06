import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";

type CommunityFiltersProps = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function CommunityFilters({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: CommunityFiltersProps) {
  return (
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
        <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
          Most Popular
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
          Newly Created
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
          My Interests
        </Badge>
      </div>
    </div>
  );
}
