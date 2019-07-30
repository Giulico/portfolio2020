import React from 'react'
// import PropTypes from 'prop-types'

// Components
import DisplacedBackground from '../components/DisplacedBackground'

// Style
// import style from './index-page.module.css'

class IndexPage extends React.Component {
  componentWillUnmount() {
    console.log('index-page is unmounting')
  }

  render() {
    const { transitionStatus } = this.props
    return <DisplacedBackground transitionStatus={transitionStatus} />
  }
}

IndexPage.propTypes = {}

export default IndexPage
