import { useAuth } from "@/components/auth/SessionAuthProvider";
import { Button } from "@/components/ui/button.tsx";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

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
              <Link to="/communities/approval">
                <Button
                  variant="link"
                  className="text-slate-200 p-0 h-auto text-sm"
                >
                  Community Creation Requests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
