import lerp from '../../../utils/lerp'

const base = ({ position, circlePosition, pointer, circle }) => {
  const { x, y } = position
  const { x: circleX, y: circleY, size: circleSize } = circlePosition

  const newCirclePosition = {
    x: lerp(circleX, x, 0.1),
    y: lerp(circleY, y, 0.1),
    size: lerp(circleSize, 15, 0.1)
  }

  pointer
    .clear()
    .beginFill(0x000000, 1)
    .drawCircle(x, y, 2)
    .endFill()

  circle
    .clear()
    .beginFill(0x83ccf2, 0.5)
    .drawCircle(
      newCirclePosition.x,
      newCirclePosition.y,
      newCirclePosition.size
    )
    .endFill()

  Object.assign(circlePosition, newCirclePosition)
}

export default base
