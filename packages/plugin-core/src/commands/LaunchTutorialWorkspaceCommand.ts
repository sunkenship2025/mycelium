import { TutorialEvents, WorkspaceType } from "@myceliumhq/common-all";
import { FileUtils, resolveTilde } from "@myceliumhq/common-server";
import path from "path";
import {
  MYCELIUM_COMMANDS,
  LaunchTutorialCommandInvocationPoint,
} from "../constants";
import { AnalyticsUtils } from "../utils/analytics";
import { TutorialInitializer } from "../workspace/tutorialInitializer";
import { BasicCommand } from "./base";
import { SetupWorkspaceCommand } from "./SetupWorkspace";

type CommandInput = {
  invocationPoint: LaunchTutorialCommandInvocationPoint;
};

type CommandOpts = CommandInput;

/**
 * Helper command to launch the user into a new tutorial workspace.
 */
export class LaunchTutorialWorkspaceCommand extends BasicCommand<
  CommandOpts,
  void
> {
  key = MYCELIUM_COMMANDS.LAUNCH_TUTORIAL_WORKSPACE.key;

  async execute(opts: CommandOpts) {
    // Try to put into a default '~/Mycelium' folder first. If path is occupied,
    // create a new folder with an numbered suffix
    const { filePath } = FileUtils.genFilePathWithSuffixThatDoesNotExist({
      fpath: path.join(resolveTilde("~"), "Mycelium"),
    });

    // Since this command will cause a window reload, track this telemetry point
    // via trackForNextRun
    await AnalyticsUtils.trackForNextRun(
      TutorialEvents.TutorialWorkspaceLaunching,
      {
        invocationPoint: opts.invocationPoint,
      }
    );

    await new SetupWorkspaceCommand().execute({
      rootDirRaw: filePath,
      workspaceInitializer: new TutorialInitializer(),
      workspaceType: WorkspaceType.CODE,
      EXPERIMENTAL_openNativeWorkspaceNoReload: false,
    });
  }
}
