import React from 'react'
// import PropTypes from 'prop-types'
import loadable from '@loadable/component'

const ClientCanvas = loadable(() => import('./ClientCanvas'))

const Canvas = () => <ClientCanvas />

export default Canvas
