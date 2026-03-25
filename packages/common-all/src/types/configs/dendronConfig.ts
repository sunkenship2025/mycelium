import {
  MyceliumCommandConfig,
  genDefaultCommandConfig,
} from "./commands/commands";
import {
  MyceliumWorkspaceConfig,
  genDefaultWorkspaceConfig,
} from "./workspace/MyceliumWorkspaceConfig";
import {
  MyceliumPreviewConfig,
  genDefaultPreviewConfig,
} from "./preview/preview";
import {
  MyceliumPublishingConfig,
  genDefaultPublishingConfig,
} from "./publishing/publishing";
import { MyceliumGlobalConfig } from "./global/global";
import { MyceliumDevConfig, genDefaultDevConfig } from "./dev/MyceliumDevConfig";

/**
 * MyceliumConfig
 * This is the top level config that will hold everything.
 */
export type MyceliumConfig = {
  version: number;
  global?: MyceliumGlobalConfig;
  commands: MyceliumCommandConfig;
  workspace: MyceliumWorkspaceConfig;
  preview: MyceliumPreviewConfig;
  publishing: MyceliumPublishingConfig;
  dev?: MyceliumDevConfig;
};

export type TopLevelMyceliumConfig = keyof MyceliumConfig;

/**
 * Generates a default MyceliumConfig using
 * respective default config generators of each sub config groups.
 * @returns MyceliumConfig
 */
export function genDefaultMyceliumConfig(): MyceliumConfig {
  return {
    version: 5,
    commands: genDefaultCommandConfig(),
    workspace: genDefaultWorkspaceConfig(),
    preview: genDefaultPreviewConfig(),
    publishing: genDefaultPublishingConfig(),
    dev: genDefaultDevConfig(),
  };
}
