import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  Context,
} from "react";

type IUser = {
  email: string;
  name: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
};

const authContext = createContext<AuthContextType | null>(null);
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    // Check if the user is already logged in
  }, []);

  const login = async (email: string, password: string) => {
    // Call the login API
    // If successful, set the user and token in the state
    // If unsuccessful, show an error message
  };
  const logout = () => {
    // Clear the user and token from the state
  };
  const signup = async (name: string, email: string, password: string) => {
    // Call the signup API
    // If successful, set the user and token in the state
    // If unsuccessful, show an error message
  };

  const value = { isLoggedIn, user, login, logout, signup };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuth = () => useContext(authContext);