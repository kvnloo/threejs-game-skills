# Browser aim-latency benchmark

## Purpose

Provide a reusable FPS/aim-training workload for detecting input, simulation, and rendering regressions in Three.js games.

## Timestamps

Capture, when available:

- raw `pointermove` event timestamp
- handler entry timestamp
- simulation-step timestamp
- render submission timestamp
- `requestAnimationFrame` timestamp

Do not describe these browser timestamps as true input-to-photon latency without external display measurement.

## Scenarios

- static click timing
- micro-correction
- target switching
- smooth tracking
- sudden direction reversal

## Determinism

Each scenario must accept a seed and deterministic target trajectory. Replaying the same synthetic pointer trace should produce the same simulation state.

## Output

Export JSON/CSV containing:

- event cadence
- event -> simulation delay
- simulation -> render delay
- frame delta
- long/missed frame markers
- scenario/seed
- browser + refresh-rate metadata

Summaries must include p50, p95, p99 and max, not only averages.
