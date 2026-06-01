import { assertUnreachable } from "@myceliumhq/common-all";
import { ShowcaseEntry } from "@myceliumhq/engine-server";
import * as vscode from "vscode";
import { showMeHowView } from "../views/ShowMeHowView";
import {
  DisplayLocation,
  IFeatureShowcaseMessage,
} from "./IFeatureShowcaseMessage";

export class SettingsUITip implements IFeatureShowcaseMessage {
  shouldShow(displayLocation: DisplayLocation): boolean {
    switch (displayLocation) {
      case DisplayLocation.InformationMessage:
      case DisplayLocation.TipOfTheDayView:
        return true;
      default:
        assertUnreachable(displayLocation);
    }
  }
  get showcaseEntry(): ShowcaseEntry {
    return ShowcaseEntry.SettingsUI;
  }

  getDisplayMessage(_displayLocation: DisplayLocation): string {
    return "You can configure Mycelium by using the `Mycelium: Configure(UI) command`. You can also optionally edit the config file directly it with the `Mycelium: Configure(yaml) command`";
  }

  onConfirm() {
    vscode.commands.executeCommand("mycelium.configureUI");
    showMeHowView({
      name: "Mycelium Configure (UI)",
      src: "https://org-mycelium-public-assets.s3.amazonaws.com/images/settingsUI.gif",
      href: "https://www.loom.com/share/3eba0f8523ac4d1ab150e8d3af9f1b0b",
      alt: "Run Ctrl+shift+P > Mycelium: Configure (UI)",
    });
  }

  get confirmText(): string {
    return "Show me how";
  }

  get deferText(): string {
    return "Later";
  }
}
