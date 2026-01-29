import React, { createContext, useContext, useState, useEffect } from "react";
import { useContent } from "./ContentContext";

interface User {
  username: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data } = useContent();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // In a real app, we would make an API call.
    // Here we check against the loaded content data or a specific users endpoint if we had one separate.
    // Since we put users in db.json, they are available in `data.users` via ContentContext,
    // BUT ContentContext loads 'hero', 'about' etc.
    // Let's see if `data` includes `users`.
    // My ContentContext fetches http://localhost:3001/db or similar?
    // If I fetch `http://localhost:3001/db`, I get the whole object.
    // If I fetch endpoints separately, I might not have `users` in `data`.
    // Let's check `ContentContext` implementation.
    
    // For now, I'll fetch users directly from json-server to be safe and secure-ish (not really secure but separate).
    try {
        // Assuming json-server is running on port 3001
        // We can search for the user
        try {
          const response = await fetch(`http://localhost:3001/users?username=${username}&password=${password}`);
          if (response.ok) {
            const users = await response.json();
            
            if (users.length > 0) {
                const loggedInUser = { username: users[0].username, name: users[0].name };
                setUser(loggedInUser);
                localStorage.setItem("user", JSON.stringify(loggedInUser));
                return true;
            }
          }
        } catch (fetchError) {
          console.error("Fetch login failed, trying fallback:", fetchError);
        }

        // Fallback: Check local db.json if server is unreachable
        const localData = await import("../data/db.json");
        const localUsers = localData.default.users || [];
        const foundUser = localUsers.find((u: any) => u.username === username && u.password === password);
        
        if (foundUser) {
           const loggedInUser = { username: foundUser.username, name: foundUser.name };
           setUser(loggedInUser);
           localStorage.setItem("user", JSON.stringify(loggedInUser));
           return true;
        }

    } catch (error) {
        console.error("Login error:", error);
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
