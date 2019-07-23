import React from 'react'
import { connect } from 'redhooks'

class App extends React.Component {
  componentDidMount() {
    // add event listener resize
    window.addEventListener('resize', this.setSize, false)
  }

  componentWillUnmount() {
    // remove event listener
    window.removeEventListener('resize', this.setSize)
  }

  render() {
    return this.props.children
  }

  setSize = e => {
    const target = e.currentTarget
    this.props.dispatch({
      type: 'APP_SET_SIZE',
      payload: {
        width: target.innerWidth,
        height: target.innerHeight
      }
    })
  }
}

export default connect()(App)
