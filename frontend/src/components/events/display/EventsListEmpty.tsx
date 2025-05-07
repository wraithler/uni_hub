import { Info } from "lucide-react";
import ListEmpty from "@/components/common/ListEmpty.tsx";

export default function EventsListEmpty() {
  return (
    <ListEmpty
      title="No Events"
      description="There are currently no events available."
      icon={<Info className="w-12 h-12 mb-4" />}
    />
  );
}
