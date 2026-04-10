import { DEngineClient, SeedCommands, SeedConfig } from "@myceliumhq/common-all";
import { tmpDir, writeYAML } from "@myceliumhq/common-server";
import { SeedCLICommand } from "@myceliumhq/mycelium-cli";
import { SeedInitMode, SeedService, SeedUtils } from "@myceliumhq/engine-server";
import path from "path";
import { GitTestUtils } from "./git";

export class TestSeedUtils {
  static defaultSeedId = () => {
    return "mycelium.foo";
  };

  static async addSeed2WS({
    wsRoot,
    engine,
    modifySeed,
  }: {
    wsRoot: string;
    engine: DEngineClient;
    modifySeed?: (seed: SeedConfig) => SeedConfig;
  }) {
    const { registryFile } = await this.createSeedRegistry({
      engine,
      wsRoot,
      modifySeed,
    });
    const id = this.defaultSeedId();
    const seedService = new SeedService({ wsRoot, registryFile });
    await seedService.addSeed({ id });
  }

  static async createSeedRegistry(opts: {
    engine: DEngineClient;
    wsRoot: string;
    modifySeed?: (seed: SeedConfig) => SeedConfig;
  }) {
    let config = await this.createSeed(opts);
    const id = SeedUtils.getSeedId(config);
    const root = tmpDir().name;
    const registryFile = path.join(root, "reg.yml");
    if (opts.modifySeed) {
      config = opts.modifySeed(config);
    }
    const seedDict = { [id]: config };
    writeYAML(registryFile, seedDict);
    return { registryFile, seedDict };
  }

  static async createSeed(opts: { engine: DEngineClient; wsRoot: string }) {
    const cli = new SeedCLICommand();
    const cmd = SeedCommands.INIT;
    const id = this.defaultSeedId();
    const seed: SeedConfig = {
      id: "mycelium.foo",
      description: "",
      license: "",
      name: "foo",
      publisher: "mycelium",
      repository: {
        type: "git",
        url: `file://${opts.wsRoot}`,
      },
      root: "vault",
    };
    await cli.execute({
      cmd,
      id,
      server: {} as any,
      config: seed,
      mode: SeedInitMode.CREATE_WORKSPACE,
      ...opts,
    });
    try {
      await GitTestUtils.addRepoToWorkspace(opts.wsRoot);
      // eslint-disable-next-line no-empty
    } catch (err) {}
    return seed;
  }
}
