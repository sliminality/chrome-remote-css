// @flow @format
import { normalize, schema } from 'normalizr';

import type { CRDP$NodeId, CRDP$Node } from 'devtools-typed/domain/DOM';

export type NormalizeResult = {
  entities: {
    nodes: { [CRDP$NodeId]: NormalizedNode },
  },
  result: CRDP$NodeId,
};

const nodeSchema = new schema.Entity(
  'nodes',
  {}, // Defined below.
  {
    idAttribute: 'nodeId',
  },
);

const nodeArraySchema = new schema.Array(nodeSchema);

// Recursive template for CRDP$Node types.
nodeSchema.define({
  children: nodeArraySchema,
  pseudoElements: nodeArraySchema,
});

function normalizeNodes(root: CRDP$Node): NormalizeResult {
  return normalize(root, nodeSchema);
}

export default normalizeNodes;

