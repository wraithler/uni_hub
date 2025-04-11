import { useAuth } from "@/components/auth/AuthProvider.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "../ui/badge.tsx";
import { Shield } from "lucide-react";

export default function AdminHeader() {
  const { user } = useAuth();
  return (
    <div className="bg-slate-900 text-slate-200 py-2">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Shield className="w-6 h-4" />
              <span className="text-sm font-medium">
                {user?.first_name} {user?.last_name}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="link"
                className="text-slate-200 p-0 h-auto text-sm"
              >
                User Management
              </Button>
              <Button
                variant="link"
                className="text-slate-200 p-0 h-auto text-sm"
              >
                Content Moderation
              </Button>
              <Button
                variant="link"
                className="text-slate-200 p-0 h-auto text-sm"
              >
                Analytics
              </Button>
              <Button
                variant="link"
                className="text-slate-200 p-0 h-auto text-sm"
              >
                Settings
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="text-slate-200 border-slate-700"
            >
              {user?.is_admin ? "Admin" : "Moderator"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-100"
            >
              Exit Admin Mode
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
