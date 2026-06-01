import assert from "assert";
import { getSiteIndex } from "../../../injection-providers/getSiteIndex";
import { WorkspaceHelpers } from "../../helpers/WorkspaceHelpers";

suite("GIVEN a workspace folder", () => {
  test("WHEN siteIndex is present in mycelium.yml THEN return correct value", async () => {
    const wsRoot = await WorkspaceHelpers.getWSRootForTest();

    const config = {
      publishing: {
        siteIndex: "mycelium",
      },
    };

    await WorkspaceHelpers.createTestYAMLConfigFile(wsRoot, config);
    const siteIndex = await getSiteIndex(wsRoot);

    assert.strictEqual(siteIndex, "mycelium");
  });
  test("WHEN siteIndex is not present in mycelium.yml THEN return the first value from siteHierarchies array", async () => {
    const wsRoot = await WorkspaceHelpers.getWSRootForTest();

    const config = {
      publishing: {
        siteHierarchies: ["root"],
      },
    };

    await WorkspaceHelpers.createTestYAMLConfigFile(wsRoot, config);
    const siteIndex = await getSiteIndex(wsRoot);

    assert.strictEqual(siteIndex, "root");
  });
});
