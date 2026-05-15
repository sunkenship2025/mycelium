import { DVault, NoteProps, NotePropsByIdDict } from "@myceliumhq/common-all";
import _ from "lodash";
import { MyceliumRouterProps } from "./hooks";

declare global {
  interface Window {
    CommandBar: any;
  }
}

export type NoteData = {
  /**
   * All notes that are published
   */
  notes: NotePropsByIdDict;
  /**
   * All top level domains that are published
   */
  domains: NoteProps[];
  /**
   * The note for the home page
   */
  noteIndex: NoteProps;
  vaults: DVault[];
};

export type MyceliumCommonProps = Partial<NoteData> & {
  myceliumRouter: MyceliumRouterProps;
  note?: NoteProps;
};
export type MyceliumPageWithNoteDataProps = NoteData & MyceliumCommonProps;

export function verifyNoteData(
  noteData: Partial<NoteData>
): noteData is NoteData {
  const { notes } = noteData;
  return !(_.isUndefined(notes) || _.isEmpty(notes) || _.isUndefined(notes));
}
