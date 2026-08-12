---
title: "Breaking Charts: What I Learned Maintaining valkey-helm"
speakers: ["ishan-jain"]
track: "Cloud Native Experience"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T11:45:00+05:30"
room: "Hall 1"
level: "All levels"
tags: ["valkey", "helm", "kubernetes"]
---

Valkey started with one Helm chart. It's becoming three, and the reasons why trace a line straight through how Valkey actually runs.

Valkey has two deployment modes, and they pull in different directions. Standalone (with Sentinel likely down the road) is served by valkey-helm: pods, services, config, no controller needed. Cluster mode is a different beast, sharded and coordinated, and that's where valkey-operator comes in, managing Valkey through CRDs. valkey-resources, currently in design, would ship just the custom resources for a cluster-mode setup, assuming the operator already lives in the cluster. Three charts, drawn along the seam between standalone and cluster.

This talk uses that split to open up how a maintainer team works. Why cluster mode earns an operator when standalone doesn't. Why we'd ship CRs as a separate chart instead of folding them into the operator. How we argue about naming and scope in public GitHub discussions, and how we weigh backward compatibility against a cleaner design. You'll see what breaks when a chart assumes a controller exists, how the operator-first-then-resources dependency shapes UX and failure modes, and how we decide what belongs in which layer.

If you build internal platforms or maintain Helm charts, you'll leave with a sharper model for splitting responsibilities along the grain of how software actually runs, and a look at how open source design gets argued out in the open.
