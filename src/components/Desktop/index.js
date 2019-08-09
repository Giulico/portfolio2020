// import React from 'react'
import { useMediaQuery } from 'react-responsive'

import variables from '../../styles/base/variables.css'

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: variables.Desktop })
  return isDesktop ? children : null
}

export default Desktop
