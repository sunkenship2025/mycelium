import { DEngine } from "./typesv2";

/**
 * Subset of DEngine capabilities designed to support Mycelium as a Web Extension
 */
export type ReducedDEngine = Pick<
  DEngine,
  | "wsRoot"
  | "getNote"
  | "getNoteMeta"
  | "bulkGetNotes"
  | "bulkGetNotesMeta"
  | "findNotes"
  | "findNotesMeta"
  | "deleteNote"
  | "bulkWriteNotes"
  | "writeNote"
  | "renameNote"
  | "queryNotes"
>;
