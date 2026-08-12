---
title: "Who Wrote That Query? Tracing AI Agents from Prompt to PostgreSQL with OpenTelemetry"
speakers: ["anushka-saxena", "anubhav-dhawan"]
track: "Observability"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T12:15:00+05:30"
room: "Hall 1"
level: "Intermediate"
---

Your AI agent executes a tool, the request reaches your database, latency spikes... and suddenly the trail goes cold.

Traditional distributed tracing ends at the application boundary, leaving database logs disconnected from the original prompt that triggered them. For platform engineers running AI systems in production, this observability gap makes debugging slow queries, understanding agent behavior, and correlating incidents far harder than it should be.

In this talk, we'll follow a single request from an LLM prompt through MCP, OpenTelemetry, the Toolbox server, and finally into PostgreSQL using SQLCommenter without changing tool APIs or polluting application logic.

We'll explore how W3C trace context propagates across distributed AI systems, how OpenTelemetry semantic conventions fit naturally into MCP-based architectures, and how SQLCommenter bridges the final gap between traces and database execution.

By the end, you'll understand how to build production-ready observability for AI agents and gain practical techniques for debugging real-world cloud-native AI applications.
