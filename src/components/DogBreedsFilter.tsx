import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DogBreedsFilterProps = {
  selectedBreeds: string[];
  setSelectedBreeds: React.Dispatch<React.SetStateAction<string[]>>;
};

export const DogBreedsFilter: React.FC<DogBreedsFilterProps> = ({
  selectedBreeds,
  setSelectedBreeds,
}) => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetchWithAuth(
          "https://frontend-take-home-service.fetch.com/dogs/breeds"
        );
        if (response.ok) {
          const data = (await response.json()) as string[];
          const sortedBreeds = data.sort((a, b) => a.localeCompare(b));
          setBreeds(sortedBreeds);
        } else {
          console.error("Failed to fetch breeds");
        }
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };

    fetchBreeds();
  }, []);

  return (
    <div className="flex flex-col gap-2 pb-4">
      <p>Filter by breeds:</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-h-[44px] justify-between"
          >
            {selectedBreeds.length === 0 && "Select breeds..."}
            {selectedBreeds.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {selectedBreeds.map((breed) => (
                  <Badge
                    variant="secondary"
                    key={breed}
                    className="mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBreeds(
                        selectedBreeds.filter((b) => b !== breed)
                      );
                    }}
                  >
                    {breed}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search breeds..." />
            <CommandEmpty>No breed found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {breeds.map((breed) => (
                <CommandItem
                  key={breed}
                  onSelect={() => {
                    setSelectedBreeds((prev) =>
                      prev.includes(breed)
                        ? prev.filter((b) => b !== breed)
                        : [...prev, breed]
                    );
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedBreeds.includes(breed)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {breed}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
