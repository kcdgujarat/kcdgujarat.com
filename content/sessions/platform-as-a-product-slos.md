---
title: "Platform as a Product: Metrics, Feedback Loops, and the SLOs We Wrote for Ourselves"
speakers: ["raghu-reddy", "sarvani-swapna-priya-yallapragada"]
track: "Platform Engineering"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T11:15:00+05:30"
room: "Hall 1"
level: "Intermediate"
tags: ["kubernetes", "opentelemetry", "argo-cd", "backstage"]
---

We shipped a self-service Kubernetes platform with all the right pieces Backstage portal, automated provisioning, GitOps deployments. Six months later, adoption was at 30%, developers were filing tickets to work around our abstractions, and three teams had quietly built their own deployment scripts. We had built a platform. We had not built a product anyone wanted to use.

The turning point was measuring success by developer behavior instead of cluster uptime. We defined SLOs for developer experience, onboarding under 30 minutes, deployment lead time under 15 minutes, zero-touch environment provisioning. We built feedback loops using OpenTelemetry-instrumented developer journeys, quarterly surveys, and usage analytics on every platform feature. We ran internal betas before forcing migrations and deprecated capabilities that weren't earning adoption.

Attendees will leave with a practical framework for measuring platform success through developer outcomes, SLO templates designed for internal platforms, and honest guidance on where the product mindset helps and where it creates tension with infrastructure reality.
