import React, { useContext, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AuthContext } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/login-form";
import LoadingSpinner from "./components/LoadingSpinner";
import { DogBreedsFilter } from "./components/DogBreedsFilter";
import DogTable from "./components/DogTable";
import AuthProvider from "./components/AuthProvider";

const AppContent: React.FC = () => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated;
  const isLoading = authContext?.isLoading;
  const logout = authContext?.logout;
  const setUser = authContext?.setUser;

  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser?.(JSON.parse(savedUser));
    }
  }, [setUser]);

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
          </div>
        </header>
        <div className="p-4">
          <DogBreedsFilter
            selectedBreeds={selectedBreeds}
            setSelectedBreeds={setSelectedBreeds}
          />
          <DogTable selectedBreeds={selectedBreeds} />
          <div className="pt-4">
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
