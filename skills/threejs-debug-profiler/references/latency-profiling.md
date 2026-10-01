# Browser input latency profiling

Use this when a Three.js game is sensitive to aiming, camera motion, clicking, steering, rhythm timing, or other high-rate input.

## Instrument boundaries, not one opaque number

Capture timestamps for:

- browser input event arrival
- handler entry
- simulation step consuming that input
- render submission / render call
- `requestAnimationFrame` callback
- frame delta

Browser timestamps cannot prove physical input-to-photon latency. Label them by the software boundaries they actually measure.

## Keep the workload deterministic

Use a fixed scene, seeded target motion, a fixed camera path where possible, and a recorded/synthetic pointer trace. Change one variable per run.

For polling-rate studies, preserve total movement while changing packetization. A 4 kHz trace should not silently contain four times as much movement as a 1 kHz trace.

## Report distributions

Never use average-only latency claims. Preserve raw samples and report at least p50, p95, p99, and max. Keep run-to-run variance separate from within-run frame variance.

The helper:

```bash
node skills/threejs-debug-profiler/scripts/summarize-latency.mjs samples.json
```

expects a JSON array with fields such as:

```json
{
  "eventTimestamp": 100.0,
  "simulationTimestamp": 100.4,
  "renderTimestamp": 101.2,
  "frameDelta": 4.2
}
```

## Comparison protocol

Prefer A/B/A or A/B/B/A runs when thermal or background drift is plausible. Warm up the scene before recording. Keep refresh rate, VRR, frame cap, browser build, renderer backend, resolution, and background load fixed unless one is the variable under test.
