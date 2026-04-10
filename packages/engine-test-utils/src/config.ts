import { DConfig, readYAML, writeYAML } from "@myceliumhq/common-server";
import { MyceliumConfig } from "@myceliumhq/common-all";

export class TestConfigUtils {
  static getConfig = (opts: { wsRoot: string }) => {
    const configPath = DConfig.configPath(opts.wsRoot);
    const config = readYAML(configPath) as MyceliumConfig;
    return config;
  };

  static withConfig = (
    func: (config: MyceliumConfig) => MyceliumConfig,
    opts: { wsRoot: string }
  ) => {
    const config = TestConfigUtils.getConfig(opts);

    const newConfig = func(config);
    TestConfigUtils.writeConfig({ config: newConfig, wsRoot: opts.wsRoot });
    return newConfig;
  };

  static writeConfig = (opts: { config: MyceliumConfig; wsRoot: string }) => {
    const configPath = DConfig.configPath(opts.wsRoot);
    return writeYAML(configPath, opts.config);
  };
}
