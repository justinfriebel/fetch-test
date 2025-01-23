import { createContext } from "react";

export type User = { name: string; email: string } | null;

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  setUser: (user: User) => void;
  login: (user: User) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
