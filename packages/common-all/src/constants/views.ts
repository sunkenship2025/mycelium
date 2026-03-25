import { ErrorFactory } from "..";

export type MyceliumWebViewEntry = {
  label: string;
  desc: string;
  bundleName: string;
  type: "webview";
};
export type MyceliumNativeViewEntry = {
  label: string;
  desc: string;
  type: "nativeview";
};

export type MyceliumViewEntry = MyceliumWebViewEntry | MyceliumNativeViewEntry;

export enum MyceliumEditorViewKey {
  CONFIGURE = "mycelium.configure",
  NOTE_GRAPH = "mycelium.graph-note",
  SCHEMA_GRAPH = "mycelium.graph-schema",
  NOTE_PREVIEW = "mycelium.note-preview",
  SEED_BROWSER = "mycelium.seed-browser",
}

export enum MyceliumTreeViewKey {
  SAMPLE_VIEW = "mycelium.sample",
  TREE_VIEW = "mycelium.treeView",
  BACKLINKS = "mycelium.backlinks",
  CALENDAR_VIEW = "mycelium.calendar-view",
  LOOKUP_VIEW = "mycelium.lookup-view",
  TIP_OF_THE_DAY = "mycelium.tip-of-the-day",
  HELP_AND_FEEDBACK = "mycelium.help-and-feedback",
  GRAPH_PANEL = "mycelium.graph-panel",
  RECENT_WORKSPACES = "mycelium.recent-workspaces",
}

export const EDITOR_VIEWS: Record<MyceliumEditorViewKey, MyceliumViewEntry> = {
  [MyceliumEditorViewKey.NOTE_PREVIEW]: {
    desc: "Note Preview",
    label: "Note Preview",
    bundleName: "MyceliumNotePreview",
    type: "webview",
  },
  [MyceliumEditorViewKey.CONFIGURE]: {
    desc: "Mycelium Configuration",
    label: "Mycelium Configuration",
    bundleName: "MyceliumConfigure",
    type: "webview",
  },
  [MyceliumEditorViewKey.NOTE_GRAPH]: {
    desc: "Note Graph",
    label: "Note Graph",
    bundleName: "MyceliumGraphPanel",
    type: "webview",
  },
  [MyceliumEditorViewKey.SCHEMA_GRAPH]: {
    desc: "Schema Graph",
    label: "Schema Graph",
    bundleName: "MyceliumSchemaGraphPanel",
    type: "webview",
  },
  [MyceliumEditorViewKey.SEED_BROWSER]: {
    desc: "Seed Registry",
    label: "Seed Registry",
    bundleName: "SeedBrowser",
    type: "webview",
  },
};

/**
 * Value is the name of webpack bundle for webview based tree views
 */
export const TREE_VIEWS: Record<MyceliumTreeViewKey, MyceliumViewEntry> = {
  [MyceliumTreeViewKey.SAMPLE_VIEW]: {
    desc: "A view used for prototyping",
    label: "Sample View",
    bundleName: "SampleComponent",
    type: "webview",
  },
  [MyceliumTreeViewKey.TREE_VIEW]: {
    desc: "Tree View",
    label: "Tree View",
    type: "nativeview",
  },
  [MyceliumTreeViewKey.BACKLINKS]: {
    desc: "Shows all backlinks to the currentnote",
    label: "Backlinks",
    type: "nativeview",
  },
  [MyceliumTreeViewKey.CALENDAR_VIEW]: {
    desc: "Calendar View",
    label: "Calendar View",
    type: "webview",
    bundleName: "MyceliumCalendarPanel",
  },
  [MyceliumTreeViewKey.LOOKUP_VIEW]: {
    desc: "Lookup View",
    label: "Lookup View",
    type: "webview",
    bundleName: "MyceliumLookupPanel",
  },
  [MyceliumTreeViewKey.TIP_OF_THE_DAY]: {
    desc: "Feature Showcase",
    label: "Feature Showcase",
    type: "webview",
    bundleName: "MyceliumTipOfTheDay",
  },
  [MyceliumTreeViewKey.RECENT_WORKSPACES]: {
    desc: "Recent Mycelium Workspaces",
    label: "Recent Mycelium Workspaces",
    type: "nativeview",
  },
  [MyceliumTreeViewKey.HELP_AND_FEEDBACK]: {
    desc: "Help and Feedback",
    label: "Help and Feedback",
    type: "nativeview",
  },
  [MyceliumTreeViewKey.GRAPH_PANEL]: {
    desc: "Graph Panel (side)",
    label: "Graph Panel",
    bundleName: "MyceliumSideGraphPanel",
    type: "webview",
  },
};

export const isWebViewEntry = (
  entry: MyceliumViewEntry
): entry is MyceliumWebViewEntry => {
  return entry.type === "webview";
};

export const getWebTreeViewEntry = (
  key: MyceliumTreeViewKey
): MyceliumWebViewEntry => {
  const out = TREE_VIEWS[key];
  if (isWebViewEntry(out)) {
    return out;
  }
  throw ErrorFactory.createInvalidStateError({
    message: `${key} is not valid webview key`,
  });
};

export const getWebEditorViewEntry = (
  key: MyceliumEditorViewKey
): MyceliumWebViewEntry => {
  const out = EDITOR_VIEWS[key];
  if (isWebViewEntry(out)) {
    return out;
  }
  throw ErrorFactory.createInvalidStateError({
    message: `${key} is not valid webview key`,
  });
};

export enum BacklinkPanelSortOrder {
  /** Using path sorted so order with shallow first = true */
  PathNames = "PathNames",

  LastUpdated = "LastUpdated",
}
