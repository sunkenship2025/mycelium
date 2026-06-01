import { VSCodeEvents } from "@myceliumhq/common-all";
import { SegmentClient, TelemetryStatus } from "@myceliumhq/common-server";
import { window } from "vscode";
import { MYCELIUM_COMMANDS } from "../constants";
import { AnalyticsUtils } from "../utils/analytics";
import { BasicCommand } from "./base";

type CommandOpts = {};

type CommandInput = {};

type CommandOutput = void;

export class DisableTelemetryCommand extends BasicCommand<
  CommandOpts,
  CommandOutput
> {
  key = MYCELIUM_COMMANDS.DISABLE_TELEMETRY.key;
  async gatherInputs(): Promise<CommandInput | undefined> {
    return {};
  }
  async execute() {
    const reason = TelemetryStatus.DISABLED_BY_COMMAND;
    AnalyticsUtils.track(VSCodeEvents.DisableTelemetry, { reason });
    SegmentClient.disable(reason);
    window.showInformationMessage("telemetry disabled");
  }
}
