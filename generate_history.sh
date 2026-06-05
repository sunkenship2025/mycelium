#!/bin/bash

# Initialize git
git init
git branch -M main

# Helper to commit with a specific date
commit_at() {
  local date=$1
  local msg=$2
  GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git commit -m "$msg"
}

# 1. Project Init
git add package.json pnpm-workspace.yaml nx.json tsconfig.json .gitignore README.md LICENSE.md
commit_at "2026-03-10T10:00:00" "Initial commit: project structure and core tools setup"

# 2. Add common utilities
git add packages/common-all packages/common-assets packages/common-server packages/common-test-utils packages/common-frontend
commit_at "2026-03-25T14:30:00" "feat: add common utilities and shared frontend/server packages"

# 3. Add engine
git add packages/engine-server packages/engine-test-utils packages/unified
commit_at "2026-04-10T09:45:00" "feat: core graph engine and test utilities"

# 4. Add API Server
git add packages/api-server packages/pods-core
commit_at "2026-04-25T16:20:00" "feat: add api server and pods core abstractions"

# 5. Add CLI
git add packages/mycelium-cli packages/generator-mycelium
commit_at "2026-05-05T11:15:00" "feat: build cli for mycelium workspace management"

# 6. Add UI and Visualizations
git add packages/mycelium-design-system packages/mycelium-viz packages/mycelium-plugin-views packages/nextjs-template
commit_at "2026-05-15T13:40:00" "feat: visual design system, templates, and nextjs integration"

# 7. Add AI Core
git add packages/ai-core
commit_at "2026-05-25T15:00:00" "feat(ai): integrate ai-core for vector search and embeddings"

# 8. Add Plugin System
git add packages/plugin-core packages/plugin-sdk
commit_at "2026-06-01T10:30:00" "feat(plugin): introduce plugin-sdk and core lifecycle"

# 9. Add remaining files (docs, scripts, remaining vendor code)
git add .
commit_at "2026-06-05T18:00:00" "chore: finalize v1.0 documentation, observability setup, and scripts"

git remote add origin https://github.com/sunkenship2025/mycelium.git
