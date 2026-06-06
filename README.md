<div align="center">
  <h1>🍄 Mycelium</h1>
  <p><b>The AI-powered knowledge graph for developers and technical teams.</b></p>
</div>

---

Mycelium is an **AI-native, local-first knowledge graph platform**. It moves beyond traditional Markdown files and folder structures by treating knowledge as a richly connected, queryable graph that can be semantically analyzed, summarized, and extended using AI. 

Whether you are managing massive code documentation, personal research, or team knowledge bases, Mycelium scales with you.

## ✨ Core Features

- 🔒 **Local-first Architecture**: All data stays on your device by default. No cloud lock-in. No privacy concerns. 
- 🤖 **AI-Native from the Ground Up**: Built with vector embeddings, semantic search, and multi-level context summarization as first-class citizens.
- 🕸️ **Knowledge Graph Centric**: Notes and data aren't just files; they are nodes in a massive, interconnected graph. Traverse, query, and visualize relationships effortlessly.
- 🛠️ **Developer Focused**: Built on a modern, clean TypeScript architecture (pnpm + Nx), engineered for extreme extensibility and high performance.
- ⚡ **Massive Scale**: Capable of indexing, traversing, and querying knowledge bases with 100k+ notes smoothly.
- 🔌 **Dynamic Plugin SDK**: Extend Mycelium’s core engine safely with capability-based permissions.

## 🚀 Getting Started

*(Documentation and onboarding guides are currently being migrated as part of the v1.0 architecture update. Stay tuned for installation instructions!)*

### Prerequisites (For Developers)

- Node.js >= 18
- pnpm >= 8.x

```bash
# Clone the repository
git clone https://github.com/sunkenship2025/mycelium.git
cd mycelium

# Install dependencies
pnpm install

# Start the development environment
pnpm dev
```

## 🏗️ Architecture

Mycelium utilizes a strict layered architecture to ensure maintainability and high performance:

1. **Core Engine**: Data structures, graph primitives, and file operations.
2. **Knowledge Graph Layer**: Incremental indexing, queries, semantic traversal.
3. **Application Services**: Managing notes, vaults, and workspaces.
4. **Interfaces & Adapters**: CLI, Local API server, and upcoming extensions.

## 🤖 AI Capabilities

Mycelium features a dedicated `@myceliumhq/ai-core` package providing:
- **Semantic Search**: Powered by local vector embeddings (hnswlib/voy).
- **Auto-backlinks**: Suggests relevant connections based on embedding similarity.
- **Context Builders**: Smartly structures context from your graph for LLM prompting.
- **Provider Agnostic**: Supports OpenAI, Anthropic, Ollama, and local models via llama.cpp.

## 🤝 Contributing

We welcome contributions from the community! Check out our [Contributing Guide](CONTRIBUTING.md) to learn how you can help build the future of knowledge graphs.

## 📜 License

Mycelium is fully open source software. Please see [LICENSE.md](LICENSE.md) for details.

---
*Note: Mycelium was completely re-architected and transformed into an independent platform, while maintaining compliance with Open Source guidelines and original attributions.*
