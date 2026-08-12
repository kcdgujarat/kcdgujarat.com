---
title: "Pod Security End to End - From readOnlyRootFilesystem to Kernel Mount Flags"
speakers: ["nispriha-jagan", "amritansh"]
track: "Security"
type: "Talk"
durationMinutes: 25
start: "2026-09-19T15:30:00+05:30"
room: "Hall 2"
level: "Intermediate"
tags: ["kubernetes", "cri-o", "containerd"]
---

Most people think a pod is secure once they've set readOnlyRootFilesystem, dropped capabilities, and applied Pod Security Standards. But here's the thing , an attacker can still we get a binary into your emptyDir, chmod +x it, and run whatever they want. readOnlyRootFilesystem only protects the container's root layer, not your volumes. AppArmor and SELinux can restrict execution, but they depend on host-level setup and aren't portable across clusters. Until v1.37, there was no way to do this declaratively in the pod spec itself.

We hit this exact problem while working on upstream Kubernetes. A security audit flagged it back in 2022, but the gap had been open since 2017,  no Kubernetes-native way to block binary execution on writable volume mounts. So we helped build the fix: bindMountOptions, a new field that lets you set noexec, nosuid, and nodev on any volume mount, enforced at the kernel level.

In this talk, we'll break a "hardened" pod live on stage, downloading and executing a binary from emptyDir to show why existing defenses fall short. Then we'll rebuild the security stack layer by layer: what each control actually stops, where the gaps are, and how bindMountOptions closes the one nobody talks about. We'll also cover how to enforce all of this cluster-wide using ValidatingAdmissionPolicy, so it's not just one pod but every pod.

You'll leave with a clear picture of what Kubernetes security actually looks like end to end, and a checklist you can apply to your clusters the same week.
