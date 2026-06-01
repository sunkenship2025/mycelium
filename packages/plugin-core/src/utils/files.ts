import open from "open";
import { MyceliumError, ERROR_STATUS } from "@myceliumhq/common-all";
import { Logger } from "../logger";
import _ from "lodash";

export class PluginFileUtils {
  /** Opens the given file with the default app.
   *
   * Logs if opening the file with the default app failed.
   */
  static async openWithDefaultApp(filePath: string) {
    await open(filePath).catch((err) => {
      const error = MyceliumError.createFromStatus({
        status: ERROR_STATUS.UNKNOWN,
        innerError: err,
      });
      Logger.warn({ ctx: "PluginFileUtils.openWithDefaultApp", error });
    });
  }
}
