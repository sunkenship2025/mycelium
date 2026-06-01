import { TutorialEvents } from "@myceliumhq/common-all";
import { readMD } from "@myceliumhq/common-server";
import _ from "lodash";
import semver from "semver";
import * as vscode from "vscode";
import { LaunchTutorialWorkspaceCommand } from "./commands/LaunchTutorialWorkspaceCommand";
import { LaunchTutorialCommandInvocationPoint } from "./constants";
import { AnalyticsUtils } from "./utils/analytics";
import { VSCodeUtils } from "./vsCodeUtils";

async function initWorkspace() {
  // ^z5hpzc3fdkxs
  await AnalyticsUtils.trackForNextRun(TutorialEvents.ClickStart);

  await new LaunchTutorialWorkspaceCommand().run({
    invocationPoint: LaunchTutorialCommandInvocationPoint.WelcomeWebview,
  });
  return;
}

/**
 * video formats are supported above vscode version 1.71. For users below this version,
 * we render gif in welcome page
 */
export enum WelcomePageMedia {
  "gif" = "gif",
  "video" = "video",
}

export function showWelcome(assetUri: vscode.Uri) {
  try {
    let content: string;
    let testgroup: string;
    if (semver.gte(vscode.version, "1.71.0")) {
      const videoUri = VSCodeUtils.joinPath(
        assetUri,
        "mycelium-ws",
        "vault",
        "welcome_video.html"
      );
      content = readMD(videoUri.fsPath).content;
      testgroup = WelcomePageMedia.video;
    } else {
      // NOTE: this needs to be from extension because no workspace might exist at this point
      const uri = VSCodeUtils.joinPath(
        assetUri,
        "mycelium-ws",
        "vault",
        "welcome.html"
      );
      content = readMD(uri.fsPath).content;
      testgroup = WelcomePageMedia.gif;
    }

    const title = "Welcome to Mycelium";

    const panel = vscode.window.createWebviewPanel(
      _.kebabCase(title),
      title,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    panel.webview.html = content;

    panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case "loaded":
            AnalyticsUtils.track(TutorialEvents.WelcomeShow, { testgroup });
            return;

          case "initializeWorkspace": {
            // ^z5hpzc3fdkxs
            await initWorkspace();
            return;
          }
          default:
            break;
        }
      },
      undefined,
      undefined
    );
    return;
  } catch (err) {
    vscode.window.showErrorMessage(JSON.stringify(err));
    return;
  }
}
