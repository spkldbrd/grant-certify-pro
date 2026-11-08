import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { removeEdgeBackground } from './logo-processing';

describe('scripted logo background removal', () => {
  test('removes edge-connected white backgrounds and preserves logo color', () => {
    const pixels = new Uint8ClampedArray([255,255,255,255, 180,40,40,255, 255,255,255,255]);
    const result = removeEdgeBackground(pixels, 3, 1);
    assert.deepEqual(Array.from(result.filter((_, i) => i % 4 === 3)), [0,255,0]);
    assert.equal(pixels[3], 255);
  });
  test('removes edge-connected black backgrounds', () => {
    const pixels = new Uint8ClampedArray([0,0,0,255, 180,40,40,255, 0,0,0,255]);
    assert.equal(removeEdgeBackground(pixels, 3, 1)[3], 0);
    assert.equal(removeEdgeBackground(pixels, 3, 1)[7], 255);
  });
  test('preserves enclosed white details and existing transparency', () => {
    const pixels = new Uint8ClampedArray(5 * 5 * 4);
    for (let i = 0; i < 25; i++) pixels.set([180,40,40,255], i * 4);
    pixels.set([255,255,255,255], 12 * 4);
    pixels.set([0,0,0,0], 0);
    const result = removeEdgeBackground(pixels, 5, 5);
    assert.equal(result[12 * 4 + 3], 255);
    assert.equal(result[3], 0);
  });
});