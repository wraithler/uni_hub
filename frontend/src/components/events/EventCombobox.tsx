
import { useState } from "react";
import { useEvents } from "@/api/events/useEvents";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { Event } from "@/api/events/eventTypes";
import { cn } from "@/lib/utils";

type EventsComboboxProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function EventsCombobox({ value, onChange }: EventsComboboxProps) {
  const { data } = useEvents();
  const [open, setOpen] = useState(false);

  const selectedEvent = data?.results.find((event: Event) => event.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {selectedEvent?.title ?? "Select an event..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search events..." className="h-9" />
          <CommandList>
            <CommandEmpty>No events found.</CommandEmpty>
            <CommandGroup>
              {data?.results.map((event: Event) => (
                <CommandItem
                  key={event.id}
                  value={event.title}
                  onSelect={() => {
                    onChange(event.id!);
                    setOpen(false);
                  }}
                >
                  {event.title}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === event.id ? "opacity-100" : "opacity-0"
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
