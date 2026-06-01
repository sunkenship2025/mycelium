import { VSCodeUtils } from "./vsCodeUtils";
import { NodeJSUtils } from "@myceliumhq/common-server";
import vscode from "vscode";
import { extensionQualifiedId } from "./constants";
import _ from "lodash";

/**
 * @deprecated - use vscode.ExtensionContext.extension.packageJSON.version instead.
 */
export class VersionProvider {
  static version() {
    let version: string | undefined;
    if (VSCodeUtils.isDevMode()) {
      version = NodeJSUtils.getVersionFromPkg();
    } else {
      try {
        const myceliumExtension =
          vscode.extensions.getExtension(extensionQualifiedId)!;
        version = myceliumExtension.packageJSON.version;
      } catch (err) {
        version = NodeJSUtils.getVersionFromPkg();
      }
    }
    if (_.isUndefined(version)) {
      version = "0.0.0";
    }
    return version;
  }
}
