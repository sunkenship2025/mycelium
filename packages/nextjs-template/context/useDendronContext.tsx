import { useContext } from "react";
import { myceliumContext } from "./MyceliumProvider";

export function useMyceliumContext() {
  const context = useContext(myceliumContext);

  return context;
}
