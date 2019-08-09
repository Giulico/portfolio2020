export const between = (x, min, max) => {
  if (x <= min) {
    return min
  }
  if (x >= max) {
    return max
  }
  return x
}
export const normalize = (value, min, max) => {
  return (value - min) / (max - min)
}

export const proximityFactor = (coords, rect, proximity = 2) => {
  // Controlla la collisione
  // RICORDA: l'anchor è fissato a x: 0, y: 0,5
  // Normalized Rect
  const nR = {
    left: rect.x,
    right: rect.x + rect.width,
    top: rect.y - rect.height / 2,
    bottom: rect.y + rect.height / 2
  }
  if (
    coords.x >= nR.left &&
    coords.x <= nR.right &&
    coords.y >= nR.top &&
    coords.y <= nR.bottom
  ) {
    return 1
  }

  // Controlla la prossimità
  // Proximity Rect
  const treshold = (rect.height / 2) * proximity
  const pR = {
    left: nR.left - treshold,
    right: nR.right + treshold,
    top: nR.top - treshold,
    bottom: nR.bottom + treshold
  }
  if (
    coords.x >= pR.left &&
    coords.x <= pR.right &&
    coords.y >= pR.top &&
    coords.y <= pR.bottom
  ) {
    // Trova il fattore
    const border = coords.y > nR.bottom ? nR.bottom : nR.top
    return coords.y > border
      ? Math.min(1 - normalize(coords.y, nR.bottom, pR.bottom), 1)
      : Math.min(normalize(coords.y, pR.top, nR.top))
  }

  return 0
}
