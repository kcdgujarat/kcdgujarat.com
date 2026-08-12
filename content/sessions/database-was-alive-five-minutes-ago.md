---
title: "I Swear the Database Was Alive 5 Minutes Ago"
speakers: ["shivam-nandy", "bikram-debnath"]
track: "Cloud Native Experience"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T14:30:00+05:30"
room: "Hall 1"
level: "Intermediate"
tags: ["postgresql", "kubernetes", "zalando", "grafana", "opentelemetry"]
---

Running PostgreSQL inside Kubernetes introduces an entirely new class of distributed failure scenarios where orchestration behavior, storage consistency, and replication mechanics directly impact database reliability. While most HA setups appear stable during normal operations, real production incidents often emerge during node failures, network partitions, WAL replay conflicts, or broken failover coordination.

This session explores PostgreSQL high availability from the inside out by dissecting how PostgreSQL behaves during infrastructure-level chaos in Kubernetes environments. Through live failure simulations and production-inspired scenarios, we will analyze WAL generation and replay, timeline divergence, replication slot behavior, crash recovery, synchronous vs asynchronous replication tradeoffs, and split-brain prevention strategies. The talk will also examine how PostgreSQL operators such as Zalando Postgres Operator interact with StatefulSets, Persistent Volumes, readiness probes, and Kubernetes leader election during failover conditions. Attendees will see how replica lag, fencing failures, storage corruption, and network isolation can create cascading consistency issues across clusters.
