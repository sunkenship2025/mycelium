import { ShowcaseEntry } from "@myceliumhq/engine-server";
import * as vscode from "vscode";
import {
  DisplayLocation,
  IFeatureShowcaseMessage,
} from "./IFeatureShowcaseMessage";
import { MyceliumTreeViewKey } from "@myceliumhq/common-all";

export class GraphPanelTip implements IFeatureShowcaseMessage {
  shouldShow(_displayLocation: DisplayLocation): boolean {
    return true;
  }
  get showcaseEntry(): ShowcaseEntry {
    return ShowcaseEntry.GraphPanel;
  }

  getDisplayMessage(_displayLocation: DisplayLocation): string {
    return "We're experimenting with a note graph panel in the new Mycelium sidebar. Check it out!";
  }

  onConfirm() {
    vscode.commands.executeCommand(`${MyceliumTreeViewKey.GRAPH_PANEL}.focus`);
  }

  get confirmText(): string {
    return "Show Graph Panel";
  }

  get deferText(): string {
    return "Later";
  }
}
