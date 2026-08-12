---
title: "How Four Default Settings Become a Full Cluster Compromise"
speakers: ["rajpal-sinh-jadeja"]
track: "Security"
type: "Lightning"
durationMinutes: 10
start: "2026-09-19T16:40:00+05:30"
room: "Hall 2"
level: "All levels"
---

Four misconfigurations. Each one looks harmless in isolation. Together they hand an attacker complete control of a Kubernetes cluster in under ten minutes — and most clusters have all four open right now.

This talk walks through the exact attack path door by door. A single compromised pod becomes the entry point. An overprivileged service account exposes the entire cluster API. A flat network with no policies allows free lateral movement across namespaces. A missing admission controller lets a malicious privileged pod land without challenge. An audited role binding hands over cluster-admin. At no point does a single alert fire.

Then each door closes — scoped RBAC, default-deny Network Policies, one Kyverno ClusterPolicy — and the same attack fails at every stage. You leave with a four-item checklist and the exact YAML that stops each step, built entirely on open source tooling already available in your cluster.
