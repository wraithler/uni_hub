import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useCommunitySetRole from "@/api/communities/useCommunitySetRole.ts";
import axios from "axios";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useUsers } from "@/api/users/useUsers.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Loader2, PenSquare } from "lucide-react";
import UserCombobox from "@/components/users/UserCombobox.tsx";

type CommunityDashboardRoleDialogProps = {
  community_id: number;
};

const Schema = z.object({
  role: z.string(),
  user_id: z.number(),
  is_suspended: z.boolean(),
});

export default function CommunityDashboardRoleDialog({
  community_id,
}: CommunityDashboardRoleDialogProps) {
  const { mutate, error } = useCommunitySetRole();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
  });
  const { data: users } = useUsers({ community_id, name, limit: 250 });

  if (!users) {
    return <Loader2 className="animate-spin" />;
  }

  const onSubmit = (data: z.infer<typeof Schema>) => {
    setIsLoading(true);
    mutate({
      role: data.role,
      user_id: data.user_id,
      community_id,
    });

    if (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.detail || "Something went wrong");
      }
    }

    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Manage users</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change a user's role</DialogTitle>
          <DialogDescription>
            Promote, demote, or remove a user in your community
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <UserCombobox
                        users={users.results}
                        value={Number(field.value)}
                        onChange={field.onChange}
                        name={name}
                        setName={setName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="kick">Kick</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Update
                    <PenSquare className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
