import { DVault } from "./DVault";
import { RemoteEndpoint } from "./RemoteEndpoint";

export type MyceliumWorkspace = {
  name: string;
  vaults: DVault[];
  remote: RemoteEndpoint;
};
