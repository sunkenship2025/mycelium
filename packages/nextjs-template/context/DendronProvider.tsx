import React from "react";

export interface MyceliumState {
  isResponsive: boolean;
  isSidebarCollapsed: boolean;
}

const defaultMyceliumState: MyceliumState = {
  isResponsive: false,
  isSidebarCollapsed: false,
};

export interface MyceliumContext extends MyceliumState {
  setResponsive: (isResponsive: boolean) => void;
  setIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
}

export const myceliumContext = React.createContext<MyceliumContext>(null as any); // null because it gets set in the jsx

export const MyceliumProvider: React.FC = (props: any) => {
  const [state, setState] = React.useState<MyceliumState>({
    ...defaultMyceliumState,
  });

  function setResponsive(isResponsive: boolean) {
    setState((state) => {
      return { ...state, isResponsive };
    });
  }

  function setIsSidebarCollapsed(isSidebarCollapsed: boolean) {
    setState((state) => {
      return { ...state, isSidebarCollapsed };
    });
  }

  return (
    <myceliumContext.Provider
      value={{ setResponsive, setIsSidebarCollapsed, ...state }}
    >
      {props.children}
    </myceliumContext.Provider>
  );
};

export default MyceliumProvider;
