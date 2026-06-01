#!/bin/bash
[[ ! -d "reports" ]] && mkdir reports
cd reports && awesome_bot ../CHANGELOG.md --allow-redirect --allow-dupe --allow 429 -w "https://github.com/myceliumhq/mycelium/compare/*,https://github.com/myceliumhq/mycelium/commit/*"
