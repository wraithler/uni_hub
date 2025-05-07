import { User } from "@/api/users/userTypes.ts";

export default function ProfileBanner({ user }: { user: User }) {
  return (
    <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-indigo-600">
      <img
        src={user.banner || "/placeholder.svg"}
        alt="Cover"
        className="w-full h-full object-cover opacity-50"
      />
    </div>
  );
}
