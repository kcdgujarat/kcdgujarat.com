---
title: "One Bad Label: How a Single Metric Brought Our Monitoring to Its Knees"
speakers: ["ishan-mahadevia"]
track: "Observability"
type: "Lightning"
durationMinutes: 10
start: "2026-09-19T16:50:00+05:30"
room: "Hall 1"
level: "Intermediate"
---

It wasn't a hardware failure or a network outage. It was one metric with the wrong labels.

In this lightning talk, I'll share how an unexpected cardinality explosion affected a large Prometheus deployment, how we identified the root cause, and the practical changes we made to prevent it from happening again.

Along the way, I'll share simple techniques for spotting dangerous metrics early, enforcing metric hygiene, and keeping Prometheus healthy as deployments grow.

If you've ever wondered whether one exporter or application can really impact your monitoring platform, the answer is yes, and this talk explains why.
