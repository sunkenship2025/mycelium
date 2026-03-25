import { Theme } from "../publishing";

/**
 * Namespace for all preview related configurations
 */
export type MyceliumPreviewConfig = {
  enableFMTitle: boolean; // TODO: split
  enableNoteTitleForLink: boolean; // TODO: split
  enableFrontmatterTags: boolean;
  enableHashesForFMTags: boolean;
  enablePrettyRefs: boolean;
  enableKatex: boolean;
  automaticallyShowPreview: boolean;
  theme?: Theme;
};

/**
 * Generate defaults for {@link MyceliumPreviewConfig}
 * @returns MyceliumPreviewConfig
 */
export function genDefaultPreviewConfig(): MyceliumPreviewConfig {
  return {
    enableFMTitle: true,
    enableNoteTitleForLink: true,
    enableFrontmatterTags: true,
    enableHashesForFMTags: false,
    enablePrettyRefs: true,
    enableKatex: true,
    automaticallyShowPreview: false,
  };
}
