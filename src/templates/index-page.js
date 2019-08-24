import React from 'react'
import cn from 'classnames'
import { connect } from 'redhooks'
// import PropTypes from 'prop-types'

// Components
import DisplacedBackground from '../components/DisplacedBackground'

// Style
import style from './index-page.module.css'

class IndexPage extends React.Component {
  render() {
    const { app, transitionStatus, menu } = this.props
    const { isLoading } = app

    const classes = cn({
      [style.root]: true,
      [style.menuOpen]: menu.isOpen,
      [style.loading]: isLoading === 'loading',
      [style.loaded]: isLoading === 'loaded'
    })

    return (
      <div className={classes}>
        <DisplacedBackground transitionStatus={transitionStatus} />
        <div className={style.preHeading}>
          My name is Giulio,
          <br />
          I'm a C----E
        </div>
        <h1 className={style.heading}>
          <span className={style.headingFirstLine}>
            <span>U</span>
            <span>X</span>
          </span>
          <span className={style.headingSecondLine}>
            <span>E</span>
            <span>n</span>
            <span>g</span>
            <span>i</span>
            <span>n</span>
            <span>e</span>
            <span>e</span>
            <span>r</span>
          </span>
        </h1>
        <div className={style.postHeading}>@Sketchin, Lugano</div>
      </div>
    )
  }
}

IndexPage.propTypes = {}

const mapStateToProps = state => ({
  app: state.app,
  menu: state.menu
})

export default connect(mapStateToProps)(IndexPage)
