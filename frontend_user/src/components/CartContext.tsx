import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { Api } from "../Api";

interface CartsumContextType {
  cartsum: number;
  updateCartsum: (newCartsum: number) => void;
  fetchCartsum: (id: string) => void;
}

const CartsumContext = createContext<CartsumContextType | undefined>(undefined);

interface CartsumProviderProps {
  children: ReactNode;
}

// CartsumProvider
export const CartsumProvider: React.FC<CartsumProviderProps> = ({
  children,
}) => {
  const [cartsum, setCartsum] = useState<number>(0);

  const updateCartsum = (newCartsum: number): void => {
    setCartsum(newCartsum);
  };

  const fetchCartsum = (id: string): void => {
    axios
      .post<{ sum: number }>(Api + "cart/index/4", {
        userid: id,
      })
      .then((res) => {
        const data = res.data;
        if ([data].length !== 0) {
          setCartsum(data.sum);
        }
      });
  };

  return (
    <CartsumContext.Provider value={{ cartsum, updateCartsum, fetchCartsum }}>
      {children}
    </CartsumContext.Provider>
  );
};

// useCartsum
export const useCartsum = (): CartsumContextType => {
  const context = useContext(CartsumContext);
  if (!context) {
    throw new Error("dek here jung rai");
  }
  return context;
};
