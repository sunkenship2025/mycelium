import { DVault, VaultUtils } from "@myceliumhq/common-all";
import { WorkspaceService } from "@myceliumhq/engine-server";
import _ from "lodash";
import { commands, window } from "vscode";
import { MYCELIUM_COMMANDS } from "../constants";
import { IMyceliumExtension } from "../myceliumExtensionInterface";
import { Logger } from "../logger";
import { VSCodeUtils } from "../vsCodeUtils";
import { BasicCommand } from "./base";

type CommandOpts = {
  vault: DVault;
  /**
   * added for contextual-ui check
   */
  fsPath?: string;
};

type CommandOutput = { vault: DVault };

export { CommandOpts as RemoveVaultCommandOpts };

export class RemoveVaultCommand extends BasicCommand<
  CommandOpts,
  CommandOutput
> {
  key = MYCELIUM_COMMANDS.REMOVE_VAULT.key;
  constructor(private _ext: IMyceliumExtension) {
    super();
  }
  async gatherInputs(opts?: CommandOpts): Promise<any> {
    const { vaults } = this._ext.getDWorkspace();
    const { wsRoot } = this._ext.getDWorkspace();
    /**
     * check added for contextual-ui. If the args are passed to the gather inputs,
     * there is no need to show quickpick to select a vault
     */
    if (opts && opts.fsPath) {
      const vault = VaultUtils.getVaultByDirPath({
        fsPath: opts.fsPath,
        vaults,
        wsRoot,
      });
      return { vault };
    } else {
      const vaultQuickPick = await VSCodeUtils.showQuickPick(
        vaults.map((ent) => ({
          label: VaultUtils.getName(ent),
          detail: ent.fsPath,
          data: ent,
        }))
      );
      if (_.isUndefined(vaultQuickPick)) {
        return;
      }
      return { vault: vaultQuickPick?.data };
    }
  }

  async execute(opts: CommandOpts) {
    const ctx = "RemoveVaultCommand";
    // NOTE: relative vault
    const { vault } = opts;
    const { wsRoot } = this._ext.getDWorkspace();
    const wsService = new WorkspaceService({ wsRoot });
    Logger.info({ ctx, msg: "preRemoveVault", vault });
    await wsService.removeVault({ vault, updateWorkspace: true });
    await commands.executeCommand("workbench.action.reloadWindow");
    window.showInformationMessage(
      "finished removing vault (from mycelium). you will still need to delete the notes from your disk"
    );
    return { vault };
  }
}
