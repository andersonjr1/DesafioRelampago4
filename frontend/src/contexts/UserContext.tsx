import React, { createContext, useContext, ReactNode, useState } from "react";

interface User {
  id: string | null;
  name: string | null;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  updateUserFromWebSocket: (data: any) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User>({
    id: null,
    name: null,
  });

  const setUser = (newUser: User) => {
    setUserState(newUser);
  };

  const updateUserFromWebSocket = (data: any) => {
    if (data.success) {
      setUserState({
        id: data.yourId,
        name: data.yourName,
      });
    }
  };

  const clearUser = () => {
    setUserState({
      id: null,
      name: null,
    });
  };

  const value = {
    user,
    setUser,
    updateUserFromWebSocket,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
