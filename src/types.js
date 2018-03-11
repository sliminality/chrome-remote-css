// @flow @format
import type { CRDP$NodeId, CRDP$Node } from 'devtools-typed/domain/dom';

export type CSSPropertyPath = {
  nodeId: CRDP$NodeId,
  ruleIndex: number,
  propertyIndex: number,
};

export type Target = {
  tabId: number,
};

export type NodeMap = { [CRDP$NodeId]: CRDP$Node };

export type DebugStatus = 'ACTIVE' | 'INACTIVE';

export type NodeStyleMask = Array<Array<boolean>>;

export type CSSPropertyIndices = [number, number];

export type NodeStyleMaskDiff = {
  enabled?: Array<CSSPropertyIndices>,
  disabled?: Array<CSSPropertyIndices>,
};

// HACK: CSSPropertyIndices is actually a misnomer. The keys are stringified paths
// `${nodeId},${ruleIndex},${propertyIndex}`.
export type NodeStyleDependencies = {
  dependants: { [keystone: CSSPropertyIndices]: Array<CSSPropertyIndices> },
  keystones: { [dependant: CSSPropertyIndices]: Array<CSSPropertyIndices> },
};
