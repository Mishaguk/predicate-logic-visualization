import type { Model } from "../../types";

type DirEdge = { source: string; target: string };

export function buildBinaryEdges(model: Model): DirEdge[] {
  const edges: DirEdge[] = [];

  for (const predicate of model.predicates) {
    const args = predicate.universeArgs;
    if (args.length !== 2) continue;
    const [source, target] = args;
    if (!source || !target) continue;
    if (source === target) continue;
    edges.push({ source, target });
  }
  return edges;
}

export function computeLayers(
  nodes: string[],
  edges: DirEdge[],
): Map<string, number> {
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) adjacency.set(node, []);

  for (const { source, target } of edges) {
    if (!adjacency.has(source)) adjacency.set(source, []);
    adjacency.get(source)?.push(target);
  }

  const layer = new Map<string, number>();
  const state = new Map<string, 0 | 1 | 2>();

  for (const node of nodes) {
    layer.set(node, 0);
    state.set(node, 0);
  }

  const depthFirstSearch = (node: string): number => {
    const nodeState = state.get(node);
    if (nodeState === 2) return layer.get(node) ?? 0;
    if (nodeState === 1) return layer.get(node) ?? 0;

    state.set(node, 1);

    let best = 0;

    for (const neighbor of adjacency.get(node) ?? []) {
      const candidate = depthFirstSearch(neighbor) + 1;
      if (candidate > best) best = candidate;
    }
    layer.set(node, best);
    state.set(node, 2);
    return best;
  };

  for (const node of nodes) {
    depthFirstSearch(node);
  }

  let min = Infinity;

  for (const value of layer.values()) min = Math.min(min, value);

  if (min !== 0 && min !== Infinity) {
    for (const [key, value] of layer) layer.set(key, value - min);
  }

  return layer;
}

export function initialOrderInLayers(
  nodes: string[],
  layer: Map<string, number>,
  existingPositions: Map<string, { x: number; y: number }>,
): Map<number, string[]> {
  const layers = new Map<number, string[]>();
  for (const node of nodes) {
    const nodeLayer = layer.get(node) ?? 0;
    if (!layers.has(nodeLayer)) layers.set(nodeLayer, []);
    layers.get(nodeLayer)?.push(node);
  }

  for (const [layer, nodes] of layers) {
    nodes.sort((a, b) => {
      const ax = existingPositions.get(a)?.x ?? 0;
      const bx = existingPositions.get(b)?.x;

      if (ax != null && bx != null) return ax - bx;
      if (ax != null) return -1;
      if (bx != null) return 1;
      return a.localeCompare(b);
    });
    layers.set(layer, nodes);
  }
  return layers;
}

export function getPositionByLayers(
  layers: Map<number, string[]>,
  edges: DirEdge[],
  offsetX: number,
  offsetY: number,
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  const layerIndices = Array.from(layers.keys());
  const maxLayer = Math.max(...layerIndices, 0);

  const incoming = new Map<string, string[]>();
  for (const { source, target } of edges) {
    if (!incoming.has(target)) incoming.set(target, []);
    incoming.get(target)!.push(source);
  }

  const sortedLayerIndices = Array.from(layers.keys()).sort((a, b) => a - b);

  sortedLayerIndices.forEach((layerIdx, i) => {
    const currentNodes = layers.get(layerIdx) || [];

    if (i > 0) {
      const getBarycenter = (node: string) => {
        const parents = incoming.get(node) || [];
        if (parents.length === 0) return 0;

        const prevLayerNodes = layers.get(sortedLayerIndices[i - 1]) || [];
        const sum = parents.reduce((acc, p) => {
          const idx = prevLayerNodes.indexOf(p);
          return acc + (idx === -1 ? 0 : idx);
        }, 0);
        return sum / parents.length;
      };

      currentNodes.sort((a, b) => getBarycenter(a) - getBarycenter(b));
    }

    currentNodes.forEach((nodeId, nodeIdx) => {
      const staggerAmount = 50;
      const yNudge = layerIdx % 2 === 0 ? staggerAmount : -staggerAmount;

      positions.set(nodeId, {
        x: (maxLayer - layerIdx) * offsetX,
        y: nodeIdx * offsetY + yNudge,
      });
    });
  });

  return positions;
}
