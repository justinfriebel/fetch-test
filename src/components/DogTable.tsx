import React, { useEffect, useState } from "react";
import { fetchDogs } from "@/api/dogService";
import type { Dog } from "@/api/dogService";

type DogTableProps = {
  selectedBreeds: string[];
};

const DogTable: React.FC<DogTableProps> = ({ selectedBreeds }) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDogs = async () => {
      try {
        const data = await fetchDogs({ breeds: selectedBreeds });
        setDogs(data);
      } catch (err) {
        setError("Failed to load dogs");
      } finally {
        setLoading(false);
      }
    };

    loadDogs();
  }, [selectedBreeds]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Breed</th>
          <th>Age</th>
          <th>Zip Code</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {dogs.map((dog) => (
          <tr key={dog.id}>
            <td>{dog.name}</td>
            <td>{dog.breed}</td>
            <td>{dog.age}</td>
            <td>{dog.zip_code}</td>
            <td>
              <img src={dog.img} alt={dog.name} width="100" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DogTable;
