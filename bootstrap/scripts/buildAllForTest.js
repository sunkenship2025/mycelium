/* eslint-disable no-console */

/**
 * Compiles all code for Mycelium Plugin
 */

const execa = require("execa");

const $ = (cmd) => {
  console.log(`$ ${cmd}`);
  return execa.commandSync(cmd, { stdout: process.stdout, buffer: false });
};

const TEST_NEXT_TEMPLATE = process.env.TEST_NEXT_TEMPLATE;

console.log("build all...");
$(`npx lerna run buildCI --scope @myceliumhq/common-all`);
$(
  `npx lerna run build --parallel --scope "@myceliumhq/{unified,common-server}"`
);
$(`npx lerna run buildCI --scope @myceliumhq/mycelium-viz `);
$(`npx lerna run buildCI --scope @myceliumhq/engine-server `);
$(`npx lerna run buildCI --scope @myceliumhq/pods-core `);
if (TEST_NEXT_TEMPLATE) {
  $(
    `npx lerna run buildCI --parallel --scope "@myceliumhq/{common-test-utils,api-server,common-assets}"`
  );
} else {
  $(
    `npx lerna run buildCI --parallel --scope "@myceliumhq/{common-test-utils,api-server}"`
  );
}
$(
  `npx lerna run buildCI --parallel --scope "@myceliumhq/{common-frontend,mycelium-cli}"`
);

$(`npx lerna run buildCI --scope "@myceliumhq/engine-test-utils"`);

$(`npx lerna run buildCI --scope "@myceliumhq/plugin-core"`);

if (TEST_NEXT_TEMPLATE) {
  $(`npx lerna run build --scope "@myceliumhq/mycelium-plugin-views"`);
  $(`npx yarn mycelium dev sync_assets --fast`);
}
console.log("done");
