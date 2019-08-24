const getSize = () => ({
  width: typeof window === 'undefined' ? 800 : window.innerWidth,
  height: typeof window === 'undefined' ? 600 : window.innerHeight,
  isLoading: '',
  isDesktopOrLaptop: true,
  isBigScreen: false,
  isTabletOrMobile: false,
  isTabletOrMobileDevice: false,
  isPortrait: false
})

const defaultState = {
  ...getSize()
}

// function reducer
const app = (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'APP_SET_SIZE':
      return {
        ...state,
        ...payload
      }
    case 'APP_SET_LOADING':
      return {
        ...state,
        ...payload
      }
    default:
      return state
  }
}

export default app
