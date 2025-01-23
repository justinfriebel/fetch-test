import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/utils";

type DogBreedsFilterProps = {
  selectedBreeds: string[];
  setSelectedBreeds: React.Dispatch<React.SetStateAction<string[]>>;
};

export const DogBreedsFilter: React.FC<DogBreedsFilterProps> = ({
  selectedBreeds,
  setSelectedBreeds,
}) => {
  const [breeds, setBreeds] = useState<string[]>([]);

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
    <div>
      <p>Filter by:</p>
      <Accordion type="single" collapsible className="pb-6">
        <AccordionItem value="breeds">
          <AccordionTrigger>Dog Breeds</AccordionTrigger>
          <AccordionContent>
            <ToggleGroup
              type="multiple"
              value={selectedBreeds}
              onValueChange={(value) => setSelectedBreeds(value)}
              className="grid grid-cols-2 gap-2"
            >
              {breeds.map((breed) => (
                <ToggleGroupItem
                  key={breed}
                  value={breed}
                  aria-label={`Toggle ${breed}`}
                  className="text-center"
                >
                  {breed}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
