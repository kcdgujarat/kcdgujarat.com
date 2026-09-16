---
title: "We Keep Building Control Planes for Machines. Nobody's Built One for Trust"
speakers: ["rishabh-aggarwal"]
track: "Security"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T15:00:00+05:30"
room: "Hall 2"
level: "Intermediate"
tags: ["kubernetes", "spiffe", "opa", "falco", "cilium"]
---

Kubernetes has a control plane for compute. CNI has one for network. CSI has one for storage. But trust who's allowed to believe what about whom, and for how long is scattered across IAM, PKI, service mesh mTLS, audit logs, and vendor contracts, with no single system that can answer, "should this identity be allowed to do this, right now, given everything we know."

In this talk, we'll borrow real patterns from machine identity, zero-trust access, and sovereign infrastructure work to name this gap precisely, walk through where trust silently lives today, and sketch what a real trust control plane would need to do — continuous evaluation instead of point-in-time grants, context-aware policy instead of static roles, and a model that spans identity + network + audit rather than living separately in each. We'll close on why this becomes urgent fast: autonomous AI agents that can request new scopes or spawn sub-agents at runtime already break every assumption today's IAM systems were built on.