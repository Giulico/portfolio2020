import React from 'react'
import { connect } from 'redhooks'
import {
  Container,
  filters,
  Graphics,
  Loader,
  Point,
  Sprite,
  Texture,
  depth
} from '../../constants'

// Imgs
import Giulio from '../../assets/images/giulio.png'
import GiulioMap from '../../assets/images/giulio-map.png'
import VideoShader from './VideoShader'

class DisplacedBackground extends React.Component {
  componentDidMount() {
    const { canvas } = this.props

    // if application was already published
    if (canvas.application) {
      this.load()
    }
  }

  componentDidUpdate(prevProps) {
    const { app: prevApp, canvas: prevCanvas } = prevProps
    const { app: currApp, canvas: currCanvas } = this.props

    // When application has been published
    if (!prevCanvas.application && currCanvas.application) {
      this.load()
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

  load = () => {
    new Loader()
      .add('image', Giulio)
      .add('depthMap', GiulioMap)
      .load(this.setup)
  }

  setup = () => {
    const { app, canvas } = this.props
    const { width, height } = app

    this.ds = new Sprite(Texture.from(GiulioMap))
    this.bg = new Sprite(Texture.from(Giulio))

    const stage = new Container()
    stage.interactive = true
    stage.zIndex = depth.displacedBackground
    stage.alpha = 0.5

    canvas.application.stage.addChild(stage)

    this.coloredBG = new Graphics()
      .beginFill(0x8bc5ff, 1)
      .drawRect(0, 0, width * 0.7, height)
      .endFill()

    const container = new Container()

    stage.addChild(container, this.ds)

    const displacementFilter = new filters.DisplacementFilter(this.ds)

    container.filters = [displacementFilter]

    displacementFilter.scale.x = 10
    displacementFilter.scale.y = 10

    this.VideoShader = new VideoShader(
      stage,
      canvas.application.view,
      width,
      height
    )

    this.handleResize()

    container.addChild(this.coloredBG, this.bg)

    const onPointerMove = e => {
      const mouseOffsetX = e.data.global.x / width
      const mouseOffsetY = e.data.global.y / height

      displacementFilter.scale.x = mouseOffsetX * 20
      displacementFilter.scale.y = mouseOffsetY * 20
    }

    stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove)
  }

  handleResize = () => {
    this.setBackground()
    Object.assign(this.ds, {
      x: this.bg.x,
      y: this.bg.y,
      width: this.bg.width,
      height: this.bg.height
    })
    Object.assign(this.ds.scale, {
      x: this.bg.scale.x,
      y: this.bg.scale.y
    })
  }

  setBackground = () => {
    const { app } = this.props
    const { width, height } = app
    const x = width * 0.75
    const y = height

    if (!this.bgContainer) {
      this.bgContainer = new Container()
      this.mask = new Graphics()
        .beginFill(0x8bc5ff)
        .drawRect(0, 0, x, y)
        .endFill()

      this.bgContainer.mask = this.mask
      this.bgContainer.addChild(this.mask)
      this.bgContainer.addChild(this.bg)
    }

    // debugger;
    let sp = {
      x: this.bg.width,
      y: this.bg.height
    }
    const winratio = x / y
    const spratio = sp.x / sp.y
    const pos = new Point(0, 0)
    let scale = 1
    if (winratio > spratio) {
      // photo is wider than background
      scale = x / sp.x
      pos.y = -(sp.y * scale - y) / 2
    } else {
      // photo is taller than background
      // debugger
      // scale = y / sp.y
      scale = y / y
      pos.x = -(sp.x * scale - x) / 2
    }

    this.bg.scale = new Point(scale, scale)
    this.bg.position = pos
  }
}

const mapStateToProp = state => ({
  app: state.app,
  canvas: state.canvas
})

export default connect(mapStateToProp)(DisplacedBackground)
