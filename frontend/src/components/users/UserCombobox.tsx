import { User } from "@/api/users/userTypes.ts";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { cn } from "@/lib/utils.ts";

type UserComboboxProps = {
  users: User[];
  value: number;
  onChange: (value: number) => void;
  name: string;
  setName: (newName: string) => void;
};

export default function UserCombobox({
  users,
  value,
  onChange,
  name,
  setName,
}: UserComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedUser = users.find((user) => user.id === value);
  const display = selectedUser
    ? `${selectedUser.first_name} ${selectedUser.last_name}`
    : "Select a user";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {display}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Search users..."
            className="h-9"
            value={name}
            onValueChange={setName}
          />
          <CommandList>
            <CommandEmpty>No users found</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.first_name} ${user.last_name} (${user.email})`}
                  onSelect={() => {
                    onChange(user.id as number);
                    setOpen(false);
                  }}
                >
                  {`${user.first_name} ${user.last_name} (${user.email})`}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === user.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
