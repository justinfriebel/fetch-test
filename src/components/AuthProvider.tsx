import { AuthContext, User } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/utils";
import React, { useState, useEffect, ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(
          "https://frontend-take-home-service.fetch.com/dogs/breeds",
          {
            credentials: "include",
          }
        );
        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (user: User) => {
    if (!user?.name || !user?.email) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: user.name, email: user.email }),
        }
      );

      if (!response.ok) {
        console.error("Login failed");
      }

      setIsAuthenticated(response.ok);
      setUser({ name: user.name, email: user.email });
    } catch (error) {
      console.error("Error during login:", error);
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetchWithAuth(
        "https://frontend-take-home-service.fetch.com/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Logout failed");
      }

      setIsAuthenticated(!response.ok);
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error during logout:", error);
      setIsAuthenticated(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
