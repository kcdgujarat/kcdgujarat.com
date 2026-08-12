---
title: "Scaling LLM Inference on Kubernetes with KV-Cache-Aware Routing"
speakers: ["himanshu-sangshetti"]
track: "AI Inference + Agentic"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T10:45:00+05:30"
room: "Hall 2"
level: "Intermediate"
tags: ["kserve", "llm-d", "vllm", "kubernetes"]
---

Every token an LLM generates depends on the KV cache- the model's running memory of the request so far.

Manage it well and inference is fast and cheap. Manage it badly and you recompute the same prefixes over and over, burning GPU you never needed. This session treats the KV cache as the thing that actually governs LLM inference performance on Kubernetes.

We serve models on KServe (now a CNCF project), then go where the speed and savings are:

1. prefix caching in vLLM- reuse the cache within a worker

2. KV-cache-aware routing with llm-d- send a request to the worker that already holds its prefix instead of recomputing it

3. prefill/decode disaggregation- split the two phases across GPU pools and move the cache between them

We'll walk real before/after numbers on throughput, time-to-first-token, and GPU cost.

You'll leave knowing why the KV cache is your inference bottleneck, and the Kubernetes-native patterns that fix it.
