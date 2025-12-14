/* eslint-disable react-refresh/only-export-components */
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../src/api";

type AppContext = {
  isLoggedIn: boolean;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isError, isLoading } = useQuery({
    queryKey: ["validateToken"],
    queryFn: apiClient.validateToken,
    retry: false,
  });

  if (isLoading) {
    return <span>Ładowanie...</span>; // lub <LoadingSpinner />
  }

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: !isError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
