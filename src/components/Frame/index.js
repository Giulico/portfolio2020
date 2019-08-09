import React from 'react'
// import PropTypes from 'prop-types'
import loadable from '@loadable/component'

const ClientFrame = loadable(() => import('./Frame'))

const Frame = props => <ClientFrame {...props} />

export default Frame
