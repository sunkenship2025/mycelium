#!/bin/bash

echo "updating pkg"
rm ../../package.json
sed  -ibak 's/@myceliumhq.plugin-core/mycelium/' package.json
sed  -ibak 's/out\/src\/extension/dist\/extension/' package.json

cat package.json | jq '.repository = { "url": "https://github.com/myceliumhq/mycelium.git", "type": "git" }' > tmp.json
mv tmp.json package.json