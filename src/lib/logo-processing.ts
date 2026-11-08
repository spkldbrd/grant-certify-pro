/** Remove only white/black pixels connected to the image edges, preserving enclosed logo details. */
export function removeEdgeBackground(data: Uint8ClampedArray, width: number, height: number) {
  const output = new Uint8ClampedArray(data);
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  function enqueue(index: number) {
    if (visited[index]) return;
    visited[index] = 1;
    const p = index * 4;
    const low = Math.min(data[p], data[p + 1], data[p + 2]);
    const high = Math.max(data[p], data[p + 1], data[p + 2]);
    if (data[p + 3] === 0 || low >= 235 || high <= 30) queue[tail++] = index;
  }
  for (let x = 0; x < width; x++) { enqueue(x); enqueue((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { enqueue(y * width); enqueue(y * width + width - 1); }
  while (head < tail) {
    const index = queue[head++];
    output[index * 4 + 3] = 0;
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) enqueue(index - 1);
    if (x < width - 1) enqueue(index + 1);
    if (y > 0) enqueue(index - width);
    if (y < height - 1) enqueue(index + width);
  }
  return output;
}

export async function prepareLogo(file: File, removeBackground: boolean): Promise<string> {
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
    throw new Error('Choose a PNG, JPG, WebP, or GIF image.');
  }
  if (file.size > 10 * 1024 * 1024) throw new Error('Please choose a logo smaller than 10 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Your browser could not process this image.');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    if (removeBackground) {
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      image.data.set(removeEdgeBackground(image.data, canvas.width, canvas.height));
      ctx.putImageData(image, 0, 0);
    }
    return canvas.toDataURL('image/png');
  } finally {
    bitmap.close();
  }
}