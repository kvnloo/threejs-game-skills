#!/usr/bin/env node

import fs from "node:fs";

function finite(values) {
  return values.filter(Number.isFinite);
}

export function percentile(values, p) {
  const sorted = finite(values).sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  if (sorted.length === 1) return sorted[0];

  const position = (sorted.length - 1) * p;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];

  const weight = position - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function summarize(values) {
  const valid = finite(values);
  if (valid.length === 0) {
    return { count: 0, p50: null, p95: null, p99: null, max: null, mean: null };
  }

  const sum = valid.reduce((total, value) => total + value, 0);
  return {
    count: valid.length,
    p50: percentile(valid, 0.50),
    p95: percentile(valid, 0.95),
    p99: percentile(valid, 0.99),
    max: Math.max(...valid),
    mean: sum / valid.length,
  };
}

function delta(sample, start, end) {
  const a = Number(sample[start]);
  const b = Number(sample[end]);
  return Number.isFinite(a) && Number.isFinite(b) ? b - a : NaN;
}

export function summarizeLatencySamples(samples) {
  if (!Array.isArray(samples)) {
    throw new TypeError("Expected a JSON array of samples.");
  }

  const eventToSimulation = samples.map((sample) =>
    delta(sample, "eventTimestamp", "simulationTimestamp"));
  const simulationToRender = samples.map((sample) =>
    delta(sample, "simulationTimestamp", "renderTimestamp"));
  const eventToRender = samples.map((sample) =>
    delta(sample, "eventTimestamp", "renderTimestamp"));
  const frameDelta = samples.map((sample) => Number(sample.frameDelta));

  return {
    sampleCount: samples.length,
    eventToSimulationMs: summarize(eventToSimulation),
    simulationToRenderMs: summarize(simulationToRender),
    eventToRenderMs: summarize(eventToRender),
    frameDeltaMs: summarize(frameDelta),
  };
}

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: summarize-latency.mjs <samples.json>");
    process.exitCode = 2;
    return;
  }

  const samples = JSON.parse(fs.readFileSync(path, "utf8"));
  process.stdout.write(JSON.stringify(summarizeLatencySamples(samples), null, 2) + "\n");
}

if (import.meta.url === "file://" + process.argv[1]) {
  main();
}
