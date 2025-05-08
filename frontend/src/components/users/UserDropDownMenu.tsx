import { useAuth } from "../auth/SessionAuthProvider";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  LogOut,
  UserCircle,
  UserPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {NotificationBell} from "@/components/notifications";

export default function UserDropdownMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <NotificationBell />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <UserCircle className="w-4 h-4" />
            <span>
              {user?.first_name} {user?.last_name}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserPen />
              Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
