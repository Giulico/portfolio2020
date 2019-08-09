import React from 'react'
import { connect } from 'redhooks'
import { Container, Graphics, depth } from '../../constants'
import { isEqual } from 'lodash'

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
      if (!isEqual(prevApp, currApp)) {
        this.handleResize()
      }
    }, 300)
  }

  render() {
    return null
  }

  get frameSize() {
    return this.props.app.isTabletOrMobileDevice ? 20 : 40
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
    // const color = 0x9c27b0
    const color = 0xffffff

    this.topBar
      .clear()
      .beginFill(color, 1)
      .drawRect(0, 0, width, this.frameSize)
      .endFill()
    this.rightBar
      .clear()
      .beginFill(color, 1)
      .drawRect(width - this.frameSize, 0, this.frameSize, height)
      .endFill()
    this.bottomBar
      .clear()
      .beginFill(color, 1)
      .drawRect(0, height - this.frameSize, width, this.frameSize)
      .endFill()
    this.leftBar
      .clear()
      .beginFill(color, 1)
      .drawRect(0, 0, this.frameSize, height)
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
