// @flow

declare type PixelmatchOptions = {
  threshold?: number,
  maxDiff?: number,
};

declare var pixelmatch: ({
  img1: Uint8ClampedArray,
  img2: Uint8ClampedArray,
  diff: ?Uint8ClampedArray,
  height: number,
  width: number,
  options?: PixelmatchOptions,
}) => number;
