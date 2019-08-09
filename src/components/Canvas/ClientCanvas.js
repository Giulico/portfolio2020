import React, { PureComponent } from 'react'
import { connect } from 'redhooks'
import { Application } from '../../constants'

// Style
import style from './index.module.css'

class Canvas extends PureComponent {
  componentDidMount() {
    const { app, dispatch } = this.props
    const { width, height } = app

    this.application = new Application({ transparent: true })
    this.application.stage.sortableChildren = true
    const { view } = this.application
    view.width = width
    view.height = height
    this.canvasContainer.appendChild(view)

    // Publish application
    dispatch({
      type: 'CANVAS_SET_APPLICATION',
      payload: this.application
    })
  }

  componentDidUpdate(prevProps) {
    const { app: currentApp } = this.props
    const { app: prevApp } = prevProps

    // Debounced events
    if (this.debounceTimer) {
      window.clearTimeout(this.debounceTimer)
    }
    this.debounceTimer = window.setTimeout(() => {
      // If App Resize
      if (
        currentApp.width !== prevApp.width ||
        currentApp.height !== prevApp.height
      ) {
        this.onResize()
      }
    }, 300)
  }

  render() {
    return <div className={style.root} ref={c => (this.canvasContainer = c)} />
  }

  onResize = () => {
    const { app, canvas } = this.props
    const { width, height } = app
    const { renderer } = canvas.application
    renderer.resize(width, height)
  }
}

const mapStateToProp = state => ({
  app: state.app,
  canvas: state.canvas
})

export default connect(mapStateToProp)(Canvas)
