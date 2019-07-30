import React from 'react'
// import PropTypes from 'prop-types'
import loadable from '@loadable/component'

const ClientDisplacedBackground = loadable(() =>
  import('./DisplacedBackground')
)

const DisplacedBackground = props => <ClientDisplacedBackground {...props} />

export default DisplacedBackground
