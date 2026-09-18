---
title: "One Cluster to Rule Them All: Running VMs, Containers, and Serverless with KubeVirt"
speakers: ["nilesh-vaghela"]
track: "Platform Engineering"
type: "Sponsored Talk"
durationMinutes: 25
start: "2026-09-19T14:30:00+05:30"
room: "Hall 2"
level: "Intermediate"
tags: ["kubevirt", "knative", "libvirt", "kubernetes"]
---

Most teams live with a split infrastructure: Kubernetes for modern container workloads, and a legacy virtualization platform for everything that can't be containerized yet — Windows workloads, kernel-module-dependent apps, licensed appliances, and monoliths mid-migration. Two platforms means two operating models, two skill sets, two security postures, and double the toil.

KubeVirt — a CNCF Incubating project now approaching graduation — removes that split by running virtual machines as native Kubernetes objects. A VM becomes a Custom Resource, scheduled as a pod, sharing the same API, RBAC, networking, storage, and observability as your containers.

This session takes the platform architect's view. We'll cover:

- **The architecture:** how a VM actually runs on Kubernetes — `virt-launcher`, `virt-handler`, the `VirtualMachine`/`VirtualMachineInstance` CRDs, and KVM/libvirt underneath.
- **The unified platform:** shared networking (Multus/bridge), storage and live migration (CDI, PVCs), and a single control plane for both VMs and containers.
- **The serverless dimension:** running Knative on the same cluster for scale-to-zero container functions, and how KubeVirt VMs plug into event-driven flows via Knative Eventing — plus an honest look at where "serverless for full VMs" is today.
- **When NOT to use it:** trade-offs, adoption limits, and migration gotchas.

We finish with a live demo: a container app, a virtual machine, and a serverless function all running side by side on a single Kubernetes cluster — one control plane, three workload types.
