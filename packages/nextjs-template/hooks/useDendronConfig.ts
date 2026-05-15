import { useEngineAppSelector } from "../features/engine/hooks";

export const useMyceliumConfig = () => {
  const { config } = useEngineAppSelector((state) => state.engine);
  return config;
};
