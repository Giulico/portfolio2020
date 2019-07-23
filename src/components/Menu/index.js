import React from 'react'
// import PropTypes from 'prop-types'
import loadable from '@loadable/component'

const ClientMenu = loadable(() => import('./Menu'))

const Menu = props => <ClientMenu {...props} />

export default Menu
