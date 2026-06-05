#!/usr/bin/env bash

# Watch all packages required for building mycelium repo

echo "watching..."
npx lerna run watch --parallel 
    \ --scope @myceliumhq/common-all 
    \ --scope @myceliumhq/unified
    \ --scope @myceliumhq/common-server 
    \ --scope @myceliumhq/mycelium-viz
    \ --scope @myceliumhq/engine-server 
    \ --scope @myceliumhq/plugin-core 
    \ --scope @myceliumhq/mycelium-cli 
    \ --scope @myceliumhq/pods-core 
    \ --scope @myceliumhq/api-server
    \ --scope @myceliumhq/common-test-utils
    \ --scope @myceliumhq/engine-test-utils
    \ --scope @myceliumhq/bootstrap
