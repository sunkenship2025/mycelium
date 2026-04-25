import {
  MyceliumError,
  MyceliumConfig,
  RespV3,
  WorkspaceRequest,
} from "@myceliumhq/common-all";
import { DConfig } from "@myceliumhq/common-server";
import { MemoryStore } from "../store/memoryStore";
import { getWSEngine } from "../utils";

export class ConfigController {
  static singleton?: ConfigController;

  static instance() {
    if (!ConfigController.singleton) {
      ConfigController.singleton = new ConfigController();
    }
    return ConfigController.singleton;
  }

  async get({ ws }: WorkspaceRequest): Promise<RespV3<MyceliumConfig>> {
    const engine = ws
      ? await getWSEngine({ ws })
      : MemoryStore.instance().getEngine();
    try {
      return { data: DConfig.readConfigSync(engine.wsRoot) };
    } catch (err) {
      return {
        error: new MyceliumError({ message: JSON.stringify(err) }),
      };
    }
  }
}
