import { describe, expect, test } from 'bun:test';
import { removeEdgeBackground } from './logo-processing';

describe('scripted logo background removal', () => {
  test('removes edge-connected white backgrounds and preserves logo color', () => {
    const pixels = new Uint8ClampedArray([255,255,255,255, 180,40,40,255, 255,255,255,255]);
    const result = removeEdgeBackground(pixels, 3, 1);
    expect(Array.from(result.filter((_, i) => i % 4 === 3))).toEqual([0,255,0]);
    expect(pixels[3]).toBe(255);
  });
  test('removes edge-connected black backgrounds', () => {
    const pixels = new Uint8ClampedArray([0,0,0,255, 180,40,40,255, 0,0,0,255]);
    expect(removeEdgeBackground(pixels, 3, 1)[3]).toBe(0);
    expect(removeEdgeBackground(pixels, 3, 1)[7]).toBe(255);
  });
  test('preserves enclosed white details and existing transparency', () => {
    const pixels = new Uint8ClampedArray(5 * 5 * 4);
    for (let i = 0; i < 25; i++) pixels.set([180,40,40,255], i * 4);
    pixels.set([255,255,255,255], 12 * 4);
    pixels.set([0,0,0,0], 0);
    const result = removeEdgeBackground(pixels, 5, 5);
    expect(result[12 * 4 + 3]).toBe(255);
    expect(result[3]).toBe(0);
  });
});