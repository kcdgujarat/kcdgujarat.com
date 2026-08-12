---
title: "Beyond DOM-Parsing: Exposing Native Machine Layers to AI Agents via WebMCP"
speakers: ["dhwani-suthar", "tejas-ladhani"]
track: "AI Inference + Agentic"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T15:30:00+05:30"
room: "Hall 1"
level: "All levels"
tags: ["kubernetes", "argo-cd", "backstage", "model-context-protocol", "webmcp", "playwright"]
---

For years, platform teams building AI agents to operate Kubernetes environments have hit a wall when interacting with existing web-based tooling like IDPs, ArgoCD, or observability dashboards. We have forced agents to browse these portals like humans: capturing screenshots, parsing chaotic DOM trees, and writing fragile Playwright scripts just to trigger a deployment or fetch logs. This approach is slow, highly prone to breaking when a UI changes, and incredibly frustrating to secure in an enterprise infrastructure environment.

Enter WebMCP, the emerging web standard that completely flips the script for platform engineering. Instead of an infrastructure agent trying to guess what a portal can do by scraping it, WebMCP introduces a browser-native API that allows platform developers to explicitly expose their application’s features, components, and forms as structured, schema-driven tools for browser-based AI agents.

In this talk, we will explore this groundbreaking "second layer" of the web and how it applies to cloud-native tooling. We will look under the hood of WebMCP, demonstrating how platform teams can use declarative HTML attributes and imperative JavaScript APIs to give agents a lightning-fast, deterministic way to operate IDPs without traditional scraping. Attendees will leave with a clear understanding of how to make their Kubernetes web apps agent-native, how the browser mediates these calls securely, and why brittle web-scraping for infrastructure workflows can finally rest.
