---
name: "@rune/ai-ml"
description: AI/ML integration patterns — LLM integration, RAG pipelines, embeddings, and fine-tuning workflows.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L4
  price: "$15"
  target: AI engineers
---

# @rune/ai-ml

## Skills Included

### llm-integration
LLM integration patterns — API client wrappers, streaming responses, token management, fallback chains, prompt versioning, structured output parsing.

### rag-patterns
RAG pipeline patterns — document chunking, embedding generation, vector store setup (Pinecone, Weaviate, pgvector), retrieval strategies, reranking.

### embedding-search
Embedding-based search — semantic search implementation, hybrid search (keyword + vector), similarity thresholds, index optimization.

### fine-tuning-guide
Fine-tuning workflows — dataset preparation, training configuration, evaluation metrics, deployment of fine-tuned models, A/B testing.

## Connections

```
Calls → research (L3): lookup model documentation
Calls → docs-seeker (L3): API reference lookup
Called By ← cook (L1): when AI task detected
Called By ← plan (L2): when AI architecture decision needed
```
