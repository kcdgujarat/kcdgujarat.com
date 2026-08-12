---
title: "Zero Trust for AI: Protecting Models While They Run"
speakers: ["gagan-h-r", "jayashree-o"]
track: "Emerging + Advanced"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T14:00:00+05:30"
room: "Hall 2"
level: "All levels"
tags: ["confidential-containers", "kata-containers", "vllm", "kserve", "kubernetes"]
---

Cloud native infrastructure has become the operating layer for AI. Every LLM and SLM in production runs as a pod, and vLLM serves these models using the same patterns as any stateless deployment. This introduces a risk rarely discussed explicitly: when a model runs on a shared Kubernetes node, the host retains full visibility into pod memory. Prompts, user data, and proprietary model weights sit in plaintext, exposed to any node admin, compromised node, or co-tenant with sufficient access. Encryption at rest and in transit are standard practice, but encryption in use, protecting data while actively processed, remains largely unaddressed in AI serving stacks.

This talk presents a practical way to close that gap without touching the application layer. Starting from a standard vLLM deployment serving an open-weight SLM, we show how changing a single runtimeClassName relaunches the workload inside a hardware-encrypted Confidential VM using Confidential Containers (CoCo). The model ships as an encrypted OCI image, and remote attestation with a Key Broker Service (KBS) ensures the decryption key is released only to a workload that's measured, verified, and untampered.
