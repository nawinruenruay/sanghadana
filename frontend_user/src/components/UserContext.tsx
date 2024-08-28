// ApiContext.tsx
import React, { createContext, useContext } from "react";
import axios from "axios";
import { Api } from "../Api";

type UserContextType = {
  FetchUser: (userId: string) => Promise<any>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const FetchUser = async (userId: string) => {
    try {
      const response = await axios.post(Api + "user/index", {
        userid: atob(userId),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ FetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
