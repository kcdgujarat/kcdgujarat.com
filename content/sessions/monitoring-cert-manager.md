---
title: "The Certificate That Will Take Down Your CI — Monitoring cert-manager Before It Bites"
speakers: ["prathamesh-busa"]
track: "Observability"
type: "Lightning"
durationMinutes: 10
start: "2026-09-19T16:40:00+05:30"
room: "Hall 1"
level: "Intermediate"
tags: ["cert-manager", "kubernetes", "prometheus", "thanos", "tekton", "argo-cd"]
---

Certificates expire. When they do, your CI pipelines, webhooks, and service-to-service communication break silently. You find out from angry developers, not dashboards.

This lightning talk shares how our SRE team at Red Hat added cert-manager observability to a multi-cluster Kubernetes platform serving hundreds of developers. I will walk through:

 - The real failure modes: expired certs, stuck issuers, silent sync errors

- Which cert-manager metrics actually matter (and which are noise)

- How we federate these metrics across clusters using Prometheus and Thanos

- The writeRelabelConfigs setup that makes federation practical without metric explosion

- A live dashboard walkthrough: what "healthy" looks like vs what "2am page" looks like

This is not a cert-manager tutorial. This is a field report from operating certificates at scale on a platform where a single expired cert can block every build for every team.

You will leave with a ready-to-use list of cert-manager metrics to add to your monitoring stack and the PromQL queries to alert on them before your developers do.

No slides-only theory. Every metric and alert in this talk runs in production today.
