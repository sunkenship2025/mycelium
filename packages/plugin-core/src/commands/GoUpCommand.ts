import { DNodeUtils, NoteUtils } from "@myceliumhq/common-all";
import _ from "lodash";
import path from "path";
import { Uri, window } from "vscode";
import { PickerUtilsV2 } from "../components/lookup/utils";
import { MYCELIUM_COMMANDS } from "../constants";
import { IMyceliumExtension } from "../myceliumExtensionInterface";
import { VSCodeUtils } from "../vsCodeUtils";
import { BasicCommand } from "./base";

type CommandOpts = {};

type CommandOutput = void;

export class GoUpCommand extends BasicCommand<CommandOpts, CommandOutput> {
  constructor(private _ext: IMyceliumExtension) {
    super();
  }

  key = MYCELIUM_COMMANDS.GO_UP_HIERARCHY.key;
  async gatherInputs(): Promise<any> {
    return {};
  }
  async execute() {
    const maybeTextEditor = VSCodeUtils.getActiveTextEditor();
    if (_.isUndefined(maybeTextEditor)) {
      window.showErrorMessage("no active document found");
      return;
    }
    const engine = this._ext.getEngine();
    const nparent = await DNodeUtils.findClosestParentWithEngine(
      path.basename(maybeTextEditor.document.uri.fsPath, ".md"),
      engine,
      {
        excludeStub: true,
        vault: PickerUtilsV2.getVaultForOpenEditor(),
      }
    );
    const nppath = NoteUtils.getFullPath({
      note: nparent,
      wsRoot: this._ext.getDWorkspace().wsRoot,
    });
    await VSCodeUtils.openFileInEditor(Uri.file(nppath));
    return;
  }
}
