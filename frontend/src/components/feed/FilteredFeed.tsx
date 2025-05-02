import FeedFilterBar from "@/components/feed/FeedFilterBar.tsx";
import { InfiniteScrollFeed } from "@/components/feed/InfiniteScrollFeed.tsx";
import { useState } from "react";

export type FeedFilters = {
  show: "all" | "post" | "event";
};

export default function FilteredFeed() {
  const [filters, setFilters] = useState<FeedFilters>({ show: "all" });

  return (
    <>
      <FeedFilterBar filters={filters} setFilters={setFilters} />
      <InfiniteScrollFeed filters={filters} />
    </>
  );
}
