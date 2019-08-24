import React from 'react'
import { connect } from 'redhooks'
import cn from 'classnames'

// Styles
import style from './index.module.css'

class MenuBurger extends React.Component {
  componentDidMount() {
    window.addEventListener('mouseup', this.pointerUpHandler)
    this.burgerRef.addEventListener('mouseenter', this.mouseEnterHandler, false)
    this.burgerRef.addEventListener('mouseleave', this.mouseLeaveHandler, false)
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mouseup', this.pointerUpHandler)
      this.burgerRef.removeEventListener('mouseenter', this.mouseEnterHandler)
      this.burgerRef.removeEventListener('mouseleave', this.mouseLeaveHandler)
    }
  }

  render() {
    const { app, menu, cursor } = this.props
    const { isLoading } = app

    const classes = cn({
      [style.root]: true,
      [style.loaded]: isLoading === 'loaded',
      [style.hasHover]:
        cursor.name === 'menuBurger' || cursor.name === 'menuOpen',
      [style.isOpen]: menu.isOpen
    })

    return (
      <div className={classes} ref={c => (this.burgerRef = c)}>
        <button
          className={style.button}
          onPointerDown={this.pointerDownHandler}
        >
          <span className={style.label}>Menu</span>
        </button>
        <div className={style.slider} ref={c => (this.sliderRef = c)} />
      </div>
    )
  }

  mouseEnterHandler = e => {
    const { dispatch, cursor } = this.props
    const rect = this.burgerRef.getBoundingClientRect()
    if (cursor.name !== 'menuOpen') {
      dispatch({
        type: 'CURSOR_SET_NAME',
        payload: {
          name: 'menuBurger',
          fixedPosition: {
            x: rect.left + (rect.right - rect.left) / 2,
            y: rect.top + (rect.bottom - rect.top) / 2,
            width: rect.width,
            height: rect.height
          }
        }
      })
    }
  }

  mouseLeaveHandler = e => {
    const { dispatch, cursor } = this.props
    // Restore cursor state only if the menu is closed
    if (cursor.name !== 'menuOpen') {
      dispatch({
        type: 'CURSOR_SET_NAME',
        payload: {
          name: 'base'
        }
      })
    }
  }

  pointerDownHandler = () => {
    const { dispatch } = this.props
    dispatch({ type: 'MENU_OPEN' })
    // Set cursor state
    const rect = this.sliderRef.getBoundingClientRect()
    dispatch({
      type: 'CURSOR_SET_NAME',
      payload: {
        name: 'menuOpen',
        fixedPosition: {
          x: rect.left + (rect.right - rect.left) / 2,
          y: rect.top + (rect.bottom - rect.top) / 2,
          width: rect.width,
          height: rect.height
        }
      }
    })
  }

  pointerUpHandler = e => {
    const { dispatch, cursor } = this.props
    const { x, y } = e
    const rect = this.burgerRef.getBoundingClientRect()

    // Close the menu
    dispatch({ type: 'MENU_CLOSE' })

    // Set the cursor
    // check if cursor is on the menu burger
    if (
      (cursor.name === 'menuOpen' || cursor.name === 'menuBurger') &&
      x > rect.left &&
      x < rect.right &&
      y > rect.top &&
      y < rect.bottom
    ) {
      dispatch({
        type: 'CURSOR_SET_NAME',
        payload: {
          name: 'menuBurger',
          fixedPosition: {
            x: rect.left + (rect.right - rect.left) / 2,
            y: rect.top + (rect.bottom - rect.top) / 2,
            width: rect.width,
            height: rect.height
          }
        }
      })
    } else {
      dispatch({
        type: 'CURSOR_SET_NAME',
        payload: {
          name: 'base'
        }
      })
    }
  }
}

const mapStateToProp = state => ({
  app: state.app,
  menu: state.menu,
  cursor: state.cursor
})

export default connect(mapStateToProp)(MenuBurger)
