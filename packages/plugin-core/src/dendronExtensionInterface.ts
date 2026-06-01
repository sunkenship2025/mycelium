import {
  DefaultMap,
  DWorkspaceV2,
  WorkspaceSettings,
  WorkspaceType,
} from "@myceliumhq/common-all";
import { execa, IWorkspaceService } from "@myceliumhq/engine-server";
import vscode, { CommentController } from "vscode";
import { ILookupControllerV3Factory } from "./components/lookup/LookupControllerV3Interface";
import {
  INoteLookupProviderFactory,
  ISchemaLookupProviderFactory,
} from "./components/lookup/LookupProviderV3Interface";
import { FileWatcher } from "./fileWatcher";
import { IEngineAPIService } from "./services/EngineAPIServiceInterface";
import { NoteTraitService } from "./services/NoteTraitService";
import { ISchemaSyncService } from "./services/SchemaSyncServiceInterface";
import { IWSUtilsV2 } from "./WSUtilsV2Interface";

export type MyceliumWorkspaceSettings = Partial<{
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
}>;

/**
 * This is THE interface of MyceliumExtension.
 *
 * Going forward we should NOT be using MyceliumExtension object directly
 * (Eg. avoid using workspace.getExtension()).
 *
 * A very large amount of our application will require to take dependency on this
 * interface hence it is paramount that it is kept away from any circular dependencies
 * to accomplish that goal this interface should for the most part deal with interfaces
 * (so think thrice prior to exposing a concrete class from this interface, since
 * concrete classes tend to take on dependencies on other concrete classes).
 *
 * For most of the usage of this interface we should strive to get an instance of this
 * interface through constructor dependency injection. However, during transition
 * to constructor injection if we need to get this instance in a static fashion then
 * use ExtensionProvider class.
 * */
export interface IMyceliumExtension {
  port?: number;
  /**
   * If set, the server sub process that spawned the engine
   */
  serverProcess?: execa.ExecaChildProcess<string>;
  context: vscode.ExtensionContext;
  serverWatcher?: vscode.FileSystemWatcher;
  fileWatcher?: FileWatcher;
  type: WorkspaceType;
  wsUtils: IWSUtilsV2;
  schemaSyncService: ISchemaSyncService;
  workspaceService?: IWorkspaceService;

  lookupControllerFactory: ILookupControllerV3Factory;
  noteLookupProviderFactory: INoteLookupProviderFactory;
  schemaLookupProviderFactory: ISchemaLookupProviderFactory;
  workspaceImpl?: DWorkspaceV2;
  noteRefCommentController: CommentController;

  activateWatchers(): Promise<void>;
  /**
   * This will deactivate the entire Mycelium Extension. Takes care of disposing of all resources that Mycelium has created
   */
  deactivate(): Promise<void>;
  pauseWatchers<T = void>(cb: () => Promise<T>): Promise<T>;

  getClientAPIRootUrl(): Promise<string>;
  getCommentThreadsState(): {
    inlineNoteRefs: DefaultMap<string, Map<string, vscode.CommentThread>>;
  };

  /** Shorthand for previously existing function getWorkspaceImplOrThrow() */
  getDWorkspace(): DWorkspaceV2;

  getWorkspaceImplOrThrow(): DWorkspaceV2;

  /** For Native workspaces (without .code-workspace file) this will return undefined. */
  getWorkspaceSettings(): Promise<WorkspaceSettings | undefined>;

  getWorkspaceSettingsSync(): WorkspaceSettings | undefined;

  getMyceliumWorkspaceSettingsSync(): MyceliumWorkspaceSettings | undefined;

  getWorkspaceSettingOrDefault({
    wsConfigKey,
    myceliumConfigKey,
  }: {
    wsConfigKey: keyof MyceliumWorkspaceSettings;
    myceliumConfigKey: string;
  }): any;

  setupViews(context: vscode.ExtensionContext): Promise<void>;

  addDisposable(disposable: vscode.Disposable): void;

  getEngine(): IEngineAPIService;
  setEngine(svc: IEngineAPIService): void;

  /**
   * Checks if a Mycelium workspace is currently active.
   */
  isActive(): boolean;

  /**
   * Checks if a Mycelium workspace is currently active and that the current {@link fpath} is a valid Mycelium Note
   * @param fpath: full path to current file
   */
  isActiveAndIsMyceliumNote(fpath: string): Promise<boolean>;

  /**
   * @deprecated Use {@link VSCodeUtils.getWorkspaceConfig} instead.
   *
   * There is no need to read the configuration from the extension, it doesn't depend on the extension itself.
   */
  getWorkspaceConfig(
    section?: string | undefined
  ): vscode.WorkspaceConfiguration;

  /**
   * Gets an instance of the trait Registrar service, which contains information
   * about registered Note Traits
   */
  get traitRegistrar(): NoteTraitService;

  /**
   * Directory in which pod configs are located
   */
  get podsDir(): string;
}
