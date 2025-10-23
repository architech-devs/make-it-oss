// AuthContext.ts
import { createContext } from "react";

export type User = {
  id: string;
  login: string;
  avatar_url: string;
    username: string;

  // add more fields as needed
};

export type AuthContextType = {
  user: User | null;
  login: () => void;
  logout: () => Promise<void>;
};

// Only export the context here
export const AuthContext = createContext<AuthContextType | null>(null);


