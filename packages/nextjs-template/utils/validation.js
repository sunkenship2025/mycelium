const fs = require("fs-extra");
const path = require("path");
const { parse, treeMenuSchema } = require("@myceliumhq/common-all");
const { env } = require('../env/server')

const dataDir = env.DATA_DIR
if (!dataDir) {
  throw new Error("DATA_DIR not set");
}

// check if `tree.json` is formated correctly
const treeInput = fs.readJSONSync(path.join(dataDir, "tree.json"));
const treeMenuResp = parse(treeMenuSchema, treeInput);
if (treeMenuResp.error) {
  throw new Error(
    "The version of `mycelium-cli` you have is out of date and not compatible with the latest nextjs-template. Please upgrade you `mycelium-cli` by running `npm install @mycelium-cli@latest` in the root of your workspace (where your mycelium.yml file is located)."
  );
}
