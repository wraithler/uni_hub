import { Info } from "lucide-react";

export default function EventsListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center col-span-3">
      <Info className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-medium mb-2">No Events</h3>
      <p className="text-muted-foreground mb-4">
        There are currently no events available.
      </p>
    </div>
  );
}
