import path from "path";
import { ConfigUtils } from ".";
import { MyceliumConfig, MyceliumSiteFM, NoteProps, SEOProps } from "../types";

export class PublishUtils {
  static getPublishFM(note: NoteProps): MyceliumSiteFM {
    if (!note.custom) {
      return {};
    }
    return note.custom as MyceliumSiteFM;
  }
  static getSEOPropsFromConfig(config: MyceliumConfig): Partial<SEOProps> {
    const { title, twitter, description, image } =
      ConfigUtils.getPublishing(config).seo;
    return { title, twitter, description, image };
  }

  static getSEOPropsFromNote(note: NoteProps): SEOProps {
    const { title, created, updated, image, desc } = note;
    const { excerpt, canonicalUrl, noindex, canonicalBaseUrl, twitter } =
      note.custom ? note.custom : ({} as any);
    return {
      title,
      excerpt,
      description: excerpt || desc || undefined,
      updated,
      created,
      canonicalBaseUrl,
      canonicalUrl,
      noindex,
      image,
      twitter,
    };
  }

  /**
   * Path to the banner alert compoenent
   */
  static getCustomSiteBannerPathFromWorkspace(wsRoot: string) {
    return path.join(wsRoot, "publish", "components", "BannerAlert.tsx");
  }

  static getCustomSiteBannerPathToPublish(publishRoot: string) {
    return path.join(publishRoot, "custom", "BannerAlert.tsx");
  }

  /**
   * Site banner uses a custom react component
   */
  static hasCustomSiteBanner(config: MyceliumConfig): boolean {
    return ConfigUtils.getPublishing(config).siteBanner === "custom";
  }
}
