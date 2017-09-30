// @flow

declare module 'pixelmatch' {
  declare export type PixelmatchOptions = {
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

  declare export default function pixelmatch(input: PixelmatchInput): number;
}
