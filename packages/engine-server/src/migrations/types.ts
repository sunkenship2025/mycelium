import {
  MyceliumConfig,
  MyceliumError,
  WorkspaceSettings,
} from "@myceliumhq/common-all";
import { WorkspaceService } from "../workspace";

export type MigrateFunction = (opts: {
  myceliumConfig: MyceliumConfig;
  wsConfig?: WorkspaceSettings;
  wsService: WorkspaceService;
}) => Promise<{
  error?: MyceliumError;
  data: {
    myceliumConfig: MyceliumConfig;
    wsConfig?: WorkspaceSettings;
  };
}>;

export type MigrationChangeSet = {
  name: string;
  func: MigrateFunction;
};

export type Migrations = {
  version: string;
  changes: MigrationChangeSet[];
};

export type MigrationChangeSetStatus = {
  error?: MyceliumError;
  data: {
    version: string;
    changeName: string;
    status: "ok" | "error";
    myceliumConfig: MyceliumConfig;
    wsConfig?: WorkspaceSettings;
  };
};
