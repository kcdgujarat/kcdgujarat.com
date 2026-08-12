---
title: "Breaking RAG Apart: A Microservices Blueprint for Retrieval at Scale on Kubernetes"
speakers: ["aman-mundra"]
track: "AI Inference + Agentic"
type: "Lightning"
durationMinutes: 10
start: "2026-09-19T16:30:00+05:30"
room: "Hall 2"
level: "Advanced"
tags: ["kubernetes", "milvus", "langfuse", "argo", "kubeflow", "langchain"]
---

Most RAG systems are just jupyter notebook POCs: embed, retrieve, generate, all in a few cells that can hardly support 10 concurrent queries. But with the real traffic, Vector search fails on high concurrency, the GPU generation step becomes a bottleneck because you never tuned it, and one slow re-rank call takes the whole request down with it.

This talk covers how to split a RAG pipeline into separate services on Kubernetes: embedding, vector retrieval, re-ranking, orchestration, LLM generation and evaluation. Each of these has a different scaling profile and a different way of failing, so each needs to be deployed and scaled on its own terms. I'll walk through running vector databases as sharded, stateful services, autoscaling GPU inference with KEDA instead of relying on CPU-based HPA, where caching actually pays off, and how to keep one failing component from taking down the whole system.

Attendees will have a working reference architecture for a scalable RAG pipeline that serve thousands of concurrent queries, along with a clear picture of which Kubernetes building blocks (StatefulSets, operators, KEDA, GPU scheduling) map to which part of the pipeline. Along with that, a bonus architecture pipeline for performing evaluation at scale.
