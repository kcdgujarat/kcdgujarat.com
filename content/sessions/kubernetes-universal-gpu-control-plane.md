---
title: "Kubernetes as the universal GPU Control Plane for AI workloads"
speakers: ["satyam-soni", "rudraksh-karpe"]
track: "AI Inference + Agentic"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T11:15:00+05:30"
room: "Hall 2"
level: "All levels"
tags: ["kubernetes", "hami", "kaito"]
---

AI workloads are driving huge demand for GPUs and AI accelerators, yet the default Kubernetes model still leans on vendor-specific device plugins, which tie workloads to particular hardware and complicate portability across heterogeneous clusters. In this session, members from the Kubernetes and KAITO projects will present a more unified alternative: coupling HAMi’s device virtualization and unified scheduling abstraction with KAITO’s AI workload automation, transforming Kubernetes into a cross-vendor GPU control plane. Together, they enable cross-vendor accelerator management, reducing lock-in and improving workload portability.

We’ll walk through demos that show how HAMi abstracts device details (splitting, isolation, topology-aware scheduling), while KAITO automates workload lifecycles (model deployment, node provisioning, scaling). Attendees will leave with a practical blueprint for running AI workloads on heterogeneous infrastructure on Kubernetes.
