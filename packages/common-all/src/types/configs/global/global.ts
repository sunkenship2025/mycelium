/**
 * Namespace for all global configurations.
 */
export type MyceliumGlobalConfig = {
  enableFMTitle: boolean; // TODO: split implementation to respect non-global config
  enableNoteTitleForLink: boolean; // TODO: split
  enablePrettyRefs: boolean; // TODO: split
  enableKatex: boolean; // TODO: split
  enableChildLinks: boolean;
  enableBackLinks: boolean;
};

/**
 * Generates default for {@link MyceliumGlobalConfig}
 * @returns MyceliumGlobalConfig
 */
export function genDefaultGlobalConfig(): MyceliumGlobalConfig {
  return {
    enableFMTitle: true, // TODO: split implementation to respect non-global config
    enableNoteTitleForLink: true, // TODO: split
    enableKatex: true,
    enablePrettyRefs: true,
    enableChildLinks: true,
    enableBackLinks: true,
  };
}
