import { Tabs } from "@radix-ui/react-tabs";
import { TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Filter } from "lucide-react";

export default function FeedFilterBar() {
  return (
    <div className="flex justify-between items-center">
      <Tabs className="w-full" defaultValue="all">
        <TabsList className="w-full grid grid-cols-3 h-auto p-0 bg-transparent gap-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="post"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="event"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
          >
            Events
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Button variant="outline" size="sm" className="ml-2">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  );
}
