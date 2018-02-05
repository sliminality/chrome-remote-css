// @flow
import pixelmatch from 'pixelmatch';
import {assert} from './utils';

import type { PixelmatchOptions } from 'pixelmatch';

/**
 * Computes whether two images are different.
 */

export type Base64String = string;

type DiffOptions = PixelmatchOptions & {
  writeDiff?: boolean,
};

type DiffResult = {
  // Number of pixels calculated as different.
  numPixelsDifferent: number,

  // If `options.maxDiff` was specified, it will be included here.
  // If defined, then `numPixelsDifferent` will be upper-bounded
  // by this value, even though the true difference between the
  // two images may be greater.
  maxDiff?: number,

  // If `options.writeDiff` is specified, the diff image data (with diff
  // pixels drawn) will be returned.
  // TODO(slim): Check if this works with early-return behavior?
  diffImage?: ImageData,
};

type Dimensions = {
  width: number,
  height: number,
};

class DimensionMismatchError extends Error {}

function _formatDimensions({width, height}: Dimensions) {
  return `${width}x${height}`;
}

async function pdiff(before64: Base64String, options: DiffOptions = {}) {
  const before = await getImageData(before64);
  const resolvedOptions = resolveDiffOptions(options);

  return async function(after64: Base64String): Promise<DiffResult> {
    const after = await getImageData(after64);
    const dimensionsMatch = before.height === after.height && before.width === after.width;
    if (!dimensionsMatch) {
      const beforeDims = _formatDimensions(before);
      const afterDims = _formatDimensions(after);
      throw new DimensionMismatchError(`Images do not match: ${beforeDims} vs ${afterDims}`);
    }
    const { width, height } = before;

    const writeDiff = !!resolvedOptions.writeDiff;
    let diffImage: ?ImageData;
    if (writeDiff) {
      // Create an empty context, just so we can create an appropriately-
      // sized ImageData to pass to Pixelmatch.
      const ctx = createContext({ width, height });
      diffImage = ctx.createImageData(width, height);
    }

    const numPixelsDifferent = pixelmatch({
      width,
      height,
      img1: before.data,
      img2: after.data,
      diff: diffImage ? diffImage.data : null,
      options: resolvedOptions,
    });

    const result: DiffResult = { numPixelsDifferent };
    const { maxDiff } = options;
    const hasMaxDiff = typeof maxDiff === 'number';
    if (hasMaxDiff) {
      result.maxDiff = maxDiff;
    }
    if (diffImage) {
      result.diffImage = diffImage;
    }
    return result;
  };
}

function resolveDiffOptions(
  given?: DiffOptions = {}
): PixelmatchOptions & {
  writeDiff: boolean,
} {
  // By default, we don't specify either a threshold or maxDiff,
  // just whether to write the diff.
  const DEFAULTS = {
    writeDiff: false,
  };
  return Object.assign({}, DEFAULTS, given);
}

async function getImageData(uri: Base64String): Promise<ImageData> {
  const img = new Image();
  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = prefixURI(uri);
    });
  } catch (imageLoadError) {
    throw new Error(`getImageData: image failed to load`);
  }
  const { width, height } = img;
  const ctx = createContext({ width, height });
  ctx.drawImage(img, 0, 0);
  const imageData: ImageData = ctx.getImageData(0, 0, width, height);
  return imageData;
}

function createContext({
  width,
  height,
}: {
  width: number,
  height: number,
}): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx: ?CanvasRenderingContext2D = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(`createContext: couldn't get context from canvas`);
  }
  return ctx;
}

function prefixURI(uri: Base64String): Base64String {
  const PREFIX = 'data:image/png;base64,';
  const index = uri.indexOf(PREFIX);
  assert(
    index === -1 || index === 0,
    'image URI must begin with data prefix, or omit entirely'
  );
  return index === -1 ? `${PREFIX}${uri}` : uri;
}

export default pdiff;
export { prefixURI, getImageData };
