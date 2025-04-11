import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "../ui/button.tsx";
import {ImageIcon, PenSquare, Link} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import CommunitiesCombobox from "@/components/communities/CommunitiesCombobox.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

export default function CreatePostCard() {
  const { user } = useAuth();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>
              {nameToAvatarFallback(`${user?.first_name} ${user?.last_name}`)}
            </AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="Share something with your communities..."
            className="bg-slate-100"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-3 pt-3 border-t">
          <div className="flex flex-1">
            <Button variant="ghost" size="sm" className="flex-1">
              <ImageIcon className="h-4 w-4 mr-2" />
              Media
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <Link className="h-4 w-4 mr-2" />
              Link
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <CommunitiesCombobox />
            <Button className="w-full sm:w-auto">
              Post
              <PenSquare className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
