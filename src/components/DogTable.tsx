import React, { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";
import { fetchDogs } from "@/api/dogService";
import type { Dog } from "@/api/dogService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

type DogTableProps = {
  selectedBreeds: string[];
  dogFavorites: string[];
  addDogFavorite: (dogId: string) => void;
  removeDogFavorite: (dogId: string) => void;
};

const DogTable: React.FC<DogTableProps> = ({
  selectedBreeds,
  dogFavorites,
  addDogFavorite,
  removeDogFavorite,
}) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [sortField, setSortField] = useState<string>("breed");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const loadDogs = useCallback(
    async (pageNumber: number, breeds: string[], sort: string) => {
      setLoading(true);
      setError(null);

      try {
        const from = (pageNumber - 1) * size;
        const data = await fetchDogs({
          page: pageNumber,
          size: size,
          from: from,
          breeds: breeds,
          sort: sort,
        });
        setDogs(data.dogs);
      } catch (err) {
        console.error("An error occurred:", err);
        setError("Failed to load dogs");
      } finally {
        setLoading(false);
      }
    },
    [size]
  );

  useEffect(() => {
    setPage(1);
    loadDogs(1, selectedBreeds, `${sortField}:${sortOrder}`);
  }, [selectedBreeds, sortField, sortOrder, loadDogs]);

  useEffect(() => {
    loadDogs(page, selectedBreeds, `${sortField}:${sortOrder}`);
  }, [page, loadDogs, selectedBreeds, sortField, sortOrder]);

  const handlePaginationNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrevious = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const isFavorite = (dogId: string) => {
    return dogFavorites.includes(dogId);
  };

  const toggleFavorite = (dogId: string) => {
    if (isFavorite(dogId)) {
      removeDogFavorite(dogId);
    } else {
      addDogFavorite(dogId);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <p>Sort by:</p>
      <div className="flex items-center space-x-4 pb-6">
        <Select onValueChange={handleSortChange} value={sortField}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="breed">Breed</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="age">Age</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={() => handleSortChange(sortField)}>
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead onClick={() => handleSortChange("name")}>Name</TableHead>
            <TableHead onClick={() => handleSortChange("breed")}>
              Breed
            </TableHead>
            <TableHead onClick={() => handleSortChange("age")}>Age</TableHead>
            <TableHead>Zip Code</TableHead>
            <TableHead>Favorite</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dogs.map((dog) => (
            <TableRow key={dog.id}>
              <TableCell>
                <img src={dog.img} alt={dog.name} width="100" />
              </TableCell>
              <TableCell>{dog.name}</TableCell>
              <TableCell>{dog.breed}</TableCell>
              <TableCell>{dog.age}</TableCell>
              <TableCell>{dog.zip_code}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => toggleFavorite(dog.id)}
                  aria-label={
                    isFavorite(dog.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <Star
                    className={`h-5 w-5 ${
                      isFavorite(dog.id) ? "fill-current text-yellow-500" : ""
                    }`}
                  />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handlePaginationPrevious} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={handlePaginationNext} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default DogTable;
