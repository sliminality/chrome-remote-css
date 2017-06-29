// @flow
import pixelmatch from 'pixelmatch';

type Base64String = string;

type DiffOptions = {
  writeDiff?: boolean,
} & PixelmatchOptions;

type DiffResult = {
  pdiff: number,
  maxDiff?: number,
  context?: CanvasRenderingContext2D,
};

class PDiffer {
  width: ?number;
  height: ?number;
  base: ?Uint8ClampedArray;
  prefix: string;

  constructor() {
    this.prefix = 'data:image/png;base64,';
    this.width = null;
    this.height = null;
    this.base = null;
  }

  async setBaseImage(base: Base64String) {
    const { width, height, data } = await this._getImageData(base);
    this.width = width;
    this.height = height;
    this.base = data;
  }

  isInitialized(): boolean {
    return this.base !== null && this.width !== null && this.height !== null;
  }

  async computeDiff(
    other: Base64String,
    options: DiffOptions = {}
  ): Promise<DiffResult> {
    if (!this.isInitialized()) {
      throw new Error(`computeDiff: differ is not initialized`);
    }

    let writeDiff: boolean = false;
    if (options && options.writeDiff) {
      writeDiff = true;
    }
    const { data, height, width } = await this._getImageData(other);
    let diffCtx: ?CanvasRenderingContext2D;
    let diffData: ?Uint8ClampedArray;

    if (height !== this.height || width !== this.width) {
      throw new Error(
        `computeDiff: image dimensions do not match! ${width}, ${height} vs. base of ${this.width}, ${this.height}`
      );
    }

    if (writeDiff) {
      diffCtx = this._createContext({ width, height });
      diffData = diffCtx.createImageData(this.width, this.height).data;
    }

    const pdiff = pixelmatch({
      img1: this.base,
      img2: data,
      diff: writeDiff ? diffData : null,
      height: this.height,
      width: this.width,
      options,
    });

    const result: DiffResult = {
      pdiff,
    };

    // If maxDiff parameter is specified, then pdiff will be equal to maxDiff,
    // and denotes only that the maxDiff was achieved (rather than the total
    // difference between the two images).
    if (typeof options.maxDiff === 'number') {
      result.maxDiff = options.maxDiff;
    }

    if (diffCtx && diffData) {
      diffCtx.putImageData(diffData, 0, 0);
      result.context = diffCtx;
    }

    return result;
  }

  async _getImageData(uri: Base64String): Promise<ImageData> {
    const img: Image = new Image();
    try {
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = this._prefixURI(uri);
      });
    } catch (imageLoadError) {
      throw new Error(`_getImageData: image failed to load`);
    }

    const { width, height } = img;
    const ctx: CanvasRenderingContext2D = this._createContext({
      width,
      height,
    });
    ctx.drawImage(img, 0, 0);
    const imageData: ImageData = ctx.getImageData(0, 0, width, height);
    return imageData;
  }

  _createContext({
    width,
    height,
  }: {
    width: number,
    height: number,
  }): CanvasRenderingContext2D {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx: ?CanvasRenderingContext2D = canvas.getContext('2d');
    if (!ctx) {
      throw new Error(`_createContext: couldn't get context`);
    }
    return ctx;
  }

  _prefixURI(uri: Base64String): Base64String {
    const index: number = uri.indexOf(this.prefix);
    let result: Base64String;

    if (index === -1) {
      result = `${this.prefix}${uri}`;
    } else if (index === 0) {
      result = uri;
    } else {
      throw new Error(`_prefixURI: invalid URI ${uri}`);
    }

    return result;
  }
}

export default PDiffer;
