import lerp from '../../../utils/lerp'

const menuBurger = ({
  position,
  circlePosition,
  pointer,
  circle,
  fixedPosition
}) => {
  const { x, y } = position
  const { x: circleX, y: circleY, size: circleSize } = circlePosition

  const newCirclePosition = {
    x: lerp(circleX, fixedPosition.x, 0.1),
    y: lerp(circleY, fixedPosition.y, 0.1),
    size: lerp(circleSize, 40, 0.1)
  }

  pointer
    .clear()
    .beginFill(0x000000, 1)
    .drawCircle(x, y, 3)
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

export default menuBurger
