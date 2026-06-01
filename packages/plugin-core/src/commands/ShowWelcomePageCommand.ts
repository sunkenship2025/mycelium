import { MYCELIUM_COMMANDS } from "../constants";
import { VSCodeUtils } from "../vsCodeUtils";
import { showWelcome } from "../WelcomeUtils";
import { MyceliumExtension } from "../workspace";
import { BasicCommand } from "./base";

type CommandOpts = {};

type CommandInput = {};

type CommandOutput = void;

/**
 * This command is a bit of a misnomer - it actually launches the welcome
 * webview page
 */
export class ShowWelcomePageCommand extends BasicCommand<
  CommandOpts,
  CommandOutput
> {
  key = MYCELIUM_COMMANDS.SHOW_WELCOME_PAGE.key;

  async gatherInputs(): Promise<CommandInput | undefined> {
    return {};
  }

  async execute(_opts: CommandOpts): Promise<CommandOutput> {
    const assetUri = VSCodeUtils.getAssetUri(MyceliumExtension.context());
    await showWelcome(assetUri);
  }
}
