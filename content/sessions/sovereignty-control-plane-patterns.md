---
title: "Picking Ahmedabad Isn't Sovereignty: Control Plane Patterns for Regulated Platforms"
speakers: ["hrittik-roy", "surabhi-mishra"]
track: "Application Development + Delivery"
type: "Keynote"
durationMinutes: 20
start: "2026-09-19T09:30:00+05:30"
room: "Hall 1"
level: "All levels"
---

Two years ago, digital sovereignty was a procurement line. Today it is a platform engineering problem. The EU Data Act has been fully applicable since January 2025; NIS-2, DORA, and the UK Data Use and Access Act now drive platform decisions in regulated sectors. Auditors no longer just ask where data sits. They ask who operates the control plane, who holds the keys, and who can be subpoenaed.

That breaks a common assumption: workloads in an EU region do not make a platform sovereign. A single shared Kubernetes control plane centralizes authority, policy, APIs, and key management, wherever the data plane runs. Workload placement is not the boundary. The control plane is.

This talk walks the pattern regulated platforms are converging on: a Kubernetes control plane per isolation boundary, a tenant cluster, on shared infrastructure. Using open source building blocks, we discuss jurisdiction with Git, pin state and audit logs locally, stage CVE responses per tenant, and shrink the blast radius of a CLOUD Act request, especially when banking entities and consumers are included.

This talk will help you discover where the pattern ends and when these clusters incur their costs.
