import { DVault } from "@myceliumhq/common-all";
import { tmpDir } from "@myceliumhq/common-server";
import { WorkspaceService } from "@myceliumhq/engine-server";

export class TestWorkspaceUtils {
  static async create({
    wsRoot = tmpDir().name,
    vaults,
  }: {
    vaults: DVault[];
    wsRoot?: string;
  }) {
    return WorkspaceService.createWorkspace({
      wsRoot,
      additionalVaults: vaults,
    });
  }
}
