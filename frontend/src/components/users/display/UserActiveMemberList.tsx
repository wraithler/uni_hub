import { User } from "@/api/users/userTypes.ts";
import UserActiveMemberCard from "@/components/users/cards/UserActiveMemberCard.tsx";

export default function UserActiveMemberList({ users }: { users: User[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Active Members</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {users.map((user) => (
          <UserActiveMemberCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}
