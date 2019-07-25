import React from 'react'
import { connect } from 'redhooks'
import { Container, Graphics, depth } from '../../constants'

class Frame extends React.Component {
  componentDidMount() {
    const { canvas } = this.props

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
    const { app, canvas } = this.props
    const { width, height } = app
    const container = new Container()

    const topBar = new Graphics()
      .beginFill(0xffffff, 1)
      .drawRect(0, 0, width, 40)
      .endFill()
    const rightBar = new Graphics()
      .beginFill(0xffffff, 1)
      .drawRect(width - 40, 0, 40, height)
      .endFill()
    const bottomBar = new Graphics()
      .beginFill(0xffffff, 1)
      .drawRect(0, height - 40, width, 40)
      .endFill()
    const leftBar = new Graphics()
      .beginFill(0xffffff, 1)
      .drawRect(0, 0, 40, height)
      .endFill()

    container.zIndex = depth.displacedBackground + 1

    container.addChild(topBar, rightBar, bottomBar, leftBar)
    canvas.application.stage.addChild(container)
  }
}

const mapStateToProp = state => ({
  app: state.app,
  canvas: state.canvas
})

export default connect(mapStateToProp)(Frame)
