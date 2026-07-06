/**
 * Downscale an image file to a small JPEG data URL so nine photos per team
 * fit comfortably inside the localStorage quota (~5 MB).
 */
export async function fileToThumbnail(file: File, maxDim = 512): Promise<string> {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg', 0.75)
  } finally {
    bitmap.close()
  }
}
