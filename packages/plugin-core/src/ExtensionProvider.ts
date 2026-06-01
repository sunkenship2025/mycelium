import { MyceliumError } from "@myceliumhq/common-all";
import { PodUtils } from "@myceliumhq/pods-core";
import { ensureDirSync } from "fs-extra";
import _ from "lodash";
import { IMyceliumExtension } from "./myceliumExtensionInterface";
import { IWSUtilsV2 } from "./WSUtilsV2Interface";

/**
 * Use this to statically get implementation of IMyceliumExtension without having to
 * depend on concrete MyceliumExtension.
 *
 * Note: Prefer to get IMyceliumExtension injected into your classes upon their
 * construction rather than statically getting it from here. But if that's not
 * a fitting option then use this class.
 * */
export class ExtensionProvider {
  private static extension: IMyceliumExtension;

  static getExtension(): IMyceliumExtension {
    if (_.isUndefined(ExtensionProvider.extension)) {
      throw new MyceliumError({
        message: `Extension is not yet registered. Make sure initialization registers extension prior to usage.`,
      });
    }

    return ExtensionProvider.extension;
  }

  static getCommentThreadsState() {
    return ExtensionProvider.extension.getCommentThreadsState();
  }

  static getDWorkspace() {
    return ExtensionProvider.getExtension().getDWorkspace();
  }

  static getEngine() {
    return ExtensionProvider.getExtension().getEngine();
  }

  static getWSUtils(): IWSUtilsV2 {
    return ExtensionProvider.getExtension().wsUtils;
  }

  static isActive() {
    return ExtensionProvider.getExtension().isActive();
  }

  static isActiveAndIsMyceliumNote(fpath: string) {
    return ExtensionProvider.getExtension().isActiveAndIsMyceliumNote(fpath);
  }

  static getWorkspaceConfig() {
    return ExtensionProvider.getExtension().getWorkspaceConfig();
  }

  static register(extension: IMyceliumExtension) {
    ExtensionProvider.extension = extension;
  }

  static getPodsDir() {
    const { wsRoot } = ExtensionProvider.getDWorkspace();
    const podsDir = PodUtils.getPodDir({ wsRoot });
    ensureDirSync(podsDir);
    return podsDir;
  }
}
