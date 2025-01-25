import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/utils";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DogBreedsFilterProps = {
  selectedBreeds: string[];
  setSelectedBreeds: React.Dispatch<React.SetStateAction<string[]>>;
};

export const DogBreedsFilter: React.FC<DogBreedsFilterProps> = ({
  selectedBreeds = [],
  setSelectedBreeds,
}) => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBreeds = async () => {
      setIsLoading(true);
      try {
        const response = await fetchWithAuth(
          "https://frontend-take-home-service.fetch.com/dogs/breeds"
        );
        if (response.ok) {
          const data = (await response.json()) as string[];
          const sortedBreeds = Array.isArray(data)
            ? data.sort((a, b) => a.localeCompare(b))
            : [];
          setBreeds(sortedBreeds);
        } else {
          console.error("Failed to fetch breeds");
          setBreeds([]);
        }
      } catch (error) {
        console.error("Error fetching breeds:", error);
        setBreeds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  const handleBreedSelect = (breed: string) => {
    setSelectedBreeds((prev = []) =>
      prev.includes(breed) ? prev.filter((b) => b !== breed) : [...prev, breed]
    );
  };

  return (
    <div className="flex flex-col gap-2 pb-4">
      <p>Filter by breeds:</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {Array.isArray(selectedBreeds) &&
          selectedBreeds.map((breed) => (
            <Badge
              variant="secondary"
              key={breed}
              className="flex items-center gap-1 p-1"
            >
              {breed}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleBreedSelect(breed)}
              />
            </Badge>
          ))}
      </div>
      <Select onValueChange={handleBreedSelect} value="">
        <SelectTrigger className="w-full">
          <SelectValue defaultValue="" placeholder="Select breeds..." />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectGroup>
              <SelectItem value="loading" disabled>
                Loading breeds...
              </SelectItem>
            </SelectGroup>
          ) : !breeds.length ? (
            <SelectGroup>
              <SelectItem value="empty" disabled>
                No breeds found
              </SelectItem>
            </SelectGroup>
          ) : (
            <SelectGroup className="max-h-[300px] overflow-auto">
              {breeds
                .filter((breed) => !selectedBreeds.includes(breed))
                .map((breed) => (
                  <SelectItem key={breed} value={breed}>
                    {breed}
                  </SelectItem>
                ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
