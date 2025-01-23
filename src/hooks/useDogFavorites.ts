import { useState, useEffect } from "react";

export const useDogFavorites = (userEmail: string | null) => {
  const [dogFavorites, setDogFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (userEmail) {
      const storedFavorites = localStorage.getItem(`favorites_${userEmail}`);
      if (storedFavorites) {
        setDogFavorites(JSON.parse(storedFavorites));
      }
    }
  }, [userEmail]);

  const addDogFavorite = (dogId: string) => {
    if (!dogFavorites.includes(dogId)) {
      const updatedFavorites = [...dogFavorites, dogId];
      setDogFavorites(updatedFavorites);
      if (userEmail) {
        localStorage.setItem(
          `favorites_${userEmail}`,
          JSON.stringify(updatedFavorites)
        );
      }
    }
  };

  const removeDogFavorite = (dogId: string) => {
    const updatedFavorites = dogFavorites.filter((id) => id !== dogId);
    setDogFavorites(updatedFavorites);
    if (userEmail) {
      localStorage.setItem(
        `favorites_${userEmail}`,
        JSON.stringify(updatedFavorites)
      );
    }
  };

  return { dogFavorites, addDogFavorite, removeDogFavorite };
};
