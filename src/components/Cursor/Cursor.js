import React from 'react'
import { connect } from 'redhooks'
import { Container, Graphics, Ticker, depth } from '../../constants'

// Cursors
import { base, menuBurger, menuOpen } from './cursors/'

class Cursor extends React.Component {
  position = {
    x: 0,
    y: 0
  }

  circlePosition = {
    x: 0,
    y: 0,
    size: 0
  }

  componentDidMount() {
    const { canvas } = this.props

    document.addEventListener('mousemove', this.updatePosition, false)

    // if application was already published
    if (canvas.application) {
      this.setup()
    }
  }

  componentDidUpdate(prevProps) {
    const { canvas: prevCanvas } = prevProps
    const { canvas: currCanvas } = this.props

    // When application has been published
    if (!prevCanvas.application && currCanvas.application) {
      this.setup()
    }
  }

  render() {
    return null
  }

  setup() {
    const { canvas } = this.props
    this.pointer = new Graphics()
    this.circle = new Graphics()

    this.cursor = new Container()
    this.cursor.zIndex = depth.cursor
    this.cursor.addChild(this.circle, this.pointer)

    canvas.application.stage.addChild(this.cursor)

    // Ticker
    this.ticker = new Ticker()
    this.ticker.add(this.drawCursor)
    this.ticker.start()
  }

  drawCursor = () => {
    const { cursor } = this.props
    switch (cursor.name) {
      case 'menuBurger':
        menuBurger({
          position: this.position,
          circlePosition: this.circlePosition,
          pointer: this.pointer,
          circle: this.circle,
          fixedPosition: cursor.fixedPosition
        })
        break
      case 'menuOpen':
        menuOpen({
          position: this.position,
          circlePosition: this.circlePosition,
          pointer: this.pointer,
          circle: this.circle,
          fixedPosition: cursor.fixedPosition
        })
        break
      default:
        base({
          position: this.position,
          circlePosition: this.circlePosition,
          pointer: this.pointer,
          circle: this.circle
        })
    }
  }

  updatePosition = e => {
    this.position.x = e.x
    this.position.y = e.y
  }
}

const mapStateToProp = state => ({
  app: state.app,
  canvas: state.canvas,
  cursor: state.cursor
})

export default connect(mapStateToProp)(Cursor)
