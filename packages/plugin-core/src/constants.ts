import {
  BacklinkPanelSortOrder,
  MyceliumTreeViewKey,
  MYCELIUM_VSCODE_CONFIG_KEYS,
  isWebViewEntry,
  TreeViewItemLabelTypeEnum,
  TREE_VIEWS,
} from "@myceliumhq/common-all";
import { CodeConfigKeys } from "./types";

export const extensionQualifiedId = `mycelium.mycelium`;
export const DEFAULT_LEGACY_VAULT_NAME = "vault";

export enum MyceliumContext {
  PLUGIN_ACTIVE = "mycelium:pluginActive",
  PLUGIN_NOT_ACTIVE = "!mycelium:pluginActive",
  DEV_MODE = "mycelium:devMode",
  HAS_LEGACY_PREVIEW = "mycelium:hasLegacyPreview",
  HAS_CUSTOM_MARKDOWN_VIEW = "hasCustomMarkdownPreview",
  NOTE_LOOK_UP_ACTIVE = "mycelium:noteLookupActive",
  SHOULD_SHOW_LOOKUP_VIEW = "mycelium:shouldShowLookupView",
  BACKLINKS_SORT_ORDER = "mycelium:backlinksSortOrder",
  ENABLE_EXPORT_PODV2 = "mycelium:enableExportPodV2",
  TREEVIEW_TREE_ITEM_LABEL_TYPE = "mycelium:treeviewItemLabelType",
  GRAPH_PANEL_SHOW_BACKLINKS = "mycelium.graph-panel.showBacklinks",
  GRAPH_PANEL_SHOW_OUTWARD_LINKS = "mycelium.graph-panel.showOutwardLinks",
  GRAPH_PANEL_SHOW_HIERARCHY = "mycelium.graph-panel.showHierarchy",
}

const treeViewConfig2VSCodeEntry = (id: MyceliumTreeViewKey) => {
  const entry = TREE_VIEWS[id];
  const out: {
    id: string;
    name: string;
    type?: "webview";
  } = {
    id,
    name: entry.label,
  };
  if (isWebViewEntry(entry)) {
    out.type = "webview";
  }
  return out;
};

/**
 * Invocation point for the LaunchTutorialCommand. Used for telemetry purposes
 */
export enum LaunchTutorialCommandInvocationPoint {
  RecentWorkspacesPanel = "RecentWorkspacesPanel",
  WelcomeWebview = "WelcomeWebview",
}

const args = {
  invocationPoint: LaunchTutorialCommandInvocationPoint.RecentWorkspacesPanel,
};
const encodedArgs = encodeURIComponent(JSON.stringify(args));
const commandUri = `command:mycelium.launchTutorialWorkspace?${encodedArgs}`;

export const MYCELIUM_VIEWS_WELCOME = [
  {
    view: MyceliumTreeViewKey.BACKLINKS,
    contents: "There are no backlinks to this note.",
  },
  {
    view: MyceliumTreeViewKey.RECENT_WORKSPACES,
    contents: `No recent workspaces detected. If this is your first time using Mycelium, [try out our tutorial workspace](${commandUri}).`,
  },
  {
    view: MyceliumTreeViewKey.TREE_VIEW,
    contents: "First open a Mycelium note to see the tree view.",
  },
];

export const MYCELIUM_VIEWS_CONTAINERS = {
  activitybar: [
    {
      id: "mycelium-view",
      title: "Mycelium",
      icon: "media/icons/mycelium-activity-bar-icon.svg",
    },
  ],
};

export const MYCELIUM_VIEWS = [
  {
    ...treeViewConfig2VSCodeEntry(MyceliumTreeViewKey.SAMPLE_VIEW),
    when: MyceliumContext.DEV_MODE,
    where: "explorer",
  },
  {
    id: MyceliumTreeViewKey.TIP_OF_THE_DAY,
    name: "Tip of the Day",
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    type: "webview",
    where: "mycelium-view",
  },
  {
    id: MyceliumTreeViewKey.BACKLINKS,
    name: "Backlinks",
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    where: "mycelium-view",
  },
  {
    ...treeViewConfig2VSCodeEntry(MyceliumTreeViewKey.TREE_VIEW),
    when: `${MyceliumContext.PLUGIN_ACTIVE}`,
    where: "mycelium-view",
    icon: "media/icons/mycelium-vscode.svg",
  },
  {
    ...treeViewConfig2VSCodeEntry(MyceliumTreeViewKey.LOOKUP_VIEW),
    when: `${MyceliumContext.PLUGIN_ACTIVE} && ${MyceliumContext.NOTE_LOOK_UP_ACTIVE} && ${MyceliumContext.SHOULD_SHOW_LOOKUP_VIEW}`,
    where: "mycelium-view",
  },
  {
    ...treeViewConfig2VSCodeEntry(MyceliumTreeViewKey.CALENDAR_VIEW),
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    where: "mycelium-view",
  },
  {
    id: MyceliumTreeViewKey.RECENT_WORKSPACES,
    name: "Recent Mycelium Workspaces",
    where: "mycelium-view",
    when: `${MyceliumContext.PLUGIN_NOT_ACTIVE} && shellExecutionSupported`,
  },
  {
    id: MyceliumTreeViewKey.HELP_AND_FEEDBACK,
    name: "Help and Feedback",
    where: "mycelium-view",
    when: "shellExecutionSupported",
  },
  {
    ...treeViewConfig2VSCodeEntry(MyceliumTreeViewKey.GRAPH_PANEL),
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    where: "mycelium-view",
  },
];

type KeyBinding = {
  key?: string;
  mac?: string;
  windows?: string;
  when?: string;
  args?: any;
};

type ConfigEntry = {
  key: string;
  description: string;
  type: "string" | "boolean" | "number";
  default?: any;
  enum?: string[];
  scope?: CommandEntry;
};

type Entry = {
  name: string;
  description: string;
  data: any;
};

type CommandEntry = {
  key: string;
  title: string;
  keybindings?: KeyBinding;
  icon?: string;
  // this will be used in `commandPalette` contribution point.
  when?: string;
  // this will be used in `commands` contribution point.
  enablement?: string;
};

const CMD_PREFIX = "Mycelium:";
export const ICONS = {
  LINK_CANDIDATE: "debug-disconnect",
  WIKILINK: "link",
  SCHEMA: "repo",
};
export const MYCELIUM_WORKSPACE_FILE = "mycelium.code-workspace";

export const MYCELIUM_REMOTE_VAULTS: Entry[] = [
  {
    name: "mycelium",
    description: "mycelium.so notes",
    data: "https://github.com/myceliumhq/mycelium-site.git",
  },
  {
    name: "aws",
    description: "aws notes",
    data: "https://github.com/myceliumhq/mycelium-aws-vault.git",
  },
  {
    name: "tldr",
    description: "cli tld",
    data: "https://github.com/kevinslin/seed-tldr.git",
  },
  {
    name: "xkcd",
    description: "all xkcd comics",
    data: "https://github.com/kevinslin/seed-xkcd.git",
  },
];

type CommandPaletteEntry = {
  command: string;
  when?: string;
};

// TODO: fomarlize
export const MYCELIUM_MENUS = {
  commandPalette: [] as CommandPaletteEntry[],
  "view/title": [
    /**
     * Sort orders are round-robined, if we add more orders and/or change ordering
     * of sort order THEN make sure to update the labels of the command since the labels
     * display the current backlink ordering that is being used.
     * */
    {
      command: "mycelium.backlinks.sortByLastUpdated",
      when: `view == mycelium.backlinks && ${MyceliumContext.BACKLINKS_SORT_ORDER} == ${BacklinkPanelSortOrder.PathNames}`,
      group: "sort@1",
    },
    {
      command: "mycelium.backlinks.sortByLastUpdatedChecked",
      when: `view == mycelium.backlinks && ${MyceliumContext.BACKLINKS_SORT_ORDER} == ${BacklinkPanelSortOrder.LastUpdated}`,
      group: "sort@1",
    },
    {
      command: "mycelium.backlinks.sortByPathNames",
      when: `view == mycelium.backlinks && ${MyceliumContext.BACKLINKS_SORT_ORDER} == ${BacklinkPanelSortOrder.LastUpdated}`,
      group: "sort@2",
    },
    {
      command: "mycelium.backlinks.sortByPathNamesChecked",
      when: `view == mycelium.backlinks && ${MyceliumContext.BACKLINKS_SORT_ORDER} == ${BacklinkPanelSortOrder.PathNames}`,
      group: "sort@2",
    },
    {
      command: "mycelium.backlinks.expandAll",
      when: "view == mycelium.backlinks",
      group: "navigation@2",
    },
    {
      command: "mycelium.treeView.labelByTitle",
      when: `view == mycelium.treeView && ${MyceliumContext.TREEVIEW_TREE_ITEM_LABEL_TYPE} == ${TreeViewItemLabelTypeEnum.filename}`,
    },
    {
      command: "mycelium.treeView.labelByFilename",
      when: `view == mycelium.treeView && ${MyceliumContext.TREEVIEW_TREE_ITEM_LABEL_TYPE} == ${TreeViewItemLabelTypeEnum.title}`,
    },
    {
      command: "mycelium.treeView.expandAll",
      when: `view == mycelium.treeView && ${MyceliumContext.DEV_MODE}`,
      group: "navigation@2",
    },
    {
      command: "mycelium.treeView.createNote",
      when: `view == mycelium.treeView`,
      group: "navigation@2",
    },
    {
      command: "mycelium.graph-panel.increaseDepth",
      when: "view == mycelium.graph-panel",
      group: "navigation@2",
    },
    {
      command: "mycelium.graph-panel.decreaseDepth",
      when: "view == mycelium.graph-panel",
      group: "navigation@2",
    },
    {
      command: "mycelium.graph-panel.showBacklinksChecked",
      when: `view == mycelium.graph-panel && ${MyceliumContext.GRAPH_PANEL_SHOW_BACKLINKS}`,
    },
    {
      command: "mycelium.graph-panel.showOutwardLinksChecked",
      when: `view == mycelium.graph-panel && ${MyceliumContext.GRAPH_PANEL_SHOW_OUTWARD_LINKS}`,
    },
    {
      command: "mycelium.graph-panel.showHierarchyChecked",
      when: `view == mycelium.graph-panel && ${MyceliumContext.GRAPH_PANEL_SHOW_HIERARCHY}`,
    },
    {
      command: "mycelium.graph-panel.showBacklinks",
      when: `view == mycelium.graph-panel && !${MyceliumContext.GRAPH_PANEL_SHOW_BACKLINKS}`,
    },
    {
      command: "mycelium.graph-panel.showOutwardLinks",
      when: `view == mycelium.graph-panel && !${MyceliumContext.GRAPH_PANEL_SHOW_OUTWARD_LINKS}`,
    },
    {
      command: "mycelium.graph-panel.showHierarchy",
      when: `view == mycelium.graph-panel && !${MyceliumContext.GRAPH_PANEL_SHOW_HIERARCHY}`,
    },
  ],
  "explorer/context": [
    {
      when: "explorerResourceIsFolder && mycelium:pluginActive && workspaceFolderCount > 1 && shellExecutionSupported",
      command: "mycelium.vaultAdd",
      group: "2_workspace",
    },
    {
      when: "explorerResourceIsFolder && mycelium:pluginActive && shellExecutionSupported",
      command: "mycelium.removeVault",
      group: "2_workspace",
    },
    {
      // [[Command Enablement / When Clause Gotchas|mycelium://mycelium.docs/pkg.plugin-core.t.commands.ops#command-enablement--when-clause-gotchas]]
      when: "resourceExtname == .md && mycelium:pluginActive && shellExecutionSupported || resourceExtname == .yml && mycelium:pluginActive && shellExecutionSupported",
      command: "mycelium.delete",
      group: "2_workspace",
    },
    {
      when: "resourceExtname == .md && mycelium:pluginActive && shellExecutionSupported",
      command: "mycelium.moveNote",
      group: "2_workspace",
    },
    {
      command: "mycelium.togglePreview",
      // when is the same as the built-in preview, plus pluginActive
      when: "resourceLangId == markdown && mycelium:pluginActive",
      group: "navigation",
    },
  ],
  "editor/context": [
    {
      when: "resourceExtname == .md && mycelium:pluginActive && shellExecutionSupported",
      command: "mycelium.copyNoteLink",
      group: "2_workspace",
    },
  ],
  "editor/title": [
    {
      command: "mycelium.togglePreview",
      // when is the same as the built-in preview, plus pluginActive
      when: "editorLangId == markdown && !notebookEditorFocused && mycelium:pluginActive",
      group: "navigation",
    },
  ],
  "editor/title/context": [
    {
      command: "mycelium.togglePreview",
      when: "resourceLangId == markdown && mycelium:pluginActive",
      group: "1_open",
    },
  ],
  "view/item/context": [
    {
      command: "mycelium.delete",
      when: "view == mycelium.treeView && viewItem == note && shellExecutionSupported",
    },
    {
      command: "mycelium.createNote",
      when: "view == mycelium.treeView && shellExecutionSupported",
    },
    {
      command: "mycelium.treeView.gotoNote",
      when: "view == mycelium.treeView && viewItem == stub && shellExecutionSupported",
      group: "inline",
    },
  ],
};

export const MYCELIUM_COMMANDS: { [key: string]: CommandEntry } = {
  // --- backlinks panel buttons
  BACKLINK_SORT_BY_LAST_UPDATED: {
    key: "mycelium.backlinks.sortByLastUpdated",
    title: "Sort by Last Updated",
  },
  BACKLINK_SORT_BY_LAST_UPDATED_CHECKED: {
    key: "mycelium.backlinks.sortByLastUpdatedChecked",
    title: "✓ Sort by Last Updated",
  },
  BACKLINK_SORT_BY_PATH_NAMES: {
    key: "mycelium.backlinks.sortByPathNames",
    title: "Sort by Path Names",
  },
  BACKLINK_SORT_BY_PATH_NAMES_CHECKED: {
    key: "mycelium.backlinks.sortByPathNamesChecked",
    title: "✓ Sort by Path Names",
  },
  BACKLINK_EXPAND_ALL: {
    key: "mycelium.backlinks.expandAll",
    title: "Expand All",
    icon: "$(expand-all)",
  },
  // --- tree view panel buttons
  TREEVIEW_LABEL_BY_TITLE: {
    key: "mycelium.treeView.labelByTitle",
    title: "Label and sort notes by title",
    icon: "$(list-ordered)",
  },
  TREEVIEW_LABEL_BY_FILENAME: {
    key: "mycelium.treeView.labelByFilename",
    title: "Label and sort notes by filename",
    icon: "$(list-ordered)",
  },
  TREEVIEW_EXPAND_ALL: {
    key: "mycelium.treeView.expandAll",
    title: "Expand All",
    icon: "$(expand-all)",
    when: MyceliumContext.DEV_MODE,
  },
  TREEVIEW_CREATE_NOTE: {
    key: "mycelium.treeView.createNote",
    title: "Create Note",
    icon: "$(new-file)",
    when: "false",
  },
  TREEVIEW_EXPAND_STUB: {
    key: "mycelium.treeView.expandStub",
    title: `${CMD_PREFIX} Dev: Expand Stub`,
    when: "false",
  },
  TREEVIEW_GOTO_NOTE: {
    key: "mycelium.treeView.gotoNote",
    title: `Create Note`, // will appear in the tooltip
    icon: "$(gist-new)",
    when: "false",
  },
  // graph panel buttons
  GRAPH_PANEL_INCREASE_DEPTH: {
    key: "mycelium.graph-panel.increaseDepth",
    title: "Increase Depth",
    icon: "$(arrow-up)",
  },
  GRAPH_PANEL_DECREASE_DEPTH: {
    key: "mycelium.graph-panel.decreaseDepth",
    title: "Decrease Depth",
    icon: "$(arrow-down)",
  },
  GRAPH_PANEL_SHOW_BACKLINKS: {
    key: "mycelium.graph-panel.showBacklinks",
    title: "Show Backlinks",
  },
  GRAPH_PANEL_SHOW_OUTWARD_LINKS: {
    key: "mycelium.graph-panel.showOutwardLinks",
    title: "Show Outward Links",
  },
  GRAPH_PANEL_SHOW_HIERARCHY: {
    key: "mycelium.graph-panel.showHierarchy",
    title: "Show Hierarchy",
  },
  GRAPH_PANEL_SHOW_BACKLINKS_CHECKED: {
    key: "mycelium.graph-panel.showBacklinksChecked",
    title: "✓ Show Backlinks",
  },
  GRAPH_PANEL_SHOW_OUTWARD_LINKS_CHECKED: {
    key: "mycelium.graph-panel.showOutwardLinksChecked",
    title: "✓ Show Outward Links",
  },
  GRAPH_PANEL_SHOW_HIERARCHY_CHECKED: {
    key: "mycelium.graph-panel.showHierarchyChecked",
    title: "✓ Show Hierarchy",
  },
  // --- Notes
  BROWSE_NOTE: {
    key: "mycelium.browseNote",
    title: `${CMD_PREFIX} Browse Note`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CONTRIBUTE: {
    key: "mycelium.contributeToCause",
    title: `${CMD_PREFIX} Contribute `,
    when: "shellExecutionSupported",
  },
  GOTO: {
    key: "mycelium.goto",
    title: `${CMD_PREFIX} Go to`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    keybindings: {
      when: "editorFocus",
    },
  },
  GOTO_NOTE: {
    key: "mycelium.gotoNote",
    title: `${CMD_PREFIX} Go to Note`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    keybindings: {
      key: "ctrl+enter",
      when: "editorFocus",
    },
  },
  CREATE_SCHEMA_FROM_HIERARCHY: {
    key: "mycelium.createSchemaFromHierarchy",
    title: `${CMD_PREFIX} Create Schema From Note Hierarchy`,
    keybindings: {
      when: `editorFocus && ${MyceliumContext.PLUGIN_ACTIVE}`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CREATE_DAILY_JOURNAL_NOTE: {
    key: "mycelium.createDailyJournalNote",
    title: `${CMD_PREFIX} Create Daily Journal Note`,
    keybindings: {
      key: "ctrl+shift+i",
      mac: "cmd+shift+i",
      when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  COPY_NOTE_LINK: {
    key: "mycelium.copyNoteLink",
    title: `${CMD_PREFIX} Copy Note Link`,
    keybindings: {
      key: "ctrl+shift+c",
      mac: "cmd+shift+c",
      when: `editorFocus && ${MyceliumContext.PLUGIN_ACTIVE}`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  COPY_NOTE_REF: {
    key: "mycelium.copyNoteRef",
    title: `${CMD_PREFIX} Copy Note Ref`,
    keybindings: {
      key: "ctrl+shift+r",
      mac: "cmd+shift+r",
      when: `editorFocus && ${MyceliumContext.PLUGIN_ACTIVE}`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  COPY_TO_CLIPBOARD: {
    key: "mycelium.copyToClipboard",
    title: `${CMD_PREFIX} Copy To Clipboard`,
    when: "false",
  },
  COPY_CODESPACE_URL: {
    key: "mycelium.copyCodespaceURL",
    title: `${CMD_PREFIX} Copy Codespace URL`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  COPY_AS: {
    key: "mycelium.copyAs",
    title: `${CMD_PREFIX} Copy As`,
    keybindings: {
      key: "ctrl+k ctrl+c",
      mac: "cmd+k cmd+c",
      when: "mycelium:pluginActive",
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  DELETE: {
    key: "mycelium.delete",
    title: `${CMD_PREFIX} Delete`,
    keybindings: {
      key: "ctrl+shift+d",
      mac: "cmd+shift+d",
      when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  INSERT_NOTE_LINK: {
    key: "mycelium.insertNoteLink",
    title: `${CMD_PREFIX} Insert Note Link`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  INSERT_NOTE_INDEX: {
    key: "mycelium.insertNoteIndex",
    title: `${CMD_PREFIX} Insert Note Index`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  MOVE_NOTE: {
    key: "mycelium.moveNote",
    title: `${CMD_PREFIX} Move Note`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  MOVE_SELECTION_TO: {
    key: "mycelium.moveSelectionTo",
    title: `${CMD_PREFIX} Move Selection To`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  MERGE_NOTE: {
    key: "mycelium.mergeNote",
    title: `${CMD_PREFIX} Merge Note`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  RANDOM_NOTE: {
    key: "mycelium.randomNote",
    title: `${CMD_PREFIX} Random Note`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  RENAME_NOTE_V2A: {
    key: "mycelium.renameNoteV2a",
    title: `${CMD_PREFIX} Rename Note V2a`,
    when: "false", // this is internal only.
  },
  RENAME_NOTE: {
    key: "mycelium.renameNote",
    title: `${CMD_PREFIX} Rename Note`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  RENAME_HEADER: {
    key: "mycelium.renameHeader",
    title: `${CMD_PREFIX} Rename Header`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  MOVE_HEADER: {
    key: "mycelium.moveHeader",
    title: `${CMD_PREFIX} Move Header`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CONVERT_CANDIDATE_LINK: {
    key: "mycelium.convertCandidateLink",
    title: `${CMD_PREFIX} Convert Candidate Link`,
    when: "false",
  },
  CONVERT_LINK: {
    key: "mycelium.convertLink",
    title: `${CMD_PREFIX} Convert Link`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  LOOKUP_NOTE: {
    key: "mycelium.lookupNote",
    title: `${CMD_PREFIX} Lookup Note`,
    keybindings: {
      mac: "cmd+L",
      key: "ctrl+l",
      when: `${MyceliumContext.PLUGIN_ACTIVE}`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE}`,
  },

  // This command will only apply when the note look up quick pick is open
  // which is taken care by the MyceliumContext.NOTE_LOOK_UP_ACTIVE
  //
  // It will also NOT activate when the focus is in editor using `!editorFocus`
  //
  // However, when it comes to user navigating to side panels its quite imperfect.
  // We do have some protection against Tab interception by using the `!view`
  // (most side panels set the view variable Eg. "view": "mycelium.backlinks").
  // But it is possible for user to tab into empty side panel which does not
  // have a `view` context set, at that point if user still has look up open and
  // presses tab, Tab will get intercepted by note auto complete.
  //
  // Ideally there would be a trigger event when quick pick goes in focus/focuses out
  // but not able to find such hook.
  LOOKUP_NOTE_AUTO_COMPLETE: {
    key: "mycelium.lookupNoteAutoComplete",

    /** This command will NOT show up within the command palette
     *  since its disabled within package.json in contributes.menus.commandPalette */
    title: `${CMD_PREFIX} hidden`,
    keybindings: {
      key: "Tab",
      when: `${MyceliumContext.PLUGIN_ACTIVE} && ${MyceliumContext.NOTE_LOOK_UP_ACTIVE} && !editorFocus && !view`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && ${MyceliumContext.NOTE_LOOK_UP_ACTIVE} && !editorFocus && !view`,
  },
  CREATE_JOURNAL: {
    key: "mycelium.createJournalNote",
    title: `${CMD_PREFIX} Create Journal Note`,
    keybindings: {
      key: "ctrl+shift+j",
      mac: "cmd+shift+j",
      args: {
        noteType: "journal",
      },
      when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CREATE_SCRATCH: {
    key: "mycelium.createScratchNote",
    title: `${CMD_PREFIX} Create Scratch Note`,
    keybindings: {
      key: "ctrl+k s",
      mac: "cmd+k s",
      when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CREATE_NOTE: {
    key: "mycelium.createNote",
    title: `${CMD_PREFIX} Create Note`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CREATE_MEETING_NOTE: {
    key: "mycelium.createMeetingNote",
    title: `${CMD_PREFIX} Create Meeting Note`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  LOOKUP_SCHEMA: {
    key: "mycelium.lookupSchema",
    title: `${CMD_PREFIX} Lookup Schema`,
    keybindings: {
      mac: "cmd+shift+L",
      key: "ctrl+shift+l",
      when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  RELOAD_INDEX: {
    key: "mycelium.reloadIndex",
    title: `${CMD_PREFIX} Reload Index`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  TASK_CREATE: {
    key: "mycelium.createTask",
    title: `${CMD_PREFIX} Create Task Note`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  TASK_SET_STATUS: {
    key: "mycelium.setTaskStatus",
    title: `${CMD_PREFIX} Set Task Status`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  TASK_COMPLETE: {
    key: "mycelium.completeTask",
    title: `${CMD_PREFIX} Complete Task`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  APPLY_TEMPLATE: {
    key: "mycelium.applyTemplate",
    title: `${CMD_PREFIX} Apply Template`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  // --- Hierarchies
  ARCHIVE_HIERARCHY: {
    key: "mycelium.archiveHierarchy",
    title: `${CMD_PREFIX} Archive Hierarchy`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  REFACTOR_HIERARCHY: {
    key: "mycelium.refactorHierarchy",
    title: `${CMD_PREFIX} Refactor Hierarchy`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  GO_UP_HIERARCHY: {
    key: "mycelium.goUpHierarchy",
    title: `${CMD_PREFIX} Go Up`,
    keybindings: {
      mac: "cmd+shift+up",
      key: "ctrl+shift+up",
      when: `editorFocus && ${MyceliumContext.PLUGIN_ACTIVE}`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  GO_NEXT_HIERARCHY: {
    key: "mycelium.goNextHierarchy",
    title: `${CMD_PREFIX} Go Next Sibling`,
    keybindings: {
      key: "ctrl+shift+]",
      when: `editorFocus && ${MyceliumContext.PLUGIN_ACTIVE}`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  GO_PREV_HIERARCHY: {
    key: "mycelium.goPrevHierarchy",
    title: `${CMD_PREFIX} Go Previous Sibling`,
    keybindings: {
      key: "ctrl+shift+[",
      when: `editorFocus && ${MyceliumContext.PLUGIN_ACTIVE}`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  GO_DOWN_HIERARCHY: {
    key: "mycelium.goDownHierarchy",
    title: `${CMD_PREFIX} Go Down`,
    keybindings: {
      mac: "cmd+shift+down",
      key: "ctrl+shift+down",
      when: `editorFocus && ${MyceliumContext.PLUGIN_ACTIVE}`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  GOTO_BACKLINK: {
    key: "mycelium.gotoBacklink",
    title: `${CMD_PREFIX} Go To Backlink`,
    when: "false",
  },
  // --- Workspace
  ADD_AND_COMMIT: {
    key: "mycelium.addAndCommit",
    title: `${CMD_PREFIX} Workspace: Add and Commit`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  SYNC: {
    key: "mycelium.sync",
    title: `${CMD_PREFIX} Workspace: Sync`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  VAULT_ADD: {
    key: "mycelium.vaultAdd",
    title: `${CMD_PREFIX} Vault Add`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  REMOVE_VAULT: {
    key: "mycelium.removeVault",
    title: `${CMD_PREFIX} Remove Vault`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CONVERT_VAULT: {
    key: "mycelium.convertVault",
    title: `${CMD_PREFIX} Convert Vault`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CREATE_NEW_VAULT: {
    key: "mycelium.createNewVault",
    title: `${CMD_PREFIX} Create New Vault`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  ADD_EXISTING_VAULT: {
    key: "mycelium.addExistingVault",
    title: `${CMD_PREFIX} Add Existing Vault`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  INIT_WS: {
    key: "mycelium.initWS",
    title: `${CMD_PREFIX} Initialize Workspace`,
    when: "shellExecutionSupported",
  },
  CHANGE_WS: {
    key: "mycelium.changeWS",
    title: `${CMD_PREFIX} Change Workspace`,
    when: "shellExecutionSupported",
  },
  UPGRADE_SETTINGS: {
    key: "mycelium.upgradeSettings",
    title: `${CMD_PREFIX} Upgrade Settings`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  // --- Pods
  CONFIGURE_POD: {
    key: "mycelium.configurePod",
    title: `${CMD_PREFIX} Configure Pod`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CONFIGURE_SERVICE_CONNECTION: {
    key: "mycelium.configureServiceConnection",
    title: `${CMD_PREFIX} Configure Service Connection`,
    enablement: `${MyceliumContext.PLUGIN_ACTIVE} && ${MyceliumContext.ENABLE_EXPORT_PODV2}`,
  },
  CONFIGURE_EXPORT_POD_V2: {
    key: "mycelium.configureExportPodV2",
    title: `${CMD_PREFIX} Configure Export Pod V2`,
    enablement: `${MyceliumContext.PLUGIN_ACTIVE} && ${MyceliumContext.ENABLE_EXPORT_PODV2}`,
  },
  IMPORT_POD: {
    key: "mycelium.importPod",
    title: `${CMD_PREFIX} Import Pod`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  IMPORT_OBSIDIAN_POD: {
    key: "mycelium.importObsidianPod",
    title: `${CMD_PREFIX} Import Obsidian Vault`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  EXPORT_POD: {
    key: "mycelium.exportPod",
    title: `${CMD_PREFIX} Export Pod`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  EXPORT_POD_V2: {
    key: "mycelium.exportPodv2",
    title: `${CMD_PREFIX} Export Pod V2`,
    enablement: `${MyceliumContext.PLUGIN_ACTIVE} && ${MyceliumContext.ENABLE_EXPORT_PODV2}`,
  },
  PUBLISH_POD: {
    key: "mycelium.publishPod",
    title: `${CMD_PREFIX} Publish Pod`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  SNAPSHOT_VAULT: {
    key: "mycelium.snapshotVault",
    title: `${CMD_PREFIX} Snapshot Vault`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  RESTORE_VAULT: {
    key: "mycelium.restoreVault",
    title: `${CMD_PREFIX} Restore Vault`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  COPY_NOTE_URL: {
    key: "mycelium.copyNoteURL",
    title: `${CMD_PREFIX} Copy Note URL`,
    keybindings: {
      mac: "cmd+shift+u",
      windows: "ctrl+shift+u",
      when: `editorFocus && ${MyceliumContext.PLUGIN_ACTIVE}`,
    },
    when: `${MyceliumContext.PLUGIN_ACTIVE}`,
  },
  // --- Hooks
  CREATE_HOOK: {
    key: "mycelium.createHook",
    title: `${CMD_PREFIX} Hook Create`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  DELETE_HOOK: {
    key: "mycelium.deleteHook",
    title: `${CMD_PREFIX} Hook Delete`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  REGISTER_NOTE_TRAIT: {
    key: "mycelium.registerNoteTrait",
    title: `${CMD_PREFIX} Register Note Trait`,
    when: "false",
  },
  CONFIGURE_NOTE_TRAITS: {
    key: "mycelium.configureNoteTraits",
    title: `${CMD_PREFIX} Configure Note Traits`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CREATE_USER_DEFINED_NOTE: {
    key: "mycelium.createNoteWithTraits",
    title: `${CMD_PREFIX} Create Note with Custom Traits`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  // --- Publishing
  PUBLISH_EXPORT: {
    key: "mycelium.publishExport",
    title: `${CMD_PREFIX} Publish Export`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  PUBLISH_DEV: {
    key: "mycelium.publishDev",
    title: `${CMD_PREFIX} Publish Dev`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  // --- Accounts
  SIGNUP: {
    key: "mycelium.signUp",
    title: `${CMD_PREFIX} Sign Up`,
    when: "shellExecutionSupported",
  },
  SIGNIN: {
    key: "mycelium.signIn",
    title: `${CMD_PREFIX} Sign In`,
    when: "shellExecutionSupported",
  },
  // --- Misc
  ENABLE_TELEMETRY: {
    key: "mycelium.enableTelemetry",
    title: `${CMD_PREFIX} Enable Telemetry`,
    when: "shellExecutionSupported",
  },
  DISABLE_TELEMETRY: {
    key: "mycelium.disableTelemetry",
    title: `${CMD_PREFIX} Disable Telemetry`,
    when: "shellExecutionSupported",
  },
  OPEN_LINK: {
    key: "mycelium.openLink",
    title: `${CMD_PREFIX} Open Link`,
    when: `false`,
  },
  PASTE_LINK: {
    key: "mycelium.pasteLink",
    title: `${CMD_PREFIX} Paste Link`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  SHOW_HELP: {
    key: "mycelium.showHelp",
    title: `${CMD_PREFIX} Show Help`,
    when: "shellExecutionSupported",
  },
  SHOW_NOTE_GRAPH: {
    key: "mycelium.showNoteGraphView",
    title: `${CMD_PREFIX} Show Note Graph`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  SHOW_SCHEMA_GRAPH: {
    key: "mycelium.showSchemaGraphView",
    title: `${CMD_PREFIX} Show Schema Graph`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  SHOW_LEGACY_PREVIEW: {
    key: "mycelium.showLegacyPreview",
    title: `${CMD_PREFIX} Show Preview (legacy)`,
    keybindings: {
      windows: "windows+ctrl+p",
      mac: "cmd+ctrl+p",
      when: "mycelium:pluginActive && mycelium:hasLegacyPreview",
    },
    when: "mycelium:pluginActive && mycelium:hasLegacyPreview",
  },
  TOGGLE_PREVIEW: {
    key: "mycelium.togglePreview",
    title: `${CMD_PREFIX} Toggle Preview`,
    icon: `$(open-preview)`,
    keybindings: {
      key: "ctrl+k v",
      mac: "cmd+ctrl+p",
      when: "mycelium:pluginActive",
    },
    when: "mycelium:pluginActive",
  },
  TOGGLE_PREVIEW_LOCK: {
    key: "mycelium.togglePreviewLock",
    title: `${CMD_PREFIX} Toggle Preview Lock`,
    icon: `$(lock)`,
    when: "mycelium:pluginActive",
  },
  PASTE_FILE: {
    key: "mycelium.pasteFile",
    title: `${CMD_PREFIX} Paste File`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  // -- Workbench
  CONFIGURE_RAW: {
    key: "mycelium.configureRaw",
    title: `${CMD_PREFIX} Configure (yaml)`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },

  CONFIGURE_UI: {
    key: "mycelium.configureUI",
    title: `${CMD_PREFIX} Configure (UI)`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CONFIGURE_GRAPH_STYLES: {
    key: "mycelium.configureGraphStyle",
    title: `${CMD_PREFIX} Configure Graph Style (css)`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  CONFIGURE_LOCAL_OVERRIDE: {
    key: "mycelium.configureLocalOverride",
    title: `${CMD_PREFIX} Configure Local Override`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  //-- Seeds
  SEED_ADD: {
    key: "mycelium.seedAdd",
    title: `${CMD_PREFIX} Add Seed to Workspace`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  SEED_REMOVE: {
    key: "mycelium.seedRemove",
    title: `${CMD_PREFIX} Remove Seed from Workspace`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  SEED_BROWSE: {
    key: "mycelium.seedBrowse",
    title: `${CMD_PREFIX} Browse the Seed Registry`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  // --- Dev
  DOCTOR: {
    key: "mycelium.dev.doctor",
    title: `${CMD_PREFIX} Doctor`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  DUMP_STATE: {
    key: "mycelium.dev.dumpState",
    title: `${CMD_PREFIX} Dump State`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  DEV_TRIGGER: {
    key: "mycelium.dev.devTrigger",
    title: `${CMD_PREFIX}Dev: Dev Trigger`,
    when: MyceliumContext.DEV_MODE,
  },
  RESET_CONFIG: {
    key: "mycelium.dev.resetConfig",
    title: `${CMD_PREFIX}Dev: Reset Config`,
    when: "shellExecutionSupported",
  },
  RUN_MIGRATION: {
    key: "mycelium.dev.runMigration",
    title: `${CMD_PREFIX}Dev: Run Migration`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  MIGRATE_SELF_CONTAINED: {
    key: "mycelium.dev.migrateSelfContained",
    title: `${CMD_PREFIX} Migrate to Self Contained Vault`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  OPEN_LOGS: {
    key: "mycelium.dev.openLogs",
    title: `${CMD_PREFIX}Dev: Open Logs`,
    when: "shellExecutionSupported",
  },
  DEV_DIAGNOSTICS_REPORT: {
    key: "mycelium.diagnosticsReport",
    title: `${CMD_PREFIX}Dev: Diagnostics Report`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  /**
   * This launches the welcome screen, which has a button that will launch the
   * tutorial when clicked.
   */
  SHOW_WELCOME_PAGE: {
    key: "mycelium.showWelcomePage",
    title: `${CMD_PREFIX} Launch Tutorial`,
    when: "shellExecutionSupported",
  },
  /**
   * This command actually launches the tutorial workspace
   */
  LAUNCH_TUTORIAL_WORKSPACE: {
    key: "mycelium.launchTutorialWorkspace",
    title: `${CMD_PREFIX} Launch Tutorial Workspace`,
    when: "false",
  },
  OPEN_BACKUP: {
    key: "mycelium.openBackup",
    title: `${CMD_PREFIX} Open Backup`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
  INSTRUMENTED_WRAPPER_COMMAND: {
    key: "mycelium.instrumentedWrapperCommand",
    title: `${CMD_PREFIX} Instrumented Wrapper Command`,
    when: "false",
  },
  VALIDATE_ENGINE: {
    key: "mycelium.dev.validateEngine",
    title: `${CMD_PREFIX}Dev: Validate Engine`,
    when: `${MyceliumContext.PLUGIN_ACTIVE} && shellExecutionSupported`,
  },
};

export const MYCELIUM_CHANNEL_NAME = "Mycelium";

export const WORKSPACE_STATE = {
  VERSION: "mycelium.wsVersion",
};

export enum GLOBAL_STATE {
  VERSION = "mycelium.version",
  /**
   * Context that can be used on extension activation to trigger special behavior.
   */
  WORKSPACE_ACTIVATION_CONTEXT = "mycelium.workspace_activation_context",
  /**
   * Extension is being debugged
   */
  VSCODE_DEBUGGING_EXTENSION = "mycelium.vscode_debugging_extension",
  /**
   * Most Recently Imported Doc
   */
  MRUDocs = "MRUDocs",
  /**
   * @deprecated
   * Checks if initial survey was prompted and submitted.
   */
  INITIAL_SURVEY_SUBMITTED = "mycelium.initial_survey_submitted",
  /**
   * @deprecated
   * Checks if lapsed user survey was submitted.
   */
  LAPSED_USER_SURVEY_SUBMITTED = "mycelium.lapsed_user_survey_submitted",
  /**
   * @deprecated
   * Chekcs if inactive user survey was submitted.
   */
  INACTIVE_USER_SURVEY_SUBMITTED = "mycelium.inactive_user_survey_submitted",
}

/**
 * @deprecated
 */
export enum WORKSPACE_ACTIVATION_CONTEXT {
  // UNSET - Indicates this is the first Workspace Launch
  "NORMAL", // Normal Launch; No Special Behavior
  "TUTORIAL", // Launch the Tutorial
  "SEED_BROWSER", // Open with Seed Browser Webview
}

export type ConfigKey = keyof typeof CONFIG;

export const _noteAddBehaviorEnum = [
  "childOfDomain",
  "childOfDomainNamespace",
  "childOfCurrent",
  "asOwnDomain",
];

export const CONFIG: { [key: string]: ConfigEntry } = {
  // --- journals
  DAILY_JOURNAL_DOMAIN: {
    key: "mycelium.dailyJournalDomain",
    type: "string",
    default: "daily",
    description: "DEPRECATED. Use journal settings in mycelium.yml",
  },
  DEFAULT_JOURNAL_NAME: {
    key: "mycelium.defaultJournalName",
    type: "string",
    default: "journal",
    description: "DEPRECATED. Use journal settings in mycelium.yml",
  },
  DEFAULT_JOURNAL_DATE_FORMAT: {
    key: "mycelium.defaultJournalDateFormat",
    type: "string",
    default: "y.MM.dd",
    description: "DEPRECATED. Use journal settings in mycelium.yml",
  },
  DEFAULT_JOURNAL_ADD_BEHAVIOR: {
    key: "mycelium.defaultJournalAddBehavior",
    default: "childOfDomain",
    type: "string",
    description: "DEPRECATED. Use journal settings in mycelium.yml",
    enum: _noteAddBehaviorEnum,
  },
  DEFAULT_SCRATCH_NAME: {
    key: "mycelium.defaultScratchName",
    type: "string",
    default: "scratch",
    description: "DEPRECATED. Use scratch settings in mycelium.yml",
  },
  DEFAULT_SCRATCH_DATE_FORMAT: {
    key: "mycelium.defaultScratchDateFormat",
    type: "string",
    default: "y.MM.dd.HHmmss",
    description: "DEPRECATED. Use scratch settings in mycelium.yml",
  },
  DEFAULT_SCRATCH_ADD_BEHAVIOR: {
    key: "mycelium.defaultScratchAddBehavior",
    default: "asOwnDomain",
    type: "string",
    description: "DEPRECATED. Use scratch settings in mycelium.yml",
    enum: _noteAddBehaviorEnum,
  },
  COPY_NOTE_URL_ROOT: {
    key: "mycelium.copyNoteUrlRoot",
    type: "string",
    description: "override root url when getting note url",
  },
  LINK_SELECT_AUTO_TITLE_BEHAVIOR: {
    key: "mycelium.linkSelectAutoTitleBehavior",
    type: "string",
    description: "Control title behavior when using selection2link with lookup",
    enum: ["none", "slug"],
    default: "slug",
  },
  DEFAULT_LOOKUP_CREATE_BEHAVIOR: {
    key: "mycelium.defaultLookupCreateBehavior",
    default: "selectionExtract",
    type: "string",
    description:
      "when creating a new note with selected text, define behavior for selected text",
    enum: ["selection2link", "selectionExtract"],
  },
  // --- timestamp decoration
  DEFAULT_TIMESTAMP_DECORATION_FORMAT: {
    key: CodeConfigKeys.DEFAULT_TIMESTAMP_DECORATION_FORMAT,
    default: "DATETIME_MED",
    type: "string",
    description: "Decide how human readable timestamp decoration is displayed",
    enum: [
      "DATETIME_FULL",
      "DATETIME_FULL_WITH_SECONDS",
      "DATETIME_HUGE",
      "DATETIME_HUGE_WITH_SECONDS",
      "DATETIME_MED",
      "DATETIME_MED_WITH_SECONDS",
      "DATETIME_SHORT",
      "DATETIME_SHORT_WITH_SECONDS",
      "DATE_FULL",
      "DATE_HUGE",
      "DATE_MED",
      "DATE_MED_WITH_WEEKDAY",
      "DATE_SHORT",
      "TIME_24_SIMPLE",
      "TIME_24_WITH_LONG_OFFSET",
      "TIME_24_WITH_SECONDS",
      "TIME_24_WITH_SHORT_OFFSET",
      "TIME_SIMPLE",
      "TIME_WITH_LONG_OFFSET",
      "TIME_WITH_SECONDS",
      "TIME_WITH_SHORT_OFFSET",
    ],
  },
  // --- root dir
  ROOT_DIR: {
    key: "mycelium.rootDir",
    type: "string",
    default: "",
    description: "location of mycelium workspace",
  },
  MYCELIUM_DIR: {
    key: "mycelium.myceliumDir",
    type: "string",
    default: "",
    description: "DEPRECATED. Use journal settings in mycelium.yml",
  },
  // --- other
  LOG_LEVEL: {
    key: "mycelium.logLevel",
    type: "string",
    default: "info",
    description: "control verbosity of mycelium logs",
    enum: ["debug", "info", "error"],
  },
  LSP_LOG_LVL: {
    key: "mycelium.trace.server",
    enum: ["off", "messages", "verbose"],
    type: "string",
    default: "messages",
    description: "LSP log level",
  },
  SERVER_PORT: {
    key: "mycelium.serverPort",
    type: "number",
    description:
      "port for server. If not set, will be randomly generated at startup.",
  },
  ENABLE_SELF_CONTAINED_VAULT_WORKSPACE: {
    key: MYCELIUM_VSCODE_CONFIG_KEYS.ENABLE_SELF_CONTAINED_VAULTS_WORKSPACE,
    type: "boolean",
    default: true,
    description:
      "When enabled, newly created workspaces will be created as self contained vaults.",
  },
};

export const gdocRequiredScopes = [
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive",
];

export const Oauth2Pods = ["mycelium.gdoc"];

export const INCOMPATIBLE_EXTENSIONS = [
  "yzhang.markdown-all-in-one",
  "fantasy.markdown-all-in-one-for-web",
  "foam.foam-vscode",
  "brianibbotson.add-double-bracket-notation-to-selection",
  "ianjsikes.md-graph",
  "thomaskoppelaar.markdown-wiki-links-preview",
  "svsool.markdown-memo",
  "kortina.vscode-markdown-notes",
  "maxedmands.vscode-zettel-markdown-notes",
  "tchayen.markdown-links",
  // Note graph is now built into Mycelium, and having this extension enabled breaks it.
  "mycelium.mycelium-markdown-links",
];

export type osType = "Linux" | "Darwin" | "Windows_NT";

export function isOSType(str: string): str is osType {
  return str === "Linux" || str === "Darwin" || str === "Windows_NT";
}

export type KeybindingConflict = {
  /**
   * extension id of the extension that has keybinding conflict
   */
  extensionId: string;
  /**
   * command id of the command contributed by `extensionId` that conflicts
   */
  commandId: string;
  /**
   * command id of Mycelium command that conflicts with `commandId`
   */
  conflictsWith: string;
  /**
   * os in which this conflict exists. assume all platforms if undefined.
   * this is the os type returned by {@link os.type}
   */
  os?: osType[];
};

export const KNOWN_CONFLICTING_EXTENSIONS = ["vscodevim.vim"];

/**
 * List of known keybinding conflicts
 */
export const KNOWN_KEYBINDING_CONFLICTS: KeybindingConflict[] = [
  {
    extensionId: "vscodevim.vim",
    commandId: "extension.vim_navigateCtrlL",
    conflictsWith: "mycelium.lookupNote",
    os: ["Linux", "Windows_NT"],
  },
  // This is left here so it could be tested in Darwin.
  // This is not an actual conflict.
  // {
  //   extensionId: "vscodevim.vim",
  //   commandId: "extension.vim_tab",
  //   conflictsWith: "mycelium.lookupNoteAutoComplete",
  // },
];
