import { ResultAsync } from "neverthrow";
import {
  MyceliumError,
  NoteChangeEntry,
  NotePropsByIdDict,
  NotePropsMeta,
  SchemaModuleDict,
  SchemaModuleProps,
} from "..";

export type INoteQueryOpts = {
  /**
   * Original query string (which can contain minor modifications such as mapping '/'->'.')
   * This string is added for sorting the lookup results when there is exact match with
   * original query. */
  originalQS: string;
  onlyDirectChildren?: boolean;
};

export interface IQueryStore {
  queryNotes(
    qs: string,
    opts: INoteQueryOpts
  ): ResultAsync<NotePropsMeta[], MyceliumError>;
  querySchemas(
    qs: string,
    opts?: INoteQueryOpts
  ): ResultAsync<{ id: string }[], MyceliumError>;
  updateNotesIndex(changes: NoteChangeEntry[]): ResultAsync<void, MyceliumError>;
  updateSchemasIndex(): ResultAsync<void, MyceliumError>;
  replaceNotesIndex(props: NotePropsByIdDict): ResultAsync<void, MyceliumError>;
  replaceSchemasIndex(props: SchemaModuleDict): ResultAsync<void, MyceliumError>;

  removeSchemaFromIndex(
    schema: SchemaModuleProps
  ): ResultAsync<void, MyceliumError>;

  addSchemaToIndex(schema: SchemaModuleProps): ResultAsync<void, MyceliumError>;
}
