import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "@/lib/appwrite";
import type { User } from "@/types/user";

interface GlobalContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const result = await getCurrentUser();
        setUser(result);
        setIsLogged(true);
      } catch (error) {
        setIsLogged(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ user, setUser, isLogged, setIsLogged, isLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
