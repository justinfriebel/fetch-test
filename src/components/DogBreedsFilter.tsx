import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";

export function DogBreedsFilter() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch(
          "https://frontend-take-home-service.fetch.com/dogs/breeds",
          {
            credentials: "include",
          }
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
    <Accordion type="single" collapsible>
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
  );
}
