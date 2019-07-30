import lerp from '../../../utils/lerp'
import { between } from '../../../utils/numbers'

const menuOpen = ({
  position,
  circlePosition,
  pointer,
  circle,
  fixedPosition
}) => {
  const { x, y } = position
  const size = 20
  const { x: circleX, y: circleY, size: circleSize } = circlePosition
  const maxY = fixedPosition.y + fixedPosition.height / 2 - size
  const minY = fixedPosition.y - fixedPosition.height / 2 + size
  const sliderY = between(y, minY, maxY)
  const newCirclePosition = {
    x: lerp(circleX, fixedPosition.x, 0.1),
    y: lerp(circleY, sliderY, 0.1),
    size: lerp(circleSize, size - 4, 0.1)
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

export default menuOpen
