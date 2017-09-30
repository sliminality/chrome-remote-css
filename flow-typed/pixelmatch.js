// @flow

declare module 'pixelmatch' {
  declare type PixelmatchOptions = {
    threshold?: number,
    maxDiff?: number,
  };

  declare type PixelmatchInput = {
    img1: Uint8ClampedArray,
    img2: Uint8ClampedArray,
    diff: ?Uint8ClampedArray,
    height: number,
    width: number,
    options?: PixelmatchOptions,
  };

  declare export function pixelmatch(input: PixelmatchInput): number;
}
