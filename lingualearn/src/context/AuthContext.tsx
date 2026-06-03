import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: string;
  streak: number;
  xp: number;
  joinDate: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "lingualearn_auth";

const defaultUser: User = {
  id: "user_001",
  username: "学习者",
  email: "",
  avatar: "",
  level: "A1",
  streak: 0,
  xp: 0,
  joinDate: new Date().toISOString().split("T")[0],
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthState;
        setState({
          user: parsed.user,
          isAuthenticated: parsed.isAuthenticated,
          isLoading: false,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const persistState = (newState: AuthState) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
    } catch {}
  };

  const login = async (email: string, _password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await new Promise((resolve) => setTimeout(resolve, 800));

    const user: User = {
      ...defaultUser,
      id: `user_${Date.now()}`,
      email,
      username: email.split("@")[0],
      joinDate: new Date().toISOString().split("T")[0],
    };

    const newState: AuthState = {
      user,
      isAuthenticated: true,
      isLoading: false,
    };

    setState(newState);
    persistState(newState);
  };

  const register = async (username: string, email: string, _password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user: User = {
      ...defaultUser,
      id: `user_${Date.now()}`,
      username,
      email,
      joinDate: new Date().toISOString().split("T")[0],
    };

    const newState: AuthState = {
      user,
      isAuthenticated: true,
      isLoading: false,
    };

    setState(newState);
    persistState(newState);
  };

  const logout = () => {
    const newState: AuthState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    };

    setState(newState);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider内部使用");
  }
  return context;
}

export default AuthContext;
