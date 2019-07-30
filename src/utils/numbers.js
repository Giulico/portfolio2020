export const between = (x, min, max) => {
  if (x <= min) {
    return min
  }
  if (x >= max) {
    return max
  }
  return x
}
