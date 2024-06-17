import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
} from "../helpers/api";

type IUser = {
  email: string;
  first_name: string;
  last_name: string;
};

export type SignupData = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: IUser | null;
  login: (loginData: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  signup: (signupData: SignupData) => Promise<void>;
};

const authContext = createContext<AuthContextType | null>(null);
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    // Check if the user is already logged in
    async function checkStatus() {
      const data = await checkAuthStatus();
      if (data) {
        setIsLoggedIn(true);
        setUser({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        });
      }
    }
    checkStatus();
  }, []);

  const login = async (loginData: LoginData) => {
    const data = await loginUser(loginData);
    console.log(data);
    if (data) {
      setIsLoggedIn(true);
      setUser({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      });
    }
  };
  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };
  const signup = async (signupData: SignupData) => {
    const data = await signupUser(signupData);
    if (data) {
      setUser({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      });
      setIsLoggedIn(true);
    }
  };

  const value = { isLoggedIn, user, login, logout, signup };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuth = () => useContext(authContext);
