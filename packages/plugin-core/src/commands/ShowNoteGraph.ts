import {
  MyceliumEditorViewKey,
  getWebEditorViewEntry,
} from "@myceliumhq/common-all";
import * as vscode from "vscode";
import { MYCELIUM_COMMANDS } from "../constants";
import { ExtensionProvider } from "../ExtensionProvider";
import { AnalyticsUtils } from "../utils/analytics";
import { WebViewUtils } from "../views/utils";
import { BasicCommand } from "./base";

type CommandOpts = {};
type CommandOutput = void;

export class ShowNoteGraphCommand extends BasicCommand<
  CommandOpts,
  CommandOutput
> {
  static requireActiveWorkspace: boolean = true;

  key = MYCELIUM_COMMANDS.SHOW_NOTE_GRAPH.key;

  private _panel;

  constructor(panel: vscode.WebviewPanel) {
    super();
    this._panel = panel;
  }
  async gatherInputs(): Promise<any> {
    return {};
  }

  async execute() {
    const { bundleName: name } = getWebEditorViewEntry(
      MyceliumEditorViewKey.NOTE_GRAPH
    );
    const ext = ExtensionProvider.getExtension();
    const port = ext.port!;
    const engine = ext.getEngine();
    const { wsRoot } = engine;
    const webViewAssets = WebViewUtils.getJsAndCss();
    const html = await WebViewUtils.getWebviewContent({
      ...webViewAssets,
      name,
      port,
      wsRoot,
      panel: this._panel,
    });

    this._panel.webview.html = html;

    WebViewUtils.openWebviewAndMeasureTimeOpen(this._panel, (duration) => {
      AnalyticsUtils.track(this.key, {
        timeOpen: duration,
      });
    });
  }
}
