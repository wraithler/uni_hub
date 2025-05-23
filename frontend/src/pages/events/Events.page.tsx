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
import EventFeaturedCard from "@/components/events/cards/EventFeaturedCard.tsx";
import EventCard from "@/components/events/cards/EventCard.tsx";
import Layout from "@/components/core/Layout";
import PageHeader from "@/components/core/PageHeader";
import { Link } from "react-router-dom";
import { useEvents } from "@/api/events/useEvents";
import { Event } from "@/api/events/eventTypes";
import { useEventPaginated } from "@/api/events/useEventPaginated";
import PaginationBox from "@/components/common/PaginationBox";
import { useDebounce } from "@/lib/utils"; // optional if you wanna debounce search

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // optional
  const [sortBy, setSortBy] = useState("upcoming");

  const {
    data: events,
    pagination,
    isLoading,
  } = useEventPaginated({
    limit: 12,
    name: debouncedSearchQuery,
    sort_by: sortBy,
  });

  const { data: featuredEvents } = useEvents({
    limit: 3,
    offset: 0,
    is_featured: true,
  });

  if (!events || !featuredEvents || isLoading) return null;

  return (
    <Layout>
      <main className="container px-4 py-6 mx-auto">
        <PageHeader
          title="Events"
          description="Discover and attend exciting events on campus"
        />

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
              Upcoming
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
              Past
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
              My Events
            </Badge>
          </div>
        </div>

        {/* Featured Events */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredEvents.results.length > 0 ? (
              featuredEvents.results.map((event: Event) => (
                <EventFeaturedCard key={event.id} event={event} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center col-span-3">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No featured events</h3>
                <p className="text-muted-foreground mb-4">
                  There are no featured events at the moment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* All Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Events</h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="new">Newly Added</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {events.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.results.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any events matching your search criteria.
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear Filters</Button>
            </div>
          )}

          {/* Updated Pagination */}
          {pagination && <PaginationBox pagination={pagination} />}
        </div>

        {/* Create Event */}
        <div className="mt-12 bg-slate-100 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Host Your Own Event</h3>
            <p className="text-muted-foreground">
              Have something exciting planned? Share it with the community.
            </p>
          </div>
          <Button size="lg" className="whitespace-nowrap" asChild>
            <Link to="/events/create">Create Event</Link>
          </Button>
        </div>
      </main>
    </Layout>
  );
}
