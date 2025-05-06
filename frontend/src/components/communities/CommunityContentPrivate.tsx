import {Lock} from "lucide-react";

export default function CommunityContentPrivate() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center col-span-3">
      <Lock className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-medium mb-2">Private Community</h3>
      <p className="text-muted-foreground mb-4">
        Content in this community is member-only.
      </p>
    </div>
  );
}
