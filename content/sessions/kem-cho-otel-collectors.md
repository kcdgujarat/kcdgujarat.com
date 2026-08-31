---
title: "Kem Cho, OTel Collectors? Time to Meet Your Control Plane"
speakers: ["manoj-sardana"]
track: "Observability"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T11:15:00+05:30"
room: "Hall 2"
level: "Intermediate"
tags: ["kubernetes", "opamp", "otel"]
---

As OpenTelemetry adoption grows, many organizations run hundreds of OpenTelemetry Collectors across Kubernetes clusters as DaemonSets, sidecars, and gateways. In real environments, these collectors rarely share a single configuration, each requires different receivers, processors, exporters, and filters based on workload, team, or regulatory needs.

Multiple configuration's YAML sprawl leads to drift, small changes require risky redeployments, and teams lack a centralized view of collector health, versions, and active pipelines. These problems are even harder in regulated or air-gapped environments.

In this session, we show how OpAMP (OpenTelemetry Agent Management Protocol) provides a centralized control plane for OpenTelemetry Collectors, enabling dynamic configuration updates, fleet-wide visibility, and safe rollouts at scale. We’ll also discuss how OpAMP complements GitOps and helps teams scale observability without turning collector management into an operational bottleneck.