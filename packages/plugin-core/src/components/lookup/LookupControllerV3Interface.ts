import { DNodeType } from "@myceliumhq/common-all";
import { CancellationTokenSource } from "vscode";
import { MyceliumBtn } from "./ButtonTypes";
import { ILookupProviderV3 } from "./LookupProviderV3Interface";
import { MyceliumQuickPickerV2 } from "./types";

export type CreateQuickPickOpts = {
  title?: string;
  placeholder: string;
  /**
   * QuickPick.ignoreFocusOut prop
   */
  ignoreFocusOut?: boolean;
  /**
   * Initial value for quickpick
   */
  initialValue?: string;
  nonInteractive?: boolean;
  /**
   * See {@link MyceliumQuickPickerV2["alwaysShow"]}
   */
  alwaysShow?: boolean;
  /**
   * if canSelectMany and items from selection, select all items at creation
   */
  selectAll?: boolean;
};

export type PrepareQuickPickOpts = CreateQuickPickOpts & {
  provider: ILookupProviderV3;
  onDidHide?: () => void;
};

export type ShowQuickPickOpts = {
  quickpick: MyceliumQuickPickerV2;
  provider: ILookupProviderV3;
  nonInteractive?: boolean;
  fuzzThreshold?: number;
};

export interface ILookupControllerV3 {
  readonly quickPick: MyceliumQuickPickerV2;

  fuzzThreshold: number;

  readonly cancelToken: CancellationTokenSource;

  nodeType: DNodeType;

  readonly provider: ILookupProviderV3;

  /**
   * Wire up quickpick and initialize buttons
   */
  prepareQuickPick(
    opts: PrepareQuickPickOpts
  ): Promise<{ quickpick: MyceliumQuickPickerV2 }>;

  showQuickPick(opts: ShowQuickPickOpts): Promise<MyceliumQuickPickerV2>;

  onHide(): void;

  show(
    opts: CreateQuickPickOpts & {
      /**
       * Don't show quickpick
       */
      nonInteractive?: boolean;
      /**
       * Initial value for quickpick
       */
      initialValue?: string;
      provider: ILookupProviderV3;
    }
  ): Promise<MyceliumQuickPickerV2>;

  createCancelSource(): CancellationTokenSource;

  /**
   * Indicates that the journal button is pressed
   *
   * @deprecated - this is a temp solution; remove from interface once there's a
   * better way to trigger journal button functionality
   */
  isJournalButtonPressed(): boolean;
}

export interface ILookupControllerV3Factory {
  create(opts?: LookupControllerV3CreateOpts): ILookupControllerV3;
}

export type LookupControllerV3CreateOpts = {
  /**
   * Node type
   */
  nodeType: string;
  /**
   * Replace default buttons
   */
  buttons?: MyceliumBtn[];
  /**
   * When true, don't enable vault selection
   */
  disableVaultSelection?: boolean;
  /**
   * if vault selection isn't disabled,
   * press button on init if true
   */
  vaultButtonPressed?: boolean;
  /** If vault selection isn't disabled, allow choosing the mode of selection.
   *  Defaults to true. */
  vaultSelectCanToggle?: boolean;
  /**
   * Additional buttons
   */
  extraButtons?: MyceliumBtn[];
  /**
   * 0.0 = exact match
   * 1.0 = match anything
   */
  fuzzThreshold?: number;
  /**
   * enable lookup view - false by default or if undefined
   */
  enableLookupView?: boolean;
  /**
   * optional custom title of quickpic
   */
  title?: string;
};
