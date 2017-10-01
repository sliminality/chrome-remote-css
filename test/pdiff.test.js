// @flow
import path from 'path';
import test from 'ava';
import pdiff, { getImageData } from '../src/pdiff';
import { base64Encode } from './helpers/helpers';

const images = {
  tiny: path.resolve(__dirname, './images/10x2.png'),
  base: path.resolve(__dirname, './images/base.png'),
  unchanged: path.resolve(__dirname, './images/unchanged.png'),
  changed: path.resolve(__dirname, './images/changed.png'),
};

test('getImageData works', async t => {
  const one = await base64Encode(images.tiny);
  const data = await getImageData(one);
  const { width, height } = data;
  t.is(width, 10);
  t.is(height, 2);
});

test('pdiff for two identical images is 0', async t => {
  const [one, two] = await Promise.all([
    base64Encode(images.base),
    base64Encode(images.unchanged),
  ]);
  const pdiffer = await pdiff(one);
  const {numPixelsDifferent} = await pdiffer(two);
  t.is(numPixelsDifferent, 0);
});

test('pdiff for two different images is > 0', async t => {
  const [one, two] = await Promise.all([
    base64Encode(images.base),
    base64Encode(images.changed),
  ]);
  const pdiffer = await pdiff(one);
  const {numPixelsDifferent} = await pdiffer(two);
  t.is(numPixelsDifferent, 564855);
});

// $FlowFixMe - this isn't actually an error?
test.todo('pdiff for two different sizes throws an error');
