import {
  APIUtils,
  MyceliumAPI,
  MyceliumError,
  error2PlainObject,
  ThemeTarget,
  ThemeType,
  WorkspaceOpts,
} from "@myceliumhq/common-all";
import { tmpDir, vault2Path } from "@myceliumhq/common-server";
import path from "path";
import { createServer, runEngineTestV5 } from "../../engine";
import { ENGINE_HOOKS } from "../../presets";
import { checkFile, checkString } from "../../utils";

async function initRemoteWorkspace({
  wsRoot,
  vaults,
  api,
}: WorkspaceOpts & { api: MyceliumAPI }) {
  const payload = {
    uri: wsRoot,
    config: {
      vaults,
    },
  };
  const resp = await api.workspaceInit(payload);
  return resp;
}

describe("assets/get", () => {
  test("fail: asset not in workspace", async () => {
    await runEngineTestV5(
      async ({ wsRoot, vaults }) => {
        const { port } = await createServer({ wsRoot, vaults });
        const api = new MyceliumAPI({
          endpoint: APIUtils.getLocalEndpoint(port),
          apiPath: "api",
        });
        await initRemoteWorkspace({ wsRoot, vaults, api });
        const fpath = tmpDir().name;
        const resp = await api.assetGet({ fpath, ws: wsRoot });
        await checkString((resp as MyceliumError).message, "not inside a vault");
      },
      { expect }
    );
  });

  test("fail: path not exist", async () => {
    await runEngineTestV5(
      async ({ wsRoot, vaults }) => {
        const { port } = await createServer({ wsRoot, vaults });
        const api = new MyceliumAPI({
          endpoint: APIUtils.getLocalEndpoint(port),
          apiPath: "api",
        });
        await initRemoteWorkspace({ wsRoot, vaults, api });
        const vpath = vault2Path({ vault: vaults[0], wsRoot });
        const fpath = path.join(vpath, "not-exist.md");
        const resp = await api.assetGet({ fpath, ws: wsRoot });
        await checkString((resp as MyceliumError).message, "does not exist");
      },
      { expect, preSetupHook: ENGINE_HOOKS.setupBasic }
    );
  });

  test("ok", async () => {
    await runEngineTestV5(
      async ({ wsRoot, vaults }) => {
        const { port } = await createServer({ wsRoot, vaults });
        const api = new MyceliumAPI({
          endpoint: APIUtils.getLocalEndpoint(port),
          apiPath: "api",
        });
        await initRemoteWorkspace({ wsRoot, vaults, api });
        const vpath = vault2Path({ vault: vaults[0], wsRoot });
        const fpath = path.join(vpath, "foo.md");
        const resp = await api.assetGet({ fpath, ws: wsRoot });
        await checkFile({ fpath }, resp as unknown as string);
      },
      { expect, preSetupHook: ENGINE_HOOKS.setupBasic }
    );
  });
});

describe("assets/theme/get", () => {
  test("ok: dark theme", async () => {
    await runEngineTestV5(
      async ({ wsRoot, vaults }) => {
        const { port } = await createServer({ wsRoot, vaults });
        const api = new MyceliumAPI({
          endpoint: APIUtils.getLocalEndpoint(port),
          apiPath: "api",
        });
        await initRemoteWorkspace({ wsRoot, vaults, api });
        const resp = await api.assetGetTheme({
          ws: wsRoot,
          themeTarget: ThemeTarget.PRISM,
          themeType: ThemeType.DARK,
        });
        // TODO: log to figure out why integ test is failing
        if (resp instanceof MyceliumError) {
          console.log(error2PlainObject(resp));
        }
        await checkString(resp as unknown as string, "tomorrow night");
      },
      { expect }
    );
  });

  test("ok: light theme", async () => {
    await runEngineTestV5(
      async ({ wsRoot, vaults }) => {
        const { port } = await createServer({ wsRoot, vaults });
        const api = new MyceliumAPI({
          endpoint: APIUtils.getLocalEndpoint(port),
          apiPath: "api",
        });
        await initRemoteWorkspace({ wsRoot, vaults, api });
        const resp = await api.assetGetTheme({
          ws: wsRoot,
          themeTarget: ThemeTarget.PRISM,
          themeType: ThemeType.LIGHT,
        });
        await checkString(resp as unknown as string, "default theme");
      },
      { expect }
    );
  });
});
