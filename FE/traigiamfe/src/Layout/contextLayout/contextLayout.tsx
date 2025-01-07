import { UserModel } from "@/common/Model/user";
import React, { createContext, ReactNode } from "react";

export interface UserContextProps {
  dataDetail?: UserModel;
}

const LayoutContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  value: UserContextProps;
}

const LayoutContextProvider: React.FC<UserProviderProps> = ({
  children,
  value,
}) => {
  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export { LayoutContext, LayoutContextProvider };
