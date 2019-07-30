import React from 'react'
// import PropTypes from 'prop-types'
import loadable from '@loadable/component'

const ClientCursor = loadable(() => import('./Cursor'))

const Cursor = () => <ClientCursor />

export default Cursor
