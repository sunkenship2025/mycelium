import { DConfig } from "@myceliumhq/common-server";
import { Uri } from "vscode";
import { MYCELIUM_COMMANDS } from "../constants";
import { IMyceliumExtension } from "../myceliumExtensionInterface";
import { VSCodeUtils } from "../vsCodeUtils";
import { BasicCommand } from "./base";

type CommandOpts = {};

type CommandOutput = void;

export class ConfigureCommand extends BasicCommand<CommandOpts, CommandOutput> {
  key = MYCELIUM_COMMANDS.CONFIGURE_RAW.key;
  public static requireActiveWorkspace: boolean = true;
  private _ext: IMyceliumExtension;

  constructor(extension: IMyceliumExtension) {
    super();
    this._ext = extension;
  }

  async gatherInputs(): Promise<any> {
    return {};
  }
  async execute() {
    const myceliumRoot = this._ext.getDWorkspace().wsRoot;
    const configPath = DConfig.configPath(myceliumRoot);
    const uri = Uri.file(configPath);
    await VSCodeUtils.openFileInEditor(uri);
    return;
  }
}
