import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import { ResultAsync } from "neverthrow";
import { SchemaUtils } from "../dnode";
import { MyceliumError } from "../error";
import { FuseEngine } from "../FuseEngine";
import {
  NoteChangeEntry,
  NotePropsByIdDict,
  NotePropsMeta,
  SchemaModuleDict,
  SchemaModuleProps,
} from "../types";
import { INoteQueryOpts, IQueryStore } from "./IDataQuery";

export class FuseQueryStore implements IQueryStore {
  fuseEngine: FuseEngine;

  constructor(opts?: { fuzzThreshold: number }) {
    this.fuseEngine = new FuseEngine({
      fuzzThreshold: _.defaults(opts, { fuzzThreshold: 0.2 }).fuzzThreshold,
    });
  }

  addSchemaToIndex(schema: SchemaModuleProps) {
    return ResultAsync.fromPromise(
      Promise.resolve(
        this.fuseEngine.schemaIndex.add(SchemaUtils.getModuleRoot(schema))
      ),
      (err) =>
        new MyceliumError({
          message: "issue adding schema to index",
          innerError: err as Error,
        })
    );
  }

  queryNotes(
    qs: string,
    opts: INoteQueryOpts
  ): ResultAsync<NotePropsMeta[], MyceliumError<StatusCodes | undefined>> {
    const items = this.fuseEngine.queryNote({
      qs,
      ...opts,
    }) as NotePropsMeta[];
    return ResultAsync.fromSafePromise(Promise.resolve(items));
  }

  querySchemas(
    qs: string
  ): ResultAsync<{ id: string }[], MyceliumError<StatusCodes | undefined>> {
    const schemaIds = this.fuseEngine.querySchema({ qs });
    return ResultAsync.fromSafePromise(Promise.resolve(schemaIds));
  }

  removeSchemaFromIndex(
    schema: SchemaModuleProps
  ): ResultAsync<void, MyceliumError> {
    this.fuseEngine.removeSchemaFromIndex(schema);
    return ResultAsync.fromSafePromise(Promise.resolve());
  }

  replaceNotesIndex(props: NotePropsByIdDict): ResultAsync<void, MyceliumError> {
    return ResultAsync.fromPromise(
      this.fuseEngine.replaceNotesIndex(props),
      (err) =>
        new MyceliumError({
          message: "issue replacing index",
          innerError: err as Error,
        })
    );
  }

  replaceSchemasIndex(
    props: SchemaModuleDict
  ): ResultAsync<void, MyceliumError> {
    return ResultAsync.fromPromise(
      this.fuseEngine.replaceSchemaIndex(props),
      (err) =>
        new MyceliumError({
          message: "issue replacing index",
          innerError: err as Error,
        })
    );
  }

  updateNotesIndex(
    changes: NoteChangeEntry[]
  ): ResultAsync<void, MyceliumError> {
    return ResultAsync.fromPromise(
      // return signature requires us to return void vs void[]
      this.fuseEngine.updateNotesIndex(changes).then(() => {}),
      (err) =>
        new MyceliumError({
          message: "issue updating index",
          innerError: err as Error,
        })
    );
  }
  updateSchemasIndex(): ResultAsync<
    void,
    MyceliumError<StatusCodes | undefined>
  > {
    throw new Error("Method not implemented.");
  }
}
