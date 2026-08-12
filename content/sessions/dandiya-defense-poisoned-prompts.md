---
title: "The Dandiya Defense to Poisoned Prompts"
speakers: ["oshi-gupta", "sonali-srivastava"]
track: "Security"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T11:45:00+05:30"
room: "Hall 2"
level: "All levels"
tags: ["kubernetes", "kyverno", "falco", "mcp"]
---

AI agents now have real power inside Kubernetes - calling APIs, reading configs, managing workloads. Sounds great, until you realize attackers don't need to hack your cluster. They just need to trick your AI agent.

In this live session, we demo exactly that. We feed an AI agent a poisoned prompt, hidden inside something as simple as a text file, and watch it get manipulated into leaking Kubernetes secrets it was never meant to touch. No exploits, no stolen credentials - just words doing the damage.

Then we flip the script. We add three simple defenses: NetworkPolicy to lock down traffic, Kyverno to control what the agent can do, and Falco to watch for unusual runtime behavior. We run the same attack again - this time the attack fails, live on stage.

Attendees will leave with an understanding of why AI agents are a new attack surface in cloud native systems, plus a practical, open-source setup to defend your own clusters.This session is for SREs, platform engineers, and security folks working with AI in Kubernetes.
