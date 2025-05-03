import { ProfileFormData } from "@/api/profile/profileTypes";

interface FeaturedProfileCardProps {
  profile: ProfileFormData;
  onEdit: () => void;
}

export default function FeaturedProfileCard({ profile }: FeaturedProfileCardProps) {
  return (
    <div>
      {/* rofile content here (e.g., fields, links, etc.) */}

    </div>
  );
}