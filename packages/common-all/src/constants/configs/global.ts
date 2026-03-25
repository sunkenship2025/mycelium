import { TopLevelMyceliumConfig } from "../../types/configs/myceliumConfig";
import {
  MyceliumConfigEntry,
  MyceliumConfigEntryCollection,
} from "../../types/configs/base";
import { MyceliumGlobalConfig } from "../../types/configs/global/global";

export const ENABLE_MERMAID = (
  namespace: TopLevelMyceliumConfig
): MyceliumConfigEntry => {
  return {
    label: `Enable Mermaid (${namespace})`,
    desc: `Enable the use of mermaid for rendering diagrams. (${namespace})`,
  };
};

export const ENABLE_PRETTY_REFS = (
  namespace: TopLevelMyceliumConfig
): MyceliumConfigEntry => {
  return {
    label: `Enable Pretty Refs (${namespace})`,
    desc: `Enable rendering note references as pretty refs. (${namespace})`,
  };
};

export const ENABLE_KATEX = (
  namespace: TopLevelMyceliumConfig
): MyceliumConfigEntry => {
  return {
    label: `Enable Katex (${namespace})`,
    desc: `Enable the use of katex for rendering math. (${namespace})`,
  };
};

export const ENABLE_FM_TITLE = (
  namespace: TopLevelMyceliumConfig
): MyceliumConfigEntry => {
  return {
    label: `Enable Frontmatter Title (${namespace})`,
    desc: `Insert frontmatter title of note to the body (${namespace})`,
  };
};

export const ENABLE_NOTE_TITLE_FOR_LINK = (
  namespace: TopLevelMyceliumConfig
): MyceliumConfigEntry => {
  return {
    label: `Enable Note Title for Links (${namespace})`,
    desc: `Enable rendering of naked links as the title of the note. (${namespace})`,
  };
};

export const ENABLE_FRONTMATTER_TAGS = (
  namespace: TopLevelMyceliumConfig
): MyceliumConfigEntry => {
  return {
    label: `Enable Frontmatter Tags (${namespace})`,
    desc: `Show Frontmatter tags in published site. (${namespace})`,
  };
};

export const ENABLE_HASHES_FOR_FM_TAGS = (
  namespace: TopLevelMyceliumConfig
): MyceliumConfigEntry => {
  return {
    label: `Enable Hashes for Frontmatter Tags (${namespace})`,
    desc: `Display a '#' symbol in front of frontmatter tags in the tags listing. (${namespace})`,
  };
};

export const ENABLE_CHILD_LINKS = (
  namespace: TopLevelMyceliumConfig
): MyceliumConfigEntry => {
  return {
    label: `Show Child Links (${namespace})`,
    desc: `Notes will render child links (${namespace})`,
  };
};

export const ENABLE_BACK_LINKS = (
  namespace: TopLevelMyceliumConfig
): MyceliumConfigEntry => {
  return {
    label: `Show Backlinks (${namespace})`,
    desc: `Notes will render backlinks (${namespace})`,
  };
};

export const GLOBAL: MyceliumConfigEntryCollection<MyceliumGlobalConfig> = {
  enableFMTitle: ENABLE_FM_TITLE("global"), // TODO: split implementation to respect non-global config
  enableNoteTitleForLink: ENABLE_NOTE_TITLE_FOR_LINK("global"), // TODO: split
  enablePrettyRefs: ENABLE_PRETTY_REFS("global"),
  enableKatex: ENABLE_KATEX("global"),
  enableChildLinks: ENABLE_CHILD_LINKS("global"),
  enableBackLinks: ENABLE_BACK_LINKS("global"),
};
