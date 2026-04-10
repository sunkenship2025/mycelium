import { NotesCache, NotesCacheEntry } from "@myceliumhq/common-all";
import _ from "lodash";
import { MyceliumFileSystemCache } from "./myceliumFileSystemCache";

export class NotesFileSystemCache extends MyceliumFileSystemCache<
  NotesCache,
  NotesCacheEntry
> {
  get(key: string): NotesCacheEntry | undefined {
    return this._cacheContents.notes[key];
  }

  set(key: string, value: NotesCacheEntry): void {
    this._cacheContents.notes[key] = value;
  }

  drop(key: string): void {
    delete this._cacheContents.notes[key];
  }

  getCacheEntryKeys(): Set<string> {
    return new Set(_.keys(this._cacheContents.notes));
  }

  createEmptyCacheContents(): NotesCache {
    return { version: 0, notes: {} };
  }
}
