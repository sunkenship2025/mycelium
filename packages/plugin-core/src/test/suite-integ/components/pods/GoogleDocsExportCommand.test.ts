import { PodExportScope } from "@myceliumhq/pods-core";
import { describe } from "mocha";
import * as vscode from "vscode";
import { expect } from "../../../testUtilsv2";
import { describeSingleWS } from "../../../testUtilsV3";
import { MyceliumError, ErrorFactory } from "@myceliumhq/common-all";
import { GoogleDocsExportPodCommand } from "../../../../commands/pods/GoogleDocsExportPodCommand";
import { vault2Path } from "@myceliumhq/common-server";
import path from "path";
import { ExtensionProvider } from "../../../../ExtensionProvider";
import { VSCodeUtils } from "../../../../vsCodeUtils";

suite("GoogleDocsExportPodCommand", function () {
  describe("GIVEN a GoogleDocsExportPodCommand is ran with Note scope", () => {
    describeSingleWS("WHEN there is an error in response", {}, () => {
      test("THEN error message must be displayed", async () => {
        const cmd = new GoogleDocsExportPodCommand(
          ExtensionProvider.getExtension()
        );
        const { wsRoot, vaults } = ExtensionProvider.getDWorkspace();
        const notePath = path.join(
          vault2Path({ vault: vaults[0], wsRoot }),
          "root.md"
        );
        await VSCodeUtils.openFileInEditor(vscode.Uri.file(notePath));
        const payload = await cmd.enrichInputs({
          exportScope: PodExportScope.Note,
          accessToken: "test",
          refreshToken: "test",
          expirationTime: 1234,
          connectionId: "gdoc",
        });
        const result = {
          data: {
            created: [],
            updated: [],
          },
          error: new MyceliumError({
            status: "401",
            message: "Request failed with status code 401",
          }),
        };
        const resp = await cmd.onExportComplete({
          exportReturnValue: result,
          payload: payload?.payload!,
          config: payload?.config!,
        });
        expect(resp).toEqual(
          `Finished GoogleDocs Export. 0 docs created; 0 docs updated. Error encountered: ${ErrorFactory.safeStringify(
            result.error?.message
          )}`
        );
      });
    });
  });
});
