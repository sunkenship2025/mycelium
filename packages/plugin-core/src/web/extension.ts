import "reflect-metadata"; // This needs to be the topmost import for tsyringe to work

import { TreeViewItemLabelTypeEnum, VSCodeEvents } from "@myceliumhq/common-all";
import { container } from "tsyringe";
import * as vscode from "vscode";
import { NoteLookupAutoCompleteCommand } from "../commands/common/NoteLookupAutoCompleteCommand";
import { MYCELIUM_COMMANDS } from "../constants";
import { ITelemetryClient } from "../telemetry/common/ITelemetryClient";
import { NativeTreeView } from "../views/common/treeview/NativeTreeView";
import { CopyNoteURLCmd } from "./commands/CopyNoteURLCmd";
import { NoteLookupCmd } from "./commands/NoteLookupCmd";
import { TogglePreviewCmd } from "./commands/TogglePreviewCmd";
import { setupWebExtContainer } from "./injection-providers/setupWebExtContainer";

/**
 * This is the entry point for the web extension variant of Mycelium
 * @param context
 */
export async function activate(context: vscode.ExtensionContext) {
  try {
    // Use the web extension injection container:
    await setupWebExtContainer(context);

    setupCommands(context);

    setupViews(context);

    reportActivationTelemetry();
  } catch (error) {
    // TODO: properly detect if we're in a Mycelium workspace or not (instead of
    // relying on getWSRoot throwing).
    vscode.window.showErrorMessage(
      `Something went wrong during initialization.`
    );
  }

  vscode.commands.executeCommand("setContext", "mycelium:pluginActive", true);
  vscode.window.showInformationMessage("Mycelium is active");
}

export function deactivate() {}

async function setupCommands(context: vscode.ExtensionContext) {
  const existingCommands = await vscode.commands.getCommands();

  const noteLookupCmd = container.resolve(NoteLookupCmd);
  const key = MYCELIUM_COMMANDS.LOOKUP_NOTE.key;

  if (!existingCommands.includes(key))
    context.subscriptions.push(
      vscode.commands.registerCommand(key, async (_args: any) => {
        await noteLookupCmd.run();
      })
    );

  const noteLookupAutoCompleteCommand = container.resolve(
    NoteLookupAutoCompleteCommand
  );

  const noteLookupAutoCompleteCommandKey =
    MYCELIUM_COMMANDS.LOOKUP_NOTE_AUTO_COMPLETE.key;
  if (!existingCommands.includes(noteLookupAutoCompleteCommandKey))
    context.subscriptions.push(
      vscode.commands.registerCommand(noteLookupAutoCompleteCommandKey, () => {
        noteLookupAutoCompleteCommand.run();
      })
    );

  const togglePreviewCmd = container.resolve(TogglePreviewCmd);
  const togglePreviewCmdKey = MYCELIUM_COMMANDS.TOGGLE_PREVIEW.key;

  if (!existingCommands.includes(togglePreviewCmdKey))
    context.subscriptions.push(
      vscode.commands.registerCommand(
        togglePreviewCmdKey,
        async (_args: any) => {
          await togglePreviewCmd.run();
        }
      )
    );

  if (!existingCommands.includes(CopyNoteURLCmd.key)) {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        CopyNoteURLCmd.key,
        async (_args: any) => {
          await container.resolve(CopyNoteURLCmd).run();
        }
      )
    );
  }
  if (!existingCommands.includes(MYCELIUM_COMMANDS.TREEVIEW_CREATE_NOTE.key)) {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        MYCELIUM_COMMANDS.TREEVIEW_CREATE_NOTE.key,
        async (_args: any) => {
          await container.resolve(NoteLookupCmd).run();
        }
      )
    );
  }
  /**
   * go to note is not yet supported in mycelium-web.
   * for now, we open lookup bar when user clicks on the view action(+) for stubs
   */
  if (!existingCommands.includes(MYCELIUM_COMMANDS.TREEVIEW_GOTO_NOTE.key)) {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        MYCELIUM_COMMANDS.TREEVIEW_GOTO_NOTE.key,
        async (_args: any) => {
          await container.resolve(NoteLookupCmd).run();
        }
      )
    );
  }
}

async function setupViews(context: vscode.ExtensionContext) {
  await setupTreeView(context);
}

async function setupTreeView(context: vscode.ExtensionContext) {
  const treeView = container.resolve(NativeTreeView);

  treeView.show();

  context.subscriptions.push(treeView);

  vscode.commands.registerCommand(
    MYCELIUM_COMMANDS.TREEVIEW_LABEL_BY_TITLE.key,
    () => {
      treeView.updateLabelType({
        labelType: TreeViewItemLabelTypeEnum.title,
      });
    }
  );

  vscode.commands.registerCommand(
    MYCELIUM_COMMANDS.TREEVIEW_LABEL_BY_FILENAME.key,
    () => {
      treeView.updateLabelType({
        labelType: TreeViewItemLabelTypeEnum.filename,
      });
    }
  );
  vscode.commands.registerCommand(
    MYCELIUM_COMMANDS.TREEVIEW_EXPAND_STUB.key,
    async (id: string) => {
      await treeView.expandTreeItem(id);
    }
  );
}

async function reportActivationTelemetry() {
  const telemetryClient =
    container.resolve<ITelemetryClient>("ITelemetryClient");

  await telemetryClient.identify();
  // TODO: Add workspace properties later.
  await telemetryClient.track(VSCodeEvents.InitializeWorkspace);
}
