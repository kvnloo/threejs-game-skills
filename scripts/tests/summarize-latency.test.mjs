import assert from "node:assert/strict";
import test from "node:test";

import {
  percentile,
  summarizeLatencySamples,
} from "../../skills/threejs-debug-profiler/scripts/summarize-latency.mjs";

test("percentile uses deterministic linear interpolation", () => {
  assert.equal(percentile([1, 2, 3, 4, 5], 0.5), 3);
  assert.equal(percentile([1, 2, 3, 4, 5], 0.95), 4.8);
});

test("summarizes event, simulation, render, and frame deltas", () => {
  const result = summarizeLatencySamples([
    { eventTimestamp: 0, simulationTimestamp: 1, renderTimestamp: 3, frameDelta: 8 },
    { eventTimestamp: 10, simulationTimestamp: 12, renderTimestamp: 15, frameDelta: 9 },
    { eventTimestamp: 20, simulationTimestamp: 23, renderTimestamp: 27, frameDelta: 10 },
  ]);

  assert.equal(result.sampleCount, 3);
  assert.equal(result.eventToSimulationMs.p50, 2);
  assert.equal(result.simulationToRenderMs.p50, 3);
  assert.equal(result.eventToRenderMs.p50, 5);
  assert.equal(result.frameDeltaMs.max, 10);
});
