import { useMediaQuery } from 'react-responsive'

// Vars from css
import variables from '../../styles/base/variables.css'

const Mq = ({ children }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: `(min-device-width: ${variables.Laptop})`
  })
  const isBigScreen = useMediaQuery({
    query: `(min-device-width: ${variables.BigScreen})`
  })
  const isTabletOrMobile = useMediaQuery({
    query: `(max-width: ${variables.Laptop})`
  })
  const isTabletOrMobileDevice = useMediaQuery({
    query: `(max-device-width: ${variables.Laptop})`
  })
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  return children({
    isDesktopOrLaptop,
    isBigScreen,
    isTabletOrMobile,
    isTabletOrMobileDevice,
    isPortrait
  })
}

export default Mq
