const defaultState = {
  application: null
}

// function reducer
const canvas = (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'CANVAS_SET_APPLICATION':
      return {
        ...state,
        application: payload
      }
    default:
      return state
  }
}

export default canvas
