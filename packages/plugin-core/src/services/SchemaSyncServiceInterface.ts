import { WriteSchemaResp } from "@myceliumhq/common-all";
import vscode, { Uri } from "vscode";

/**
 * Interface for schema sync service to get instance of its implementation
 * refer to IMyceliumExtension interface.
 * */
export interface ISchemaSyncService {
  onDidSave({ document }: { document: vscode.TextDocument }): Promise<void>;

  saveSchema({
    uri,
    isBrandNewFile,
  }: {
    uri: Uri;
    isBrandNewFile?: boolean;
  }): Promise<WriteSchemaResp[] | undefined>;
}
