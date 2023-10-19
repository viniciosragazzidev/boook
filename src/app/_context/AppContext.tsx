"use client";

import {
  Dispatch,
  FocusEvent,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export type AppContextType = {
  fetching: boolean;
  setFetching: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
  currentCategory: string;
  setCurrentCategory: Dispatch<SetStateAction<string>>;
  totalPages: number;
  setTotalPages: Dispatch<SetStateAction<number>>;
};

export const AppContext = createContext<AppContextType>({
  fetching: false,
  setFetching: () => {},
  fetchData: () => {},
  currentCategory: "",
  setCurrentCategory: () => {},
  totalPages: 0,
  setTotalPages: () => {},
});

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [fetching, setFetching] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("");
  const fetchData = () => {
    setFetching(true);
    setTimeout(() => {
      setFetching(false);
    }, 500);
  };
  const contextValue = {
    fetching,
    setFetching,
    fetchData,
    currentCategory,
    setCurrentCategory,
    totalPages,
    setTotalPages,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
