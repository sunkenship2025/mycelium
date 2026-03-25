import { MyceliumWorkspace } from "./MyceliumWorkspace";

export type MyceliumWorkspaceEntry = Omit<MyceliumWorkspace, "name" | "vaults">;
