import { User } from "@/api/users/userTypes.ts";
import UserLeadershipCard from "@/components/users/cards/UserLeadershipCard.tsx";

export default function UserLeadershipTeamList({ users }: { users: User[] }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Leadership Team</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserLeadershipCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}
