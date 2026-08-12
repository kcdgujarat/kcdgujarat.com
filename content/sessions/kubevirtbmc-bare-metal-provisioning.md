---
title: "KubeVirtBMC: Bridging Bare-metal Provisioning Tools and KubeVirt Virtual Machines"
speakers: ["anish-bista", "zespre-chang"]
track: "Application Development + Delivery"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T15:00:00+05:30"
room: "Hall 1"
level: "Intermediate"
tags: ["kubevirt", "cert-manager"]
---

Ever tried provisioning KubeVirt virtual machines with Metal3, Tinkerbell, or other bare-metal provisioning tools? You can't because VMs running on Kubernetes lack traditional out-of-band management interfaces like IPMI and Redfish. The VirtualBMC or sushy-tools projects seem helpful, but they actually aren't, since none of them are cloud-native.

KubeVirtBMC solves this by emulating BMCs (Baseboard Management Controllers) for your KubeVirt VMs, giving you remote management capabilities, such as system power control, boot device control, and virtual media management, etc.

Born from SUSE Hack Week, this project has helped several infrastructure projects and products in testing by playing a key role between provisioning tools and cloud-native infrastructure.

In this talk, we'll explore:

- Why VMs on Kubernetes need BMC emulation

- How KubeVirtBMC translates IPMI/Redfish requests into Kubevirt API calls

- Real-world use cases

- Live demo
