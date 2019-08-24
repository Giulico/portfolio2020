import React from 'react'
import { connect } from 'redhooks'

// Utilities
import { timer } from '../../utils/async'

class App extends React.Component {
  componentWillMount() {
    const { dispatch, mq } = this.props
    dispatch({
      type: 'APP_SET_SIZE',
      payload: {
        ...mq
      }
    })
  }

  componentDidMount() {
    const { dispatch } = this.props

    // Loading simulator
    timer(1000)
      .then(() => {
        dispatch({ type: 'APP_SET_LOADING', payload: { isLoading: 'loading' } })
        return timer(1000)
      })
      .then(() => {
        dispatch({ type: 'APP_SET_LOADING', payload: { isLoading: 'loaded' } })
      })

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
    const { dispatch, mq } = this.props
    dispatch({
      type: 'APP_SET_SIZE',
      payload: {
        width: target.innerWidth,
        height: target.innerHeight,
        ...mq
      }
    })
  }
}

export default connect()(App)
