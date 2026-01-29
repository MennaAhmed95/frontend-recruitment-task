export function secondsToPx(seconds, zoom) {
  const pxPerSecond = 40 * zoom
  return seconds * pxPerSecond
}

export function pxToSeconds(px, zoom) {
  const pxPerSecond = 40 * zoom
  return px / pxPerSecond
}

