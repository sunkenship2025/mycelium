import { createLogger } from "@myceliumhq/common-server";
import { CodeConfigChanges } from "@myceliumhq/engine-server";
import _ from "lodash";
import { Extension, extensions, window } from "vscode";
import { MYCELIUM_COMMANDS } from "../constants";
import { WorkspaceConfig } from "../settings";
import { MyceliumExtension } from "../workspace";
import { BasicCommand } from "./base";

const L = createLogger("UpgradeSettingsCommand");

type UpgradeSettingsCommandOpts = {};
export type UpgradeSettingsCommandResp = {
  configUpdate: CodeConfigChanges;
};

export class UpgradeSettingsCommand extends BasicCommand<
  UpgradeSettingsCommandOpts,
  UpgradeSettingsCommandResp
> {
  key = MYCELIUM_COMMANDS.UPGRADE_SETTINGS.key;
  async execute(_opts: UpgradeSettingsCommandOpts) {
    const ctx = "Upgrade:execute";
    L.info({ ctx });

    const wsRoot = (await MyceliumExtension.workspaceRoots())[0];

    const newConfig = await WorkspaceConfig.update(wsRoot!);
    this.L.info({ ctx, newConfig });
    // vscode doesn't let us uninstall extensions
    // tell user to uninstall extensions we no longer want
    const badExtensions: Extension<any>[] =
      (newConfig.extensions.unwantedRecommendations
        ?.map((ext) => {
          return extensions.getExtension(ext);
        })
        .filter(Boolean) as Extension<any>[]) || [];
    this.L.info({ ctx, badExtensions });
    if (!_.isEmpty(badExtensions)) {
      const msg = [
        "Manual action needed!",
        "The following extensions need to be uninstalled: ",
      ]
        .concat([
          badExtensions.map((ext) => ext.packageJSON.displayName).join(", "),
        ])
        .concat([
          "- Reload the window afterwards and Mycelium will offer to install the Mycelium version of the extension",
        ]);
      window.showWarningMessage(msg.join(" "));
    }
    return { configUpdate: newConfig };
  }
}
