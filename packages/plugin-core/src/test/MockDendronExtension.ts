import {
  DefaultMap,
  DEngineClient,
  DVault,
  DWorkspaceV2,
  WorkspaceSettings,
  WorkspaceType,
} from "@myceliumhq/common-all";
import { IWorkspaceService, WorkspaceService } from "@myceliumhq/engine-server";
import {
  CommentController,
  CommentThread,
  Disposable,
  ExtensionContext,
  FileSystemWatcher,
  WorkspaceConfiguration,
} from "vscode";
import { ILookupControllerV3Factory } from "../components/lookup/LookupControllerV3Interface";
import {
  INoteLookupProviderFactory,
  ISchemaLookupProviderFactory,
} from "../components/lookup/LookupProviderV3Interface";
import { IMyceliumExtension } from "../myceliumExtensionInterface";
import { FileWatcher } from "../fileWatcher";
import { EngineAPIService } from "../services/EngineAPIService";
import { IEngineAPIService } from "../services/EngineAPIServiceInterface";
import { NoteTraitService } from "../services/NoteTraitService";
import { ISchemaSyncService } from "../services/SchemaSyncServiceInterface";
import { WSUtilsV2 } from "../WSUtilsV2";
import { IWSUtilsV2 } from "../WSUtilsV2Interface";

/**
 * Mock version of IMyceliumExtension for testing purposes. If you require additional
 * functionality for your tests, either add it here, or extend this class for
 * your own testing scenario
 */
export class MockMyceliumExtension implements IMyceliumExtension {
  private _engine: DEngineClient | undefined;
  private _context: ExtensionContext | undefined;
  private _wsRoot: string | undefined;
  private _vaults: DVault[] | undefined;
  noteRefCommentController: CommentController;

  constructor({
    engine,
    wsRoot,
    context,
    vaults,
  }: {
    engine?: DEngineClient;
    wsRoot?: string;
    context?: ExtensionContext;
    vaults?: DVault[];
  }) {
    this._engine = engine;
    this._context = context;
    this._wsRoot = wsRoot;
    this._vaults = vaults;
    this.noteRefCommentController = {} as CommentController;
  }
  get podsDir(): string {
    throw new Error("Method not implemented.");
  }
  get traitRegistrar(): NoteTraitService {
    throw new Error("Method not implemented.");
  }
  serverProcess?: undefined;
  setEngine(_svc: EngineAPIService): void {
    throw new Error("Method not implemented.");
  }
  fileWatcher?: FileWatcher | undefined;
  workspaceImpl?: DWorkspaceV2 | undefined;

  port?: number | undefined;
  get context(): ExtensionContext {
    if (!this._context) {
      throw new Error("Context not initialized in MockMyceliumExtension");
    }
    return this._context;
  }

  serverWatcher?: FileSystemWatcher | undefined;

  get type(): WorkspaceType {
    throw new Error("Method not implemented in MockMyceliumExtension");
  }

  getCommentThreadsState(): {
    inlineNoteRefs: DefaultMap<string, Map<string, CommentThread>>;
  } {
    throw new Error("Method not implemented in MockMyceliumExtension.");
  }

  get wsUtils(): IWSUtilsV2 {
    return new WSUtilsV2(this);
  }
  get schemaSyncService(): ISchemaSyncService {
    throw new Error("Method not implemented in MockMyceliumExtension");
  }
  get workspaceService(): IWorkspaceService | undefined {
    if (!this._wsRoot) {
      throw new Error("WSRoot not initialized in MockMyceliumExtension");
    }
    return new WorkspaceService({
      wsRoot: this._wsRoot,
    });
  }
  get lookupControllerFactory(): ILookupControllerV3Factory {
    throw new Error("Method not implemented in MockMyceliumExtension");
  }
  get noteLookupProviderFactory(): INoteLookupProviderFactory {
    throw new Error("Method not implemented in MockMyceliumExtension");
  }

  get schemaLookupProviderFactory(): ISchemaLookupProviderFactory {
    throw new Error("Method not implemented in MockMyceliumExtension.");
  }

  async activateWatchers(): Promise<void> {
    return;
  }

  async deactivate(): Promise<void> {
    return;
  }

  /**
   * Note: No-Op
   * @param _cb
   * @returns
   */
  pauseWatchers<T = void>(cb: () => Promise<T>): Promise<T> {
    return cb();
  }

  getClientAPIRootUrl(): Promise<string> {
    throw new Error("Method not implemented in MockMyceliumExtension.");
  }
  getDWorkspace(): DWorkspaceV2 {
    const ret: any = {
      wsRoot: this._wsRoot,
      vaults: this._vaults,
    };

    return ret;
  }
  getWorkspaceImplOrThrow(): DWorkspaceV2 {
    throw new Error("Method not implemented in MockMyceliumExtension.");
  }
  getWorkspaceSettings(): Promise<WorkspaceSettings | undefined> {
    throw new Error("Method not implemented in MockMyceliumExtension.");
  }
  getWorkspaceSettingsSync(): WorkspaceSettings | undefined {
    throw new Error("Method not implemented in MockMyceliumExtension.");
  }
  getMyceliumWorkspaceSettingsSync():
    | Partial<{
        "mycelium.dailyJournalDomain": string;
        "mycelium.defaultJournalName": string;
        "mycelium.defaultJournalDateFormat": string;
        "mycelium.defaultJournalAddBehavior": string;
        "mycelium.defaultScratchName": string;
        "mycelium.defaultScratchDateFormat": string;
        "mycelium.defaultScratchAddBehavior": string;
        "mycelium.copyNoteUrlRoot": string;
        "mycelium.linkSelectAutoTitleBehavior": string;
        "mycelium.defaultLookupCreateBehavior": string;
        "mycelium.defaultTimestampDecorationFormat": string;
        "mycelium.rootDir": string;
        "mycelium.myceliumDir": string;
        "mycelium.logLevel": string;
        "mycelium.trace.server": string;
        "mycelium.serverPort": string;
      }>
    | undefined {
    throw new Error("Method not implemented in MockMyceliumExtension.");
  }
  getWorkspaceSettingOrDefault() {
    throw new Error("Method not implemented in MockMyceliumExtension.");
  }
  setupViews(_context: ExtensionContext): Promise<void> {
    throw new Error("Method not implemented in MockMyceliumExtension.");
  }
  addDisposable(_disposable: Disposable): void {
    this._context?.subscriptions.push(_disposable);
  }

  /**
   * Note: trustedWorkspace is omitted
   * @returns
   */
  getEngine(): IEngineAPIService {
    if (!this._engine) {
      throw new Error("Engine not initialized in MockMyceliumExtension");
    }
    return this._engine as IEngineAPIService;
  }

  isActive(): boolean {
    return true;
  }

  async isActiveAndIsMyceliumNote(_fpath: string): Promise<boolean> {
    throw new Error("not implemented");
  }

  getWorkspaceConfig(): WorkspaceConfiguration {
    // TODO: the old implementation of this was wrong - it did not return WorkspaceConfiguration but a WorkspaceSettings object
    // since this doesn't seem to be used, just adding an exception here for future work
    throw Error("not implemented");
  }
}
