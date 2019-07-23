const getSize = () => ({
  width: typeof window === 'undefined' ? 800 : window.innerWidth,
  height: typeof window === 'undefined' ? 600 : window.innerHeight
})
const defaultState = {
  ...getSize()
}

// function reducer
const app = (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'APP_SET_SIZE':
      const { width, height } = payload
      return {
        ...state,
        width,
        height
      }
    default:
      return state
  }
}

export default app
