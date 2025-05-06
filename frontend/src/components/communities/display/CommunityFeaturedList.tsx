import { Community } from "@/api/communities/communityTypes.ts";
import CommunityFeaturedCard from "@/components/communities/cards/CommunityFeaturedCard.tsx";
import { Users } from "lucide-react";
import ListEmpty from "@/components/common/ListEmpty.tsx";

export default function CommunityFeaturedList({
  communities,
}: {
  communities: Community[];
}) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Featured Communities</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {communities.length > 0 ? (
          communities.map((community: Community) => (
            <CommunityFeaturedCard key={community.id} community={community} />
          ))
        ) : (
          <ListEmpty
            icon={<Users className="w-12 h-12 text-muted-foreground mb-4" />}
            title="No featured communities"
            description="There are no featured communities at the moment."
          />
        )}
      </div>
    </div>
  );
}
