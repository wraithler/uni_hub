import { useCommunities } from "@/api/communities/useCommunities.ts";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Community } from "@/api/old/types/communities.tsx";
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

export default function CommunitiesCombobox() {
  const { data } = useCommunities({ my: true });

  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {value
            ? data.results.find(
                (community: Community) => community.name === value,
              ).name
            : "Select community..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search communities..." className="h-9" />
          <CommandList>
            <CommandEmpty>No communities found.</CommandEmpty>
            <CommandGroup>
              {data && data.results.map((community: Community) => (
                <CommandItem
                  key={community.id}
                  value={community.name}
                  onSelect={(cv) => {
                    setValue(cv === value ? "" : cv);
                    setOpen(false);
                  }}
                >
                  {community.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === community.name
                        ? "opacity-100"
                        : "opacity-0",
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
