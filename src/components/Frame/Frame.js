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
    const { app: prevApp, canvas: prevCanvas } = prevProps
    const { app: currApp, canvas: currCanvas } = this.props

    // When application has been published
    if (!prevCanvas.application && currCanvas.application) {
      this.setup()
    }

    // Debounced events
    if (this.debounceTimer) {
      window.clearTimeout(this.debounceTimer)
    }
    this.debounceTimer = window.setTimeout(() => {
      // If App Resize
      if (
        currApp.width !== prevApp.width ||
        currApp.height !== prevApp.height
      ) {
        this.handleResize()
      }
    }, 300)
  }

  render() {
    return null
  }

  setup() {
    const { canvas } = this.props
    const container = new Container()

    this.topBar = new Graphics()
    this.rightBar = new Graphics()
    this.bottomBar = new Graphics()
    this.leftBar = new Graphics()

    this.drawFrame()
    container.zIndex = depth.displacedBackground + 1
    container.addChild(this.topBar, this.rightBar, this.bottomBar, this.leftBar)
    canvas.application.stage.addChild(container)
  }

  drawFrame() {
    const { app } = this.props
    const { width, height } = app

    this.topBar
      .clear()
      .beginFill(0xffffff, 1)
      .drawRect(0, 0, width, 40)
      .endFill()
    this.rightBar
      .clear()
      .beginFill(0xffffff, 1)
      .drawRect(width - 40, 0, 40, height)
      .endFill()
    this.bottomBar
      .clear()
      .beginFill(0xffffff, 1)
      .drawRect(0, height - 40, width, 40)
      .endFill()
    this.leftBar
      .clear()
      .beginFill(0xffffff, 1)
      .drawRect(0, 0, 40, height)
      .endFill()
  }

  handleResize() {
    this.drawFrame()
  }
}

const mapStateToProp = state => ({
  app: state.app,
  canvas: state.canvas
})

export default connect(mapStateToProp)(Frame)
