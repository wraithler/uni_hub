import { Tabs } from "@radix-ui/react-tabs";
import { TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { FeedFilters } from "@/components/feed/FilteredFeed.tsx";
import React from "react";

type FeedFilterBarProps = {
  filters: FeedFilters;
  setFilters: React.Dispatch<React.SetStateAction<FeedFilters>>;
};

export default function FeedFilterBar({
  filters,
  setFilters,
}: FeedFilterBarProps) {
  const handleShowChange = (newShow: "all" | "post" | "event") => {
    setFilters((prev) => ({ ...prev, show: newShow }));
  };

  return (
    <div className="flex justify-between items-center">
      <Tabs className="w-full" defaultValue={filters.show}>
        <TabsList className="w-full grid grid-cols-3 h-auto p-0 bg-transparent gap-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            onClick={() => handleShowChange("all")}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="post"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            onClick={() => handleShowChange("post")}
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="event"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            onClick={() => handleShowChange("event")}
          >
            Events
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
