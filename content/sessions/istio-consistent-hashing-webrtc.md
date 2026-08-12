---
title: "When Istio Beat Redis: Solving WebRTC Session Routing with Consistent Hashing"
speakers: ["darshil"]
track: "Connectivity"
type: "Lightning"
durationMinutes: 10
start: "2026-09-19T16:50:00+05:30"
room: "Hall 2"
level: "All levels"
---

Building a real-time WebRTC application on Kubernetes exposed an unexpected challenge: every signaling request had to reach the same backend instance, or users experienced dropped calls and broken sessions.

Our first instinct was the common approach store session mappings in Redis and use them for routing. While it solved the problem, it also introduced another stateful service to operate, monitor, secure, and scale. We began asking a simple question: could Kubernetes and Istio already solve this problem without adding another dependency?

In this session, I'll walk through our journey from a Redis-based design to using Istio's consistent hashing for deterministic request routing and also about basics of service meshes. We'll compare different approaches to session affinity, discuss why Kubernetes' built-in options weren't sufficient for our use case, and see how a small change in Istio's traffic management eliminated an entire component from our architecture.

This isn't a "Redis is bad" talk. We'll cover where Redis remains the right choice, the limitations of consistent hashing, how failures affect request routing, and the trade-offs we encountered in production. You'll also see the actual Istio configuration, traffic flow, testing strategy, and the metrics we used to validate the migration.

Whether you're building WebRTC platforms, AI voice agents, multiplayer games, or any application that depends on long-lived sessions, you'll leave with a practical framework for deciding when service mesh capabilities are enough and when introducing additional infrastructure is actually justified.

In this session, I'll share how we solved this problem in a production Kubernetes environment by replacing Redis-based session routing with Istio's consistent hashing.

We'll start by understanding why WebRTC session affinity is challenging in a distributed system and evaluate the different approaches available, including Redis-backed routing, Kubernetes session affinity, and Istio traffic management. I'll explain why our initial architecture wasn't ideal, the trade-offs we considered, and how we arrived at a simpler solution using Istio's built-in capabilities.

The talk includes the implementation details, traffic flow, DestinationRule configuration, testing methodology, production results, and the limitations of this approach. We'll also discuss where consistent hashing works well and where you should still choose Redis or another state management solution.

Attendees will leave with a practical, production-tested pattern for building deterministic request routing in Kubernetes, along with a clear framework for deciding when service mesh capabilities are sufficient and when additional infrastructure is truly necessary.
