/**
 * The event's name, spelled exactly one way everywhere it is written.
 *
 * "KCD Gujarat 2026", "Kubernetes Community Days Gujarat", "KCD Gujarat" and
 * "Kubernetes Community Day, Gujarat" were all in use at once; import this
 * instead of retyping the name so they cannot come back. `scripts/check-brand.mjs`
 * fails the build on any variant it finds outside this file.
 *
 * Deliberately dependency-free so the edge-runtime OG route can import it.
 *
 * This is *our* event only. Other Kubernetes Community Days ("KCD Bengaluru",
 * "KCD Pune") keep their own names, and the plural "Kubernetes Community Days"
 * naming the CNCF programme as a whole is not a variant of it.
 */
export const EVENT_NAME = 'Kubernetes Community Day (KCD) Gujarat 2026';
