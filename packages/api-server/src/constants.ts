import { MyceliumError } from "@myceliumhq/common-all";

export const LOG_FILE_NAME = "mycelium.server.log";
export const LOGGER_NAME = "api-server";

export function getLogPath(): string {
  if (!process.env["LOG_DST"]) {
    throw new MyceliumError({ message: "log not set" });
  }
  return process.env["LOG_DST"];
}
