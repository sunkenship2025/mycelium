import { MyceliumTreeViewKey, VSCodeEvents } from "@myceliumhq/common-all";
import { MetadataService } from "@myceliumhq/engine-server";
import * as vscode from "vscode";
import {
  ProviderResult,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  Uri,
} from "vscode";
import {
  InstrumentedWrapperCommand,
  InstrumentedWrapperCommandArgs,
} from "../commands/InstrumentedWrapperCommand";

type MyceliumWorkspaceMenuItem = {
  fsPath: string;
};

/**
 * Data provider for the Recent Workspaces Tree View
 */
class RecentWorkspacesTreeDataProvider
  implements TreeDataProvider<MyceliumWorkspaceMenuItem>
{
  getTreeItem(element: MyceliumWorkspaceMenuItem): TreeItem {
    const commandArgs: InstrumentedWrapperCommandArgs = {
      command: {
        title: "Open Workspace",
        command: "vscode.openFolder",
        arguments: [Uri.file(element.fsPath)],
      },
      event: VSCodeEvents.RecentWorkspacesPanelUsed,
    };

    return {
      label: element.fsPath,
      collapsibleState: TreeItemCollapsibleState.None,
      tooltip: "Click to open the workspace",
      command: InstrumentedWrapperCommand.createVSCodeCommand(commandArgs),
    };
  }

  getChildren(
    element?: MyceliumWorkspaceMenuItem
  ): ProviderResult<MyceliumWorkspaceMenuItem[]> {
    switch (element) {
      case undefined:
        return MetadataService.instance().RecentWorkspaces?.map(
          (workspacePath) => {
            return {
              fsPath: workspacePath,
            };
          }
        );
      default:
        return [];
    }
  }
}

/**
 * Creates a tree view for the 'Recent Workspaces' panel in the Mycelium Custom
 * View Container
 * @returns
 */
export default function setupRecentWorkspacesTreeView(): vscode.TreeView<MyceliumWorkspaceMenuItem> {
  const treeView = vscode.window.createTreeView(
    MyceliumTreeViewKey.RECENT_WORKSPACES,
    {
      treeDataProvider: new RecentWorkspacesTreeDataProvider(),
    }
  );
  return treeView;
}
