/* eslint-disable no-console */

/**
 * Compiles all code for Mycelium Plugin
 */

const execa = require("execa");

const $ = (cmd) => {
  console.log(`$ ${cmd}`);
  return execa.commandSync(cmd, { stdout: process.stdout, buffer: false });
};

console.log("building all...");
$(`npx lerna run build --scope @myceliumhq/common-all`);
$(
  `npx lerna run build --parallel --scope "@myceliumhq/{unified,common-server}"`
);
$(`npx lerna run build --scope @myceliumhq/mycelium-viz `);
$(`npx lerna run build --scope @myceliumhq/engine-server `);
$(`npx lerna run build --scope @myceliumhq/pods-core `);
$(
  `npx lerna run build --parallel --scope "@myceliumhq/{common-test-utils,api-server,common-assets}"`
);
$(
  `npx lerna run build --parallel --scope "@myceliumhq/{common-frontend,mycelium-cli}"`
);
$(`npx lerna run build --scope "@myceliumhq/engine-test-utils"`);
$(`npx lerna run build --scope "@myceliumhq/mycelium-plugin-views"`);
$(`npx lerna run build --scope "@myceliumhq/plugin-core"`);
$(`npx yarn mycelium dev sync_assets --fast`);
console.log("done");
