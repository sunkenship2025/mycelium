/* eslint-disable */
import {
  CONSTANTS,
  MyceliumConfig,
  MyceliumPublishingConfig,
  Time,
} from "@myceliumhq/common-all";
import { readYAML, writeYAML } from "@myceliumhq/common-server";
import fs from "fs-extra";
import _ from "lodash";
import path from "path";

export class DConfig {
  static configPath(configRoot: string): string {
    return path.join(configRoot, CONSTANTS.MYCELIUM_CONFIG_FILE);
  }

  /**
   * Get without filling in defaults ^getRaw
   * @param wsRoot
   */
  static getRaw(wsRoot: string) {
    const configPath = DConfig.configPath(wsRoot);
    const config = readYAML(configPath) as Partial<MyceliumConfig>;
    return config;
  }

  static getSiteIndex(sconfig: MyceliumPublishingConfig) {
    let { siteIndex, siteHierarchies } = sconfig;
    return siteIndex || siteHierarchies[0];
  }

  static writeConfig({
    wsRoot,
    config,
  }: {
    wsRoot: string;
    config: MyceliumConfig;
  }) {
    const configPath = DConfig.configPath(wsRoot);
    return writeYAML(configPath, config);
  }

  /**
   * Create a backup of mycelium.yml with an optional custom infix string. ^iRXV8AFm3hSJ
   * e.g.) createBackup(wsRoot, "foo") will result in a backup file name ^VwEHhuhP4bbK
   * `mycelium.yyyy.MM.dd.HHmmssS.foo.yml` ^backup-file
   *
   * @param wsRoot workspace root
   * @param infix custom string used in the backup name
   */
  static createBackup(wsRoot: string, infix: string): string {
    const configPath = DConfig.configPath(wsRoot);
    const today = Time.now().toFormat("yyyy.MM.dd.HHmmssS");
    const prefix = `mycelium.${today}.`;
    const suffix = `yml`;
    const maybeInfix = infix ? `${infix}.` : "";
    const backupName = `${prefix}${maybeInfix}${suffix}`;
    const backupPath = path.join(wsRoot, backupName);
    fs.copyFileSync(configPath, backupPath);
    return backupPath;
  }
}
