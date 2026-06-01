import { VSCodeEvents } from "@myceliumhq/common-all";
import { SegmentClient, TelemetryStatus } from "@myceliumhq/common-server";
import { window } from "vscode";
import { MYCELIUM_COMMANDS } from "../constants";
import { AnalyticsUtils } from "../utils/analytics";
import { BasicCommand } from "./base";

type CommandOpts = {};

type CommandInput = {};

type CommandOutput = void;

export class EnableTelemetryCommand extends BasicCommand<
  CommandOpts,
  CommandOutput
> {
  key = MYCELIUM_COMMANDS.ENABLE_TELEMETRY.key;
  async gatherInputs(): Promise<CommandInput | undefined> {
    return {};
  }
  async execute() {
    const reason = TelemetryStatus.ENABLED_BY_COMMAND;
    SegmentClient.enable(reason);
    AnalyticsUtils.track(VSCodeEvents.EnableTelemetry, { reason });
    window.showInformationMessage("telemetry enabled");
  }
}
