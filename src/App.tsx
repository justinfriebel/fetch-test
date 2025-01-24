import React, { useContext, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthContext } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/login-form";
import LoadingSpinner from "./components/LoadingSpinner";
import { DogBreedsFilter } from "./components/DogBreedsFilter";
import DogTable from "./components/DogTable";
import AuthProvider from "./components/AuthProvider";
import { Button } from "./components/ui/button";
import { useDogFavorites } from "./hooks/useDogFavorites";
import { Dog, fetchDogDetails, fetchDogMatch } from "./api/dogService";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./components/ui/drawer";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";

const AppContent: React.FC = () => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated;
  const isLoading = authContext?.isLoading;
  const logout = authContext?.logout;
  const user = authContext?.user;
  const setUser = authContext?.setUser;
  const { dogFavorites, addDogFavorite, removeDogFavorite } = useDogFavorites(
    user?.email ?? null
  );
  const { toast } = useToast();

  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser?.(JSON.parse(savedUser));
    }
  }, [setUser]);

  const handleMatchClick = async () => {
    try {
      const match = await fetchDogMatch(dogFavorites);
      const matchedDogDetails = await fetchDogDetails([match.match]);
      setMatchedDog(matchedDogDetails[0]);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching dog match:", error);
      toast({
        variant: "destructive",
        title: "We couldn't find your match.",
        description: "There was a problem when trying to find your match :(",
      });
    }
  };

  const handleMatchDrawerClose = () => {
    setMatchedDog(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-xl font-bold">DogSearch</h1>
        <div className="flex space-x-4">
          <Button
            disabled={dogFavorites.length === 0}
            onClick={handleMatchClick}
          >
            Meet your perfect match
          </Button>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
      <DogBreedsFilter
        selectedBreeds={selectedBreeds}
        setSelectedBreeds={setSelectedBreeds}
      />
      <DogTable
        selectedBreeds={selectedBreeds}
        dogFavorites={dogFavorites}
        addDogFavorite={addDogFavorite}
        removeDogFavorite={removeDogFavorite}
      />

      {matchedDog && (
        <Drawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onClose={handleMatchDrawerClose}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{matchedDog.name}</DrawerTitle>
              <DrawerDescription>
                Name: {matchedDog.name}
                <br />
                Breed: {matchedDog.breed}
                <br />
                Age: {matchedDog.age}
                <br />
                Location: {matchedDog.zip_code}
              </DrawerDescription>
            </DrawerHeader>
            <img
              src={matchedDog.img}
              alt={matchedDog.name}
              className="max-w-full max-h-96 object-contain"
            />
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
