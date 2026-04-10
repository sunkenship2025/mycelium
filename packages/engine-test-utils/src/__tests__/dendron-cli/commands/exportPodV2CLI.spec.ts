import { writeYAML } from "@myceliumhq/common-server";
import { ExportPodV2CLICommand } from "@myceliumhq/mycelium-cli";
import {
  ExternalService,
  PodExportScope,
  PodUtils,
  PodV2Types,
} from "@myceliumhq/pods-core";
import { runEngineTestV5 } from "../../..";
import fs from "fs-extra";
import { ERROR_SEVERITY, Time } from "@myceliumhq/common-all";
import path from "path";

/**
 * Export Pod V2
 */

// mycelium exportPodV2 --podId  mycelium.markdown
describe("GIVEN export pod V2 is run ", () => {
  describe("WHEN enrichPodArgs and --podId is used ", () => {
    test("THEN podArgs are enriched", async () => {
      await runEngineTestV5(
        async ({ wsRoot }) => {
          const podId = "mycelium.markdown";
          const configPath = PodUtils.getCustomConfigPath({ wsRoot, podId });
          await fs.ensureDir(path.dirname(configPath));
          writeYAML(configPath, {
            exportScope: "Workspace",
            podType: PodV2Types.MarkdownExportV2,
            destination: "workspace-exp",
          });
          const cmd = new ExportPodV2CLICommand();
          const resp = await cmd.enrichArgs({
            wsRoot,
            podId,
          });
          expect(resp.data?.config.podType).toEqual(
            PodV2Types.MarkdownExportV2
          );
          expect(resp.data?.config.exportScope).toEqual(
            PodExportScope.Workspace
          );
          return;
        },
        { expect }
      );
    });
  });

  // mycelium exportPodV2 --inlineConfig Key=podType,Value=MarkdownExport Key=exportScope,Value=Note Key=destination,Value=note-exp
  describe("WHEN only --inlineConfig is given and exportScope is Note", () => {
    test("THEN podArgs are enriched", async () => {
      await runEngineTestV5(
        async ({ wsRoot }) => {
          const cmd = new ExportPodV2CLICommand();
          const resp = await cmd.enrichArgs({
            wsRoot,
            inlineConfig: [
              "Key=podType,Value=MarkdownExportV2",
              "Key=exportScope,Value=Note",
              "Key=destination,Value=clipboard",
            ],
            fname: "root",
            vault: "vault1",
          });
          expect(resp.data?.config.podType).toEqual(
            PodV2Types.MarkdownExportV2
          );
          expect(resp.data?.config.exportScope).toEqual(PodExportScope.Note);
          return;
        },
        { expect }
      );
    });
  });

  // mycelium exportPodV2
  describe("WHEN no config is given", () => {
    test("THEN error must be thrown", async () => {
      await runEngineTestV5(
        async ({ wsRoot }) => {
          const cmd = new ExportPodV2CLICommand();
          const resp = await cmd.enrichArgs({
            wsRoot,
          });
          expect(resp.error?.severity).toEqual(ERROR_SEVERITY.FATAL);
          expect(resp.error?.message).toEqual(
            "no pod config found. Please provide a pod config or inline config"
          );
          return;
        },
        { expect }
      );
    });
  });

  // mycelium exportPodV2 --inlineConfig Key=exportScope,Value=Vault --podId mycelium.markdown
  describe("WHEN both --podId and --inlineConfig is given", () => {
    test("THEN inlineConfig values should be of higher precedence", async () => {
      await runEngineTestV5(
        async ({ wsRoot }) => {
          const cmd = new ExportPodV2CLICommand();
          const podId = "mycelium.markdown";
          const configPath = PodUtils.getCustomConfigPath({ wsRoot, podId });
          await fs.ensureDir(path.dirname(configPath));
          writeYAML(configPath, {
            exportScope: "Workspace",
            podType: PodV2Types.MarkdownExportV2,
            destination: "workspace-exp",
          });
          const resp = await cmd.enrichArgs({
            wsRoot,
            inlineConfig: ["Key=exportScope,Value=Vault"],
            podId,
            vault: "vault1",
          });
          expect(resp.data?.config.exportScope).toEqual(PodExportScope.Vault);
          expect(resp.data?.config.destination).toEqual("workspace-exp");
          return;
        },
        { expect }
      );
    });
  });

  // mycelium exportPodV2 --podId mycelium.gdoc
  describe("WHEN custom config has a connectionId is given", () => {
    test("THEN pod args are enriched with service connection values", async () => {
      await runEngineTestV5(
        async ({ wsRoot }) => {
          const cmd = new ExportPodV2CLICommand();
          const podId = "mycelium.gdoc";
          const connectionId = "gdoc-main";
          const configPath = PodUtils.getCustomConfigPath({ wsRoot, podId });
          const svcCongingPath = PodUtils.getServiceConfigPath({
            wsRoot,
            connectionId,
          });
          await fs.ensureDir(path.dirname(configPath));
          await fs.ensureDir(path.dirname(svcCongingPath));
          writeYAML(configPath, {
            exportScope: "Workspace",
            podType: PodV2Types.GoogleDocsExportV2,
            connectionId,
          });
          writeYAML(svcCongingPath, {
            accessToken: "test",
            refreshToken: "refresh",
            expirationTime: Time.now(),
            serviceType: ExternalService.GoogleDocs,
          });
          const resp = await cmd.enrichArgs({
            wsRoot,
            podId,
          });
          expect(resp.data?.config.accessToken).toEqual("test");
          expect(resp.data?.config.podType).toEqual(
            PodV2Types.GoogleDocsExportV2
          );
          return;
        },
        { expect }
      );
    });
  });

  // mycelium exportPodV2 --podId mycelium.foo
  describe("WHEN invalid podId is given", () => {
    test("THEN error must be thrown", async () => {
      await runEngineTestV5(
        async ({ wsRoot }) => {
          const cmd = new ExportPodV2CLICommand();
          const podId = "mycelium.foo";
          const configPath = PodUtils.getCustomConfigPath({ wsRoot, podId });
          await fs.ensureDir(path.dirname(configPath));
          const resp = await cmd.enrichArgs({
            wsRoot,
            inlineConfig: ["Key=exportScope,Value=Vault"],
            podId,
            vault: "vault1",
          });
          expect(resp.error?.severity).toEqual(ERROR_SEVERITY.FATAL);
          expect(resp.error?.message).toEqual(
            `no pod config found for this podId. Please create a pod config at ${configPath}`
          );
          return;
        },
        { expect }
      );
    });
  });
});
