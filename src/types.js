// @flow @format
import type { CRDP$NodeId, CRDP$Node } from 'devtools-typed/domain/dom';

export type CSSPropertyPath = {
  nodeId: CRDP$NodeId,
  ruleIndex: number,
  propIndex: number,
};

export type Target = {
  tabId: number,
};

export type NodeMap = { [CRDP$NodeId]: CRDP$Node };

export type DebugStatus = 'ACTIVE' | 'INACTIVE';

export type NodeStyleMask = Array<Array<boolean>>;
