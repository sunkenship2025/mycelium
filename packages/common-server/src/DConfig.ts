import {
  CleanMyceliumPublishingConfig,
  ConfigUtils,
  CONSTANTS,
  DeepPartial,
  MyceliumError,
  MyceliumPublishingConfig,
  ErrorFactory,
  ErrorUtils,
  ERROR_STATUS,
  getStage,
  GithubEditViewModeEnum,
  IMyceliumError,
  RespV3,
  RespWithOptError,
  MyceliumConfig,
  YamlUtils,
} from "@myceliumhq/common-all";
import fs from "fs-extra";
import _ from "lodash";
import os from "os";
import path from "path";
import { BackupKeyEnum, BackupService } from "./backup";
import { DConfigLegacy } from "./oneoff/ConfigCompat";
import { readYAML, writeYAML, writeYAMLAsync, readString } from "./files";

export enum LocalConfigScope {
  WORKSPACE = "WORKSPACE",
  GLOBAL = "GLOBAL",
}

let _myceliumConfig: MyceliumConfig | undefined;

export class DConfig {
  static createSync({
    wsRoot,
    defaults,
  }: {
    wsRoot: string;
    defaults?: DeepPartial<MyceliumConfig>;
  }) {
    const configPath = DConfig.configPath(wsRoot);
    const config: MyceliumConfig = ConfigUtils.genLatestConfig(defaults);
    writeYAML(configPath, config);
    return config;
  }

  static configPath(configRoot: string): string {
    return path.join(configRoot, CONSTANTS.MYCELIUM_CONFIG_FILE);
  }

  static configOverridePath(wsRoot: string, scope: LocalConfigScope): string {
    const configPath =
      scope === LocalConfigScope.GLOBAL ? os.homedir() : wsRoot;
    return path.join(configPath, CONSTANTS.MYCELIUM_LOCAL_CONFIG_FILE);
  }

  /**
   * Get without filling in defaults
   * @param wsRoot
   */
  static getRaw(wsRoot: string, overwriteDuplcate?: boolean) {
    const configPath = DConfig.configPath(wsRoot);
    const config = readYAML(
      configPath,
      overwriteDuplcate ?? false
    ) as Partial<MyceliumConfig>;
    return config;
  }

  static getOrCreate(
    myceliumRoot: string,
    defaults?: DeepPartial<MyceliumConfig>
  ): MyceliumConfig {
    const configPath = DConfig.configPath(myceliumRoot);
    // Need merge here to recursively merge nested configs
    let config: MyceliumConfig = _.merge(
      ConfigUtils.genDefaultConfig(),
      defaults
    );
    if (!fs.existsSync(configPath)) {
      writeYAML(configPath, config);
    } else {
      config = {
        ...config,
        ...readYAML(configPath),
      } as MyceliumConfig;
    }
    return config;
  }

  static getSiteIndex(sconfig: MyceliumPublishingConfig): string {
    const { siteIndex, siteHierarchies } = sconfig;
    return siteIndex || siteHierarchies[0];
  }

  /**
   * fill in defaults
   */

  static cleanPublishingConfig(
    config: MyceliumPublishingConfig
  ): CleanMyceliumPublishingConfig {
    const out = _.defaultsDeep(config, {
      copyAssets: true,
      enablePrettyRefs: true,
      siteFaviconPath: "favicon.ico",
      github: {
        enableEditLink: true,
        editLinkText: "Edit this page on Github",
        editBranch: "main",
        editViewMode: GithubEditViewModeEnum.edit,
      },
      writeStubs: true,
      seo: {
        description: "Personal Knowledge Space",
      },
    });
    const { siteRootDir, siteHierarchies } = out;
    let { siteIndex, siteUrl } = out;
    if (process.env["SITE_URL"]) {
      siteUrl = process.env["SITE_URL"];
    }
    if (!siteRootDir) {
      throw new MyceliumError({ message: "siteRootDir is undefined" });
    }
    if (!siteUrl && getStage() === "dev") {
      // this gets overridden in dev so doesn't matter
      siteUrl = "https://foo";
    }
    if (!siteUrl) {
      throw MyceliumError.createFromStatus({
        status: ERROR_STATUS.INVALID_CONFIG,
        message:
          "siteUrl is undefined. See https://mycelium.so/notes/f2ed8639-a604-4a9d-b76c-41e205fb8713.html#siteurl for more details",
      });
    }
    if (_.size(siteHierarchies) < 1) {
      throw MyceliumError.createFromStatus({
        status: ERROR_STATUS.INVALID_CONFIG,
        message: `siteHiearchies must have at least one hierarchy`,
      });
    }
    siteIndex = this.getSiteIndex(config);
    return {
      ...out,
      siteIndex,
      siteUrl,
    };
  }

  static setCleanPublishingConfig(opts: {
    config: MyceliumConfig;
    cleanConfig: MyceliumPublishingConfig;
  }) {
    const { config, cleanConfig } = opts;
    ConfigUtils.setProp(config, "publishing", cleanConfig);
  }

  /**
   * See if a local config file is present
   */
  static searchLocalConfigSync(wsRoot: string): RespV3<MyceliumConfig> {
    const wsPath = path.join(wsRoot, CONSTANTS.MYCELIUM_LOCAL_CONFIG_FILE);
    const globalPath = path.join(
      os.homedir(),
      CONSTANTS.MYCELIUM_LOCAL_CONFIG_FILE
    );
    let foundPath: string | undefined;

    if (fs.existsSync(globalPath)) {
      foundPath = globalPath;
    }
    if (fs.existsSync(wsPath)) {
      foundPath = wsPath;
    }
    if (foundPath) {
      // TODO: do validation in the future
      const data = readYAML(foundPath) as MyceliumConfig;
      return { data };
    }
    return {
      error: ErrorFactory.create404Error({
        url: CONSTANTS.MYCELIUM_LOCAL_CONFIG_FILE,
      }),
    };
  }

  /**
   * Read configuration
   * @param wsRoot
   * @param useCache: If true, read from cache instead of file system
   * @returns
   */
  static readConfigSync(wsRoot: string, useCache?: boolean) {
    if (_myceliumConfig && useCache) {
      return _myceliumConfig;
    }
    const configPath = DConfig.configPath(wsRoot);
    const myceliumConfigResult = readString(configPath)
      .andThen((input) => YamlUtils.fromStr(input, true))
      .andThen((unknownconfig) => {
        const cleanConfig = DConfigLegacy.configIsV4(unknownconfig)
          ? DConfigLegacy.v4ToV5(unknownconfig)
          : _.defaultsDeep(unknownconfig, ConfigUtils.genDefaultConfig());

        return ConfigUtils.parse(cleanConfig);
      })
      .map((myceliumConfig) => {
        _myceliumConfig = myceliumConfig;
        return myceliumConfig;
      });

    if (myceliumConfigResult.isErr()) {
      throw myceliumConfigResult.error;
    }
    return myceliumConfigResult.value;
  }

  /**
   * Read config and merge with local config
   * @param wsRoot
   * @param useCache: If true, read from cache instead of file system
   * @returns
   */
  static readConfigAndApplyLocalOverrideSync(
    wsRoot: string,
    useCache?: boolean
  ): RespWithOptError<MyceliumConfig> {
    const config = this.readConfigSync(wsRoot, useCache);
    const maybeLocalConfig = this.searchLocalConfigSync(wsRoot);

    let localConfigValidOrError: boolean | IMyceliumError = true;

    if (maybeLocalConfig.data) {
      const respValidate = this.validateLocalConfig({
        config: maybeLocalConfig.data,
      });
      if (respValidate.error) {
        localConfigValidOrError = respValidate.error;
      }

      if (!respValidate.error) {
        _.mergeWith(
          config,
          maybeLocalConfig.data,
          (objValue: any, srcValue: any) => {
            // TODO: optimize, check for keys of known arrays instead
            if (_.isArray(objValue)) {
              return srcValue.concat(objValue);
            }
            return;
          }
        );
      }
    }
    return {
      data: config,
      error: ErrorUtils.isMyceliumError(localConfigValidOrError)
        ? localConfigValidOrError
        : undefined,
    };
  }

  static writeConfig({
    wsRoot,
    config,
  }: {
    wsRoot: string;
    config: MyceliumConfig;
  }): Promise<void> {
    _myceliumConfig = config;
    const configPath = DConfig.configPath(wsRoot);
    return writeYAMLAsync(configPath, config);
  }

  static writeLocalConfig({
    wsRoot,
    config,
    configScope,
  }: {
    wsRoot: string;
    config: DeepPartial<MyceliumConfig>;
    configScope: LocalConfigScope;
  }): Promise<void> {
    const configPath = DConfig.configOverridePath(wsRoot, configScope);
    return writeYAMLAsync(configPath, config);
  }

  /**
   * Sanity check local config properties
   */
  static validateLocalConfig({
    config,
  }: {
    config: DeepPartial<MyceliumConfig>;
  }): RespV3<boolean> {
    if (config.workspace) {
      if (
        _.isEmpty(config.workspace) ||
        (config.workspace.vaults && !_.isArray(config.workspace.vaults))
      ) {
        return {
          error: new MyceliumError({
            message:
              "workspace must not be empty and vaults must be an array if workspace is set",
          }),
        };
      }
    }
    return { data: true };
  }

  /**
   * Create a backup of mycelium.yml with an optional custom infix string.
   * e.g.) createBackup(wsRoot, "foo") will result in a backup file name
   * `mycelium.yyyy.MM.dd.HHmmssS.foo.yml`
   * @param wsRoot workspace root
   * @param infix custom string used in the backup name
   * ^fd66z8uiuczz
   */
  static async createBackup(wsRoot: string, infix?: string): Promise<string> {
    const backupService = new BackupService({ wsRoot });
    try {
      const configPath = DConfig.configPath(wsRoot);
      const backupResp = await backupService.backup({
        key: BackupKeyEnum.config,
        pathToBackup: configPath,
        timestamp: true,
        infix,
      });
      if (backupResp.error) {
        throw new MyceliumError({ ...backupResp.error });
      }
      return backupResp.data;
    } finally {
      backupService.dispose();
    }
  }
}
